import { useState } from 'react';
import { X, UserPlus, Skull, Dices } from 'lucide-react';

// Agrega un jugador ya vinculado a la partida (con sus PV/CA actuales como
// punto de partida) o un monstruo/NPC de carga rapida a la fila de iniciativa.
export function ModalAgregarParticipante({ abierto, alCerrar, resumenesPersonajes, participantesActuales, onAgregar }) {
  const [tipo, setTipo] = useState('jugador');
  const [personajeSeleccionadoId, setPersonajeSeleccionadoId] = useState('');
  const [iniciativaJugador, setIniciativaJugador] = useState(10);

  const [nombreMonstruo, setNombreMonstruo] = useState('');
  const [pvMonstruo, setPvMonstruo] = useState(10);
  const [caMonstruo, setCaMonstruo] = useState(10);
  const [modIniciativaMonstruo, setModIniciativaMonstruo] = useState(0);
  const [iniciativaMonstruo, setIniciativaMonstruo] = useState(10);

  if (!abierto) return null;

  const idsYaAgregados = new Set(participantesActuales.filter((p) => p.personaje_id).map((p) => p.personaje_id));
  const disponibles = resumenesPersonajes.filter((p) => !idsYaAgregados.has(p.id));

  const tirarIniciativaMonstruo = () => {
    setIniciativaMonstruo(1 + Math.floor(Math.random() * 20) + Number(modIniciativaMonstruo));
  };

  const confirmarJugador = () => {
    const personaje = resumenesPersonajes.find((p) => p.id === personajeSeleccionadoId);
    if (!personaje) return;
    onAgregar({
      personaje_id: personaje.id,
      monstruo_id: null,
      nombre_visible: personaje.nombre || personaje.clase,
      iniciativa: iniciativaJugador,
      pv_actual: personaje.pvActual,
      pv_maximo: personaje.pvMaximo,
      clase_armadura: personaje.clase_armadura,
      visible_para_jugadores: true,
    });
    setPersonajeSeleccionadoId('');
    alCerrar();
  };

  const confirmarMonstruo = () => {
    if (!nombreMonstruo.trim()) return;
    onAgregar({
      personaje_id: null,
      monstruo_id: null,
      nombre_visible: nombreMonstruo.trim(),
      iniciativa: iniciativaMonstruo,
      pv_actual: pvMonstruo,
      pv_maximo: pvMonstruo,
      clase_armadura: caMonstruo,
      visible_para_jugadores: false,
    });
    setNombreMonstruo('');
    alCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={alCerrar}>
      <div className="w-full max-w-md rounded-xl bg-dndoscuro-400 p-5 shadow-2xl border border-white/10" onClick={(evento) => evento.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-cinzel font-bold text-stone-200">Agregar a la Iniciativa</h2>
          <button onClick={alCerrar} className="rounded p-1 text-stone-400 hover:bg-white/10 hover:text-stone-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTipo('jugador')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tipo === 'jugador' ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-500/50 shadow-neon' : 'bg-dndoscuro-300 text-stone-400 hover:bg-white/10'
            }`}
          >
            <UserPlus className="h-4 w-4" /> Jugador
          </button>
          <button
            onClick={() => setTipo('monstruo')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tipo === 'monstruo' ? 'bg-sangre-900/80 text-sangre-200 border border-sangre-500/50 shadow-neon' : 'bg-dndoscuro-300 text-stone-400 hover:bg-white/10'
            }`}
          >
            <Skull className="h-4 w-4" /> Monstruo
          </button>
        </div>

        {tipo === 'jugador' && (
          <div className="space-y-4">
            {disponibles.length === 0 ? (
              <p className="text-sm text-stone-400 italic text-center p-4">Todos los jugadores de la partida ya están en la iniciativa.</p>
            ) : (
              <>
                <select
                  value={personajeSeleccionadoId}
                  onChange={(evento) => setPersonajeSeleccionadoId(evento.target.value)}
                  className="w-full input-dnd"
                >
                  <option value="" className="bg-dndoscuro-400">-- Selecciona un jugador --</option>
                  {disponibles.map((p) => (
                    <option key={p.id} value={p.id} className="bg-dndoscuro-400">
                      {p.nombre || 'Sin nombre'} (Nv{p.nivel} {p.clase})
                    </option>
                  ))}
                </select>
                <label className="flex items-center justify-between text-sm text-stone-400 font-bold bg-dndoscuro-300 p-2 rounded-lg border border-white/5">
                  <span>Iniciativa</span>
                  <input
                    type="number"
                    value={iniciativaJugador}
                    onChange={(evento) => setIniciativaJugador(Number(evento.target.value))}
                    className="w-20 input-dnd text-center"
                  />
                </label>
                <button
                  onClick={confirmarJugador}
                  disabled={!personajeSeleccionadoId}
                  className="w-full btn-primary py-3"
                >
                  Agregar Jugador
                </button>
              </>
            )}
          </div>
        )}

        {tipo === 'monstruo' && (
          <div className="space-y-4">
            <input
              value={nombreMonstruo}
              onChange={(evento) => setNombreMonstruo(evento.target.value)}
              placeholder="Nombre (ej. Goblin 1)"
              className="w-full input-dnd py-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-stone-400 uppercase tracking-wider font-bold">
                Puntos de Vida
                <input
                  type="number"
                  value={pvMonstruo}
                  onChange={(evento) => setPvMonstruo(Number(evento.target.value))}
                  className="mt-1 w-full input-dnd text-center"
                />
              </label>
              <label className="text-xs text-stone-400 uppercase tracking-wider font-bold">
                Clase de Armadura
                <input
                  type="number"
                  value={caMonstruo}
                  onChange={(evento) => setCaMonstruo(Number(evento.target.value))}
                  className="mt-1 w-full input-dnd text-center"
                />
              </label>
            </div>
            
            <div className="bg-dndoscuro-300 p-3 rounded-lg border border-white/5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs text-stone-400 font-bold flex items-center gap-2 w-full">
                  <span className="w-24">Modificador</span>
                  <input
                    type="number"
                    value={modIniciativaMonstruo}
                    onChange={(evento) => setModIniciativaMonstruo(Number(evento.target.value))}
                    className="w-16 input-dnd text-center"
                  />
                </label>
                <button
                  onClick={tirarIniciativaMonstruo}
                  className="flex items-center gap-1 rounded bg-white/10 px-3 py-1.5 text-sm font-bold text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <Dices className="h-4 w-4" /> Tirar
                </button>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                <label className="text-sm text-stone-300 font-bold flex items-center gap-2 w-full justify-between">
                  <span>Resultado Iniciativa</span>
                  <input
                    type="number"
                    value={iniciativaMonstruo}
                    onChange={(evento) => setIniciativaMonstruo(Number(evento.target.value))}
                    className="w-20 input-dnd text-center text-lg"
                  />
                </label>
              </div>
            </div>

            <button onClick={confirmarMonstruo} className="w-full btn-primary py-3 bg-sangre-800 hover:bg-sangre-700">
              Agregar Monstruo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
