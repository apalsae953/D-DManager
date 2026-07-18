import { useState } from 'react';
import { Plus, User, Shield, Swords, Trash2, Link } from 'lucide-react';
import { ModalVincularPartida } from './ModalVincularPartida.jsx';

export function ListaPersonajes({ personajes, misPartidasJugador = [], alSeleccionar, alCrear, alEliminar, onUnirsePartida, onAsignarPartida }) {
  const [personajeAVincular, setPersonajeAVincular] = useState(null);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-sangre-100 drop-shadow-md">Mis Personajes</h1>
          <p className="text-stone-400 mt-1">Selecciona un héroe para continuar tu aventura o forja uno nuevo.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={alCrear} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Nuevo Personaje
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personajes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 glass-panel text-center">
            <Shield className="w-16 h-16 text-stone-600 mb-4 opacity-50" />
            <h3 className="text-xl font-cinzel text-stone-300 mb-2">Ningún héroe encontrado</h3>
            <p className="text-stone-500 mb-6">Parece que aún no has comenzado tu leyenda.</p>
            <button onClick={alCrear} className="btn-secondary">
              Crear Personaje
            </button>
          </div>
        ) : (
          personajes.map((p) => {
            const partidaDelPersonaje = misPartidasJugador.find(game => game.id === p.partida_id);
            return (
              <div 
                key={p.id} 
                onClick={() => alSeleccionar(p)}
                className="glass-panel group cursor-pointer hover:border-sangre-600/50 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-dndoscuro-400 relative overflow-hidden">
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.nombre} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-dndoscuro-300">
                      <User className="w-16 h-16 text-stone-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dndoscuro-900 via-dndoscuro-900/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-xl font-cinzel font-bold text-white drop-shadow-md">{p.nombre || 'Sin nombre'}</h2>
                    <p className="text-sm text-stone-300">{p.raza} {p.clase} - Nivel {p.nivel || 1}</p>
                    {partidaDelPersonaje ? (
                      <p className="text-xs text-emerald-400 mt-1 font-semibold flex items-center gap-1 drop-shadow-md">
                        <Shield className="w-3 h-3" />
                        {partidaDelPersonaje.nombre}
                      </p>
                    ) : (
                      <div className="mt-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setPersonajeAVincular(p)}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-300 bg-dndoscuro-900/80 hover:bg-sangre-700/80 hover:text-white px-2.5 py-1.5 rounded-md border border-white/10 transition-colors w-fit"
                        >
                          <Link className="w-3 h-3" /> Unir a Partida
                        </button>
                      </div>
                    )}
                  </div>
                  {alEliminar && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Seguro que quieres eliminar a ${p.nombre || 'este personaje'}? No podrás recuperarlo.`)) {
                          alEliminar(p.id);
                        }
                      }}
                      className="absolute top-3 right-3 p-2 bg-dndoscuro-900/80 text-stone-400 hover:text-sangre-500 hover:bg-dndoscuro-900 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                      title="Eliminar personaje"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="p-4 flex justify-between items-center bg-dndoscuro-300/50">
                  <div className="flex items-center gap-4 text-sm text-stone-400">
                    <div className="flex items-center gap-1"><Shield className="w-4 h-4" /> CA {p.ca || 10}</div>
                    <div className="flex items-center gap-1"><Swords className="w-4 h-4" /> PV {p.pg || 10}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ModalVincularPartida
        personaje={personajeAVincular}
        misPartidasJugador={misPartidasJugador}
        onClose={() => setPersonajeAVincular(null)}
        onVincular={onAsignarPartida}
        onUnirse={onUnirsePartida}
      />
    </div>
  );
}
