import { useCallback, useMemo, useState, useEffect } from 'react';
import { recalcularPersonaje } from '../motor/index.js';

// Reduce un personaje completo (mismo shape que usa la Ficha) al resumen que
// necesita la pantalla del master: vida actual/maxima, CA, percepcion pasiva
// y condiciones, reutilizando el motor de reglas para respetar cualquier
// anulacion Homebrew que el jugador haya activado en su ficha.
function resumenPersonaje(personaje) {
  const derivado = recalcularPersonaje(personaje);
  return {
    id: personaje.id,
    nombre: personaje.nombre,
    clase: personaje.clase,
    nivel: personaje.nivel,
    pvActual: derivado.puntosVida.actual,
    pvMaximo: derivado.puntosVida.maximo,
    clase_armadura: derivado.claseArmadura.valor,
    percepcionPasiva: derivado.percepcionPasiva.valor,
    modificadorIniciativa: derivado.modificadorIniciativa,
    condiciones: personaje.condiciones ?? [],
  };
}

export function usePanelMaster(personajes = []) {
  const resumenesPersonajes = useMemo(() => personajes.map(resumenPersonaje), [personajes]);

  const [participantes, setParticipantes] = useState(() => {
    try {
      const saved = localStorage.getItem('dnd_combate_participantes');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [ronda, setRonda] = useState(() => {
    try {
      const saved = localStorage.getItem('dnd_combate_ronda');
      return saved ? Number(saved) : 1;
    } catch { return 1; }
  });
  const [turnoActivoId, setTurnoActivoId] = useState(() => {
    try {
      const saved = localStorage.getItem('dnd_combate_turno');
      return saved ? saved : null;
    } catch { return null; }
  });
  const [combateIniciado, setCombateIniciado] = useState(() => {
    try {
      const saved = localStorage.getItem('dnd_combate_iniciado');
      return saved === 'true';
    } catch { return false; }
  });

  useEffect(() => {
    localStorage.setItem('dnd_combate_participantes', JSON.stringify(participantes));
    localStorage.setItem('dnd_combate_ronda', ronda.toString());
    if (turnoActivoId) localStorage.setItem('dnd_combate_turno', turnoActivoId);
    else localStorage.removeItem('dnd_combate_turno');
    localStorage.setItem('dnd_combate_iniciado', combateIniciado.toString());
  }, [participantes, ronda, turnoActivoId, combateIniciado]);

  const participantesOrdenados = useMemo(
    () => [...participantes].sort((a, b) => b.iniciativa - a.iniciativa),
    [participantes]
  );

  const agregarParticipante = useCallback((participante) => {
    setParticipantes((anteriores) => [
      ...anteriores,
      { id: `participante-${Date.now()}-${Math.random()}`, condiciones: [], visible_para_jugadores: true, ...participante },
    ]);
  }, []);

  const quitarParticipante = useCallback((id) => {
    setParticipantes((anteriores) => anteriores.filter((p) => p.id !== id));
  }, []);

  const actualizarParticipante = useCallback((id, cambios) => {
    setParticipantes((anteriores) => anteriores.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
  }, []);

  const iniciarCombate = useCallback(() => {
    if (participantes.length === 0) return;
    const ordenados = [...participantes].sort((a, b) => b.iniciativa - a.iniciativa);
    setRonda(1);
    setTurnoActivoId(ordenados[0].id);
    setCombateIniciado(true);
  }, [participantes]);

  const siguienteTurno = useCallback(() => {
    if (participantesOrdenados.length === 0) return;
    const indiceActual = participantesOrdenados.findIndex((p) => p.id === turnoActivoId);
    const siguienteIndice = indiceActual + 1;
    if (siguienteIndice >= participantesOrdenados.length) {
      setRonda((r) => r + 1);
      setTurnoActivoId(participantesOrdenados[0].id);
    } else {
      setTurnoActivoId(participantesOrdenados[siguienteIndice].id);
    }
  }, [participantesOrdenados, turnoActivoId]);

  const turnoAnterior = useCallback(() => {
    if (participantesOrdenados.length === 0) return;
    const indiceActual = participantesOrdenados.findIndex((p) => p.id === turnoActivoId);
    const indiceAnterior = indiceActual - 1;
    if (indiceAnterior < 0) {
      setRonda((r) => Math.max(1, r - 1));
      setTurnoActivoId(participantesOrdenados[participantesOrdenados.length - 1].id);
    } else {
      setTurnoActivoId(participantesOrdenados[indiceAnterior].id);
    }
  }, [participantesOrdenados, turnoActivoId]);

  const terminarCombate = useCallback(() => {
    setParticipantes([]);
    setRonda(1);
    setTurnoActivoId(null);
    setCombateIniciado(false);
  }, []);

  return {
    resumenesPersonajes,
    participantes: participantesOrdenados,
    ronda,
    turnoActivoId,
    combateIniciado,
    agregarParticipante,
    quitarParticipante,
    actualizarParticipante,
    iniciarCombate,
    siguienteTurno,
    turnoAnterior,
    terminarCombate,
  };
}
