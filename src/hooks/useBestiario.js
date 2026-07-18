import { useCallback, useMemo, useState, useEffect } from 'react';
import { MONSTRUOS_SRD } from '../datos/monstruosSRD.js';
import { supabase } from '../supabaseClient.js';

export function useBestiario(session) {
  const [personalizados, setPersonalizados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [userId, setUserId] = useState(null);

  // Cargar de Supabase cuando haya sesión
  useEffect(() => {
    const cargarMonstruos = async () => {
      if (!session) {
        // Fallback a localStorage si no hay sesión
        try {
          const saved = localStorage.getItem('dnd_bestiario_personalizados');
          if (saved) setPersonalizados(JSON.parse(saved));
        } catch { /* ignorar */ }
        return;
      }
      
      setUserId(session.user.id);

      // Cargar monstruos personalizados
      const { data, error } = await supabase
        .from('monstruos')
        .select('*');
      
      if (data && !error) {
        const parseados = data.map(m => ({
          ...m,
          id: m.id,
          propietario_id: m.propietario_id,
          visible: m.fuente === 'visible'
        }));
        setPersonalizados(parseados);
      }
    };
    
    cargarMonstruos();
  }, [session]);

  const todos = useMemo(() => [...MONSTRUOS_SRD, ...personalizados], [personalizados]);

  const monstruos = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return todos;
    return todos.filter((m) => m.nombre.toLowerCase().includes(termino) || m.tipo.toLowerCase().includes(termino));
  }, [todos, busqueda]);

  const crearMonstruo = useCallback(async (monstruo) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setPersonalizados((prev) => {
        const nuevos = [...prev, { ...monstruo, id: crypto.randomUUID() }];
        localStorage.setItem('dnd_bestiario_personalizados', JSON.stringify(nuevos));
        return nuevos;
      });
      return;
    }

    // Insertar en Supabase
    const { data, error } = await supabase.from('monstruos').insert({
      propietario_id: session.user.id,
      es_srd: false,
      nombre: monstruo.nombre,
      tamano: monstruo.tamano,
      tipo: monstruo.tipo,
      subtipo: monstruo.subtipo || null,
      alineamiento: monstruo.alineamiento || null,
      clase_armadura: monstruo.clase_armadura,
      puntos_vida: monstruo.puntos_vida,
      velocidad: monstruo.velocidad,
      caracteristicas: monstruo.caracteristicas,
      salvaciones: monstruo.salvaciones || {},
      habilidades: monstruo.habilidades || {},
      vulnerabilidades_dano: monstruo.vulnerabilidades_dano || [],
      resistencias_dano: monstruo.resistencias_dano || [],
      inmunidades_dano: monstruo.inmunidades_dano || [],
      inmunidades_condicion: monstruo.inmunidades_condicion || [],
      sentidos: monstruo.sentidos || null,
      idiomas: monstruo.idiomas || null,
      nivel_desafio: monstruo.nivel_desafio || 0,
      px: monstruo.px || 0,
      habilidades_especiales: monstruo.habilidades_especiales || [],
      acciones: monstruo.acciones || [],
      acciones_legendarias: monstruo.acciones_legendarias || [],
      reacciones: monstruo.reacciones || [],
      fuente: monstruo.visible ? 'visible' : 'oculto' // Usamos fuente para guardar la visibilidad temporalmente
    }).select().single();

    if (data && !error) {
      setPersonalizados((prev) => [...prev, { ...data, visible: data.fuente === 'visible' }]);
    }
  }, []);

  const eliminarMonstruo = useCallback(async (id) => {
    setPersonalizados((prev) => prev.filter((m) => m.id !== id));
    await supabase.from('monstruos').delete().eq('id', id);
  }, []);

  const toggleVisibilidad = useCallback(async (id, actualVisible) => {
    setPersonalizados((prev) => prev.map(m => m.id === id ? { ...m, visible: !actualVisible, fuente: !actualVisible ? 'visible' : 'oculto' } : m));
    await supabase.from('monstruos').update({ fuente: !actualVisible ? 'visible' : 'oculto' }).eq('id', id);
  }, []);

  return {
    monstruos,
    todos,
    busqueda,
    setBusqueda,
    crearMonstruo,
    eliminarMonstruo,
    toggleVisibilidad,
    userId
  };
}
