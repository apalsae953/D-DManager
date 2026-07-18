import { Dices } from 'lucide-react';
import { NOMBRE_CARACTERISTICA } from '../../datos/datosCreacion.js';
import { validarCompraPuntos, validarAsignacionArregloEstandar } from '../../motor/index.js';

const ORDEN = ['fue', 'des', 'con', 'int', 'sab', 'car'];
const VALORES_ARREGLO_ESTANDAR = [15, 14, 13, 12, 10, 8];

const METODOS = [
  { clave: 'compra_puntos', etiqueta: 'Compra por Puntos' },
  { clave: 'arreglo_estandar', etiqueta: 'Arreglo Estandar' },
  { clave: 'tirada_dados', etiqueta: 'Tirada de Dados' },
  { clave: 'manual', etiqueta: 'Manual' },
];

function tirar4d6QuitarMenor() {
  const tiradas = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6));
  tiradas.sort((a, b) => a - b);
  return tiradas.slice(1).reduce((suma, valor) => suma + valor, 0);
}

export function SelectorCaracteristicas({ personaje, actualizarCampo, soloLectura = false }) {
  const metodo = personaje.metodo_caracteristicas;
  const cambiarMetodo = (nuevoMetodo) => actualizarCampo('metodo_caracteristicas', nuevoMetodo);
  const cambiarBase = (clave, valor) => actualizarCampo(`caracteristicas.${clave}.base`, valor);

  const valoresActuales = ORDEN.reduce((acc, clave) => {
    acc[clave] = personaje.caracteristicas[clave].base;
    return acc;
  }, {});

  const validacionCompra = metodo === 'compra_puntos' ? validarCompraPuntos(valoresActuales) : null;
  const validacionArreglo = metodo === 'arreglo_estandar' ? validarAsignacionArregloEstandar(valoresActuales) : null;

  return (
    <div className="space-y-4">
      {!soloLectura && (
        <div className="flex flex-wrap gap-2">
          {METODOS.map((opcion) => (
            <button
              key={opcion.clave}
              onClick={() => cambiarMetodo(opcion.clave)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                metodo === opcion.clave ? 'bg-sangre-700 text-white' : 'bg-dndoscuro-300 text-stone-400 hover:bg-white/10'
              }`}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      )}

      {metodo === 'compra_puntos' && (
        <p className={`text-sm font-medium ${validacionCompra.valida ? 'text-emerald-400' : 'text-sangre-400'}`}>
          Puntos usados: {validacionCompra.coste} / {validacionCompra.presupuesto}
          {!validacionCompra.valida && ' -- excede el presupuesto'}
        </p>
      )}

      {metodo === 'arreglo_estandar' && !validacionArreglo.valida && (
        <p className="text-sm font-medium text-sangre-400">
          Los valores asignados deben ser exactamente {VALORES_ARREGLO_ESTANDAR.join(', ')}, sin repetir.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ORDEN.map((clave) => (
          <div key={clave} className="rounded-lg border border-white/10 glass-panel p-3 text-center">
            <p className="text-xs font-semibold uppercase text-stone-500">{NOMBRE_CARACTERISTICA[clave]}</p>

            {!soloLectura && metodo === 'compra_puntos' && (
              <div className="mt-1 flex items-center justify-center gap-2">
                <button
                  onClick={() => cambiarBase(clave, Math.max(8, valoresActuales[clave] - 1))}
                  className="h-7 w-7 rounded-full border border-white/10 text-stone-400 hover:bg-white/10"
                >
                  -
                </button>
                <span className="w-8 text-xl font-bold text-stone-100">{valoresActuales[clave]}</span>
                <button
                  onClick={() => cambiarBase(clave, Math.min(15, valoresActuales[clave] + 1))}
                  className="h-7 w-7 rounded-full border border-white/10 text-stone-400 hover:bg-white/10"
                >
                  +
                </button>
              </div>
            )}

            {!soloLectura && metodo === 'arreglo_estandar' && (
              <select
                value={valoresActuales[clave]}
                onChange={(evento) => cambiarBase(clave, Number(evento.target.value))}
                className="mt-1 w-full input-dnd py-1 text-center text-lg font-bold"
              >
                {VALORES_ARREGLO_ESTANDAR.map((valor) => (
                  <option key={valor} value={valor} className="bg-dndoscuro-400">
                    {valor}
                  </option>
                ))}
              </select>
            )}

            {!soloLectura && (metodo === 'tirada_dados' || metodo === 'manual') && (
              <div className="mt-1 flex items-center justify-center gap-2">
                <input
                  type="number"
                  value={valoresActuales[clave]}
                  onChange={(evento) => cambiarBase(clave, Number(evento.target.value))}
                  className="w-14 input-dnd py-1 text-center text-lg font-bold"
                />
                {metodo === 'tirada_dados' && (
                  <button
                    title="Tirar 4d6, descartando el menor"
                    onClick={() => cambiarBase(clave, tirar4d6QuitarMenor())}
                    className="rounded border border-white/10 p-1.5 text-stone-400 hover:bg-white/10"
                  >
                    <Dices className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {soloLectura && (
              <div className="mt-1 flex items-center justify-center">
                <span className="text-3xl font-cinzel font-bold text-sangre-400">{valoresActuales[clave]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
