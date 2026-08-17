import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Swords, Plus, Trash2, Calendar, Award, Users, Skull, Sparkles, Pencil, X } from 'lucide-react';

export function BitacoraCampana({ partida, onGuardarBitacora }) {
  // Estructura de bitácora
  const bitacora = partida?.bitacora || { sesiones: [], combates: [] };
  const sesiones = bitacora.sesiones || [];
  const combates = bitacora.combates || [];

  const [subPestania, setSubPestania] = useState('sesiones'); // 'sesiones' | 'combates'
  const [modalSesionAbierto, setModalSesionAbierto] = useState(false);
  const [sesionEditando, setSesionEditando] = useState(null);
  
  const [modalCombateAbierto, setModalCombateAbierto] = useState(false);

  // Formulario Sesión
  const [formSesion, setFormSesion] = useState({
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    resumen: '',
    botin: '',
    npcs: '',
    proximosPasos: '',
  });

  // Formulario Combate
  const [formCombate, setFormCombate] = useState({
    nombreEncuentro: '',
    fecha: new Date().toISOString().split('T')[0],
    rondas: 3,
    enemigos: '',
    pxTotal: 0,
    resultado: 'Victoria',
    notas: '',
  });

  const abrirCrearSesion = () => {
    setSesionEditando(null);
    setFormSesion({
      titulo: `Sesión ${sesiones.length + 1}`,
      fecha: new Date().toISOString().split('T')[0],
      resumen: '',
      botin: '',
      npcs: '',
      proximosPasos: '',
    });
    setModalSesionAbierto(true);
  };

  const abrirEditarSesion = (s) => {
    setSesionEditando(s.id);
    setFormSesion({
      titulo: s.titulo || '',
      fecha: s.fecha || new Date().toISOString().split('T')[0],
      resumen: s.resumen || '',
      botin: s.botin || '',
      npcs: s.npcs || '',
      proximosPasos: s.proximosPasos || '',
    });
    setModalSesionAbierto(true);
  };

  const guardarSesion = (e) => {
    e.preventDefault();
    if (!formSesion.titulo.trim()) return;

    let nuevasSesiones;
    if (sesionEditando) {
      nuevasSesiones = sesiones.map(s => s.id === sesionEditando ? { ...s, ...formSesion } : s);
    } else {
      const nueva = {
        id: `sesion-${Date.now()}`,
        ...formSesion,
        creado_en: new Date().toISOString(),
      };
      nuevasSesiones = [nueva, ...sesiones];
    }

    const nuevaBitacora = { ...bitacora, sesiones: nuevasSesiones };
    onGuardarBitacora?.(nuevaBitacora);
    setModalSesionAbierto(false);
  };

  const eliminarSesion = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta entrada de sesión?')) return;
    const nuevasSesiones = sesiones.filter(s => s.id !== id);
    onGuardarBitacora?.({ ...bitacora, sesiones: nuevasSesiones });
  };

  const guardarCombate = (e) => {
    e.preventDefault();
    if (!formCombate.nombreEncuentro.trim()) return;

    const nuevoCombate = {
      id: `combate-${Date.now()}`,
      ...formCombate,
      creado_en: new Date().toISOString(),
    };

    const nuevosCombates = [nuevoCombate, ...combates];
    onGuardarBitacora?.({ ...bitacora, combates: nuevosCombates });
    setModalCombateAbierto(false);
    setFormCombate({
      nombreEncuentro: '',
      fecha: new Date().toISOString().split('T')[0],
      rondas: 3,
      enemigos: '',
      pxTotal: 0,
      resultado: 'Victoria',
      notas: '',
    });
  };

  const eliminarCombate = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro de combate?')) return;
    const nuevosCombates = combates.filter(c => c.id !== id);
    onGuardarBitacora?.({ ...bitacora, combates: nuevosCombates });
  };

  return (
    <div className="space-y-6 animate-fade-in text-stone-200">
      {/* Cabecera y Selector de Subpestaña */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex bg-dndoscuro-400/50 rounded-xl p-1 border border-white/5 w-full sm:w-auto">
          <button
            onClick={() => setSubPestania('sesiones')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-cinzel text-xs sm:text-sm font-bold transition-all ${
              subPestania === 'sesiones'
                ? 'bg-sangre-700 text-white shadow-neon'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Bitácora de Sesiones ({sesiones.length})
          </button>
          <button
            onClick={() => setSubPestania('combates')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-cinzel text-xs sm:text-sm font-bold transition-all ${
              subPestania === 'combates'
                ? 'bg-sangre-700 text-white shadow-neon'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Swords className="w-4 h-4" /> Historial de Combates ({combates.length})
          </button>
        </div>

        <div>
          {subPestania === 'sesiones' ? (
            <button
              onClick={abrirCrearSesion}
              className="btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm py-2 px-4 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Nueva Entrada de Sesión
            </button>
          ) : (
            <button
              onClick={() => setModalCombateAbierto(true)}
              className="btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm py-2 px-4 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Registrar Combate
            </button>
          )}
        </div>
      </div>

      {/* PESTAÑA 1: BITÁCORA DE SESIONES */}
      {subPestania === 'sesiones' && (
        <div className="space-y-4">
          {sesiones.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-2xl border border-white/5 space-y-3">
              <BookOpen className="w-12 h-12 text-stone-600 mx-auto opacity-40" />
              <h4 className="text-lg font-cinzel text-stone-300">Aún no hay sesiones registradas</h4>
              <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
                Guarda los acontecimientos clave, descubrimientos, tesoros entregados y PNJs conocidos en cada sesión de tu campaña.
              </p>
              <button onClick={abrirCrearSesion} className="btn-secondary mt-2">
                Crear Primera Entrada
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {sesiones.map((s) => (
                <div key={s.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 hover:border-sangre-500/40 transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-xl font-cinzel font-bold text-sangre-100 flex items-center gap-2">
                        {s.titulo}
                      </h3>
                      <span className="text-xs text-stone-400 flex items-center gap-1.5 mt-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" /> {s.fecha}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirEditarSesion(s)}
                        className="p-2 rounded-lg bg-dndoscuro-400 hover:bg-white/10 text-stone-400 hover:text-stone-200 transition-colors"
                        title="Editar entrada"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => eliminarSesion(s.id)}
                        className="p-2 rounded-lg bg-dndoscuro-400 hover:bg-red-950/60 text-stone-500 hover:text-red-400 transition-colors"
                        title="Eliminar entrada"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Resumen */}
                  {s.resumen && (
                    <div>
                      <p className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1">Acontecimientos Principales</p>
                      <p className="text-sm text-stone-300 whitespace-pre-line leading-relaxed bg-dndoscuro-950/50 p-3 rounded-xl border border-white/5 font-serif">
                        {s.resumen}
                      </p>
                    </div>
                  )}

                  {/* Detalles extra en cuadrícula */}
                  <div className="grid sm:grid-cols-3 gap-3 text-xs">
                    {s.botin && (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-1 uppercase tracking-wider text-[10px]">
                          <Award className="w-3.5 h-3.5" /> Botín y Tesoro
                        </span>
                        <p className="text-stone-300 whitespace-pre-line">{s.botin}</p>
                      </div>
                    )}
                    {s.npcs && (
                      <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                        <span className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1 uppercase tracking-wider text-[10px]">
                          <Users className="w-3.5 h-3.5" /> PNJs Relevantes
                        </span>
                        <p className="text-stone-300 whitespace-pre-line">{s.npcs}</p>
                      </div>
                    )}
                    {s.proximosPasos && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1 uppercase tracking-wider text-[10px]">
                          <Sparkles className="w-3.5 h-3.5" /> Próximos Pasos
                        </span>
                        <p className="text-stone-300 whitespace-pre-line">{s.proximosPasos}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: HISTORIAL DE COMBATES */}
      {subPestania === 'combates' && (
        <div className="space-y-4">
          {combates.length === 0 ? (
            <div className="text-center p-12 glass-panel rounded-2xl border border-white/5 space-y-3">
              <Swords className="w-12 h-12 text-stone-600 mx-auto opacity-40" />
              <h4 className="text-lg font-cinzel text-stone-300">Sin combates registrados</h4>
              <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
                Registra los encuentros librados, los monstruos derrotados, la duración en rondas y la experiencia repartida.
              </p>
              <button onClick={() => setModalCombateAbierto(true)} className="btn-secondary mt-2">
                Registrar Primer Combate
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {combates.map((c) => (
                <div key={c.id} className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${c.resultado === 'Victoria' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-red-950 text-red-400 border border-red-800/40'}`}>
                        {c.resultado || 'Victoria'}
                      </span>
                      <h4 className="font-cinzel font-bold text-stone-100 text-base">{c.nombreEncuentro}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1 font-mono"><Calendar className="w-3.5 h-3.5" /> {c.fecha}</span>
                      <span>·</span>
                      <span>Rondas: <strong className="text-stone-200">{c.rondas || 1}</strong></span>
                      <span>·</span>
                      <span>PX Total: <strong className="text-emerald-400 font-mono">{c.pxTotal || 0} PX</strong></span>
                    </div>
                    {c.enemigos && (
                      <p className="text-xs text-stone-300">
                        <strong className="text-stone-400">Enemigos:</strong> {c.enemigos}
                      </p>
                    )}
                    {c.notas && (
                      <p className="text-xs text-stone-400 italic bg-dndoscuro-950/40 p-2 rounded border border-white/5 font-serif">
                        {c.notas}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => eliminarCombate(c.id)}
                    className="p-2 rounded-lg bg-dndoscuro-400 hover:bg-red-950/60 text-stone-500 hover:text-red-400 transition-colors self-end sm:self-center"
                    title="Eliminar registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL CREAR / EDITAR SESIÓN */}
      {modalSesionAbierto && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-stone-200"
          onClick={() => setModalSesionAbierto(false)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-dndoscuro-900 border border-sangre-600/50 p-6 shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-cinzel font-bold text-sangre-100">
                {sesionEditando ? 'Editar Entrada de Sesión' : 'Nueva Entrada de Sesión'}
              </h3>
              <button 
                type="button"
                onClick={() => setModalSesionAbierto(false)} 
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={guardarSesion} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Título de la Sesión *</label>
                  <input
                    value={formSesion.titulo}
                    onChange={(e) => setFormSesion({ ...formSesion, titulo: e.target.value })}
                    placeholder="Ej. Sesión 4: La Emboscada en el Pantano"
                    className="w-full input-dnd py-2"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formSesion.fecha}
                    onChange={(e) => setFormSesion({ ...formSesion, fecha: e.target.value })}
                    className="w-full input-dnd py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Resumen y Acontecimientos</label>
                <textarea
                  value={formSesion.resumen}
                  onChange={(e) => setFormSesion({ ...formSesion, resumen: e.target.value })}
                  placeholder="Escribe qué descubrieron los jugadores, decisiones clave tomadas, etc..."
                  rows={4}
                  className="w-full input-dnd py-2 resize-none font-serif"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-400 mb-1">Botín / Tesoro</label>
                  <textarea
                    value={formSesion.botin}
                    onChange={(e) => setFormSesion({ ...formSesion, botin: e.target.value })}
                    placeholder="50 po, Poción de curación..."
                    rows={2}
                    className="w-full input-dnd py-1.5 text-xs resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-indigo-400 mb-1">PNJs Conocidos</label>
                  <textarea
                    value={formSesion.npcs}
                    onChange={(e) => setFormSesion({ ...formSesion, npcs: e.target.value })}
                    placeholder="Gundren Buscarroca, Sildar..."
                    rows={2}
                    className="w-full input-dnd py-1.5 text-xs resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-emerald-400 mb-1">Próximos Pasos</label>
                  <textarea
                    value={formSesion.proximosPasos}
                    onChange={(e) => setFormSesion({ ...formSesion, proximosPasos: e.target.value })}
                    placeholder="Viajar a Phandalin..."
                    rows={2}
                    className="w-full input-dnd py-1.5 text-xs resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={() => setModalSesionAbierto(false)} 
                  className="btn-secondary px-5 py-2"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary px-6 py-2"
                >
                  Guardar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL REGISTRAR COMBATE */}
      {modalCombateAbierto && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-stone-200"
          onClick={() => setModalCombateAbierto(false)}
        >
          <div 
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-dndoscuro-900 border border-sangre-600/50 p-6 shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-cinzel font-bold text-sangre-100 flex items-center gap-2">
                <Swords className="w-5 h-5 text-sangre-500" /> Registrar Combate
              </h3>
              <button 
                type="button"
                onClick={() => setModalCombateAbierto(false)} 
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={guardarCombate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Nombre del Encuentro *</label>
                <input
                  value={formCombate.nombreEncuentro}
                  onChange={(e) => setFormCombate({ ...formCombate, nombreEncuentro: e.target.value })}
                  placeholder="Ej. Batalla contra el Líder Trasgo"
                  className="w-full input-dnd py-2"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formCombate.fecha}
                    onChange={(e) => setFormCombate({ ...formCombate, fecha: e.target.value })}
                    className="w-full input-dnd py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Rondas</label>
                  <input
                    type="number"
                    min={1}
                    value={formCombate.rondas}
                    onChange={(e) => setFormCombate({ ...formCombate, rondas: Number(e.target.value) })}
                    className="w-full input-dnd py-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-emerald-400 mb-1">PX Total</label>
                  <input
                    type="number"
                    min={0}
                    value={formCombate.pxTotal}
                    onChange={(e) => setFormCombate({ ...formCombate, pxTotal: Number(e.target.value) })}
                    className="w-full input-dnd py-2 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Enemigos / Criaturas</label>
                <input
                  value={formCombate.enemigos}
                  onChange={(e) => setFormCombate({ ...formCombate, enemigos: e.target.value })}
                  placeholder="Ej. 4 Goblins, 1 Osgo (Jefe)"
                  className="w-full input-dnd py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Resultado</label>
                <select
                  value={formCombate.resultado}
                  onChange={(e) => setFormCombate({ ...formCombate, resultado: e.target.value })}
                  className="w-full input-dnd py-2"
                >
                  <option value="Victoria">Victoria de los Héroes</option>
                  <option value="Retirada">Retirada / Huida</option>
                  <option value="Derrota / TPK">Derrota / TPK</option>
                  <option value="Negociación">Pacto / Negociación</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Notas del Combate</label>
                <textarea
                  value={formCombate.notas}
                  onChange={(e) => setFormCombate({ ...formCombate, notas: e.target.value })}
                  placeholder="Momentos épicos, críticos, bajas o tácticas destacadas..."
                  rows={3}
                  className="w-full input-dnd py-2 resize-none text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={() => setModalCombateAbierto(false)} 
                  className="btn-secondary px-5 py-2"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary px-6 py-2"
                >
                  Guardar Combate
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
