import { useState } from 'react';
import { AlignLeft, Plus, ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';

export function PanelRasgos({ personaje, actualizarCampo }) {
  const rasgos = personaje.rasgos || {
    notas: '',
    raciales: [],
    clase: [],
    trasfondo: []
  };

  const actualizarRasgos = (nuevosRasgos) => {
    actualizarCampo('rasgos', nuevosRasgos);
  };

  const [notaExpandida, setNotaExpandida] = useState(false);
  const [editandoNotas, setEditandoNotas] = useState(false);

  return (
    <div className="space-y-6">
      <SeccionRasgos
        titulo="Notas Generales"
        lista={null}
        esNota={true}
        contenido={rasgos.notas}
        expandido={notaExpandida}
        setExpandido={setNotaExpandida}
        editando={editandoNotas}
        setEditando={setEditandoNotas}
        onGuardar={(texto) => actualizarRasgos({ ...rasgos, notas: texto })}
      />
      <SeccionRasgos
        titulo={`Rasgos Raciales (${personaje.raza || 'Raza'})`}
        lista={rasgos.raciales}
        onAñadir={(nuevo) => actualizarRasgos({ ...rasgos, raciales: [...rasgos.raciales, nuevo] })}
        onEliminar={(idx) => {
          const nueva = [...rasgos.raciales];
          nueva.splice(idx, 1);
          actualizarRasgos({ ...rasgos, raciales: nueva });
        }}
      />
      <SeccionRasgos
        titulo={`Rasgos de Clase (${personaje.clase || 'Clase'})`}
        lista={rasgos.clase}
        onAñadir={(nuevo) => actualizarRasgos({ ...rasgos, clase: [...rasgos.clase, nuevo] })}
        onEliminar={(idx) => {
          const nueva = [...rasgos.clase];
          nueva.splice(idx, 1);
          actualizarRasgos({ ...rasgos, clase: nueva });
        }}
      />
      <SeccionRasgos
        titulo={`Trasfondo: ${personaje.trasfondo || 'Ninguno'}`}
        lista={rasgos.trasfondo}
        onAñadir={(nuevo) => actualizarRasgos({ ...rasgos, trasfondo: [...rasgos.trasfondo, nuevo] })}
        onEliminar={(idx) => {
          const nueva = [...rasgos.trasfondo];
          nueva.splice(idx, 1);
          actualizarRasgos({ ...rasgos, trasfondo: nueva });
        }}
      />
    </div>
  );
}

function SeccionRasgos({ titulo, lista, esNota, contenido, expandido, setExpandido, editando, setEditando, onGuardar, onAñadir, onEliminar }) {
  const [creando, setCreando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');

  const manejarAñadir = () => {
    if (nuevoTitulo.trim() === '') return;
    onAñadir({ titulo: nuevoTitulo, descripcion: nuevaDesc });
    setCreando(false);
    setNuevoTitulo('');
    setNuevaDesc('');
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-sangre-800/50 pb-1 mb-2">
        <h3 className="text-xl font-serif text-sangre-100">{titulo}</h3>
        {esNota ? (
          <button onClick={() => setEditando(!editando)} className="text-stone-400 hover:text-sangre-400">
            {editando ? <AlignLeft className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </button>
        ) : (
          <button onClick={() => setCreando(!creando)} className="text-stone-400 hover:text-sangre-400">
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {esNota ? (
        <div className="bg-dndoscuro-400/30 rounded-md p-3">
          {editando ? (
            <textarea
              className="w-full bg-dndoscuro-300 text-stone-200 p-2 rounded-md border border-white/10 min-h-[100px]"
              value={contenido}
              onChange={(e) => onGuardar(e.target.value)}
              placeholder="Escribe tus notas aquí..."
            />
          ) : (
            <p className="text-sm text-stone-300 whitespace-pre-wrap">{contenido || 'No hay notas.'}</p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {creando && (
            <div className="p-3 bg-dndoscuro-400/50 border border-sangre-500/30 rounded-md mb-2 space-y-2">
              <input 
                type="text" 
                placeholder="Nombre del Rasgo..." 
                value={nuevoTitulo} 
                onChange={e => setNuevoTitulo(e.target.value)} 
                className="w-full bg-dndoscuro-300 text-stone-200 p-1 rounded border border-white/10" 
              />
              <textarea 
                placeholder="Descripción..." 
                value={nuevaDesc} 
                onChange={e => setNuevaDesc(e.target.value)} 
                className="w-full bg-dndoscuro-300 text-stone-200 p-1 rounded border border-white/10 text-sm" 
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setCreando(false)} className="px-3 py-1 text-xs text-stone-400 hover:text-white">Cancelar</button>
                <button onClick={manejarAñadir} className="px-3 py-1 text-xs bg-sangre-700 text-white rounded hover:bg-sangre-600">Añadir</button>
              </div>
            </div>
          )}
          {lista && lista.length > 0 ? lista.map((item, idx) => (
            <ItemRasgo key={idx} item={item} onEliminar={() => onEliminar(idx)} />
          )) : (
            <p className="text-xs text-stone-500 italic p-2">Ningún rasgo añadido todavía.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ItemRasgo({ item, onEliminar }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0 group">
      <div 
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-dndoscuro-400/30"
        onClick={() => setExpandido(!expandido)}
      >
        <h4 className="font-bold text-stone-200">{item.titulo}</h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEliminar(); }}
            className="p-1 text-stone-500 hover:text-sangre-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Eliminar"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expandido ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </div>
      </div>
      {expandido && item.descripcion && (
        <div className="p-2 pt-0 text-sm text-stone-400 whitespace-pre-wrap bg-dndoscuro-400/10">
          {item.descripcion}
        </div>
      )}
    </div>
  );
}
