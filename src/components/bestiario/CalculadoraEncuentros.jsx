import { useMemo, useState } from 'react';
import { Users, Skull, Trash2, Plus } from 'lucide-react';
import { calcularDificultadEncuentro } from '../../motor/index.js';

const ETIQUETA_DIFICULTAD = {
  trivial: { texto: 'Trivial', color: 'bg-dndoscuro-400 text-stone-300 border border-white/5' },
  facil: { texto: 'Fácil', color: 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 shadow-neon' },
  medio: { texto: 'Medio', color: 'bg-amber-900/50 text-amber-400 border border-amber-500/30 shadow-neon' },
  dificil: { texto: 'Difícil', color: 'bg-orange-900/50 text-orange-400 border border-orange-500/30 shadow-neon' },
  mortal: { texto: 'Mortal', color: 'bg-sangre-900/50 text-sangre-400 border border-sangre-500/30 shadow-neon' },
};

export function CalculadoraEncuentros({ monstruosDisponibles = [] }) {
  const [cantidadJugadores, setCantidadJugadores] = useState(4);
  const [nivelJugadores, setNivelJugadores] = useState(5);
  const [monstruosSeleccionados, setMonstruosSeleccionados] = useState([]);
  const [monstruoIdParaAgregar, setMonstruoIdParaAgregar] = useState('');
  const [nombreManual, setNombreManual] = useState('');
  const [pxManual, setPxManual] = useState(0);

  const resultado = useMemo(() => {
    const nivelesJugadores = Array.from({ length: Math.max(0, cantidadJugadores) }, () => nivelJugadores);
    return calcularDificultadEncuentro({ nivelesJugadores, monstruos: monstruosSeleccionados });
  }, [cantidadJugadores, nivelJugadores, monstruosSeleccionados]);

  const agregarDelBestiario = () => {
    const monstruo = monstruosDisponibles.find((m) => m.id === monstruoIdParaAgregar);
    if (!monstruo) return;
    setMonstruosSeleccionados((anteriores) => {
      const existente = anteriores.find((m) => m.id === monstruo.id);
      if (existente) {
        return anteriores.map((m) => (m.id === monstruo.id ? { ...m, cantidad: m.cantidad + 1 } : m));
      }
      return [...anteriores, { id: monstruo.id, nombre: monstruo.nombre, px: monstruo.px, cantidad: 1 }];
    });
  };

  const agregarManual = () => {
    if (!nombreManual.trim() || pxManual <= 0) return;
    setMonstruosSeleccionados((anteriores) => [...anteriores, { id: `manual-${Date.now()}`, nombre: nombreManual.trim(), px: pxManual, cantidad: 1 }]);
    setNombreManual('');
    setPxManual(0);
  };

  const cambiarCantidad = (id, cantidad) => {
    setMonstruosSeleccionados((anteriores) => anteriores.map((m) => (m.id === id ? { ...m, cantidad: Math.max(1, cantidad) } : m)));
  };

  const quitarMonstruo = (id) => setMonstruosSeleccionados((anteriores) => anteriores.filter((m) => m.id !== id));

  const dificultad = ETIQUETA_DIFICULTAD[resultado.dificultad];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 glass-panel p-4">
          <p className="mb-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
            <Users className="h-4 w-4 text-indigo-400" /> Grupo de Jugadores
          </p>
          <div className="flex gap-4 mb-4">
            <label className="text-sm text-stone-300 font-bold flex-1">
              Cantidad
              <input
                type="number"
                min={1}
                value={cantidadJugadores}
                onChange={(evento) => setCantidadJugadores(Number(evento.target.value))}
                className="mt-1 w-full input-dnd text-center py-2"
              />
            </label>
            <label className="text-sm text-stone-300 font-bold flex-1">
              Nivel
              <input
                type="number"
                min={1}
                max={20}
                value={nivelJugadores}
                onChange={(evento) => setNivelJugadores(Number(evento.target.value))}
                className="mt-1 w-full input-dnd text-center py-2"
              />
            </label>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {['facil', 'medio', 'dificil', 'mortal'].map((clave) => (
              <div key={clave} className="rounded-lg bg-dndoscuro-400 p-2 border border-white/5">
                <p className="text-stone-400 font-bold mb-1">{ETIQUETA_DIFICULTAD[clave].texto}</p>
                <p className="font-bold text-stone-200 text-lg">{resultado.umbrales[clave]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 glass-panel p-4">
          <p className="mb-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
            <Skull className="h-4 w-4 text-sangre-500" /> Monstruos del Encuentro
          </p>
          <div className="mb-3 flex gap-2">
            <select
              value={monstruoIdParaAgregar}
              onChange={(evento) => setMonstruoIdParaAgregar(evento.target.value)}
              className="flex-1 input-dnd text-sm"
            >
              <option value="" className="bg-dndoscuro-400">-- Elegir del bestiario --</option>
              {monstruosDisponibles.map((m) => (
                <option key={m.id} value={m.id} className="bg-dndoscuro-400">
                  {m.nombre} ({m.px} PX)
                </option>
              ))}
            </select>
            <button onClick={agregarDelBestiario} className="rounded-lg border border-white/10 bg-dndoscuro-300 p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-4 flex gap-2">
            <input
              value={nombreManual}
              onChange={(evento) => setNombreManual(evento.target.value)}
              placeholder="O nombre manual"
              className="flex-1 input-dnd text-sm"
            />
            <input
              type="number"
              value={pxManual}
              onChange={(evento) => setPxManual(Number(evento.target.value))}
              placeholder="PX"
              className="w-20 input-dnd text-sm"
            />
            <button onClick={agregarManual} className="rounded-lg border border-white/10 bg-dndoscuro-300 p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            {monstruosSeleccionados.length === 0 && <p className="text-xs text-stone-500 italic text-center p-4">Ningún monstruo agregado todavía.</p>}
            {monstruosSeleccionados.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg bg-dndoscuro-400/50 border border-white/5 px-3 py-2 text-sm">
                <span className="text-stone-200 font-bold">
                  {m.nombre} <span className="text-stone-400 font-normal">({m.px} PX c/u)</span>
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={m.cantidad}
                    onChange={(evento) => cambiarCantidad(m.id, Number(evento.target.value))}
                    className="w-14 input-dnd px-1 py-1 text-center"
                  />
                  <button onClick={() => quitarMonstruo(m.id)} className="text-stone-500 hover:text-sangre-500 transition-colors p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 glass-panel p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Resultado Final del Encuentro</p>
        <div className={`mt-2 inline-block rounded-lg px-8 py-2 text-2xl font-cinzel font-bold ${dificultad.color}`}>{dificultad.texto}</div>
        <p className="mt-4 text-sm text-stone-400 flex flex-wrap justify-center gap-4">
          <span className="bg-dndoscuro-400 px-3 py-1 rounded-lg border border-white/5">PX total: <strong className="text-stone-200">{resultado.pxTotal}</strong></span>
          <span className="bg-dndoscuro-400 px-3 py-1 rounded-lg border border-white/5">Multiplicador: <strong className="text-amber-400">x{resultado.multiplicador}</strong></span>
          <span className="bg-dndoscuro-400 px-3 py-1 rounded-lg border border-white/5">PX ajustado: <strong className="text-emerald-400">{resultado.pxAjustado}</strong></span>
        </p>
      </div>
    </div>
  );
}
