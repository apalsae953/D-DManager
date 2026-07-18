import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient.js';
import { Login } from './components/auth/Login.jsx';
import { FichaPersonaje } from './components/ficha-personaje/FichaPersonaje.jsx';
import { PanelMaster } from './components/panel-master/PanelMaster.jsx';
import { ListaPersonajes } from './components/ListaPersonajes.jsx';
import { CreadorPersonaje } from './components/creador-personaje/CreadorPersonaje.jsx';
import { PARTIDA_DEMO, PERSONAJES_DEMO } from './datos/datosDemo.js';

import { crearPersonajePorDefecto } from './hooks/useFichaPersonaje.js';
import { LogOut } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [modoLocal, setModoLocal] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('dnd_personajes', JSON.stringify(personajes));
  }, [personajes]);

  useEffect(() => {
    if (partida) localStorage.setItem('dnd_partida', JSON.stringify(partida));
    else localStorage.removeItem('dnd_partida');
  }, [partida]);

  const manejarGuardarPersonaje = useCallback((personajeEditado) => {
    setPersonajes(prev => prev.map(p => p.id === personajeEditado.id ? personajeEditado : p));
  }, []);

  const manejarCreacionPersonaje = useCallback((nuevoPersonaje) => {
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

    setPersonajes(prev => [...prev, personajeCompleto]);
    setVista('listaPersonajes');
  }, []);

  const manejarEliminarPersonaje = useCallback((id) => {
    setPersonajes(prev => prev.filter(p => p.id !== id));
  }, []);

  const manejarCrearPartida = (nombre) => {
    setPartida({ ...PARTIDA_DEMO, nombre });
  };

  const manejarUnirsePartida = (codigo) => {
    setPartida(PARTIDA_DEMO);
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
      <div className="mx-auto flex max-w-5xl items-center gap-4 p-4 border-b border-white/5">
        <h1 className="text-xl font-cinzel font-bold text-sangre-500 mr-4">D&D Manager</h1>
        <button
          onClick={() => setVista('listaPersonajes')}
          className={`px-3 py-1 text-sm font-semibold transition-colors ${['listaPersonajes', 'creadorPersonaje', 'ficha'].includes(vista) ? 'text-white border-b-2 border-sangre-600' : 'text-stone-500 hover:text-stone-300'}`}
        >
          Jugador
        </button>
        <button
          onClick={() => setVista('master')}
          className={`px-3 py-1 text-sm font-semibold transition-colors ${vista === 'master' ? 'text-white border-b-2 border-sangre-600' : 'text-stone-500 hover:text-stone-300'}`}
        >
          Dungeon Master
        </button>
        <div className="flex-1" />
        {modoLocal ? (
          <div className="text-sm font-semibold text-amber-500 mr-4 border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded">
            Modo Local Activo
          </div>
        ) : (
          <>
            <div className="text-sm text-stone-400 mr-4">
              {session?.user?.email}
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
          alSeleccionar={(p) => { setPersonajeActivo(p); setVista('ficha'); }} 
          alCrear={() => setVista('creadorPersonaje')}
          alEliminar={manejarEliminarPersonaje}
        />
      )}
      
      {vista === 'creadorPersonaje' && (
        <CreadorPersonaje 
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
          personajes={personajes}
          onCrearPartida={manejarCrearPartida}
          onUnirsePartida={manejarUnirsePartida}
        />
      )}
    </div>
  );
}
