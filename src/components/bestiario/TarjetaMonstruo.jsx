import { useState } from 'react';
import { Heart, Shield, Plus, Eye, EyeOff, Trash2, Info } from 'lucide-react';
import { ModalDetalleMonstruo } from './ModalDetalleMonstruo.jsx';

function formatoNivelDesafio(nd) {
  if (nd === 0.125) return '1/8';
  if (nd === 0.25) return '1/4';
  if (nd === 0.5) return '1/2';
  return String(nd);
}

export function TarjetaMonstruo({ monstruo, onAgregar, onEliminar, onToggleVisibilidad, currentUserId }) {
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const isPropietario = currentUserId && monstruo.propietario_id === currentUserId;

  const ca = typeof monstruo.clase_armadura === 'object' ? monstruo.clase_armadura?.valor : monstruo.clase_armadura;
  const hp = typeof monstruo.puntos_vida === 'object' ? monstruo.puntos_vida?.promedio : monstruo.puntos_vida;
  const hpFormula = typeof monstruo.puntos_vida === 'object' ? monstruo.puntos_vida?.formula : null;

  return (
    <>
      <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-dndoscuro-400/50 p-3 hover:border-sangre-500/50 hover:bg-white/5 transition-all">
        {/* Click en la cabecera / cuerpo abre la ficha detallada */}
        <div 
          className="cursor-pointer group select-none"
          onClick={() => setModalDetalleAbierto(true)}
          title="Haz clic para ver toda la información detallada de esta criatura"
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <div>
              <p className="font-bold font-cinzel text-stone-200 text-lg group-hover:text-sangre-400 transition-colors flex items-center gap-1.5">
                {monstruo.nombre}
                <Info className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-sangre-400 transition-opacity" />
              </p>
              <p className="text-xs text-stone-400">
                <span className="capitalize">{monstruo.tamano}</span> · <span className="capitalize">{monstruo.tipo}</span>
                {monstruo.alineamiento ? ` · ${monstruo.alineamiento}` : ''}
              </p>
            </div>
            {monstruo.es_srd && <span className="shrink-0 rounded bg-indigo-900/50 border border-indigo-500/30 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">SRD</span>}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-stone-400 mt-2">
            <span className="flex items-center gap-1 font-bold text-stone-200">
              <Shield className="h-4 w-4 text-indigo-400" /> {ca}
            </span>
            <span className="flex items-center gap-1 font-bold text-stone-200">
              <Heart className="h-4 w-4 text-sangre-500" /> {hp}
              {hpFormula ? <span className="text-stone-500 font-normal text-xs">({hpFormula})</span> : ''}
            </span>
            <span className="font-bold text-amber-500/80">
              ND {formatoNivelDesafio(monstruo.nivel_desafio)} <span className="text-stone-500 font-normal text-xs">({monstruo.px || 0} PX)</span>
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-2 pt-2 border-t border-white/5">
          {onAgregar && (
            <button
              onClick={() => onAgregar(monstruo)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-dndoscuro-300 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> A Iniciativa
            </button>
          )}
          
          <button
            onClick={() => setModalDetalleAbierto(true)}
            className="flex items-center justify-center rounded-lg border border-white/10 bg-dndoscuro-300 px-2.5 py-1.5 text-xs font-bold text-stone-300 hover:bg-white/10 hover:text-white transition-colors"
            title="Ver ficha completa"
          >
            Ficha
          </button>
          
          {onToggleVisibilidad && isPropietario && (
            <button
              onClick={() => onToggleVisibilidad(monstruo.id, monstruo.visible)}
              className={`flex items-center justify-center rounded-lg border border-white/10 px-2.5 py-1.5 transition-colors ${
                monstruo.visible ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60 hover:text-white' : 'bg-dndoscuro-300 text-stone-500 hover:bg-white/10 hover:text-stone-300'
              }`}
              title={monstruo.visible ? "Ocultar a jugadores" : "Revelar a jugadores"}
            >
              {monstruo.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          )}

          {onEliminar && isPropietario && (
            <button
              onClick={() => {
                if (window.confirm(`¿Seguro que quieres eliminar a ${monstruo.nombre}?`)) {
                  onEliminar(monstruo.id);
                }
              }}
              className="flex items-center justify-center rounded-lg border border-white/10 bg-dndoscuro-300 px-2.5 py-1.5 text-stone-500 transition-colors hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-400"
              title="Eliminar del bestiario"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {modalDetalleAbierto && (
        <ModalDetalleMonstruo
          monstruo={monstruo}
          alCerrar={() => setModalDetalleAbierto(false)}
          onAgregarAIniciativa={onAgregar}
        />
      )}
    </>
  );
}
