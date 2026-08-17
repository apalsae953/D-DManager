import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, Heart, Wind, Swords, Sparkles, Plus, Trash2, Eye } from 'lucide-react';
import { TAMANOS_CRIATURA, TIPOS_CRIATURA, NIVELES_DESAFIO } from '../../datos/datosCreacion.js';
import { modificadorCaracteristica, TablasEncuentro } from '../../motor/index.js';

const CARACTERISTICAS_ORDEN = ['fue', 'des', 'con', 'int', 'sab', 'car'];
const CARACTERISTICAS_NOMBRES = {
  fue: 'Fuerza',
  des: 'Destreza',
  con: 'Constitución',
  int: 'Inteligencia',
  sab: 'Sabiduría',
  car: 'Carisma'
};

function monstruoVacio() {
  return {
    nombre: '',
    tamano: 'Mediano',
    tipo: 'humanoide',
    subtipo: '',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 10, notas: '' },
    puntos_vida: { promedio: 10, formula: '2d8+2' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
    sentidos: 'visión en la oscuridad 60 pies',
    idiomas: '--',
    nivel_desafio: 0.25,
    px: TablasEncuentro.PX_POR_NIVEL_DESAFIO[0.25] || 50,
    habilidades_especiales: [],
    acciones: [],
    acciones_legendarias: [],
    es_srd: false,
    visible: true,
  };
}

export function ModalCreadorMonstruo({ abierto, alCerrar, onCrear }) {
  const [monstruo, setMonstruo] = useState(monstruoVacio);
  const [seccionActiva, setSeccionActiva] = useState('basico'); // 'basico' | 'acciones'

  if (!abierto) return null;

  const actualizar = (campo, valor) => setMonstruo((anterior) => ({ ...anterior, [campo]: valor }));
  const actualizarAnidado = (grupo, campo, valor) =>
    setMonstruo((anterior) => ({ ...anterior, [grupo]: { ...anterior[grupo], [campo]: valor } }));

  const cambiarNivelDesafio = (valorTexto) => {
    const nd = Number(valorTexto);
    setMonstruo((anterior) => ({ 
      ...anterior, 
      nivel_desafio: nd, 
      px: TablasEncuentro.PX_POR_NIVEL_DESAFIO[nd] ?? anterior.px 
    }));
  };

  const agregarItem = (listaKey) => {
    setMonstruo((prev) => ({
      ...prev,
      [listaKey]: [...(prev[listaKey] || []), { nombre: '', descripcion: '' }]
    }));
  };

  const actualizarItem = (listaKey, index, campo, valor) => {
    setMonstruo((prev) => {
      const items = [...(prev[listaKey] || [])];
      items[index] = { ...items[index], [campo]: valor };
      return { ...prev, [listaKey]: items };
    });
  };

  const eliminarItem = (listaKey, index) => {
    setMonstruo((prev) => ({
      ...prev,
      [listaKey]: (prev[listaKey] || []).filter((_, i) => i !== index)
    }));
  };

  const confirmar = (e) => {
    e?.preventDefault();
    if (!monstruo.nombre.trim()) {
      alert('Por favor introduce un nombre para el monstruo.');
      return;
    }
    onCrear({ ...monstruo, id: `monstruo-${Date.now()}-${Math.random()}` });
    setMonstruo(monstruoVacio());
    alCerrar();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={alCerrar}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-dndoscuro-900 border border-sangre-600/50 shadow-2xl text-stone-200 overflow-hidden animate-scale-in"
        onClick={(evento) => evento.stopPropagation()}
      >
        {/* Cabecera Fija */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-dndoscuro-950/80 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-sangre-100 drop-shadow-md">
              Creador de Criaturas
            </h2>
            <p className="text-xs text-stone-400">Diseña una criatura o monstruo personalizado para tu aventura.</p>
          </div>
          <button 
            onClick={alCerrar} 
            className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pestañas Rápidas del Modal */}
        <div className="flex border-b border-white/10 bg-dndoscuro-800/60 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setSeccionActiva('basico')}
            className={`py-2.5 px-4 font-cinzel text-xs sm:text-sm font-bold border-b-2 transition-all ${
              seccionActiva === 'basico'
                ? 'border-sangre-500 text-white shadow-neon'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Estadísticas y Atributos
          </button>
          <button
            type="button"
            onClick={() => setSeccionActiva('acciones')}
            className={`py-2.5 px-4 font-cinzel text-xs sm:text-sm font-bold border-b-2 transition-all ${
              seccionActiva === 'acciones'
                ? 'border-sangre-500 text-white shadow-neon'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Rasgos y Acciones ({monstruo.habilidades_especiales.length + monstruo.acciones.length + monstruo.acciones_legendarias.length})
          </button>
        </div>

        {/* Cuerpo con Scroll Único y Fluido */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {seccionActiva === 'basico' ? (
            <>
              {/* Bloque 1: Datos Básicos */}
              <div>
                <h3 className="text-xs font-bold font-cinzel uppercase tracking-widest text-sangre-400 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Datos de Identidad
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Nombre *</label>
                    <input 
                      value={monstruo.nombre} 
                      onChange={(e) => actualizar('nombre', e.target.value)} 
                      placeholder="Ej. Dragón de Cenizas"
                      className="w-full input-dnd py-2" 
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Tamaño</label>
                    <select 
                      value={monstruo.tamano} 
                      onChange={(e) => actualizar('tamano', e.target.value)} 
                      className="w-full input-dnd py-2"
                    >
                      {TAMANOS_CRIATURA.map((t) => (
                        <option key={t} value={t} className="bg-dndoscuro-400">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Tipo</label>
                    <select 
                      value={monstruo.tipo} 
                      onChange={(e) => actualizar('tipo', e.target.value)} 
                      className="w-full input-dnd py-2 capitalize"
                    >
                      {TIPOS_CRIATURA.map((t) => (
                        <option key={t} value={t} className="bg-dndoscuro-400">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Subtipo (Opcional)</label>
                    <input 
                      value={monstruo.subtipo || ''} 
                      onChange={(e) => actualizar('subtipo', e.target.value)} 
                      placeholder="Ej. trasgoide, cambiaformas..."
                      className="w-full input-dnd py-2" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Alineamiento</label>
                    <input 
                      value={monstruo.alineamiento} 
                      onChange={(e) => actualizar('alineamiento', e.target.value)} 
                      placeholder="Ej. Caótico Malvado, No alineado..."
                      className="w-full input-dnd py-2" 
                    />
                  </div>
                </div>
              </div>

              {/* Bloque 2: Combate y Salud */}
              <div>
                <h3 className="text-xs font-bold font-cinzel uppercase tracking-widest text-sangre-400 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Estadísticas de Combate
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-dndoscuro-950/60 p-4 rounded-xl border border-white/5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">CA (Armadura)</label>
                    <input
                      type="number"
                      value={monstruo.clase_armadura.valor}
                      onChange={(e) => actualizarAnidado('clase_armadura', 'valor', Number(e.target.value))}
                      className="w-full input-dnd py-1.5 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">PV Promedio</label>
                    <input
                      type="number"
                      value={monstruo.puntos_vida.promedio}
                      onChange={(e) => actualizarAnidado('puntos_vida', 'promedio', Number(e.target.value))}
                      className="w-full input-dnd py-1.5 font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Fórmula PV</label>
                    <input
                      value={monstruo.puntos_vida.formula || ''}
                      onChange={(e) => actualizarAnidado('puntos_vida', 'formula', e.target.value)}
                      placeholder="Ej. 2d8+2"
                      className="w-full input-dnd py-1.5 text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Velocidad (pies)</label>
                    <input
                      type="number"
                      value={monstruo.velocidad.caminar}
                      onChange={(e) => actualizarAnidado('velocidad', 'caminar', Number(e.target.value))}
                      className="w-full input-dnd py-1.5 text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Bloque 3: Características */}
              <div>
                <h3 className="text-xs font-bold font-cinzel uppercase tracking-widest text-sangre-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Puntuaciones de Característica
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {CARACTERISTICAS_ORDEN.map((c) => {
                    const mod = modificadorCaracteristica(monstruo.caracteristicas[c] || 10);
                    return (
                      <div key={c} className="rounded-xl border border-white/10 bg-dndoscuro-950/70 p-2.5 text-center">
                        <p className="text-[10px] font-bold uppercase text-stone-400">{CARACTERISTICAS_NOMBRES[c]}</p>
                        <input
                          type="number"
                          value={monstruo.caracteristicas[c]}
                          onChange={(e) => actualizarAnidado('caracteristicas', c, Number(e.target.value))}
                          className="w-full input-dnd py-1 text-center text-lg font-bold my-1"
                        />
                        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${mod >= 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-red-950 text-red-400 border border-red-800/40'}`}>
                          {mod >= 0 ? `+${mod}` : mod}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bloque 4: Sentidos, Idiomas y Desafío */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Sentidos</label>
                  <input
                    value={monstruo.sentidos}
                    onChange={(e) => actualizar('sentidos', e.target.value)}
                    placeholder="visión en la oscuridad 60 pies..."
                    className="w-full input-dnd py-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Idiomas</label>
                  <input 
                    value={monstruo.idiomas} 
                    onChange={(e) => actualizar('idiomas', e.target.value)} 
                    placeholder="Común, Dracónico..."
                    className="w-full input-dnd py-2" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Nivel de Desafío (ND)</label>
                  <select 
                    value={monstruo.nivel_desafio} 
                    onChange={(e) => cambiarNivelDesafio(e.target.value)} 
                    className="w-full input-dnd py-2"
                  >
                    {NIVELES_DESAFIO.map((nd) => (
                      <option key={nd.valor} value={nd.valor} className="bg-dndoscuro-400">
                        {nd.etiqueta}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Puntos de Experiencia (PX)</label>
                  <input 
                    type="number" 
                    value={monstruo.px} 
                    onChange={(e) => actualizar('px', Number(e.target.value))} 
                    className="w-full input-dnd py-2 font-bold" 
                  />
                </div>
              </div>
            </>
          ) : (
            /* Pestaña: Rasgos y Acciones */
            <div className="space-y-6">
              {/* Habilidades Especiales */}
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <h4 className="font-cinzel text-sm font-bold text-sangre-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Rasgos y Habilidades Especiales
                  </h4>
                  <button
                    type="button"
                    onClick={() => agregarItem('habilidades_especiales')}
                    className="flex items-center gap-1.5 text-xs text-sangre-400 hover:text-white font-bold bg-sangre-900/40 hover:bg-sangre-800/80 px-2.5 py-1 rounded-lg border border-sangre-700/40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir Rasgo
                  </button>
                </div>
                {monstruo.habilidades_especiales.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 text-center bg-dndoscuro-950/40 rounded-lg">No hay rasgos especiales añadidos aún.</p>
                ) : (
                  <div className="space-y-3">
                    {monstruo.habilidades_especiales.map((item, i) => (
                      <div key={i} className="flex gap-2 p-3 rounded-xl bg-dndoscuro-950/70 border border-white/10">
                        <div className="flex-1 space-y-2">
                          <input
                            value={item.nombre}
                            onChange={(e) => actualizarItem('habilidades_especiales', i, 'nombre', e.target.value)}
                            placeholder="Nombre del rasgo (ej. Fuga Ágil, Olfato Agudo)"
                            className="w-full input-dnd py-1.5 text-sm font-bold"
                          />
                          <textarea
                            value={item.descripcion}
                            onChange={(e) => actualizarItem('habilidades_especiales', i, 'descripcion', e.target.value)}
                            placeholder="Descripción del efecto..."
                            rows={2}
                            className="w-full input-dnd py-1.5 text-sm resize-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarItem('habilidades_especiales', i)}
                          className="p-2 text-stone-500 hover:text-red-400 self-start"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <h4 className="font-cinzel text-sm font-bold text-sangre-300 flex items-center gap-2">
                    <Swords className="w-4 h-4" /> Acciones de Ataque y Turno
                  </h4>
                  <button
                    type="button"
                    onClick={() => agregarItem('acciones')}
                    className="flex items-center gap-1.5 text-xs text-sangre-400 hover:text-white font-bold bg-sangre-900/40 hover:bg-sangre-800/80 px-2.5 py-1 rounded-lg border border-sangre-700/40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir Acción
                  </button>
                </div>
                {monstruo.acciones.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 text-center bg-dndoscuro-950/40 rounded-lg">No hay acciones añadidas aún.</p>
                ) : (
                  <div className="space-y-3">
                    {monstruo.acciones.map((item, i) => (
                      <div key={i} className="flex gap-2 p-3 rounded-xl bg-dndoscuro-950/70 border border-white/10">
                        <div className="flex-1 space-y-2">
                          <input
                            value={item.nombre}
                            onChange={(e) => actualizarItem('acciones', i, 'nombre', e.target.value)}
                            placeholder="Nombre del ataque/acción (ej. Mordisco, Gran Hacha)"
                            className="w-full input-dnd py-1.5 text-sm font-bold"
                          />
                          <textarea
                            value={item.descripcion}
                            onChange={(e) => actualizarItem('acciones', i, 'descripcion', e.target.value)}
                            placeholder="Ataque con arma: +4 a impactar, alcance 5 pies. Impacto: 7 (2d4+2) daño cortante..."
                            rows={2}
                            className="w-full input-dnd py-1.5 text-sm resize-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarItem('acciones', i)}
                          className="p-2 text-stone-500 hover:text-red-400 self-start"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Acciones Legendarias */}
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <h4 className="font-cinzel text-sm font-bold text-sangre-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Acciones Legendarias (Opcional)
                  </h4>
                  <button
                    type="button"
                    onClick={() => agregarItem('acciones_legendarias')}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-white font-bold bg-amber-900/30 hover:bg-amber-800/60 px-2.5 py-1 rounded-lg border border-amber-700/40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir Acción Legendaria
                  </button>
                </div>
                {monstruo.acciones_legendarias.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 text-center bg-dndoscuro-950/40 rounded-lg">Sin acciones legendarias.</p>
                ) : (
                  <div className="space-y-3">
                    {monstruo.acciones_legendarias.map((item, i) => (
                      <div key={i} className="flex gap-2 p-3 rounded-xl bg-dndoscuro-950/70 border border-amber-700/30">
                        <div className="flex-1 space-y-2">
                          <input
                            value={item.nombre}
                            onChange={(e) => actualizarItem('acciones_legendarias', i, 'nombre', e.target.value)}
                            placeholder="Nombre de la acción legendaria"
                            className="w-full input-dnd py-1.5 text-sm font-bold"
                          />
                          <textarea
                            value={item.descripcion}
                            onChange={(e) => actualizarItem('acciones_legendarias', i, 'descripcion', e.target.value)}
                            placeholder="Coste y descripción del efecto legendario..."
                            rows={2}
                            className="w-full input-dnd py-1.5 text-sm resize-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarItem('acciones_legendarias', i)}
                          className="p-2 text-stone-500 hover:text-red-400 self-start"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pie de Acciones Fijo */}
        <div className="border-t border-white/10 px-6 py-4 bg-dndoscuro-950/90 flex items-center justify-between gap-4 shrink-0">
          {seccionActiva === 'basico' ? (
            <button
              type="button"
              onClick={() => setSeccionActiva('acciones')}
              className="text-xs font-bold text-sangre-400 hover:text-sangre-300 underline"
            >
              Siguiente: Rasgos y Acciones &rarr;
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSeccionActiva('basico')}
              className="text-xs font-bold text-stone-400 hover:text-stone-200 underline"
            >
              &larr; Volver a Estadísticas
            </button>
          )}

          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={alCerrar} 
              className="btn-secondary px-5 py-2 text-sm"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={confirmar} 
              className="btn-primary px-6 py-2 text-sm"
            >
              Guardar Monstruo
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
