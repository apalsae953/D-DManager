import { CARACTERISTICAS, COSTES_COMPRA_PUNTOS, PRESUPUESTO_COMPRA_PUNTOS, ARREGLO_ESTANDAR } from './datos/tablasSRD.js';

export function modificadorCaracteristica(valor) {
  return Math.floor((valor - 10) / 2);
}

// Una caracteristica se guarda como { base, anulacion }. Si hay anulacion
// activa (modo Homebrew/Manual), esta gana siempre sobre el valor base.
export function resolverValorCaracteristica(entrada) {
  if (!entrada) return 10;
  return entrada.anulacion ?? entrada.base;
}

export function resolverTodasCaracteristicas(caracteristicas) {
  return CARACTERISTICAS.reduce((acc, clave) => {
    acc[clave] = resolverValorCaracteristica(caracteristicas[clave]);
    return acc;
  }, {});
}

export function modificadoresCaracteristicas(caracteristicas) {
  const resueltas = resolverTodasCaracteristicas(caracteristicas);
  return CARACTERISTICAS.reduce((acc, clave) => {
    acc[clave] = modificadorCaracteristica(resueltas[clave]);
    return acc;
  }, {});
}

export function costeCompraPuntos(valores) {
  return CARACTERISTICAS.reduce((total, clave) => {
    const valor = valores[clave];
    if (!(valor in COSTES_COMPRA_PUNTOS)) {
      throw new Error(`Valor fuera de rango para compra por puntos (${clave}=${valor})`);
    }
    return total + COSTES_COMPRA_PUNTOS[valor];
  }, 0);
}

export function validarCompraPuntos(valores) {
  const coste = costeCompraPuntos(valores);
  return { valida: coste <= PRESUPUESTO_COMPRA_PUNTOS, coste, presupuesto: PRESUPUESTO_COMPRA_PUNTOS, restante: PRESUPUESTO_COMPRA_PUNTOS - coste };
}

export function validarAsignacionArregloEstandar(asignacion) {
  const asignados = CARACTERISTICAS.map((clave) => asignacion[clave]).sort((a, b) => a - b);
  const esperados = [...ARREGLO_ESTANDAR].sort((a, b) => a - b);
  const valida = asignados.length === esperados.length && asignados.every((valor, i) => valor === esperados[i]);
  return { valida };
}
