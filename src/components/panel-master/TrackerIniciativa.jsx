import { Swords, ChevronLeft, ChevronRight, Plus, Trash2, Eye, EyeOff, Skull, User } from 'lucide-react';
import { CONDICIONES } from '../../datos/datosCreacion.js';

export function TrackerIniciativa({
  participantes,
  ronda,
  turnoActivoId,
  combateIniciado,
  onIniciarCombate,
  onSiguienteTurno,
  onTurnoAnterior,
  onTerminarCombate,
  onQuitar,
  onActualizar,
  onAbrirModalAgregar,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 glass-panel p-3">
        <div className="flex items-center gap-2 text-lg font-cinzel font-bold text-stone-200">
          <Swords className="h-5 w-5 text-sangre-500" /> Ronda {ronda}
        </div>
        <div className="flex flex-wrap gap-2">
          {!combateIniciado ? (
            <button
              onClick={onIniciarCombate}
              disabled={participantes.length === 0}
              className="btn-primary"
            >
              Iniciar Combate
            </button>
          ) : (
            <>
              <button onClick={onTurnoAnterior} className="rounded-lg border border-white/10 p-1.5 text-stone-400 hover:bg-white/10 hover:text-white transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={onSiguienteTurno}
                className="flex items-center gap-1 btn-primary"
              >
                Siguiente Turno <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={onTerminarCombate} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-stone-400 hover:bg-white/10 hover:text-white transition-colors">
                Terminar
              </button>
            </>
          )}
          <button
            onClick={onAbrirModalAgregar}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-stone-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>
      </div>

      {participantes.length === 0 && (
        <p className="text-sm text-stone-400">Aun no hay nadie en la iniciativa. Agrega jugadores o monstruos.</p>
      )}

      <div className="space-y-2">
        {participantes.map((p) => (
          <FilaParticipante
            key={p.id}
            participante={p}
            activo={p.id === turnoActivoId}
            onQuitar={() => onQuitar(p.id)}
            onActualizar={(cambios) => onActualizar(p.id, cambios)}
          />
        ))}
      </div>
    </div>
  );
}

function FilaParticipante({ participante, activo, onQuitar, onActualizar }) {
  const esMonstruo = !participante.personaje_id;

  const alternarCondicion = (condicion) => {
    const conjunto = new Set(participante.condiciones);
    if (conjunto.has(condicion)) conjunto.delete(condicion);
    else conjunto.add(condicion);
    onActualizar({ condiciones: Array.from(conjunto) });
  };

  return (
    <div className={`rounded-lg border p-3 transition-colors ${activo ? 'border-amber-500/50 bg-amber-900/20 shadow-neon' : 'border-white/5 bg-dndoscuro-400/50'}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          title={esMonstruo ? 'Monstruo' : 'Jugador'}
          className={`rounded-full p-1.5 ${esMonstruo ? 'bg-sangre-900/50 text-sangre-500 border border-sangre-500/30' : 'bg-indigo-900/50 text-indigo-400 border border-indigo-500/30'}`}
        >
          {esMonstruo ? <Skull className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </span>

        <input
          type="number"
          value={participante.iniciativa}
          onChange={(evento) => onActualizar({ iniciativa: Number(evento.target.value) })}
          title="Iniciativa"
          className="w-14 input-dnd px-1 py-1 text-center font-bold"
        />

        <span className="min-w-[8rem] flex-1 font-bold font-cinzel text-stone-200">{participante.nombre_visible}</span>

        <div className="flex items-center gap-1 text-sm">
          <input
            type="number"
            value={participante.pv_actual}
            onChange={(evento) => onActualizar({ pv_actual: Number(evento.target.value) })}
            title="PV actuales"
            className="w-14 input-dnd px-1 py-1 text-center"
          />
          <span className="text-stone-400 font-bold">/ {participante.pv_maximo}</span>
        </div>

        <label className="flex items-center gap-1 text-sm text-stone-400 font-bold">
          CA
          <input
            type="number"
            value={participante.clase_armadura}
            onChange={(evento) => onActualizar({ clase_armadura: Number(evento.target.value) })}
            className="w-12 input-dnd px-1 py-1 text-center"
          />
        </label>

        <button
          onClick={() => onActualizar({ visible_para_jugadores: !participante.visible_para_jugadores })}
          title={participante.visible_para_jugadores ? 'Visible para jugadores' : 'Oculto para jugadores'}
          className={`rounded p-1.5 hover:bg-white/10 transition-colors ${participante.visible_para_jugadores ? 'text-indigo-400' : 'text-stone-500'}`}
        >
          {participante.visible_para_jugadores ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>

        <button onClick={onQuitar} title="Quitar de la iniciativa" className="rounded p-1.5 text-stone-500 hover:bg-sangre-900/30 hover:text-sangre-500 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {CONDICIONES.map((c) => {
          const activa = participante.condiciones.includes(c);
          return (
            <button
              key={c}
              onClick={() => alternarCondicion(c)}
              className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                activa ? 'bg-sangre-600 text-white shadow-neon' : 'bg-dndoscuro-300 text-stone-500 hover:bg-white/10 hover:text-stone-300'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
