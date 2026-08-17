import { useState, useMemo } from 'react';
import { Package, Search, Plus, Trash2, Shield, Sword, Minus, X, PlusCircle, GripVertical, Sparkles, Filter, FlaskConical, Wrench, Backpack } from 'lucide-react';
import { EQUIPO } from '../../datos/equipo.js';

const CATEGORIAS_FILTRO = [
  { id: 'todos', etiqueta: 'Todos', Icono: Package },
  { id: 'armas', etiqueta: 'Armas', Icono: Sword },
  { id: 'armaduras', etiqueta: 'Armaduras', Icono: Shield },
  { id: 'pociones', etiqueta: 'Consumibles', Icono: FlaskConical },
  { id: 'herramientas', etiqueta: 'Herramientas', Icono: Wrench },
  { id: 'equipo', etiqueta: 'Varios / Equipo', Icono: Backpack },
];

const TIPOS_OBJETO = ['Arma', 'Armadura', 'Munición', 'Equipo', 'Herramienta', 'Paquete', 'Poción', 'Montura', 'Vehículo', 'Otro'];

function clasificarObjeto(item) {
  if (!item) return 'equipo';
  const tipo = (item.tipo || '').toLowerCase().trim();
  const subtipo = (item.subtipo || '').toLowerCase().trim();
  const nombre = (item.nombre || '').toLowerCase().trim();

  // 1. Armaduras y Escudos (Debe evaluarse ANTES que armas para evitar que "armadura" coincida con "arma")
  if (
    tipo.includes('armadura') || 
    tipo.includes('escudo') || 
    subtipo.includes('armadura') || 
    subtipo.includes('escudo') ||
    nombre.includes('cota de') ||
    nombre.includes('armadura') ||
    nombre.includes('camisote') ||
    nombre.includes('coraza') ||
    nombre.includes('cuero tachonado') ||
    nombre.includes('placas') ||
    nombre.includes('loriga') ||
    nombre.includes('mallas') ||
    nombre.includes('escudo')
  ) {
    return 'armaduras';
  }

  // 2. Armas
  if (
    tipo === 'arma' ||
    tipo.startsWith('arma') ||
    tipo.includes('marcial') ||
    tipo.includes('simple') ||
    tipo.includes('distancia') ||
    tipo.includes('cuerpo a cuerpo') ||
    subtipo.includes('arma') ||
    nombre.includes('espada') ||
    nombre.includes('arco') ||
    nombre.includes('daga') ||
    nombre.includes('hacha') ||
    nombre.includes('maza') ||
    nombre.includes('lanza') ||
    nombre.includes('martillo') ||
    nombre.includes('bastón') ||
    nombre.includes('baston') ||
    nombre.includes('ballesta') ||
    nombre.includes('cimitarra') ||
    nombre.includes('alabarda') ||
    nombre.includes('tridente') ||
    nombre.includes('mangual') ||
    nombre.includes('estoque') ||
    nombre.includes('guadaña') ||
    nombre.includes('garrote') ||
    nombre.includes('mangual') ||
    nombre.includes('estoque') ||
    nombre.includes('dardo') ||
    nombre.includes('jabalina') ||
    nombre.includes('clava') ||
    nombre.includes('honda')
  ) {
    return 'armas';
  }

  // 3. Consumibles, Pociones, Munición
  if (
    tipo.includes('poción') ||
    tipo.includes('pocion') ||
    tipo.includes('munición') ||
    tipo.includes('municion') ||
    tipo.includes('comida') ||
    tipo.includes('racion') ||
    tipo.includes('ración') ||
    tipo.includes('pergamino') ||
    nombre.includes('poción') ||
    nombre.includes('pocion') ||
    nombre.includes('flecha') ||
    nombre.includes('virote') ||
    nombre.includes('bala') ||
    nombre.includes('antídoto') ||
    nombre.includes('antidoto') ||
    nombre.includes('ungüento')
  ) {
    return 'pociones';
  }

  // 4. Herramientas, Kits, Instrumentos
  if (
    tipo.includes('herramienta') ||
    tipo.includes('instrumento') ||
    tipo.includes('kit') ||
    tipo.includes('útil') ||
    nombre.includes('herramientas') ||
    nombre.includes('instrumento') ||
    nombre.includes('kit')
  ) {
    return 'herramientas';
  }

  // 5. Todo lo demás es Equipo / Varios
  return 'equipo';
}

export function PanelInventario({ personaje, actualizarCampo }) {
  const [busquedaManual, setBusquedaManual] = useState('');
  const [busquedaInventario, setBusquedaInventario] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [creadorAbierto, setCreadorAbierto] = useState(false);
  const [nuevoObjeto, setNuevoObjeto] = useState({ 
    nombre: '', 
    tipo: 'Equipo', 
    subtipo: '', 
    daño: '', 
    peso: '', 
    coste: '', 
    propiedades: '', 
    descripcion: '' 
  });
  
  const equipoActual = personaje.equipo || [];

  // Filtrado de los objetos que tiene el personaje
  const inventarioFiltrado = useMemo(() => {
    return equipoActual.filter(item => {
      // Filtro de texto
      const coincideTexto = !busquedaInventario.trim() || 
        item.nombre.toLowerCase().includes(busquedaInventario.toLowerCase()) ||
        (item.tipo && item.tipo.toLowerCase().includes(busquedaInventario.toLowerCase())) ||
        (item.propiedades && item.propiedades.toLowerCase().includes(busquedaInventario.toLowerCase()));

      if (!coincideTexto) return false;

      // Filtro de categoría
      if (filtroCategoria === 'todos') return true;
      const cat = clasificarObjeto(item);
      return cat === filtroCategoria;
    });
  }, [equipoActual, busquedaInventario, filtroCategoria]);

  // Conteo por categoría para insignias
  const conteos = useMemo(() => {
    const counts = { todos: equipoActual.length, armas: 0, armaduras: 0, pociones: 0, herramientas: 0, equipo: 0 };
    equipoActual.forEach(item => {
      const c = clasificarObjeto(item);
      if (counts[c] !== undefined) counts[c]++;
      else counts.equipo++;
    });
    return counts;
  }, [equipoActual]);

  // Filtrado del manual SRD
  const objetosManualFiltrados = useMemo(() => {
    return EQUIPO.filter(item => {
      const coincideTexto = !busquedaManual.trim() ||
        item.nombre.toLowerCase().includes(busquedaManual.toLowerCase()) || 
        (item.tipo && item.tipo.toLowerCase().includes(busquedaManual.toLowerCase()));
      
      if (!coincideTexto) return false;
      if (filtroCategoria === 'todos') return true;
      return clasificarObjeto(item) === filtroCategoria;
    }).slice(0, 30);
  }, [busquedaManual, filtroCategoria]);

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

  const IconoPorTipo = (item) => {
    const cat = typeof item === 'string' ? clasificarObjeto({ tipo: item }) : clasificarObjeto(item);
    if (cat === 'armas') return <Sword className="w-4 h-4 text-red-400 flex-shrink-0" />;
    if (cat === 'armaduras') return <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />;
    if (cat === 'pociones') return <FlaskConical className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    if (cat === 'herramientas') return <Wrench className="w-4 h-4 text-amber-400 flex-shrink-0" />;
    return <Package className="w-4 h-4 text-stone-400 flex-shrink-0" />;
  };

  // Cálculo de capacidad de carga
  const fuerza = personaje.caracteristicas?.fue?.base || (typeof personaje.caracteristicas?.fue === 'number' ? personaje.caracteristicas.fue : 10);
  const capacidadCarga = fuerza * 15;
  const pesoActual = equipoActual.reduce((total, item) => {
    const pesoNum = parseFloat(String(item.peso || '').replace(',', '.')) || 0;
    return total + (pesoNum * (item.cantidad || 1));
  }, 0);

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col lg:flex-row gap-6 animate-fade-in text-stone-200">
      
      {/* SECCIÓN 1: INVENTARIO DEL PERSONAJE */}
      <div className="flex-1 min-w-0 space-y-4">
        
        {/* Cabecera y botón crear */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-sangre-800/50 pb-3">
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-sangre-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-sangre-500" /> Equipamiento e Inventario
          </h2>
          <button
            onClick={() => setCreadorAbierto(true)}
            className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Crear Objeto
          </button>
        </div>

        {/* Barra de Filtros por Categoría */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {CATEGORIAS_FILTRO.map(({ id, etiqueta, Icono }) => {
            const activo = filtroCategoria === id;
            const cantidad = conteos[id] || 0;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFiltroCategoria(id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activo
                    ? 'bg-sangre-700 text-white shadow-neon border border-sangre-500/50'
                    : 'bg-dndoscuro-400/50 text-stone-400 hover:text-stone-200 hover:bg-dndoscuro-300 border border-white/5'
                }`}
              >
                <Icono className="w-3.5 h-3.5" />
                <span>{etiqueta}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activo ? 'bg-black/30 text-white' : 'bg-black/20 text-stone-400'}`}>
                  {cantidad}
                </span>
              </button>
            );
          })}
        </div>

        {/* Buscador dentro de mi inventario */}
        {equipoActual.length > 5 && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
            <input
              type="text"
              value={busquedaInventario}
              onChange={(e) => setBusquedaInventario(e.target.value)}
              placeholder="Buscar en mi inventario..."
              className="w-full input-dnd pl-9 py-1.5 text-xs rounded-lg"
            />
            {busquedaInventario && (
              <button
                onClick={() => setBusquedaInventario('')}
                className="absolute right-3 top-2 text-stone-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        
        {/* Lista de objetos del inventario */}
        {equipoActual.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-xl border border-dashed border-white/10 space-y-2">
            <Package className="w-10 h-10 text-stone-600 mx-auto opacity-50" />
            <p className="text-stone-300 text-sm font-cinzel">Tu inventario está vacío</p>
            <p className="text-stone-500 text-xs">Busca objetos en el manual de la derecha o crea tu propio equipo personalizado.</p>
          </div>
        ) : inventarioFiltrado.length === 0 ? (
          <p className="text-stone-500 text-xs italic p-4 text-center glass-panel rounded-lg">
            No hay objetos que coincidan con el filtro seleccionado.
          </p>
        ) : (
          <div 
            className="space-y-1.5 max-h-[520px] overflow-y-auto overflow-x-hidden pr-1 bg-dndoscuro-900/40 rounded-xl border border-white/5 p-1"
            onDragOver={(e) => {
              const container = e.currentTarget;
              const rect = container.getBoundingClientRect();
              const y = e.clientY - rect.top;
              if (y < 40) container.scrollTop -= 15;
              else if (y > rect.height - 40) container.scrollTop += 15;
            }}
          >
            {inventarioFiltrado.map((item, index) => (
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

        {/* Resumen de Capacidad de Carga */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-dndoscuro-900/60 border border-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mb-0.5">Carga Actual</div>
            <div className={`text-xl font-bold font-mono ${pesoActual > capacidadCarga ? 'text-red-400' : 'text-stone-200'}`}>
              {pesoActual.toFixed(1)} <span className="text-xs font-normal text-stone-400">kg</span>
            </div>
          </div>
          <div className="bg-dndoscuro-900/60 border border-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mb-0.5">Capacidad Máxima</div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {capacidadCarga} <span className="text-xs font-normal text-stone-400">kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: BUSCADOR DE OBJETOS SRD */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col h-[500px] lg:h-[620px] bg-dndoscuro-900/60 rounded-xl border border-white/10 overflow-hidden flex-shrink-0">
        <div className="p-3 border-b border-white/5 bg-dndoscuro-950/60 space-y-2">
          <h3 className="font-cinzel text-sm font-bold text-stone-200 flex items-center gap-2">
            <Search className="w-4 h-4 text-sangre-400" /> Manual de Equipo SRD
          </h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-500" />
            <input 
              type="text" 
              placeholder="Buscar espada, escudo, poción..." 
              value={busquedaManual}
              onChange={(e) => setBusquedaManual(e.target.value)}
              className="w-full input-dnd text-xs pl-8 py-1.5 rounded-lg"
            />
            {busquedaManual && (
              <button onClick={() => setBusquedaManual('')} className="absolute right-3 top-2 text-stone-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
          {objetosManualFiltrados.map(item => (
            <ObjetoItem 
              key={item.nombre} 
              item={item} 
              accion={{ tipo: 'añadir', handler: () => añadirObjeto(item) }} 
              IconoPorTipo={IconoPorTipo} 
              esBuscador={true}
            />
          ))}
          {objetosManualFiltrados.length === 0 && (
            <p className="text-center text-xs text-stone-500 p-6 italic">No se encontraron objetos en el manual.</p>
          )}
          {objetosManualFiltrados.length === 30 && (
            <p className="text-center text-[10px] text-stone-500 p-2 italic">Mostrando 30 resultados. Escribe para afinar la búsqueda.</p>
          )}
        </div>
      </div>

      {/* MODAL DE CREACIÓN DE OBJETO PERSONALIZADO */}
      {creadorAbierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" onClick={() => setCreadorAbierto(false)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-dndoscuro-900 border border-sangre-600/50 p-6 shadow-2xl space-y-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-cinzel text-xl font-bold text-sangre-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Crear Objeto Personalizado
              </h2>
              <button onClick={() => setCreadorAbierto(false)} className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Nombre del Objeto *</label>
                <input 
                  value={nuevoObjeto.nombre} 
                  onChange={e => setNuevoObjeto({...nuevoObjeto, nombre: e.target.value})} 
                  placeholder="Ej. Espada Lunar de Fuego" 
                  className="w-full input-dnd py-2" 
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Tipo</label>
                  <select 
                    value={nuevoObjeto.tipo} 
                    onChange={e => setNuevoObjeto({...nuevoObjeto, tipo: e.target.value})} 
                    className="w-full input-dnd py-2"
                  >
                    {TIPOS_OBJETO.map(t => <option key={t} value={t} className="bg-dndoscuro-400">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Subtipo</label>
                  <input 
                    value={nuevoObjeto.subtipo} 
                    onChange={e => setNuevoObjeto({...nuevoObjeto, subtipo: e.target.value})} 
                    placeholder="Ej. Marcial, Ligera..." 
                    className="w-full input-dnd py-2 text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Daño / CA</label>
                  <input 
                    value={nuevoObjeto.daño} 
                    onChange={e => setNuevoObjeto({...nuevoObjeto, daño: e.target.value})} 
                    placeholder="Ej. 1d8+2 Cortante" 
                    className="w-full input-dnd py-2 text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Peso</label>
                  <input 
                    value={nuevoObjeto.peso} 
                    onChange={e => setNuevoObjeto({...nuevoObjeto, peso: e.target.value})} 
                    placeholder="Ej. 1,5 kg" 
                    className="w-full input-dnd py-2 text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Coste</label>
                  <input 
                    value={nuevoObjeto.coste} 
                    onChange={e => setNuevoObjeto({...nuevoObjeto, coste: e.target.value})} 
                    placeholder="Ej. 150 po" 
                    className="w-full input-dnd py-2 text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Propiedades</label>
                <input 
                  value={nuevoObjeto.propiedades} 
                  onChange={e => setNuevoObjeto({...nuevoObjeto, propiedades: e.target.value})} 
                  placeholder="Ej. Sutil, Versátil, Arrojadiza..." 
                  className="w-full input-dnd py-2 text-xs" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Descripción / Efecto Mágico</label>
                <textarea 
                  value={nuevoObjeto.descripcion} 
                  onChange={e => setNuevoObjeto({...nuevoObjeto, descripcion: e.target.value})} 
                  placeholder="Describe la historia o efectos de este objeto..." 
                  rows={3} 
                  className="w-full input-dnd py-2 text-xs resize-none" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button onClick={() => setCreadorAbierto(false)} className="btn-secondary px-5 py-2 text-xs">
                Cancelar
              </button>
              <button 
                onClick={crearObjetoPersonalizado} 
                disabled={!nuevoObjeto.nombre.trim()} 
                className="btn-primary px-6 py-2 text-xs disabled:opacity-40"
              >
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
  
  const cat = clasificarObjeto(item);
  const esArmaOArmadura = cat === 'armas' || cat === 'armaduras';

  return (
    <div 
      className={`w-full max-w-full rounded-xl transition-all border ${
        esBuscador 
          ? 'p-2.5 cursor-pointer border-white/5 bg-dndoscuro-950/40 hover:bg-white/5 mb-1.5' 
          : item.equipado 
            ? 'p-2.5 bg-sangre-950/30 border-sangre-600/40 hover:border-sangre-500' 
            : 'p-2.5 bg-dndoscuro-950/60 border-white/5 hover:border-white/10'
      }`} 
      onClick={() => esBuscador && accion?.handler()}
      draggable={!esBuscador}
      onDragStart={(e) => {
        if (!esBuscador) {
          e.dataTransfer.setData('text/plain', index);
          e.dataTransfer.effectAllowed = 'move';
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
      <div className="flex items-center justify-between gap-2 min-w-0">
        
        {/* Lado izquierdo: Grip + Check Equipado + Icono + Nombre */}
        <div 
          className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer select-none"
          onClick={() => setExpandido(!expandido)}
        >
          {!esBuscador && (
            <div className="hidden sm:block text-stone-600 hover:text-stone-400 cursor-grab flex-shrink-0" title="Arrastrar para ordenar">
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}

          {!esBuscador && esArmaOArmadura && (
            <button 
              type="button"
              onClick={(e) => { 
                e.stopPropagation(); 
                onActualizar?.({ equipado: !item.equipado }); 
              }}
              className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                item.equipado 
                  ? 'bg-sangre-600 border-sangre-400 text-white shadow-neon' 
                  : 'border-stone-600 bg-dndoscuro-900 hover:border-stone-400'
              }`}
              title={item.equipado ? "Equipado (Click para desequipar)" : "No equipado (Click para equipar)"}
            >
              {item.equipado && <Shield className="w-3 h-3" />}
            </button>
          )}

          {IconoPorTipo?.(item)}

          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-stone-100 text-xs sm:text-sm truncate">
              {item.nombre}
            </h4>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-xs text-stone-400 font-mono">
              <span>{item.tipo || 'Objeto'}</span>
              {item.peso && <span>· {item.peso}</span>}
              {item.daño && <span className="text-red-400 font-bold">· {item.daño}</span>}
              {item.ca_base && <span className="text-indigo-400 font-bold">· CA {item.ca_base}</span>}
              {item.coste && <span>· {item.coste}</span>}
            </div>
          </div>
        </div>

        {/* Lado derecho: Cantidad + Acciones */}
        {!esBuscador ? (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex items-center bg-dndoscuro-900 rounded-lg border border-white/10 p-0.5">
              <button 
                type="button"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onActualizar?.({ cantidad: Math.max(1, (item.cantidad || 1) - 1) }); 
                }} 
                className="p-1 hover:text-white text-stone-400 rounded hover:bg-white/10"
                title="Reducir cantidad"
              >
                <Minus className="w-3 h-3"/>
              </button>
              <span className="w-5 text-center text-xs font-bold font-mono text-amber-300">
                {item.cantidad || 1}
              </span>
              <button 
                type="button"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onActualizar?.({ cantidad: (item.cantidad || 1) + 1 }); 
                }} 
                className="p-1 hover:text-white text-stone-400 rounded hover:bg-white/10"
                title="Aumentar cantidad"
              >
                <Plus className="w-3 h-3"/>
              </button>
            </div>

            <button 
              type="button"
              onClick={(e) => { 
                e.stopPropagation(); 
                if (window.confirm(`¿Eliminar "${item.nombre}" del inventario?`)) {
                  accion?.handler(); 
                }
              }}
              className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              accion?.handler(); 
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sangre-800 hover:bg-sangre-600 text-white text-xs font-bold transition-all shadow flex-shrink-0"
            title="Añadir a mi personaje"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        )}
      </div>

      {/* Descripción expandible */}
      {expandido && (item.descripcion || item.propiedades) && (
        <div className="mt-2 pt-2 border-t border-white/5 text-xs text-stone-300 space-y-1 animate-fade-in font-serif leading-relaxed">
          {item.propiedades && (
            <p className="text-[11px] text-amber-300/90 font-mono">
              <strong>Propiedades:</strong> {item.propiedades}
            </p>
          )}
          {item.descripcion && (
            <p className="whitespace-pre-line text-stone-300/90">
              {item.descripcion}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
