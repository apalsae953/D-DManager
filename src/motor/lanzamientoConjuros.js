import {
  TIPO_LANZADOR_POR_CLASE,
  SUBCLASES_LANZADOR_TERCIO,
  ESPACIOS_LANZADOR_COMPLETO,
  ESPACIOS_LANZADOR_MEDIO,
  ESPACIOS_LANZADOR_TERCIO,
  ESPACIOS_MAGIA_PACTO,
} from './datos/tablasSRD.js';

function obtenerTipoLanzador(nombreClase, nombreSubclase) {
  const tipo = TIPO_LANZADOR_POR_CLASE[nombreClase?.toLowerCase()];
  if ((tipo === 'ninguno' || !tipo) && nombreSubclase && SUBCLASES_LANZADOR_TERCIO.includes(nombreSubclase.toLowerCase())) {
    return 'tercio';
  }
  return tipo || 'ninguno';
}

function espaciosDesdeTabla(tabla, nivel) {
  const fila = tabla[Math.min(Math.max(nivel, 1), tabla.length) - 1];
  return fila ? [...fila] : [];
}

// Un personaje de una sola clase usa la tabla propia de esa clase. En cuanto
// tiene niveles en 2+ clases, los espacios normales se recalculan con el
// "nivel de lanzador multiclase" (PHB): completo = nivel entero, medio =
// nivel/2 redondeado abajo, tercio = nivel/3 redondeado abajo, sumados y
// buscados en la tabla de lanzador completo. La Magia de Pacto del Brujo
// siempre se calcula aparte, con el nivel de Brujo en solitario.
export function calcularEspaciosConjuro(personaje) {
  const espaciosConjuro = personaje.espacios_conjuro || {};
  if (espaciosConjuro.anulacion?.activada) {
    return { espacios: espaciosConjuro.anulacion.valor, espaciosPacto: null, anulado: true };
  }

  const clases = personaje.es_multiclase && personaje.niveles_multiclase?.length
    ? personaje.niveles_multiclase
    : [{ clase: personaje.clase, subclase: personaje.subclase, nivel: personaje.nivel }];

  const entradaBrujo = clases.find((c) => obtenerTipoLanzador(c.clase, c.subclase) === 'pacto');
  const espaciosPacto = entradaBrujo
    ? ESPACIOS_MAGIA_PACTO[Math.min(Math.max(entradaBrujo.nivel, 1), ESPACIOS_MAGIA_PACTO.length) - 1]
    : null;

  let espacios = [];

  if (clases.length === 1) {
    const [entrada] = clases;
    const tipo = obtenerTipoLanzador(entrada.clase, entrada.subclase);
    const tabla = { completo: ESPACIOS_LANZADOR_COMPLETO, medio: ESPACIOS_LANZADOR_MEDIO, tercio: ESPACIOS_LANZADOR_TERCIO }[tipo];
    espacios = tabla ? espaciosDesdeTabla(tabla, entrada.nivel) : [];
  } else {
    let nivelLanzador = 0;
    for (const entrada of clases) {
      const tipo = obtenerTipoLanzador(entrada.clase, entrada.subclase);
      if (tipo === 'completo') nivelLanzador += entrada.nivel;
      else if (tipo === 'medio') nivelLanzador += Math.floor(entrada.nivel / 2);
      else if (tipo === 'tercio') nivelLanzador += Math.floor(entrada.nivel / 3);
    }
    espacios = nivelLanzador > 0 ? espaciosDesdeTabla(ESPACIOS_LANZADOR_COMPLETO, nivelLanzador) : [];
  }

  return { espacios, espaciosPacto, anulado: false };
}
