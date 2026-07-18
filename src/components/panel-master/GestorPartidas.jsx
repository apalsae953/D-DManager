import { useState } from 'react';
import { Shield, Users, Copy, Check } from 'lucide-react';

// Antes de tener una partida activa, permite crearla (como master) o unirse
// a una existente mediante su codigo de invitacion. Una vez hay partida,
// muestra el codigo para compartir con los jugadores.
export function GestorPartidas({ partidaActual, onCrearPartida, onUnirsePartida }) {
  const [modo, setModo] = useState('crear');
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
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
        <button
          onClick={copiarCodigo}
          className="flex items-center gap-2 rounded-lg bg-dndoscuro-400 px-3 py-2 font-mono text-lg font-bold tracking-widest text-stone-200 hover:bg-dndoscuro-300 border border-white/10 transition-colors"
        >
          {partidaActual.codigo_invitacion} {copiado ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-stone-400" />}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 glass-panel p-5 animate-fade-in">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setModo('crear')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            modo === 'crear' ? 'bg-sangre-700 text-white shadow-md' : 'bg-dndoscuro-400 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Shield className="h-4 w-4" /> Crear Partida
        </button>
        <button
          onClick={() => setModo('unirse')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            modo === 'unirse' ? 'bg-sangre-700 text-white shadow-md' : 'bg-dndoscuro-400 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Users className="h-4 w-4" /> Unirse a Partida
        </button>
      </div>

      {modo === 'crear' ? (
        <div className="flex gap-2">
          <input
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Nombre de la partida"
            className="flex-1 input-dnd py-2"
          />
          <button
            onClick={() => nombre.trim() && onCrearPartida(nombre.trim())}
            className="btn-primary px-6"
          >
            Crear
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={codigo}
            onChange={(evento) => setCodigo(evento.target.value.toUpperCase())}
            placeholder="CÓDIGO"
            maxLength={6}
            className="flex-1 input-dnd font-mono uppercase tracking-widest py-2"
          />
          <button
            onClick={() => codigo.trim() && onUnirsePartida(codigo.trim())}
            className="btn-primary px-6"
          >
            Unirse
          </button>
        </div>
      )}
    </div>
  );
}
