import { Heart, Shield, Plus } from 'lucide-react';

function formatoNivelDesafio(nd) {
  if (nd === 0.125) return '1/8';
  if (nd === 0.25) return '1/4';
  if (nd === 0.5) return '1/2';
  return String(nd);
}

export function TarjetaMonstruo({ monstruo, onAgregarAIniciativa }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-dndoscuro-400/50 p-3 hover:bg-white/5 transition-colors">
      <div>
        <div className="mb-1 flex items-start justify-between gap-2">
          <div>
            <p className="font-bold font-cinzel text-stone-200 text-lg">{monstruo.nombre}</p>
            <p className="text-xs text-stone-400">
              <span className="capitalize">{monstruo.tamano}</span> · <span className="capitalize">{monstruo.tipo}</span>
              {monstruo.alineamiento ? ` · ${monstruo.alineamiento}` : ''}
            </p>
          </div>
          {monstruo.es_srd && <span className="shrink-0 rounded bg-indigo-900/50 border border-indigo-500/30 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">SRD</span>}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-stone-400 mt-2">
          <span className="flex items-center gap-1 font-bold text-stone-200">
            <Shield className="h-4 w-4 text-indigo-400" /> {monstruo.clase_armadura.valor}
          </span>
          <span className="flex items-center gap-1 font-bold text-stone-200">
            <Heart className="h-4 w-4 text-sangre-500" /> {monstruo.puntos_vida.promedio}
            {monstruo.puntos_vida.formula ? <span className="text-stone-500 font-normal">({monstruo.puntos_vida.formula})</span> : ''}
          </span>
          <span className="font-bold text-amber-500/80">
            ND {formatoNivelDesafio(monstruo.nivel_desafio)} <span className="text-stone-500 font-normal">({monstruo.px} PX)</span>
          </span>
        </div>
      </div>

      {onAgregarAIniciativa && (
        <button
          onClick={() => onAgregarAIniciativa(monstruo)}
          className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-dndoscuro-300 px-2 py-2 text-xs font-bold uppercase tracking-wider text-stone-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> A Iniciativa
        </button>
      )}
    </div>
  );
}
