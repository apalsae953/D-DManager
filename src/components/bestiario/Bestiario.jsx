import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { TarjetaMonstruo } from './TarjetaMonstruo.jsx';
import { ModalCreadorMonstruo } from './ModalCreadorMonstruo.jsx';

// Presentacional: recibe la lista ya filtrada y el estado de busqueda desde
// el hook useBestiario (elevado a PanelMaster para compartirlo con la
// Calculadora de Encuentros y el Tracker de Iniciativa).
export function Bestiario({ monstruos, busqueda, setBusqueda, onCrearMonstruo, onAgregarAIniciativa, onEliminarMonstruo, toggleVisibilidad, currentUserId, modoGlobal = false }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paginaActiva, setPaginaActiva] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const elementosPorPagina = 12;

  // Resetear página al buscar
  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActiva(1);
  };

  const handleCambiarFiltro = (filtro) => {
    setFiltroTipo(filtro);
    setPaginaActiva(1);
  };

  const monstruosFiltradosTab = monstruos.filter(m => {
    if (filtroTipo === 'bestias') return m.tipo === 'bestia';
    if (filtroTipo === 'monstruos') return m.tipo !== 'bestia';
    return true;
  });

  const indiceUltimo = paginaActiva * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const monstruosPaginados = monstruosFiltradosTab.slice(indicePrimero, indiceUltimo);
  const paginasTotales = Math.ceil(monstruosFiltradosTab.length / elementosPorPagina);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-white/5 pb-4">
        <div className="flex bg-dndoscuro-400/50 rounded-lg p-1 border border-white/5 w-full sm:w-auto">
          <button 
            onClick={() => handleCambiarFiltro('todos')} 
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filtroTipo === 'todos' ? 'bg-sangre-700 text-white shadow-neon' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => handleCambiarFiltro('monstruos')} 
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filtroTipo === 'monstruos' ? 'bg-sangre-700 text-white shadow-neon' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Monstruos
          </button>
          <button 
            onClick={() => handleCambiarFiltro('bestias')} 
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filtroTipo === 'bestias' ? 'bg-sangre-700 text-white shadow-neon' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Animales
          </button>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o tipo..."
              value={busqueda}
              onChange={handleBusqueda}
              className="w-full sm:w-64 rounded-md border border-white/10 bg-dndoscuro-900/80 pl-9 pr-4 py-1.5 text-sm text-stone-200 placeholder-stone-500 focus:border-sangre-500 focus:outline-none focus:ring-1 focus:ring-sangre-500 transition-all"
            />
          </div>
          {onCrearMonstruo && (
            <button
              onClick={() => setModalAbierto(true)}
              className="flex items-center justify-center gap-2 rounded-md bg-sangre-700 px-4 py-1.5 text-sm font-bold text-white transition-all hover:bg-sangre-600 hover:shadow-neon w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Crear Monstruo
            </button>
          )}
        </div>
      </div>

      {monstruosFiltradosTab.length === 0 ? (
        <p className="text-sm text-stone-500 text-center italic p-8">Ningún monstruo coincide con la búsqueda.</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {monstruosPaginados.map((m) => (
              <TarjetaMonstruo 
                key={m.id} 
                monstruo={m} 
                onAgregar={modoGlobal ? undefined : onAgregarAIniciativa}
                onEliminar={onEliminarMonstruo}
                onToggleVisibilidad={toggleVisibilidad}
                currentUserId={currentUserId}
              />
            ))}
          </div>
          
          {paginasTotales > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4 border-t border-white/5">
              <button 
                onClick={() => setPaginaActiva(p => Math.max(1, p - 1))}
                disabled={paginaActiva === 1}
                className="px-3 py-1 rounded bg-dndoscuro-300 text-stone-300 disabled:opacity-30 hover:bg-white/10 transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm text-stone-400 font-bold">
                Página {paginaActiva} de {paginasTotales}
              </span>
              <button 
                onClick={() => setPaginaActiva(p => Math.min(paginasTotales, p + 1))}
                disabled={paginaActiva === paginasTotales}
                className="px-3 py-1 rounded bg-dndoscuro-300 text-stone-300 disabled:opacity-30 hover:bg-white/10 transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      <ModalCreadorMonstruo abierto={modalAbierto} alCerrar={() => setModalAbierto(false)} onCrear={onCrearMonstruo} />
    </div>
  );
}
