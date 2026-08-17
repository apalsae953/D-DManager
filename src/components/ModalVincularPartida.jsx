import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Key, X, Trash2, Unlink, Check } from 'lucide-react';

export function ModalVincularPartida({ 
  personaje, 
  misPartidasJugador = [], 
  session,
  onClose, 
  onVincular, 
  onUnirse, 
  onSalirPartida 
}) {
  const [codigo, setCodigo] = useState('');
  
  if (!personaje) return null;

  const partidaActualVinculada = misPartidasJugador.find(p => p.id === personaje.partida_id);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-sangre-600/40 bg-dndoscuro-900 p-6 shadow-2xl relative text-stone-200 animate-scale-in space-y-5" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-2xl font-cinzel text-sangre-100 mb-1">Vincular a Campaña</h2>
          <p className="text-stone-400 text-sm">
            Gestiona la campaña a la que pertenece <strong className="text-stone-200">{personaje.nombre}</strong>.
          </p>
        </div>

        {/* Si ya está vinculado a alguna campaña, opción rápida para desvincular */}
        {personaje.partida_id && (
          <div className="p-3.5 bg-sangre-950/40 border border-sangre-500/40 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Vinculado actualmente a:</span>
              <span className="text-sm font-cinzel font-bold text-emerald-400 truncate block">
                {partidaActualVinculada?.nombre || 'Campaña activa'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onVincular(personaje.id, null);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-800 text-red-300 hover:text-white border border-red-700/50 text-xs font-bold transition-all flex-shrink-0"
              title="Quitar este personaje de la campaña"
            >
              <Unlink className="w-3.5 h-3.5" /> Desvincular
            </button>
          </div>
        )}

        <div className="space-y-5">
          {/* Opción 1: Mis campañas disponibles */}
          {misPartidasJugador.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-300 mb-2 uppercase tracking-widest">
                <Shield className="w-4 h-4 text-sangre-500" /> Mis Campañas Disponibles
              </label>
              <div className="grid gap-2">
                {misPartidasJugador.map(partida => {
                  const estaVinculadoAEsta = personaje.partida_id === partida.id;
                  const esMasterDePartida = session?.user?.id && partida.master_id === session.user.id;

                  return (
                    <div key={partida.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onVincular(personaje.id, partida.id);
                          onClose();
                        }}
                        className={`flex-1 flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                          estaVinculadoAEsta 
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' 
                            : 'bg-dndoscuro-950/60 border-white/5 hover:border-sangre-500 hover:bg-white/5 text-stone-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-cinzel font-bold text-sm block truncate">{partida.nombre}</span>
                          {esMasterDePartida && (
                            <span className="text-[10px] text-amber-400/90 font-mono font-bold">Tu campaña como DM</span>
                          )}
                        </div>
                        {estaVinculadoAEsta && (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-600/40">
                            <Check className="w-3 h-3" /> Vinculado
                          </span>
                        )}
                      </button>

                      {/* Solo permitir abandonar si NO es el master de la partida */}
                      {onSalirPartida && !esMasterDePartida && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`¿Abandonar la campaña "${partida.nombre}" como jugador? Tus personajes se desvincularán.`)) {
                              onSalirPartida(partida.id);
                            }
                          }}
                          className="p-3 rounded-xl bg-dndoscuro-950/60 hover:bg-red-900/40 text-stone-500 hover:text-red-400 border border-white/5 transition-colors"
                          title="Abandonar campaña como jugador"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {misPartidasJugador.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-stone-500 text-xs font-bold uppercase">O unirse con código</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          )}

          {/* Opción 2: Nuevo código de invitación */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-stone-300 mb-2 uppercase tracking-widest">
              <Key className="w-4 h-4 text-sangre-500" /> Código de Invitación
            </label>
            <div className="flex gap-2">
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="EJ: 8A4F2"
                maxLength={6}
                className="flex-1 input-dnd py-2 font-mono tracking-widest text-center uppercase text-sm font-bold"
              />
              <button
                type="button"
                onClick={() => {
                  if (codigo.trim()) {
                    onUnirse(personaje.id, codigo.trim());
                    onClose();
                  }
                }}
                disabled={!codigo.trim()}
                className="btn-primary py-2 px-5 text-xs disabled:opacity-40"
              >
                Unirse
              </button>
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5">Pídele al Dungeon Master el código de su campaña para unirte.</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
