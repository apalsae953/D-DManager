import { useState } from 'react';
import { Package, Search, Plus, Trash2, Shield, Sword, Minus, X, PlusCircle, GripVertical } from 'lucide-react';
import { EQUIPO } from '../../datos/equipo.js';

const TIPOS_OBJETO = ['Arma', 'Armadura', 'Munición', 'Equipo', 'Herramienta', 'Paquete', 'Montura', 'Vehículo', 'Otro'];

export function PanelInventario({ personaje, actualizarCampo }) {
  const [busqueda, setBusqueda] = useState('');
  const [creadorAbierto, setCreadorAbierto] = useState(false);
  const [nuevoObjeto, setNuevoObjeto] = useState({ nombre: '', tipo: 'Equipo', subtipo: '', daño: '', peso: '', coste: '', propiedades: '', descripcion: '' });
  
  const equipoActual = personaje.equipo || [];

  const objetosFiltrados = EQUIPO.filter(item => 
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    (item.tipo && item.tipo.toLowerCase().includes(busqueda.toLowerCase()))
  ).slice(0, 30);

  const añadirObjeto = (objeto) => {
    let nombre = objeto.nombre;
    let cantidad = 1;
    
    const match = nombre.match(/(.+?)\s*\((\d+)\)$/);
    if (match) {
      nombre = match[1].trim();
      cantidad = parseInt(match[2], 10);
    }

    const nuevoEquipo = [...equipoActual, { ...objeto, nombre, id_instancia: crypto.randomUUID(), cantidad, equipado: false }];
    actualizarCampo('equipo', nuevoEquipo);
  };

  const crearObjetoPersonalizado = () => {
    if (!nuevoObjeto.nombre.trim()) return;
    añadirObjeto({ ...nuevoObjeto, fuente: 'Personalizado' });
    setNuevoObjeto({ nombre: '', tipo: 'Equipo', subtipo: '', daño: '', peso: '', coste: '', propiedades: '', descripcion: '' });
    setCreadorAbierto(false);
  };

  const eliminarObjeto = (idInstancia) => {
    actualizarCampo('equipo', equipoActual.filter(e => e.id_instancia !== idInstancia));
  };

  const actualizarItem = (idInstancia, campos) => {
    const nuevoEquipo = equipoActual.map(item => 
      item.id_instancia === idInstancia ? { ...item, ...campos } : item
    );
    actualizarCampo('equipo', nuevoEquipo);
  };

  const moverObjeto = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const nuevoEquipo = [...equipoActual];
    const [movedItem] = nuevoEquipo.splice(fromIndex, 1);
    nuevoEquipo.splice(toIndex, 0, movedItem);
    actualizarCampo('equipo', nuevoEquipo);
  };

  const IconoPorTipo = (tipo) => {
    if (!tipo) return <Package className="w-4 h-4 text-stone-500" />;
    const t = tipo.toLowerCase();
    if (t.includes('arma') || t.includes('munición')) return <Sword className="w-4 h-4 text-sangre-500" />;
    if (t.includes('armadura') || t.includes('escudo')) return <Shield className="w-4 h-4 text-indigo-500" />;
    return <Package className="w-4 h-4 text-stone-500" />;
  };

  // Cálculo de capacidad de carga
  const fuerza = personaje.caracteristicas?.fue || 10;
  const capacidadCarga = fuerza * 15;
  const pesoActual = equipoActual.reduce((total, item) => {
    const pesoNum = parseFloat(item.peso) || 0;
    return total + (pesoNum * (item.cantidad || 1));
  }, 0);

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in">
      {/* Lista del inventario del personaje */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-sangre-800/50 pb-2 mb-4">
          <h2 className="text-2xl font-cinzel text-sangre-100">Equipamiento</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreadorAbierto(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-sangre-400 bg-dndoscuro-400/50 hover:bg-dndoscuro-300 border border-white/10 rounded-lg px-2.5 py-1.5 transition-all uppercase tracking-wider"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Crear objeto
            </button>
          </div>
        </div>
        
        {equipoActual.length === 0 ? (
          <p className="text-stone-500 text-sm italic p-4 text-center border border-dashed border-white/10 rounded-lg">Tu inventario está vacío. Busca objetos en el manual o crea los tuyos propios.</p>
        ) : (
          <div 
            className="space-y-1 max-h-[500px] overflow-y-auto pr-2 divide-y divide-white/5 bg-dndoscuro-400/30 rounded-lg border border-white/5"
            onDragOver={(e) => {
              const container = e.currentTarget;
              const rect = container.getBoundingClientRect();
              const y = e.clientY - rect.top;
              if (y < 40) {
                container.scrollTop -= 15;
              } else if (y > rect.height - 40) {
                container.scrollTop += 15;
              }
            }}
          >
            {equipoActual.map((item, index) => (
              <ObjetoItem 
                key={item.id_instancia} 
                item={item} 
                index={index}
                accion={{ tipo: 'eliminar', handler: () => eliminarObjeto(item.id_instancia) }} 
                onActualizar={(campos) => actualizarItem(item.id_instancia, campos)}
                onMover={moverObjeto}
                IconoPorTipo={IconoPorTipo} 
              />
            ))}
          </div>
        )}

        {/* Resumen de Carga */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-dndoscuro-400/50 border border-white/5 rounded-lg p-3 text-center">
            <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">Carga Transportada</div>
            <div className={`text-2xl font-bold ${pesoActual > capacidadCarga ? 'text-sangre-500' : 'text-stone-200'}`}>
              {pesoActual.toFixed(1)} kg
            </div>
          </div>
          <div className="bg-dndoscuro-400/50 border border-white/5 rounded-lg p-3 text-center">
            <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">Capacidad de Carga</div>
            <div className="text-2xl font-bold text-stone-200">
              {capacidadCarga} kg
            </div>
          </div>
        </div>
      </div>

      {/* Buscador de objetos SRD */}
      <div className="w-full md:w-1/3 flex flex-col h-[600px] bg-dndoscuro-300/30 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-dndoscuro-400/50">
          <h3 className="font-cinzel text-stone-200 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4" /> Buscar en el Manual
          </h3>
          <input 
            type="text" 
            placeholder="Buscar espada, poción..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-dnd text-sm py-2"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {objetosFiltrados.map(item => (
            <ObjetoItem 
              key={item.nombre} 
              item={item} 
              accion={{ tipo: 'añadir', handler: () => añadirObjeto(item) }} 
              IconoPorTipo={IconoPorTipo} 
              esBuscador={true}
            />
          ))}
          {objetosFiltrados.length === 0 && (
            <p className="text-center text-xs text-stone-500 p-4">No se encontraron objetos.</p>
          )}
          {objetosFiltrados.length === 30 && (
            <p className="text-center text-[10px] text-stone-500 p-2 italic">Mostrando los primeros 30 resultados. Escribe para buscar más.</p>
          )}
        </div>
      </div>

      {/* Modal de creación de objeto personalizado */}
      {creadorAbierto && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setCreadorAbierto(false)}>
          <div className="w-full max-w-lg rounded-xl bg-[#111111] border border-sangre-800/50 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-cinzel text-xl font-bold text-sangre-100">Crear Objeto Personalizado</h2>
              <button onClick={() => setCreadorAbierto(false)} className="text-stone-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Nombre *</label>
                <input value={nuevoObjeto.nombre} onChange={e => setNuevoObjeto({...nuevoObjeto, nombre: e.target.value})} placeholder="Ej. Espada del Alba" className="input-dnd" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Tipo</label>
                  <select value={nuevoObjeto.tipo} onChange={e => setNuevoObjeto({...nuevoObjeto, tipo: e.target.value})} className="input-dnd appearance-none">
                    {TIPOS_OBJETO.map(t => <option key={t} value={t} className="bg-dndoscuro-400">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Subtipo</label>
                  <input value={nuevoObjeto.subtipo} onChange={e => setNuevoObjeto({...nuevoObjeto, subtipo: e.target.value})} placeholder="Ej. Marcial cuerpo a cuerpo" className="input-dnd" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Daño</label>
                  <input value={nuevoObjeto.daño} onChange={e => setNuevoObjeto({...nuevoObjeto, daño: e.target.value})} placeholder="Ej. 2d6 Cortante" className="input-dnd" />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Peso</label>
                  <input value={nuevoObjeto.peso} onChange={e => setNuevoObjeto({...nuevoObjeto, peso: e.target.value})} placeholder="Ej. 1,35 kg" className="input-dnd" />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Coste</label>
                  <input value={nuevoObjeto.coste} onChange={e => setNuevoObjeto({...nuevoObjeto, coste: e.target.value})} placeholder="Ej. 50 po" className="input-dnd" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Propiedades</label>
                <input value={nuevoObjeto.propiedades} onChange={e => setNuevoObjeto({...nuevoObjeto, propiedades: e.target.value})} placeholder="Ej. Sutil, ligera, arrojadiza (6/18 m)" className="input-dnd" />
              </div>
              <div>
                <label className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Descripción</label>
                <textarea value={nuevoObjeto.descripcion} onChange={e => setNuevoObjeto({...nuevoObjeto, descripcion: e.target.value})} placeholder="Describe el objeto..." rows={2} className="input-dnd resize-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setCreadorAbierto(false)} className="btn-secondary text-sm">Cancelar</button>
              <button onClick={crearObjetoPersonalizado} disabled={!nuevoObjeto.nombre.trim()} className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4 mr-1 inline" /> Añadir al Inventario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ObjetoItem({ item, index, accion, IconoPorTipo, esBuscador, onActualizar, onMover }) {
  const [expandido, setExpandido] = useState(false);
  
  const esArmaOArmadura = item.tipo && (item.tipo.toLowerCase().includes('arma') || item.tipo.toLowerCase().includes('armadura') || item.tipo.toLowerCase().includes('escudo'));

  return (
    <div 
      className={`p-2 group transition-colors flex justify-between items-start ${esBuscador ? 'cursor-pointer border border-white/5 rounded-lg mb-1 bg-dndoscuro-400/50 hover:bg-white/5' : 'bg-dndoscuro-400/10 hover:bg-white/5 cursor-grab active:cursor-grabbing border-b border-white/5 last:border-0'}`} 
      onClick={() => esBuscador && setExpandido(!expandido)}
      draggable={!esBuscador}
      onDragStart={(e) => {
        if (!esBuscador) {
          e.dataTransfer.setData('text/plain', index);
          e.dataTransfer.effectAllowed = 'move';
          // Opcional: estilo al arrastrar
          e.currentTarget.style.opacity = '0.5';
        }
      }}
      onDragEnd={(e) => {
        if (!esBuscador) e.currentTarget.style.opacity = '1';
      }}
      onDragOver={(e) => {
        if (!esBuscador) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }
      }}
      onDrop={(e) => {
        if (!esBuscador) {
          e.preventDefault();
          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
          if (!isNaN(fromIndex) && onMover) {
            onMover(fromIndex, index);
          }
        }
      }}
    >
      
      {!esBuscador && (
        <div className="mt-1 mr-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-stone-500 hover:text-stone-300">
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {!esBuscador && esArmaOArmadura && (
        <button 
          onClick={(e) => { e.stopPropagation(); onActualizar({ equipado: !item.equipado }); }}
          className="mt-1 mr-3 flex-shrink-0 w-6 h-6 rounded-full border-2 border-stone-500/50 flex items-center justify-center hover:border-sangre-400/50 transition-colors"
          title={item.equipado ? "Desequipar" : "Equipar"}
        >
          {item.equipado && <div className="w-3 h-3 bg-sangre-500 rounded-full"></div>}
        </button>
      )}
      {!esBuscador && !esArmaOArmadura && (
        <div className="mt-1 mr-3 flex-shrink-0 w-6 h-6 rounded-full border-2 border-transparent"></div>
      )}

      <div className="flex items-start gap-3 flex-1 cursor-pointer" onClick={(e) => { !esBuscador && setExpandido(!expandido); }}>
        <div className="flex-1">
          <h4 className={`font-bold text-stone-200 ${esBuscador ? 'text-sm' : ''}`}>{item.nombre}</h4>
          <p className="text-xs text-stone-400 mt-0.5">
            {item.tipo} • {esBuscador ? item.coste : item.peso} {item.daño && `• ${item.daño}`} {item.ca_base && `• CA ${item.ca_base}`}
          </p>
          {item.descripcion && (
            <p className={`text-xs text-stone-400 mt-1 transition-all ${expandido ? '' : 'line-clamp-1'}`}>
              {item.descripcion}
            </p>
          )}
        </div>
      </div>

      {!esBuscador && (
        <div className="flex items-center gap-2 ml-4">
          <div className="flex items-center bg-dndoscuro-300 rounded border border-white/10">
             <button onClick={(e) => { e.stopPropagation(); onActualizar({ cantidad: Math.max(1, (item.cantidad || 1) - 1) }); }} className="p-1 hover:text-white text-stone-400"><Minus className="w-3 h-3"/></button>
             <span className="w-6 text-center text-xs font-bold text-sangre-400">{item.cantidad || 1}</span>
             <button onClick={(e) => { e.stopPropagation(); onActualizar({ cantidad: (item.cantidad || 1) + 1 }); }} className="p-1 hover:text-white text-stone-400"><Plus className="w-3 h-3"/></button>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); accion.handler(); }}
            className="p-1.5 text-stone-500 hover:text-sangre-500 hover:bg-sangre-900/30 rounded-md opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
            title="Eliminar del inventario"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {esBuscador && (
        <button 
          onClick={(e) => { e.stopPropagation(); accion.handler(); }}
          className="p-1 rounded bg-sangre-800/50 text-white hover:bg-sangre-600 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
          title="Añadir al inventario"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
