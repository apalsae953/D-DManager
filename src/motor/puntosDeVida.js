import { DADO_GOLPE_POR_CLASE } from './datos/tablasSRD.js';
import { modificadorCaracteristica, resolverValorCaracteristica } from './caracteristicas.js';

// `dadoGolpeConocido` es el valor de respaldo para clases fuera de la tabla
// SRD (por ejemplo, una clase personalizada creada en el asistente).
export function obtenerDadoGolpe(nombreClase, dadoGolpeConocido) {
  const dado = DADO_GOLPE_POR_CLASE[nombreClase?.toLowerCase()] ?? dadoGolpeConocido;
  if (!dado) throw new Error(`Clase desconocida: ${nombreClase}`);
  return dado;
}

export function tiradaPromedioDadoGolpe(tamanoDado) {
  return Math.floor(tamanoDado / 2) + 1;
}

// PV ganados en un nivel dado (2+). El PHB exige un minimo de 1 PV por nivel
// incluso si el dado + el modificador de Constitucion dan 0 o menos.
export function puntosVidaPorNivel({ tamanoDado, modificadorCon, modo, valorTirada, valorManual }) {
  switch (modo) {
    case 'fijo':
      return Math.max(1, tiradaPromedioDadoGolpe(tamanoDado) + modificadorCon);
    case 'tirada':
      if (!Number.isInteger(valorTirada) || valorTirada < 1 || valorTirada > tamanoDado) {
        throw new Error(`Tirada invalida para 1d${tamanoDado}: ${valorTirada}`);
      }
      return Math.max(1, valorTirada + modificadorCon);
    case 'manual':
      if (!Number.isInteger(valorManual)) {
        throw new Error('Se requiere un valor manual de PV para este nivel');
      }
      return valorManual;
    default:
      throw new Error(`Modo de subida de vida desconocido: ${modo}`);
  }
}

// puntos_vida.por_nivel puede incluir, por nivel, un `dado_golpe` propio
// (relevante en multiclase, donde cada nivel usa el dado de golpe de la
// clase tomada en ese nivel).
export function calcularPuntosVidaMaximos(personaje) {
  const pv = personaje.puntos_vida || {};

  if (pv.anulacion?.activada) {
    return { valor: pv.anulacion.valor, anulado: true };
  }

  const dadoPrincipal = obtenerDadoGolpe(personaje.clase, personaje.dado_golpe_personalizado);
  const modCon = modificadorCaracteristica(resolverValorCaracteristica(personaje.caracteristicas.con));
  const porNivel = pv.por_nivel || [];

  let total = Math.max(1, dadoPrincipal + modCon);

  for (let nivel = 2; nivel <= personaje.nivel; nivel++) {
    const entrada = porNivel.find((e) => e.nivel === nivel) || {};
    total += puntosVidaPorNivel({
      tamanoDado: entrada.dado_golpe || dadoPrincipal,
      modificadorCon: modCon,
      modo: entrada.modo || pv.modo_subida || 'fijo',
      valorTirada: entrada.valor_tirada,
      valorManual: entrada.valor_manual,
    });
  }

  return { valor: total, anulado: false };
}

export function calcularReservaDadosGolpe(nivel) {
  return { total: nivel, usados: 0 };
}
