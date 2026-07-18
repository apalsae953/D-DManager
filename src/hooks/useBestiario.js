import { useCallback, useMemo, useState, useEffect } from 'react';
import { MONSTRUOS_SRD } from '../datos/monstruosSRD.js';

// Combina la biblioteca SRD integrada con los monstruos personalizados que
// el master va creando en la sesion (persistirlos en Supabase es una simple
// extension de `crearMonstruo`, que hoy solo actualiza el estado local).
export function useBestiario() {
  const [personalizados, setPersonalizados] = useState(() => {
    try {
      const saved = localStorage.getItem('dnd_bestiario_personalizados');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('dnd_bestiario_personalizados', JSON.stringify(personalizados));
  }, [personalizados]);
  const [busqueda, setBusqueda] = useState('');

  const todos = useMemo(() => [...MONSTRUOS_SRD, ...personalizados], [personalizados]);

  const monstruos = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return todos;
    return todos.filter((m) => m.nombre.toLowerCase().includes(termino) || m.tipo.toLowerCase().includes(termino));
  }, [todos, busqueda]);

  const crearMonstruo = useCallback((monstruo) => {
    setPersonalizados((anteriores) => [...anteriores, monstruo]);
  }, []);

  const eliminarMonstruo = useCallback((id) => {
    setPersonalizados((anteriores) => anteriores.filter((m) => m.id !== id));
  }, []);

  return { monstruos, todos, busqueda, setBusqueda, crearMonstruo, eliminarMonstruo };
}
