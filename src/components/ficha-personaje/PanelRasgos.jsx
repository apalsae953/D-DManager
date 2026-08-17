import { useState } from 'react';
import { AlignLeft, Plus, ChevronDown, ChevronUp, Trash2, Edit2, Sparkles, Shield, Bookmark, User, Check, X } from 'lucide-react';

export function PanelRasgos({ personaje, actualizarCampo }) {
  // Asegurar siempre objetos y arrays definidos para evitar fallos de iteración
  const rasgos = {
    notas: personaje.rasgos?.notas || '',
    raciales: Array.isArray(personaje.rasgos?.raciales) ? personaje.rasgos.raciales : [],
    clase: Array.isArray(personaje.rasgos?.clase) ? personaje.rasgos.clase : [],
    trasfondo: Array.isArray(personaje.rasgos?.trasfondo) ? personaje.rasgos.trasfondo : [],
    otros: Array.isArray(personaje.rasgos?.otros) ? personaje.rasgos.otros : [],
  };

  const actualizarRasgos = (nuevosRasgos) => {
    actualizarCampo('rasgos', nuevosRasgos);
  };

  const [notaExpandida, setNotaExpandida] = useState(false);
  const [editandoNotas, setEditandoNotas] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in text-stone-200">
      {/* Notas Generales */}
      <SeccionRasgos
        titulo="Notas Generales"
        Icono={Bookmark}
        lista={null}
        esNota={true}
        contenido={rasgos.notas}
        expandido={notaExpandida}
        setExpandido={setNotaExpandida}
        editando={editandoNotas}
        setEditando={setEditandoNotas}
        onGuardar={(texto) => actualizarRasgos({ ...rasgos, notas: texto })}
      />

      {/* Rasgos Raciales */}
      <SeccionRasgos
        titulo={`Rasgos Raciales (${personaje.raza || 'Raza'})`}
        Icono={User}
        lista={rasgos.raciales}
        onAñadir={(nuevo) => {
          const lista = Array.isArray(rasgos.raciales) ? rasgos.raciales : [];
          actualizarRasgos({ ...rasgos, raciales: [...lista, nuevo] });
        }}
        onEditar={(idx, actualizado) => {
          const nueva = [...(rasgos.raciales || [])];
          nueva[idx] = actualizado;
          actualizarRasgos({ ...rasgos, raciales: nueva });
        }}
        onEliminar={(idx) => {
          const nueva = (rasgos.raciales || []).filter((_, i) => i !== idx);
          actualizarRasgos({ ...rasgos, raciales: nueva });
        }}
      />

      {/* Rasgos de Clase */}
      <SeccionRasgos
        titulo={`Rasgos de Clase (${personaje.clase || 'Clase'})`}
        Icono={Shield}
        lista={rasgos.clase}
        onAñadir={(nuevo) => {
          const lista = Array.isArray(rasgos.clase) ? rasgos.clase : [];
          actualizarRasgos({ ...rasgos, clase: [...lista, nuevo] });
        }}
        onEditar={(idx, actualizado) => {
          const nueva = [...(rasgos.clase || [])];
          nueva[idx] = actualizado;
          actualizarRasgos({ ...rasgos, clase: nueva });
        }}
        onEliminar={(idx) => {
          const nueva = (rasgos.clase || []).filter((_, i) => i !== idx);
          actualizarRasgos({ ...rasgos, clase: nueva });
        }}
      />

      {/* Rasgos de Trasfondo */}
      <SeccionRasgos
        titulo={`Rasgos de Trasfondo: ${personaje.trasfondo || 'General'}`}
        Icono={Sparkles}
        lista={rasgos.trasfondo}
        onAñadir={(nuevo) => {
          const lista = Array.isArray(rasgos.trasfondo) ? rasgos.trasfondo : [];
          actualizarRasgos({ ...rasgos, trasfondo: [...lista, nuevo] });
        }}
        onEditar={(idx, actualizado) => {
          const nueva = [...(rasgos.trasfondo || [])];
          nueva[idx] = actualizado;
          actualizarRasgos({ ...rasgos, trasfondo: nueva });
        }}
        onEliminar={(idx) => {
          const nueva = (rasgos.trasfondo || []).filter((_, i) => i !== idx);
          actualizarRasgos({ ...rasgos, trasfondo: nueva });
        }}
      />

      {/* Otros Rasgos y Dotes */}
      <SeccionRasgos
        titulo="Dotes y Otros Rasgos Especiales"
        Icono={Sparkles}
        lista={rasgos.otros}
        onAñadir={(nuevo) => {
          const lista = Array.isArray(rasgos.otros) ? rasgos.otros : [];
          actualizarRasgos({ ...rasgos, otros: [...lista, nuevo] });
        }}
        onEditar={(idx, actualizado) => {
          const nueva = [...(rasgos.otros || [])];
          nueva[idx] = actualizado;
          actualizarRasgos({ ...rasgos, otros: nueva });
        }}
        onEliminar={(idx) => {
          const nueva = (rasgos.otros || []).filter((_, i) => i !== idx);
          actualizarRasgos({ ...rasgos, otros: nueva });
        }}
      />
    </div>
  );
}

function SeccionRasgos({ 
  titulo, 
  Icono, 
  lista, 
  esNota, 
  contenido, 
  expandido, 
  setExpandido, 
  editando, 
  setEditando, 
  onGuardar, 
  onAñadir, 
  onEditar, 
  onEliminar 
}) {
  const [creando, setCreando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');

  const manejarAñadir = (e) => {
    e?.preventDefault();
    if (!nuevoTitulo.trim()) return;
    onAñadir?.({ titulo: nuevoTitulo.trim(), descripcion: nuevaDesc.trim() });
    setCreando(false);
    setNuevoTitulo('');
    setNuevaDesc('');
  };

  return (
    <div className="rounded-xl border border-white/10 bg-dndoscuro-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-sangre-800/50 pb-2">
        <h3 className="text-lg font-cinzel font-bold text-sangre-100 flex items-center gap-2">
          {Icono && <Icono className="w-4 h-4 text-sangre-400" />}
          {titulo}
        </h3>
        {esNota ? (
          <button 
            type="button"
            onClick={() => setEditando(!editando)} 
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-white font-bold p-1 rounded hover:bg-white/10 transition-colors"
          >
            {editando ? <><Check className="w-4 h-4 text-emerald-400" /> Listo</> : <><Edit2 className="w-4 h-4" /> Editar</>}
          </button>
        ) : (
          <button 
            type="button"
            onClick={() => setCreando(!creando)} 
            className="flex items-center gap-1 text-xs text-sangre-400 hover:text-sangre-200 font-bold p-1 rounded hover:bg-sangre-900/40 border border-transparent hover:border-sangre-700/40 transition-colors"
          >
            <Plus className="w-4 h-4" /> Añadir
          </button>
        )}
      </div>

      {esNota ? (
        <div className="rounded-lg bg-dndoscuro-950/60 p-3 border border-white/5">
          {editando ? (
            <textarea
              className="w-full input-dnd text-sm p-3 min-h-[100px] resize-none font-serif"
              value={contenido}
              onChange={(e) => onGuardar?.(e.target.value)}
              placeholder="Escribe tus notas, historias o trasfondo aquí..."
              autoFocus
            />
          ) : (
            <p className="text-sm text-stone-300 whitespace-pre-wrap font-serif leading-relaxed">
              {contenido || <span className="italic text-stone-500 text-xs">No hay notas escritas todavía.</span>}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {creando && (
            <form onSubmit={manejarAñadir} className="p-4 bg-dndoscuro-950/90 border border-sangre-500/50 rounded-xl space-y-3 shadow-lg animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Nombre del Rasgo *</label>
                <input 
                  type="text" 
                  placeholder="Ej. Visión en la Oscuridad, Furia, Astucia..." 
                  value={nuevoTitulo} 
                  onChange={e => setNuevoTitulo(e.target.value)} 
                  className="w-full input-dnd py-1.5 text-sm font-bold" 
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Descripción y Efecto</label>
                <textarea 
                  placeholder="Explica qué hace este rasgo o habilidad..." 
                  value={nuevaDesc} 
                  onChange={e => setNuevaDesc(e.target.value)}
                  rows={3}
                  className="w-full input-dnd py-1.5 text-sm resize-none" 
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => setCreando(false)} 
                  className="btn-secondary px-3 py-1 text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary px-4 py-1 text-xs"
                >
                  Guardar Rasgo
                </button>
              </div>
            </form>
          )}

          {Array.isArray(lista) && lista.length > 0 ? (
            lista.map((item, idx) => (
              <ItemRasgo 
                key={idx} 
                item={item} 
                onGuardarEdit={(actualizado) => onEditar?.(idx, actualizado)}
                onEliminar={() => onEliminar?.(idx)} 
              />
            ))
          ) : (
            !creando && <p className="text-xs text-stone-500 italic p-3 text-center bg-dndoscuro-950/30 rounded-lg">Ningún rasgo añadido todavía.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ItemRasgo({ item, onGuardarEdit, onEliminar }) {
  const [expandido, setExpandido] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editTitulo, setEditTitulo] = useState(item.titulo || '');
  const [editDesc, setEditDesc] = useState(item.descripcion || '');

  const guardarCambios = (e) => {
    e?.preventDefault();
    if (!editTitulo.trim()) return;
    onGuardarEdit?.({ titulo: editTitulo.trim(), descripcion: editDesc.trim() });
    setEditando(false);
  };

  return (
    <div className="rounded-xl border border-white/5 bg-dndoscuro-950/60 overflow-hidden group hover:border-white/10 transition-colors">
      {!editando ? (
        <>
          <div 
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors select-none"
            onClick={() => setExpandido(!expandido)}
          >
            <h4 className="font-bold text-stone-100 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sangre-500"></span>
              {item.titulo}
            </h4>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setEditando(true); }}
                className="p-1 text-stone-500 hover:text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Editar"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (window.confirm(`¿Eliminar el rasgo "${item.titulo}"?`)) {
                    onEliminar(); 
                  }
                }}
                className="p-1 text-stone-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {expandido ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </div>
          </div>
          {expandido && item.descripcion && (
            <div className="p-3 pt-0 text-xs sm:text-sm text-stone-300 whitespace-pre-wrap border-t border-white/5 font-serif leading-relaxed bg-dndoscuro-950/40">
              {item.descripcion}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={guardarCambios} className="p-3 space-y-2 bg-dndoscuro-900 border border-sangre-600/40">
          <input
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
            className="w-full input-dnd py-1 text-sm font-bold"
            required
            autoFocus
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={3}
            className="w-full input-dnd py-1 text-sm resize-none"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setEditando(false)} className="btn-secondary px-3 py-1 text-xs">
              Cancelar
            </button>
            <button type="submit" className="btn-primary px-4 py-1 text-xs">
              Guardar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
