import { useMemo, useState } from 'react';
import { Users, Skull, Trash2, Plus, HelpCircle, BookOpen } from 'lucide-react';
import { calcularDificultadEncuentro } from '../../motor/index.js';
import { ModalGuiaDificultad } from './ModalGuiaDificultad.jsx';

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
  const [guiaAbierta, setGuiaAbierta] = useState(false);

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
    <div className="space-y-4 animate-fade-in">
      {/* Botón de Guía e Información */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dndoscuro-900/60 p-3 rounded-xl border border-white/5">
        <div>
          <h3 className="text-lg font-cinzel font-bold text-stone-200">Calculadora de Dificultad</h3>
          <p className="text-xs text-stone-400">Balancea los combates según los personajes y el número de monstruos.</p>
        </div>
        <button
          onClick={() => setGuiaAbierta(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sangre-900/40 hover:bg-sangre-800/70 text-sangre-200 hover:text-white border border-sangre-600/40 text-xs font-bold font-cinzel transition-all shadow-md cursor-pointer hover:shadow-neon"
        >
          <HelpCircle className="w-4 h-4 text-sangre-400" />
          <span>¿Cómo funciona la Dificultad? (Guía DM)</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 glass-panel p-4 flex flex-col justify-between">
          <div>
            <p className="mb-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
              <Users className="h-4 w-4 text-indigo-400" /> Grupo de Jugadores
            </p>
            <div className="flex gap-4 mb-4">
              <label className="text-xs text-stone-300 font-bold flex-1">
                Cantidad de Héroes
                <input
                  type="number"
                  min={1}
                  value={cantidadJugadores}
                  onChange={(evento) => setCantidadJugadores(Number(evento.target.value))}
                  className="mt-1 w-full input-dnd text-center py-2 text-lg font-bold"
                />
              </label>
              <label className="text-xs text-stone-300 font-bold flex-1">
                Nivel Promedio
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={nivelJugadores}
                  onChange={(evento) => setNivelJugadores(Number(evento.target.value))}
                  className="mt-1 w-full input-dnd text-center py-2 text-lg font-bold"
                />
              </label>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase tracking-widest font-bold mb-2">Presupuesto de PX por Umbral</p>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {['facil', 'medio', 'dificil', 'mortal'].map((clave) => (
                <div key={clave} className="rounded-lg bg-dndoscuro-950/70 p-2 border border-white/5">
                  <p className="text-stone-400 font-bold mb-1 text-[11px]">{ETIQUETA_DIFICULTAD[clave].texto}</p>
                  <p className="font-bold text-stone-200 text-sm sm:text-base font-mono">{resultado.umbrales[clave]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 glass-panel p-4">
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
            <button onClick={agregarDelBestiario} className="rounded-lg border border-white/10 bg-dndoscuro-300 p-2 text-stone-300 hover:bg-sangre-700 hover:text-white transition-colors" title="Añadir monstruo">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-4 flex gap-2">
            <input
              value={nombreManual}
              onChange={(evento) => setNombreManual(evento.target.value)}
              placeholder="O escribir nombre manual..."
              className="flex-1 input-dnd text-sm"
            />
            <input
              type="number"
              value={pxManual || ''}
              onChange={(evento) => setPxManual(Number(evento.target.value))}
              placeholder="PX"
              className="w-24 input-dnd text-sm text-center"
            />
            <button onClick={agregarManual} className="rounded-lg border border-white/10 bg-dndoscuro-300 p-2 text-stone-300 hover:bg-sangre-700 hover:text-white transition-colors" title="Añadir manual">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5 max-h-48 overflow-y-auto">
            {monstruosSeleccionados.length === 0 && <p className="text-xs text-stone-500 italic text-center p-4">Ningún monstruo agregado todavía.</p>}
            {monstruosSeleccionados.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg bg-dndoscuro-950/60 border border-white/5 px-3 py-2 text-sm">
                <span className="text-stone-200 font-bold">
                  {m.nombre} <span className="text-stone-400 font-normal text-xs font-mono">({m.px} PX c/u)</span>
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-stone-500">Cant:</span>
                    <input
                      type="number"
                      min={1}
                      value={m.cantidad}
                      onChange={(evento) => cambiarCantidad(m.id, Number(evento.target.value))}
                      className="w-12 input-dnd px-1 py-0.5 text-center text-xs font-bold"
                    />
                  </div>
                  <button onClick={() => quitarMonstruo(m.id)} className="text-stone-500 hover:text-sangre-500 transition-colors p-1" title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 glass-panel p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Resultado Final del Encuentro</p>
        <div className={`mt-2 inline-block rounded-xl px-10 py-2.5 text-2xl font-cinzel font-bold ${dificultad.color}`}>{dificultad.texto}</div>
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
          <span className="bg-dndoscuro-950/70 px-4 py-2 rounded-xl border border-white/5">
            PX Total a repartir: <strong className="text-stone-200 font-mono text-base">{resultado.pxTotal}</strong>
          </span>
          <span className="bg-dndoscuro-950/70 px-4 py-2 rounded-xl border border-white/5">
            Multiplicador por criaturas: <strong className="text-amber-400 font-mono text-base">x{resultado.multiplicador}</strong>
          </span>
          <span className="bg-dndoscuro-950/70 px-4 py-2 rounded-xl border border-white/5">
            PX Ajustado (Amenaza): <strong className="text-emerald-400 font-mono text-base">{resultado.pxAjustado}</strong>
          </span>
        </div>
      </div>

      {/* Modal de Explicación */}
      <ModalGuiaDificultad
        abierto={guiaAbierta}
        alCerrar={() => setGuiaAbierta(false)}
      />
    </div>
  );
}
