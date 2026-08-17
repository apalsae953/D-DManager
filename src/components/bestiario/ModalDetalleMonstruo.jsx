import { X, Shield, Heart, Wind, Eye, Sparkles, Sword, AlertTriangle } from 'lucide-react';
import { modificadorCaracteristica } from '../../motor/caracteristicas.js';

function formatoBono(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function formatoND(nd) {
  if (nd === 0.125) return '1/8';
  if (nd === 0.25) return '1/4';
  if (nd === 0.5) return '1/2';
  return String(nd);
}

export function ModalDetalleMonstruo({ monstruo, alCerrar, onAgregarAIniciativa }) {
  if (!monstruo) return null;

  const car = monstruo.caracteristicas || { fue: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 };
  const ca = typeof monstruo.clase_armadura === 'object' ? monstruo.clase_armadura?.valor : monstruo.clase_armadura;
  const caNotas = typeof monstruo.clase_armadura === 'object' ? monstruo.clase_armadura?.notas : null;
  const hp = typeof monstruo.puntos_vida === 'object' ? monstruo.puntos_vida?.promedio : monstruo.puntos_vida;
  const hpFormula = typeof monstruo.puntos_vida === 'object' ? monstruo.puntos_vida?.formula : null;
  const vel = typeof monstruo.velocidad === 'object' ? Object.entries(monstruo.velocidad).map(([k, v]) => `${k === 'caminar' ? '' : k + ' '}${v} pies`).join(', ') : (monstruo.velocidad || '30 pies');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-sangre-800/60 bg-dndoscuro-600 shadow-2xl p-4 sm:p-6 text-stone-300">
        
        {/* Botón cerrar */}
        <button
          onClick={alCerrar}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Encabezado */}
        <div className="border-b-2 border-sangre-800/80 pb-3 mb-4 pr-10">
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-sangre-100">{monstruo.nombre}</h2>
          <p className="text-sm text-stone-400 italic capitalize">
            {monstruo.tamano} {monstruo.tipo} {monstruo.subtipo ? `(${monstruo.subtipo})` : ''}
            {monstruo.alineamiento ? `, ${monstruo.alineamiento}` : ''}
          </p>
        </div>

        {/* Stats de combate principales */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 p-3 bg-dndoscuro-400/70 rounded-lg border border-white/5 text-sm">
          <div>
            <span className="text-stone-400 block text-xs uppercase font-bold">Clase de Armadura</span>
            <span className="font-bold text-stone-100 flex items-center gap-1.5 mt-0.5">
              <Shield className="h-4 w-4 text-indigo-400" />
              {ca} {caNotas && <span className="text-xs text-stone-400 font-normal">({caNotas})</span>}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-xs uppercase font-bold">Puntos de Vida</span>
            <span className="font-bold text-stone-100 flex items-center gap-1.5 mt-0.5">
              <Heart className="h-4 w-4 text-sangre-500" />
              {hp} {hpFormula && <span className="text-xs text-stone-400 font-normal">({hpFormula})</span>}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-stone-400 block text-xs uppercase font-bold">Desafío (CR)</span>
            <span className="font-bold text-amber-400 mt-0.5 block">
              ND {formatoND(monstruo.nivel_desafio)} <span className="text-stone-400 font-normal text-xs">({monstruo.px || 0} PX)</span>
            </span>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <span className="text-stone-400 text-xs uppercase font-bold mr-2">Velocidad:</span>
            <span className="text-stone-200 text-xs">{vel}</span>
          </div>
        </div>

        {/* Atributos */}
        <div className="grid grid-cols-6 gap-1.5 text-center my-4">
          {[
            { k: 'fue', n: 'FUE' },
            { k: 'des', n: 'DES' },
            { k: 'con', n: 'CON' },
            { k: 'int', n: 'INT' },
            { k: 'sab', n: 'SAB' },
            { k: 'car', n: 'CAR' },
          ].map(({ k, n }) => {
            const val = car[k] || 10;
            const mod = modificadorCaracteristica(val);
            return (
              <div key={k} className="p-2 bg-dndoscuro-500 rounded border border-white/5">
                <span className="text-[10px] font-bold text-stone-400 block uppercase">{n}</span>
                <span className="font-bold text-stone-100 text-sm">{val}</span>
                <span className="text-xs text-sangre-400 block font-bold">{formatoBono(mod)}</span>
              </div>
            );
          })}
        </div>

        {/* Rasgos Secundarios */}
        <div className="space-y-1.5 text-xs text-stone-300 py-3 border-y border-white/10 mb-4">
          {monstruo.salvaciones && Object.keys(monstruo.salvaciones).length > 0 && (
            <p><strong className="text-stone-400 uppercase">Tiradas de Salvación:</strong> {Object.entries(monstruo.salvaciones).map(([k, v]) => `${k.toUpperCase()} ${formatoBono(v)}`).join(', ')}</p>
          )}
          {monstruo.habilidades && Object.keys(monstruo.habilidades).length > 0 && (
            <p><strong className="text-stone-400 uppercase">Habilidades:</strong> {Object.entries(monstruo.habilidades).map(([k, v]) => `${k} ${formatoBono(v)}`).join(', ')}</p>
          )}
          {monstruo.resistencias_dano?.length > 0 && (
            <p><strong className="text-amber-400 uppercase">Resistencias:</strong> {monstruo.resistencias_dano.join(', ')}</p>
          )}
          {monstruo.inmunidades_dano?.length > 0 && (
            <p><strong className="text-sangre-400 uppercase">Inmunidades a Daño:</strong> {monstruo.inmunidades_dano.join(', ')}</p>
          )}
          {monstruo.inmunidades_condicion?.length > 0 && (
            <p><strong className="text-indigo-400 uppercase">Inmunidades a Condición:</strong> {monstruo.inmunidades_condicion.join(', ')}</p>
          )}
          {monstruo.sentidos && (
            <p><strong className="text-stone-400 uppercase">Sentidos:</strong> {monstruo.sentidos}</p>
          )}
          {monstruo.idiomas && (
            <p><strong className="text-stone-400 uppercase">Idiomas:</strong> {monstruo.idiomas}</p>
          )}
        </div>

        {/* Habilidades especiales */}
        {monstruo.habilidades_especiales?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-amber-900/40 pb-1 mb-2">Rasgos Especiales</h3>
            <div className="space-y-2">
              {monstruo.habilidades_especiales.map((h, i) => (
                <p key={i} className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-stone-100 italic">{h.nombre}.</strong> {h.descripcion}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        {monstruo.acciones?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-sangre-400 border-b border-sangre-900/40 pb-1 mb-2">Acciones</h3>
            <div className="space-y-2">
              {monstruo.acciones.map((a, i) => (
                <p key={i} className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-stone-100 italic">{a.nombre}.</strong> {a.descripcion}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Acciones Legendarias */}
        {monstruo.acciones_legendarias?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 border-b border-purple-900/40 pb-1 mb-2">Acciones Legendarias</h3>
            <div className="space-y-2">
              {monstruo.acciones_legendarias.map((l, i) => (
                <p key={i} className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-stone-100 italic">{l.nombre}.</strong> {l.descripcion}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Botones inferiores */}
        <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-white/10">
          {onAgregarAIniciativa && (
            <button
              onClick={() => {
                onAgregarAIniciativa(monstruo);
                alCerrar();
              }}
              className="flex items-center gap-2 rounded-lg bg-sangre-700 hover:bg-sangre-600 px-4 py-2 text-sm font-bold text-white transition-colors"
            >
              <Sword className="h-4 w-4" /> Agregar a Iniciativa
            </button>
          )}
          <button
            onClick={alCerrar}
            className="rounded-lg border border-white/10 bg-dndoscuro-400 hover:bg-white/10 px-4 py-2 text-sm font-bold text-stone-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
