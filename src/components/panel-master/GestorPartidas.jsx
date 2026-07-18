import { useState } from 'react';
import { Shield, Users, Copy, Check, Trash2 } from 'lucide-react';

// Antes de tener una partida activa, permite crearla (como master) o unirse
// a una existente mediante su codigo de invitacion. Una vez hay partida,
// muestra el codigo para compartir con los jugadores.
export function GestorPartidas({ partidaActual, misPartidasMaster = [], onSeleccionarPartida, onCrearPartida, onUnirsePartida, onSalirPartida, onEliminarPartida }) {
  const [modo, setModo] = useState('crear'); // 'crear' o 'listar'
  const [nombre, setNombre] = useState('');
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = async () => {
    if (!partidaActual?.codigo_invitacion) return;
    await navigator.clipboard.writeText(partidaActual.codigo_invitacion);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  if (partidaActual) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 glass-panel p-4">
        <div>
          <h2 className="text-2xl font-cinzel text-stone-200">{partidaActual.nombre}</h2>
          <p className="text-sm text-stone-400">Código de invitación</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={copiarCodigo}
            className="flex items-center gap-2 rounded-lg bg-dndoscuro-400 px-3 py-2 font-mono text-lg font-bold tracking-widest text-stone-200 hover:bg-dndoscuro-300 border border-white/10 transition-colors"
          >
            {partidaActual.codigo_invitacion} {copiado ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-stone-400" />}
          </button>
          
          <button 
            onClick={onSalirPartida}
            className="px-4 py-2 bg-stone-800 text-stone-300 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-white/10"
            title="Cerrar la vista de esta partida"
          >
            Salir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 glass-panel p-5 animate-fade-in space-y-6">
      
      {/* Lista de Partidas Creadas */}
      {misPartidasMaster.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-cinzel text-stone-300 flex items-center gap-2">
              <Shield className="h-5 w-5 text-sangre-500" /> Mis Campañas
            </h3>
            <p className="text-sm text-stone-400 mt-1">Selecciona una campaña para administrarla.</p>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {misPartidasMaster.map(p => (
              <div key={p.id} className="flex items-center gap-2">
                <button
                  onClick={() => onSeleccionarPartida(p)}
                  className="flex-1 flex items-center justify-between p-4 rounded-lg bg-dndoscuro-400 hover:bg-dndoscuro-300 border border-white/5 transition-all hover:border-sangre-500/30 text-left"
                >
                  <div className="font-cinzel text-stone-200">{p.nombre}</div>
                  <Users className="w-5 h-5 text-stone-500" />
                </button>
                {onEliminarPartida && (
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Seguro que quieres borrar la campaña "${p.nombre}" enterita? Esto expulsará a todos los jugadores.`)) {
                        onEliminarPartida(p.id);
                      }
                    }}
                    className="p-4 rounded-lg bg-dndoscuro-400 hover:bg-red-900/40 border border-white/5 hover:border-red-500/50 transition-all text-stone-500 hover:text-red-400"
                    title="Borrar Partida"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crear Nueva Partida */}
      <div className={misPartidasMaster.length > 0 ? "pt-6 border-t border-white/5" : ""}>
        <div className="mb-4">
          <h3 className="text-lg font-cinzel text-stone-300 flex items-center gap-2">
            <Shield className="h-5 w-5 text-sangre-500" /> Crear Nueva Partida
          </h3>
          <p className="text-sm text-stone-400 mt-1">Como Dungeon Master, crea una sala para invitar a tus jugadores.</p>
        </div>

        <div className="flex gap-2">
          <input
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Nombre de la campaña..."
            className="flex-1 input-dnd py-2"
          />
          <button
            onClick={() => nombre.trim() && onCrearPartida(nombre.trim())}
            className="btn-primary px-6"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
