import { CARACTERISTICAS, HABILIDAD_POR_CARACTERISTICA } from './datos/tablasSRD.js';
import { modificadorCaracteristica, resolverValorCaracteristica } from './caracteristicas.js';

export function calcularSalvacion(personaje, caracteristica, bonoCompetencia) {
  const modCaracteristica = modificadorCaracteristica(resolverValorCaracteristica(personaje.caracteristicas[caracteristica]));
  const esCompetente = (personaje.competencias_salvacion || []).includes(caracteristica);
  return modCaracteristica + (esCompetente ? bonoCompetencia : 0);
}

export function calcularTodasSalvaciones(personaje, bonoCompetencia) {
  return CARACTERISTICAS.reduce((acc, caracteristica) => {
    acc[caracteristica] = calcularSalvacion(personaje, caracteristica, bonoCompetencia);
    return acc;
  }, {});
}

export function calcularBonoHabilidad(personaje, claveHabilidad, bonoCompetencia) {
  const claveCaracteristica = HABILIDAD_POR_CARACTERISTICA[claveHabilidad];
  if (!claveCaracteristica) throw new Error(`Habilidad desconocida: ${claveHabilidad}`);

  const modCaracteristica = modificadorCaracteristica(resolverValorCaracteristica(personaje.caracteristicas[claveCaracteristica]));
  const competencias = personaje.competencias_habilidad || { competente: [], pericia: [] };
  const tienePericia = competencias.pericia?.includes(claveHabilidad);
  const esCompetente = tienePericia || competencias.competente?.includes(claveHabilidad);
  const multiplicador = tienePericia ? 2 : esCompetente ? 1 : 0;

  return modCaracteristica + bonoCompetencia * multiplicador;
}

export function calcularTodasHabilidades(personaje, bonoCompetencia) {
  return Object.keys(HABILIDAD_POR_CARACTERISTICA).reduce((acc, claveHabilidad) => {
    acc[claveHabilidad] = calcularBonoHabilidad(personaje, claveHabilidad, bonoCompetencia);
    return acc;
  }, {});
}
