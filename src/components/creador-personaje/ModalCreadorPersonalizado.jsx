import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const TITULOS_CREAR = {
  raza: 'Crea tu Raza',
  subraza: 'Crea tu Subraza',
  clase: 'Crea tu Clase',
  trasfondo: 'Crea tu Trasfondo',
};

const TITULOS_EDITAR = {
  raza: 'Edita tu Raza',
  subraza: 'Edita tu Subraza',
  clase: 'Edita tu Clase',
  trasfondo: 'Edita tu Trasfondo',
};

const PLACEHOLDERS = {
  raza: 'Ej. Genasi',
  subraza: 'Ej. Genasi del Fuego',
  clase: 'Ej. Artificiero',
  trasfondo: 'Ej. Cazarrecompensas',
};

function valorInicialDesde(valorInicial) {
  return {
    nombre: valorInicial?.nombre ?? '',
    subrazas: valorInicial?.subrazas ?? [],
    dadoGolpe: valorInicial?.dadoGolpe ?? 8,
  };
}

// Se monta con una `key` distinta por cada raza/clase/trasfondo que se edita
// (ver CreadorPersonaje.jsx) para que el formulario arranque limpio o
// precargado sin necesidad de sincronizar props con un efecto.
export function ModalCreadorPersonalizado({ tipo, contexto, valorInicial, alCerrar, onGuardar }) {
  const [valor, setValor] = useState(() => valorInicialDesde(valorInicial));
  const editando = Boolean(valorInicial);

  const actualizar = (campo, val) => setValor((anterior) => ({ ...anterior, [campo]: val }));

  const confirmar = () => {
    const nombre = valor.nombre.trim();
    if (!nombre) return;

    if (tipo === 'raza') {
      onGuardar({ nombre, subrazas: valor.subrazas });
    } else if (tipo === 'clase') {
      onGuardar({ nombre, dadoGolpe: Number(valor.dadoGolpe) });
    } else {
      onGuardar(nombre);
    }

    alCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in" onClick={alCerrar}>
      <div className="w-full max-w-md rounded-xl bg-dndoscuro-500 p-5 shadow-neon border border-white/10" onClick={(evento) => evento.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xl font-cinzel font-bold text-sangre-200">{(editando ? TITULOS_EDITAR : TITULOS_CREAR)[tipo]}</h2>
          <button onClick={alCerrar} className="rounded-lg p-1.5 text-stone-400 hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {tipo === 'subraza' && contexto && (
            <p className="text-sm text-stone-400 -mt-1">
              {editando ? 'Editando una subraza de' : 'Añadiendo una subraza a'} <span className="text-stone-200 font-semibold">{contexto}</span>.
            </p>
          )}

          <Campo etiqueta="Nombre">
            <input
              value={valor.nombre}
              onChange={(evento) => actualizar('nombre', evento.target.value)}
              placeholder={PLACEHOLDERS[tipo]}
              className="w-full input-dnd px-3 py-2"
              autoFocus
              onKeyDown={(evento) => { if (evento.key === 'Enter') confirmar(); }}
            />
          </Campo>

          {tipo === 'clase' && (
            <Campo etiqueta="Dado de Golpe">
              <select value={valor.dadoGolpe} onChange={(evento) => actualizar('dadoGolpe', evento.target.value)} className="w-full input-dnd px-3 py-2">
                {[6, 8, 10, 12].map((d) => (
                  <option key={d} value={d} className="bg-dndoscuro-400">d{d}</option>
                ))}
              </select>
            </Campo>
          )}

          {tipo === 'raza' && (
            <ListaEtiquetas etiqueta="Subrazas (opcional)" valores={valor.subrazas} onCambiar={(v) => actualizar('subrazas', v)} placeholder="Ej. Genasi del Fuego" />
          )}

          <p className="text-xs text-stone-500 italic">
            Podrás detallar sus rasgos más adelante, en la pestaña "Rasgos" de la ficha.
          </p>

          <button onClick={confirmar} className="w-full btn-primary py-3">
            {editando ? 'Guardar Cambios' : `Guardar ${tipo === 'raza' ? 'Raza' : tipo === 'subraza' ? 'Subraza' : tipo === 'clase' ? 'Clase' : 'Trasfondo'}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({ etiqueta, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-stone-400">{etiqueta}</span>
      {children}
    </label>
  );
}

function ListaEtiquetas({ etiqueta, valores, onCambiar, placeholder }) {
  const [nuevo, setNuevo] = useState('');

  const agregar = () => {
    const limpio = nuevo.trim();
    if (!limpio || valores.includes(limpio)) return;
    onCambiar([...valores, limpio]);
    setNuevo('');
  };

  const quitar = (valor) => onCambiar(valores.filter((v) => v !== valor));

  return (
    <div>
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-stone-400">{etiqueta}</span>
      <div className="mb-2 flex gap-2">
        <input
          value={nuevo}
          onChange={(evento) => setNuevo(evento.target.value)}
          onKeyDown={(evento) => { if (evento.key === 'Enter') { evento.preventDefault(); agregar(); } }}
          placeholder={placeholder}
          className="flex-1 input-dnd px-3 py-1.5 text-sm"
        />
        <button type="button" onClick={agregar} className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-sm">
          <Plus className="h-3.5 w-3.5" /> Añadir
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {valores.map((v) => (
          <span key={v} className="flex items-center gap-1.5 rounded-lg bg-dndoscuro-300 px-2.5 py-1 text-xs font-semibold text-stone-200">
            {v}
            <button type="button" onClick={() => quitar(v)} className="text-stone-400 hover:text-sangre-400">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {valores.length === 0 && <p className="text-xs text-stone-500 italic">Ninguna todavía.</p>}
      </div>
    </div>
  );
}
