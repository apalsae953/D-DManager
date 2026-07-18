import { Plus, Trash2 } from 'lucide-react';

// Lista editable de pares nombre/descripcion, usada por el creador de
// monstruos para Habilidades Especiales, Acciones y Acciones Legendarias.
export function ListaDinamica({ etiqueta, items, onCambiar, placeholderNombre = 'Nombre', placeholderDescripcion = 'Descripcion' }) {
  const actualizar = (indice, campo, valor) => {
    const copia = [...items];
    copia[indice] = { ...copia[indice], [campo]: valor };
    onCambiar(copia);
  };

  const agregar = () => onCambiar([...items, { nombre: '', descripcion: '' }]);
  const quitar = (indice) => onCambiar(items.filter((_, i) => i !== indice));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{etiqueta}</span>
        <button type="button" onClick={agregar} className="flex items-center gap-1 text-xs text-sangre-400 hover:text-sangre-300 font-bold">
          <Plus className="h-3.5 w-3.5" /> Agregar
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 rounded-lg border border-white/10 bg-dndoscuro-400/50 p-2">
            <div className="flex-1 space-y-2">
              <input
                value={item.nombre}
                onChange={(evento) => actualizar(i, 'nombre', evento.target.value)}
                placeholder={placeholderNombre}
                className="w-full input-dnd px-2 py-1.5 text-sm font-bold"
              />
              <textarea
                value={item.descripcion}
                onChange={(evento) => actualizar(i, 'descripcion', evento.target.value)}
                placeholder={placeholderDescripcion}
                rows={2}
                className="w-full input-dnd px-2 py-1.5 text-sm resize-none"
              />
            </div>
            <button type="button" onClick={() => quitar(i)} className="self-start rounded p-1.5 text-stone-500 hover:text-sangre-500 hover:bg-white/5 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-stone-500 italic">Ninguna todavía.</p>}
      </div>
    </div>
  );
}
