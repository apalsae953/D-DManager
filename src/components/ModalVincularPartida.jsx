import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Key, X, Trash2 } from 'lucide-react';

export function ModalVincularPartida({ personaje, misPartidasJugador = [], onClose, onVincular, onUnirse, onSalirPartida }) {
  const [codigo, setCodigo] = useState('');
  
  if (!personaje) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-sangre-600/40 bg-dndoscuro-900 p-6 shadow-2xl relative text-stone-200 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-cinzel text-sangre-100 mb-2">Unir a Partida</h2>
        <p className="text-stone-400 text-sm mb-6">
          ¿En qué campaña quieres que participe <strong className="text-stone-200">{personaje.nombre}</strong>?
        </p>

        <div className="space-y-6">
          {/* Opción 1: Partida existente */}
          {misPartidasJugador.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-stone-300 mb-2 uppercase tracking-widest">
                <Shield className="w-4 h-4 text-sangre-500" /> Mis campañas actuales
              </label>
              <div className="grid gap-2">
                {misPartidasJugador.map(partida => (
                  <div key={partida.id} className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onVincular(personaje.id, partida.id);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-between bg-dndoscuro-950/60 p-3 rounded-lg border border-white/5 hover:border-sangre-500 hover:bg-white/5 transition-all text-left"
                    >
                      <span className="font-cinzel text-stone-200">{partida.nombre}</span>
                    </button>
                    {onSalirPartida && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`¿Abandonar la campaña "${partida.nombre}" y desvincular tus personajes?`)) {
                            onSalirPartida(partida.id);
                          }
                        }}
                        className="p-3 rounded-lg bg-dndoscuro-950/60 hover:bg-red-900/40 text-stone-500 hover:text-red-400 border border-white/5 transition-colors"
                        title="Abandonar campaña"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {misPartidasJugador.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-stone-500 text-xs font-bold uppercase">O nueva</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          )}

          {/* Opción 2: Nuevo código */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-stone-300 mb-2 uppercase tracking-widest">
              <Key className="w-4 h-4 text-sangre-500" /> Código de Invitación
            </label>
            <div className="flex gap-2">
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="EJ: 8A4F2"
                maxLength={6}
                className="flex-1 input-dnd py-2 font-mono tracking-widest text-center uppercase"
              />
              <button
                onClick={() => {
                  if (codigo.trim()) {
                    onUnirse(personaje.id, codigo.trim());
                    onClose();
                  }
                }}
                disabled={!codigo.trim()}
                className="btn-primary"
              >
                Unirse
              </button>
            </div>
            <p className="text-xs text-stone-500 mt-2">Pídele al Dungeon Master el código de 6 caracteres de su campaña.</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
