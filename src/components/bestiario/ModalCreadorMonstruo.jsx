import { useState } from 'react';
import { X } from 'lucide-react';
import { TAMANOS_CRIATURA, TIPOS_CRIATURA, NIVELES_DESAFIO } from '../../datos/datosCreacion.js';
import { modificadorCaracteristica, TablasEncuentro } from '../../motor/index.js';
import { ListaDinamica } from '../comunes/ListaDinamica.jsx';

const CARACTERISTICAS_ORDEN = ['fue', 'des', 'con', 'int', 'sab', 'car'];

function monstruoVacio() {
  return {
    nombre: '',
    tamano: 'Mediano',
    tipo: 'humanoide',
    subtipo: '',
    alineamiento: '',
    clase_armadura: { valor: 10, notas: '' },
    puntos_vida: { promedio: 10, formula: '' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
    sentidos: '',
    idiomas: '',
    nivel_desafio: 0.25,
    px: TablasEncuentro.PX_POR_NIVEL_DESAFIO[0.25],
    habilidades_especiales: [],
    acciones: [],
    acciones_legendarias: [],
    es_srd: false,
  };
}

export function ModalCreadorMonstruo({ abierto, alCerrar, onCrear }) {
  const [monstruo, setMonstruo] = useState(monstruoVacio);

  if (!abierto) return null;

  const actualizar = (campo, valor) => setMonstruo((anterior) => ({ ...anterior, [campo]: valor }));
  const actualizarAnidado = (grupo, campo, valor) =>
    setMonstruo((anterior) => ({ ...anterior, [grupo]: { ...anterior[grupo], [campo]: valor } }));

  const cambiarNivelDesafio = (valorTexto) => {
    const nd = Number(valorTexto);
    setMonstruo((anterior) => ({ ...anterior, nivel_desafio: nd, px: TablasEncuentro.PX_POR_NIVEL_DESAFIO[nd] ?? anterior.px }));
  };

  const confirmar = () => {
    if (!monstruo.nombre.trim()) return;
    onCrear({ ...monstruo, id: `monstruo-${Date.now()}-${Math.random()}` });
    setMonstruo(monstruoVacio());
    alCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in" onClick={alCerrar}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-dndoscuro-500 p-5 shadow-neon border border-white/10" onClick={(evento) => evento.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xl font-cinzel font-bold text-sangre-200">Creador de Monstruos / NPCs</h2>
          <button onClick={alCerrar} className="rounded-lg p-1.5 text-stone-400 hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo etiqueta="Nombre">
              <input value={monstruo.nombre} onChange={(evento) => actualizar('nombre', evento.target.value)} className="w-full input-dnd px-3 py-2" />
            </Campo>
            <Campo etiqueta="Tamaño">
              <select value={monstruo.tamano} onChange={(evento) => actualizar('tamano', evento.target.value)} className="w-full input-dnd px-3 py-2">
                {TAMANOS_CRIATURA.map((t) => (
                  <option key={t} value={t} className="bg-dndoscuro-400">{t}</option>
                ))}
              </select>
            </Campo>
            <Campo etiqueta="Tipo">
              <select value={monstruo.tipo} onChange={(evento) => actualizar('tipo', evento.target.value)} className="w-full input-dnd px-3 py-2">
                {TIPOS_CRIATURA.map((t) => (
                  <option key={t} value={t} className="bg-dndoscuro-400">{t}</option>
                ))}
              </select>
            </Campo>
            <Campo etiqueta="Alineamiento">
              <input value={monstruo.alineamiento} onChange={(evento) => actualizar('alineamiento', evento.target.value)} className="w-full input-dnd px-3 py-2" />
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Campo etiqueta="CA">
              <input
                type="number"
                value={monstruo.clase_armadura.valor}
                onChange={(evento) => actualizarAnidado('clase_armadura', 'valor', Number(evento.target.value))}
                className="w-full input-dnd px-3 py-2"
              />
            </Campo>
            <Campo etiqueta="PV Promedio">
              <input
                type="number"
                value={monstruo.puntos_vida.promedio}
                onChange={(evento) => actualizarAnidado('puntos_vida', 'promedio', Number(evento.target.value))}
                className="w-full input-dnd px-3 py-2"
              />
            </Campo>
            <Campo etiqueta="Formula PV">
              <input
                value={monstruo.puntos_vida.formula}
                onChange={(evento) => actualizarAnidado('puntos_vida', 'formula', evento.target.value)}
                placeholder="2d6+2"
                className="w-full input-dnd px-3 py-2"
              />
            </Campo>
            <Campo etiqueta="Velocidad (pies)">
              <input
                type="number"
                value={monstruo.velocidad.caminar}
                onChange={(evento) => actualizarAnidado('velocidad', 'caminar', Number(evento.target.value))}
                className="w-full input-dnd px-3 py-2"
              />
            </Campo>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Características</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {CARACTERISTICAS_ORDEN.map((c) => {
                const modificador = modificadorCaracteristica(monstruo.caracteristicas[c]);
                return (
                  <div key={c} className="rounded-lg border border-white/10 bg-dndoscuro-400/50 p-2 text-center">
                    <p className="text-[10px] font-bold uppercase text-stone-400">{c}</p>
                    <input
                      type="number"
                      value={monstruo.caracteristicas[c]}
                      onChange={(evento) => actualizarAnidado('caracteristicas', c, Number(evento.target.value))}
                      className="w-full input-dnd py-1 text-center font-bold my-1"
                    />
                    <p className="text-[10px] text-stone-300 font-bold">
                      {modificador >= 0 ? `+${modificador}` : modificador}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Campo etiqueta="Sentidos">
              <input
                value={monstruo.sentidos}
                onChange={(evento) => actualizar('sentidos', evento.target.value)}
                placeholder="visión en la oscuridad 60 pies"
                className="w-full input-dnd px-3 py-2"
              />
            </Campo>
            <Campo etiqueta="Idiomas">
              <input value={monstruo.idiomas} onChange={(evento) => actualizar('idiomas', evento.target.value)} className="w-full input-dnd px-3 py-2" />
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Nivel de Desafío">
              <select value={monstruo.nivel_desafio} onChange={(evento) => cambiarNivelDesafio(evento.target.value)} className="w-full input-dnd px-3 py-2">
                {NIVELES_DESAFIO.map((nd) => (
                  <option key={nd.valor} value={nd.valor} className="bg-dndoscuro-400">
                    {nd.etiqueta}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo etiqueta="PX">
              <input type="number" value={monstruo.px} onChange={(evento) => actualizar('px', Number(evento.target.value))} className="w-full input-dnd px-3 py-2" />
            </Campo>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-4">
            <ListaDinamica etiqueta="Habilidades Especiales" items={monstruo.habilidades_especiales} onCambiar={(v) => actualizar('habilidades_especiales', v)} />
            <ListaDinamica etiqueta="Acciones" items={monstruo.acciones} onCambiar={(v) => actualizar('acciones', v)} />
            <ListaDinamica etiqueta="Acciones Legendarias" items={monstruo.acciones_legendarias} onCambiar={(v) => actualizar('acciones_legendarias', v)} />
          </div>

          <button onClick={confirmar} className="w-full btn-primary py-3">
            Guardar Monstruo
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
