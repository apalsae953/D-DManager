import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient.js';
import { Login } from './components/auth/Login.jsx';
import { FichaPersonaje } from './components/ficha-personaje/FichaPersonaje.jsx';
import { PanelMaster } from './components/panel-master/PanelMaster.jsx';
import { ListaPersonajes } from './components/ListaPersonajes.jsx';
import { CreadorPersonaje } from './components/creador-personaje/CreadorPersonaje.jsx';
import { PARTIDA_DEMO, PERSONAJES_DEMO } from './datos/datosDemo.js';

import { crearPersonajePorDefecto } from './hooks/useFichaPersonaje.js';
import { LogOut, Skull, Swords, Users, Shield } from 'lucide-react';
import { Bestiario } from './components/bestiario/Bestiario.jsx';
import { useBestiario } from './hooks/useBestiario.js';

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [modoLocal, setModoLocal] = useState(false);
  const { monstruos: monstruosGlobales, busqueda: busquedaBestiario, setBusqueda: setBusquedaBestiario } = useBestiario();

  const [vista, setVista] = useState('listaPersonajes'); // listaPersonajes, creadorPersonaje, ficha, master
  const [partida, setPartida] = useState(() => {
    try {
      const saved = localStorage.getItem('dnd_partida');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [personajes, setPersonajes] = useState(() => {
    try {
      const saved = localStorage.getItem('dnd_personajes');
      if (!saved) return PERSONAJES_DEMO;
      const parsed = JSON.parse(saved);
      return parsed.map(p => {
        const def = crearPersonajePorDefecto();
        
        let nuevasCaracteristicas = def.caracteristicas;
        if (p.caracteristicas) {
          nuevasCaracteristicas = { ...def.caracteristicas };
          for (const key of Object.keys(def.caracteristicas)) {
            if (typeof p.caracteristicas[key] === 'number') {
              nuevasCaracteristicas[key] = { base: p.caracteristicas[key], anulacion: null };
            } else if (p.caracteristicas[key]?.base !== undefined) {
              nuevasCaracteristicas[key] = p.caracteristicas[key];
            }
          }
        }

        let nuevosPv = def.puntos_vida;
        if (typeof p.puntos_vida === 'number') {
          nuevosPv = { ...def.puntos_vida, actual: p.puntos_vida };
        } else if (p.puntos_vida) {
          nuevosPv = { ...def.puntos_vida, ...p.puntos_vida };
        }

        return {
          ...def,
          ...p,
          caracteristicas: nuevasCaracteristicas,
          puntos_vida: nuevosPv,
        };
      });
    } catch {
      return PERSONAJES_DEMO;
    }
  });
  const [personajeActivo, setPersonajeActivo] = useState(null);
  const debounceTimer = useRef(null);
  const [personajesPartida, setPersonajesPartida] = useState([]);
  const [misPartidasMaster, setMisPartidasMaster] = useState([]);
  const [misPartidasJugador, setMisPartidasJugador] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cargar lista de partidas del usuario
  useEffect(() => {
    if (session) {
      const fetchPartidas = async () => {
        // Partidas como Master
        const { data: dMaster } = await supabase
          .from('partidas')
          .select('*')
          .eq('master_id', session.user.id);
        if (dMaster) setMisPartidasMaster(dMaster);

        // Partidas como Jugador
        const { data: dJugador } = await supabase
          .from('miembros_partida')
          .select('partidas(*)')
          .eq('usuario_id', session.user.id);
        if (dJugador) {
          // Flatten the response
          const partidasJ = dJugador.map(m => m.partidas).filter(p => p !== null);
          setMisPartidasJugador(partidasJ);
        }
      };
      fetchPartidas();
    } else {
      setMisPartidasMaster([]);
      setMisPartidasJugador([]);
    }
  }, [session]);

  // Cargar personajes de Supabase al iniciar sesión y escuchar cambios (Para el Jugador)
  useEffect(() => {
    if (session) {
      const fetchPersonajes = async () => {
        const { data, error } = await supabase
          .from('personajes')
          .select('*')
          .eq('usuario_id', session.user.id);
        
        if (data && !error) {
          const loaded = data.map(dbChar => {
            const def = crearPersonajePorDefecto();
            return {
              ...def,
              ...(dbChar.datos_ficha || {}),
              id: dbChar.id // Usamos el UUID real de la base de datos
            };
          });
          setPersonajes(loaded.length > 0 ? loaded : []);
        }
      };
      fetchPersonajes();

      // Suscripción en tiempo real para reflejar cambios que haga el DM (ej. quitar PV)
      const channel = supabase.channel('personajes_jugador')
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'personajes', 
          filter: `usuario_id=eq.${session.user.id}` 
        }, (payload) => {
          const newData = payload.new;
          setPersonajes(prev => prev.map(p => {
            if (p.id === newData.id) {
              const def = crearPersonajePorDefecto();
              return { ...def, ...(newData.datos_ficha || {}), id: newData.id };
            }
            return p;
          }));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  // Cargar personajes de la partida para el DM
  useEffect(() => {
    if (session && vista === 'master' && partida) {
      const fetchPersonajesPartida = async () => {
        // En un futuro, si el jugador no le asigna partida_id, esto estará vacío
        // pero por ahora buscamos personajes que estén en la partida
        const { data, error } = await supabase
          .from('personajes')
          .select('*')
          .eq('partida_id', partida.id);
        
        if (data && !error) {
          const loaded = data.map(dbChar => {
            const def = crearPersonajePorDefecto();
            return { ...def, ...(dbChar.datos_ficha || {}), id: dbChar.id };
          });
          setPersonajesPartida(loaded);
        }
      };
      fetchPersonajesPartida();

      const channel = supabase.channel('personajes_master')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'personajes', 
          filter: `partida_id=eq.${partida.id}` 
        }, fetchPersonajesPartida)
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [session, vista, partida]);

  // Guardar en localStorage como backup/modo local
  useEffect(() => {
    localStorage.setItem('dnd_personajes', JSON.stringify(personajes));
  }, [personajes]);

  useEffect(() => {
    if (partida) localStorage.setItem('dnd_partida', JSON.stringify(partida));
    else localStorage.removeItem('dnd_partida');
  }, [partida]);

  const manejarGuardarPersonaje = useCallback((personajeEditado) => {
    // Actualización local inmediata (Optimistic UI)
    setPersonajes(prev => prev.map(p => p.id === personajeEditado.id ? personajeEditado : p));
    
    // Si estamos online, guardamos en Supabase con un debounce de 1 segundo
    if (session) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        await supabase.from('personajes').update({
          nombre: personajeEditado.nombre || 'Sin nombre',
          raza: personajeEditado.raza,
          clase: personajeEditado.clase,
          nivel: personajeEditado.nivel || 1,
          trasfondo: personajeEditado.trasfondo,
          alineamiento: personajeEditado.alineamiento,
          datos_ficha: personajeEditado
        }).eq('id', personajeEditado.id);
      }, 1000);
    }
  }, [session]);

  const manejarCreacionPersonaje = useCallback(async (nuevoPersonaje) => {
    const def = crearPersonajePorDefecto();
    let nuevasCaracteristicas = def.caracteristicas;
    if (nuevoPersonaje.caracteristicas) {
      nuevasCaracteristicas = { ...def.caracteristicas };
      for (const key of Object.keys(def.caracteristicas)) {
        if (typeof nuevoPersonaje.caracteristicas[key] === 'number') {
          nuevasCaracteristicas[key] = { base: nuevoPersonaje.caracteristicas[key], anulacion: null };
        } else if (nuevoPersonaje.caracteristicas[key]?.base !== undefined) {
          nuevasCaracteristicas[key] = nuevoPersonaje.caracteristicas[key];
        }
      }
    }

    let nuevosPv = def.puntos_vida;
    if (nuevoPersonaje.pgMax !== undefined) {
      nuevosPv = { ...def.puntos_vida, maximo: nuevoPersonaje.pgMax, actual: nuevoPersonaje.pg, temporal: 0 };
    }

    const personajeCompleto = {
      ...def,
      ...nuevoPersonaje,
      caracteristicas: nuevasCaracteristicas,
      puntos_vida: nuevosPv,
      dado_golpe_personalizado: nuevoPersonaje.dadoGolpe,
    };

    if (session) {
      delete personajeCompleto.id; // Quitamos el ID falso local para que Supabase genere un UUID real
      const { data, error } = await supabase.from('personajes').insert({
        usuario_id: session.user.id,
        partida_id: personajeCompleto.partida_id || null,
        nombre: personajeCompleto.nombre || 'Sin nombre',
        raza: personajeCompleto.raza,
        clase: personajeCompleto.clase,
        nivel: personajeCompleto.nivel || 1,
        trasfondo: personajeCompleto.trasfondo,
        alineamiento: personajeCompleto.alineamiento,
        datos_ficha: personajeCompleto
      }).select().single();

      if (data && !error) {
        personajeCompleto.id = data.id;
        // Guardamos el JSON actualizado con el nuevo ID real
        await supabase.from('personajes').update({ datos_ficha: personajeCompleto }).eq('id', data.id);
        setPersonajes(prev => [...prev, personajeCompleto]);
      } else if (error) {
        console.error("Error creating character:", error);
        alert("Error al crear personaje: " + error.message);
      }
    } else {
      setPersonajes(prev => [...prev, personajeCompleto]);
    }
    
    setVista('listaPersonajes');
  }, [session]);

  const manejarEliminarPersonaje = useCallback(async (id) => {
    setPersonajes(prev => prev.filter(p => p.id !== id));
    if (session) {
      await supabase.from('personajes').delete().eq('id', id);
    }
  }, [session]);

  const manejarAsignacionPartida = useCallback(async (personajeId, partidaId) => {
    // Si la partidaId es un string vacío, lo convertimos a null
    const newPartidaId = partidaId || null;
    
    // Actualizamos localmente para el jugador
    setPersonajes(prev => prev.map(p => p.id === personajeId ? { ...p, partida_id: newPartidaId } : p));
    
    // Si somos DM y estamos expulsando, actualizamos también localmente la lista del DM
    if (!newPartidaId) {
      setPersonajesPartida(prev => prev.filter(p => p.id !== personajeId));
    }
    
    if (session) {
      const { error } = await supabase.from('personajes').update({ partida_id: newPartidaId }).eq('id', personajeId);
      if (error) {
        console.error("Error al asignar partida:", error);
        alert("Error al actualizar el personaje: " + error.message);
      }
    }
  }, [session]);

  const manejarCrearPartida = async (nombre) => {
    if (!session) {
      setPartida({ ...PARTIDA_DEMO, nombre });
      return;
    }
    const { data, error } = await supabase.from('partidas').insert({
      nombre,
      master_id: session.user.id
    }).select().single();
    
    if (data && !error) {
      setPartida(data);
    } else if (error) {
      console.error(error);
      alert("Error al crear partida: " + error.message);
    }
  };

  const manejarUnirsePartida = async (codigo) => {
    if (!session) {
      alert("Debes iniciar sesión para unirte a partidas online.");
      return;
    }
    
    const { data: pData, error: pError } = await supabase
      .from('partidas')
      .select('*')
      .eq('codigo_invitacion', codigo.toUpperCase())
      .single();
    
    if (pData && !pError) {
      if (pData.master_id !== session.user.id) {
        const { error: joinError } = await supabase.from('miembros_partida').insert({
          partida_id: pData.id,
          usuario_id: session.user.id,
          rol: 'jugador'
        });
        
        if (joinError && joinError.code === '23505') {
          // Ya era miembro
          alert("Ya eres miembro de esta partida.");
        } else if (!joinError) {
          setMisPartidasJugador(prev => {
            // Evitar duplicados
            if (prev.find(p => p.id === pData.id)) return prev;
            return [...prev, pData];
          });
          alert(`¡Te has unido con éxito a la campaña: ${pData.nombre}!`);
        } else {
          console.error(joinError);
          alert("Ha ocurrido un error al unirse a la partida: " + joinError.message);
        }
      } else {
        alert("Eres el creador de esta partida. Puedes gestionarla desde el Panel de Master.");
      }
    } else {
      console.error(pError);
      alert("No se ha encontrado ninguna partida con ese código o no tienes permiso para verla: " + (pError?.message || ''));
    }
  };

  if (loadingAuth) {
    return <div className="min-h-screen text-stone-200 flex items-center justify-center">Cargando...</div>;
  }

  if (!session && !modoLocal) {
    return <Login onModoLocal={() => setModoLocal(true)} />;
  }

  return (
    <div className="min-h-screen text-stone-200">
      {/* Navegación Principal */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-dndoscuro-900/80 p-4 shadow-xl backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 mr-4">
            <Swords className="h-6 w-6 text-sangre-500" />
            <span className="font-cinzel text-xl font-bold tracking-wider text-stone-100 hidden sm:inline-block">D&D Manager</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVista('listaPersonajes');
                setPersonajeActivo(null);
                setPartida(null); // Limpiar la partida al salir del DM
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-cinzel text-sm font-semibold transition-all ${
                vista === 'listaPersonajes' || vista === 'ficha' || vista === 'creadorPersonaje' ? 'bg-sangre-700 text-white shadow-md' : 'text-stone-400 hover:bg-white/10 hover:text-stone-200'
              }`}
            >
              <Users className="h-4 w-4" /> Mis Personajes
            </button>
            <button
              onClick={() => {
                setVista('master');
                setPersonajeActivo(null);
                // No limpiamos partida aquí para que el DM recuerde en cuál estaba
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-cinzel text-sm font-semibold transition-all ${
                vista === 'master' ? 'bg-sangre-700 text-white shadow-md' : 'text-stone-400 hover:bg-white/10 hover:text-stone-200'
              }`}
            >
              <Shield className="h-4 w-4" /> Dungeon Master
            </button>
            <button
              onClick={() => {
                setVista('bestiario');
                setPersonajeActivo(null);
                setPartida(null);
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-cinzel text-sm font-semibold transition-all ${
                vista === 'bestiario' ? 'bg-sangre-700 text-white shadow-md' : 'text-stone-400 hover:bg-white/10 hover:text-stone-200'
              }`}
            >
              <Skull className="h-4 w-4" /> Bestiario
            </button>
          </div>
        </div>
        <div className="flex-1" />
        {modoLocal ? (
          <div className="text-sm font-semibold text-amber-500 mr-4 border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded">
            Modo Local Activo
          </div>
        ) : (
          <>
            <div className="text-sm text-stone-400 mr-4">
              {session?.user?.user_metadata?.display_name || 
               session?.user?.user_metadata?.full_name || 
               session?.user?.user_metadata?.name || 
               session?.user?.email?.replace('@dndmanager.com', '')}
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 text-stone-400 hover:text-red-400 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {vista === 'listaPersonajes' && (
        <ListaPersonajes
          personajes={personajes}
          partida={partida}
          misPartidasJugador={misPartidasJugador}
          alSeleccionar={(p) => { setPersonajeActivo(p); setVista('ficha'); }}
          alCrear={() => setVista('creadorPersonaje')}
          alEliminar={manejarEliminarPersonaje}
          onUnirsePartida={manejarUnirsePartida}
          onAsignarPartida={manejarAsignacionPartida}
        />
      )}
      
      {vista === 'creadorPersonaje' && (
        <CreadorPersonaje 
          misPartidasJugador={misPartidasJugador}
          partidaActual={partida}
          alGuardar={manejarCreacionPersonaje} 
          alCancelar={() => setVista('listaPersonajes')} 
        />
      )}

      {vista === 'ficha' && personajeActivo && (
        <FichaPersonaje 
          personajeInicial={personajeActivo} 
          onGuardar={manejarGuardarPersonaje} 
          onVolver={() => setVista('listaPersonajes')}
        />
      )}

      {vista === 'master' && (
        <PanelMaster 
          partida={partida}
          misPartidasMaster={misPartidasMaster}
          onSeleccionarPartida={(p) => setPartida(p)}
          personajes={personajesPartida}
          onCrearPartida={manejarCrearPartida}
          onUnirsePartida={manejarUnirsePartida}
          onActualizarPersonaje={manejarGuardarPersonaje}
          onExpulsarPersonaje={(id) => manejarAsignacionPartida(id, null)}
          onSalirPartida={() => setPartida(null)}
        />
      )}

      {vista === 'bestiario' && (
        <div className="mx-auto max-w-5xl p-4 sm:p-6">
          <h2 className="text-3xl font-cinzel text-sangre-100 mb-6">Bestiario Global</h2>
          <p className="text-stone-400 mb-8">Consulta las criaturas y monstruos del mundo. Los Dungeon Masters pueden crear sus propias criaturas exclusivas y revelarlas aquí.</p>
          <Bestiario 
            monstruos={monstruosGlobales} 
            busqueda={busquedaBestiario} 
            setBusqueda={setBusquedaBestiario} 
            modoGlobal={true}
          />
        </div>
      )}
    </div>
  );
}
