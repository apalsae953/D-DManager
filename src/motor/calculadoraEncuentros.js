import { UMBRALES_PX_POR_NIVEL, MULTIPLICADORES_ENCUENTRO } from './datos/tablasEncuentro.js';

// Suma los umbrales de dificultad (Facil/Medio/Dificil/Mortal) de cada
// jugador segun su nivel, para obtener los umbrales del grupo completo.
export function umbralesPxGrupo(nivelesJugadores) {
  return nivelesJugadores.reduce(
    (total, nivel) => {
      const fila = UMBRALES_PX_POR_NIVEL[Math.min(Math.max(nivel, 1), 20) - 1];
      return {
        facil: total.facil + fila.facil,
        medio: total.medio + fila.medio,
        dificil: total.dificil + fila.dificil,
        mortal: total.mortal + fila.mortal,
      };
    },
    { facil: 0, medio: 0, dificil: 0, mortal: 0 }
  );
}

function indiceMultiplicadorBase(cantidadMonstruos) {
  return MULTIPLICADORES_ENCUENTRO.findIndex((fila) => cantidadMonstruos <= fila.maximo);
}

// Un grupo pequeno (menos de 3) sufre el encuentro como si hubiera un
// monstruo mas de lo real; un grupo grande (6+) lo sufre como si hubiera uno
// menos, segun la regla de construccion de encuentros de la guia del DM.
function indiceAjustadoPorTamanoGrupo(indice, cantidadJugadores) {
  if (cantidadJugadores < 3) return Math.min(indice + 1, MULTIPLICADORES_ENCUENTRO.length - 1);
  if (cantidadJugadores >= 6) return Math.max(indice - 1, 0);
  return indice;
}

// monstruos: [{ px, cantidad }, ...]
export function calcularDificultadEncuentro({ nivelesJugadores, monstruos }) {
  const umbrales = umbralesPxGrupo(nivelesJugadores);
  const pxTotal = monstruos.reduce((suma, m) => suma + m.px * m.cantidad, 0);
  const cantidadMonstruos = monstruos.reduce((suma, m) => suma + m.cantidad, 0);

  const indiceBase = cantidadMonstruos > 0 ? indiceMultiplicadorBase(cantidadMonstruos) : 0;
  const indiceFinal = cantidadMonstruos > 0 ? indiceAjustadoPorTamanoGrupo(indiceBase, nivelesJugadores.length) : 0;
  const multiplicador = cantidadMonstruos > 0 ? MULTIPLICADORES_ENCUENTRO[indiceFinal].multiplicador : 1;
  const pxAjustado = Math.round(pxTotal * multiplicador);

  let dificultad = 'trivial';
  if (pxTotal > 0 && pxAjustado >= umbrales.mortal) dificultad = 'mortal';
  else if (pxTotal > 0 && pxAjustado >= umbrales.dificil) dificultad = 'dificil';
  else if (pxTotal > 0 && pxAjustado >= umbrales.medio) dificultad = 'medio';
  else if (pxTotal > 0 && pxAjustado >= umbrales.facil) dificultad = 'facil';

  return { umbrales, pxTotal, pxAjustado, multiplicador, cantidadMonstruos, dificultad };
}
