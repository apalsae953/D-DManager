import { BONO_COMPETENCIA_POR_NIVEL } from './datos/tablasSRD.js';
import { modificadorCaracteristica, resolverValorCaracteristica } from './caracteristicas.js';

function nivelTotalPersonaje(personaje) {
  return personaje.es_multiclase && personaje.niveles_multiclase?.length
    ? personaje.niveles_multiclase.reduce((suma, c) => suma + c.nivel, 0)
    : personaje.nivel;
}

export function calcularBonoCompetencia(personaje) {
  const bono = personaje.bono_competencia || {};
  if (bono.anulacion?.activada) {
    return { valor: bono.anulacion.valor, anulado: true };
  }
  const indice = Math.min(Math.max(nivelTotalPersonaje(personaje), 1), 20) - 1;
  return { valor: BONO_COMPETENCIA_POR_NIVEL[indice], anulado: false };
}

export function calcularModificadorIniciativa(personaje) {
  return modificadorCaracteristica(resolverValorCaracteristica(personaje.caracteristicas.des));
}

export function calcularPercepcionPasiva(personaje, bonoCompetencia, esCompetente, tienePericia) {
  const percepcion = personaje.percepcion_pasiva || {};
  if (percepcion.anulacion?.activada) {
    return { valor: percepcion.anulacion.valor, anulado: true };
  }
  const modSab = modificadorCaracteristica(resolverValorCaracteristica(personaje.caracteristicas.sab));
  const partesCompetencia = esCompetente ? bonoCompetencia * (tienePericia ? 2 : 1) : 0;
  return { valor: 10 + modSab + partesCompetencia, anulado: false };
}
