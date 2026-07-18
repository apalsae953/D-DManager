import { useState } from 'react';
import { X, Dices, Plus, Minus, Trash2 } from 'lucide-react';

const CARAS_DISPONIBLES = [4, 6, 8, 10, 12, 20, 100];

function tirarDados(cantidad, caras) {
  return Array.from({ length: cantidad }, () => 1 + Math.floor(Math.random() * caras));
}

function formatoModificador(modificador) {
  if (modificador === 0) return '';
  return modificador > 0 ? `+${modificador}` : `${modificador}`;
}

export function ModalDados({ abierto, alCerrar, onRegistrarTirada }) {
  const [caras, setCaras] = useState(20);
  const [cantidad, setCantidad] = useState(1);
  const [modificador, setModificador] = useState(0);
  const [historial, setHistorial] = useState([]);

  if (!abierto) return null;

  const manejarTirar = () => {
    const resultados = tirarDados(cantidad, caras);
    const total = resultados.reduce((suma, valor) => suma + valor, 0) + modificador;
    const entrada = {
      id: `${Date.now()}-${Math.random()}`,
      notacion: `${cantidad}d${caras}${formatoModificador(modificador)}`,
      resultados,
      modificador,
      total,
    };
    setHistorial((anterior) => [entrada, ...anterior].slice(0, 30));
    onRegistrarTirada?.(entrada);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={alCerrar}>
      <div
        className="w-full max-w-md rounded-xl bg-[#111111] border border-sangre-800/50 p-5 shadow-2xl shadow-black/50"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-cinzel font-bold text-sangre-100">
            <Dices className="h-5 w-5 text-amber-500" /> Lanzador de Dados
          </h2>
          <button onClick={alCerrar} className="rounded p-1 text-stone-500 hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-4 gap-2">
          {CARAS_DISPONIBLES.map((c) => (
            <button
              key={c}
              onClick={() => setCaras(c)}
              className={`rounded-lg border py-2 text-sm font-semibold transition-all ${
                caras === c
                  ? 'border-amber-600 bg-amber-900/40 text-amber-300 shadow-neon'
                  : 'border-white/10 bg-[#1a1a1a] text-stone-300 hover:bg-dndoscuro-500 hover:text-white'
              }`}
            >
              d{c}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-stone-300">
            Cantidad
            <span className="flex items-center rounded-lg border border-white/10 bg-[#1a1a1a] overflow-hidden">
              <button onClick={() => setCantidad((n) => Math.max(1, n - 1))} className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-white">{cantidad}</span>
              <button onClick={() => setCantidad((n) => Math.min(20, n + 1))} className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm text-stone-300">
            Modificador
            <input
              type="number"
              value={modificador}
              onChange={(evento) => setModificador(Number(evento.target.value))}
              className="w-16 rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-1.5 text-center font-bold text-white outline-none focus:border-sangre-600"
            />
          </label>
        </div>

        <button
          onClick={manejarTirar}
          className="mb-4 w-full rounded-lg bg-sangre-700 py-2.5 font-bold text-white shadow hover:bg-sangre-600 transition-colors"
        >
          Tirar {cantidad}d{caras}{formatoModificador(modificador)}
        </button>

        <div className="max-h-56 space-y-1.5 overflow-y-auto">
          {historial.length === 0 && <p className="text-center text-sm text-stone-500">Sin tiradas todavía.</p>}
          {historial.map((entrada) => (
            <div key={entrada.id} className="flex items-center justify-between rounded-lg bg-[#1a1a1a] border border-white/5 px-3 py-2 text-sm">
              <span className="text-stone-400">
                {entrada.notacion} = [{entrada.resultados.join(', ')}]
              </span>
              <span className="font-bold text-xl text-amber-400">{entrada.total}</span>
            </div>
          ))}
        </div>

        {historial.length > 0 && (
          <button
            onClick={() => setHistorial([])}
            className="mt-2 flex items-center gap-1 text-xs text-stone-500 hover:text-sangre-400 transition-colors"
          >
            <Trash2 className="h-3 w-3" /> Limpiar historial
          </button>
        )}
      </div>
    </div>
  );
}
