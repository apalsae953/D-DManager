import { Lock, Unlock } from 'lucide-react';
import { Interruptor } from './Interruptor.jsx';

// Campo reutilizable para cualquier valor calculado por el motor de reglas
// (PV, CA, bono de competencia, percepcion pasiva...). Con el interruptor
// desactivado muestra el valor automatico; al activarlo revela un input que
// escribe en `anulacion` para el modo Homebrew/Manual exigido en los requisitos.
export function CampoEditable({ etiqueta, Icono, valorCalculado, anulacion, onCambiar, tipo = 'numero', descripcion, sufijo }) {
  const activada = anulacion?.activada ?? false;
  const valorMostrado = activada ? anulacion.valor : valorCalculado;

  const manejarCambioValor = (evento) => {
    const bruto = evento.target.value;
    const valor = tipo === 'numero' ? (bruto === '' ? 0 : Number(bruto)) : bruto;
    onCambiar(true, valor);
  };

  const manejarToggle = (nuevoActivado) => {
    onCambiar(nuevoActivado, nuevoActivado ? valorCalculado : null);
  };

  return (
    <div className="rounded-lg border border-white/10 glass-panel p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
          {Icono && <Icono className="h-3.5 w-3.5" />}
          {etiqueta}
        </div>
        <div className="flex items-center gap-1.5">
          {activada ? <Unlock className="h-3.5 w-3.5 text-amber-600" /> : <Lock className="h-3.5 w-3.5 text-stone-400" />}
          <Interruptor activado={activada} alCambiar={manejarToggle} />
        </div>
      </div>

      {activada ? (
        <input
          type={tipo === 'numero' ? 'number' : 'text'}
          value={valorMostrado ?? ''}
          onChange={manejarCambioValor}
          className="mt-1 w-full rounded border border-amber-500/40 bg-amber-900/30 px-2 py-1 text-2xl font-bold text-amber-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
        />
      ) : (
        <div className="mt-1 text-2xl font-bold text-stone-100">
          {valorMostrado}
          {sufijo && <span className="ml-1 text-sm font-normal text-stone-400">{sufijo}</span>}
        </div>
      )}

      {descripcion && <p className="mt-1 truncate text-[11px] text-stone-400" title={descripcion}>{descripcion}</p>}
    </div>
  );
}
