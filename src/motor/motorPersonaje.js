import { modificadoresCaracteristicas } from './caracteristicas.js';
import { calcularPuntosVidaMaximos, calcularReservaDadosGolpe, obtenerDadoGolpe } from './puntosDeVida.js';
import { calcularClaseArmadura } from './claseArmadura.js';
import { calcularEspaciosConjuro } from './lanzamientoConjuros.js';
import { calcularBonoCompetencia, calcularModificadorIniciativa, calcularPercepcionPasiva } from './estadisticasCombate.js';
import { calcularTodasSalvaciones, calcularTodasHabilidades } from './salvacionesYHabilidades.js';

/**
 * Forma esperada del objeto `personaje` que consume este motor (coincide con
 * las columnas jsonb de `public.personajes` en db/esquema.sql):
 *
 * {
 *   clase, subclase, nivel, es_multiclase,
 *   niveles_multiclase: [{ clase, subclase, nivel, dado_golpe? }],
 *   caracteristicas: { fue: {base, anulacion}, des: {...}, ... },
 *   puntos_vida: { modo_subida, por_nivel: [{nivel, modo, valor_tirada, valor_manual, dado_golpe}], anulacion, actual, temporales },
 *   clase_armadura: { equipado: [{ranura, nombre, tipoArmadura, caBase}], anulacion },
 *   bono_competencia: { anulacion },
 *   percepcion_pasiva: { anulacion },
 *   competencias_salvacion: string[],
 *   competencias_habilidad: { competente: string[], pericia: string[] },
 *   espacios_conjuro: { anulacion },
 * }
 *
 * Cualquier campo calculado respeta su `anulacion.activada` (modo Homebrew/Manual).
 */

export function recalcularPersonaje(personaje) {
  const bonoCompetencia = calcularBonoCompetencia(personaje);
  const puntosVida = calcularPuntosVidaMaximos(personaje);
  const claseArmadura = calcularClaseArmadura(personaje);
  const espaciosConjuro = calcularEspaciosConjuro(personaje);
  const salvaciones = calcularTodasSalvaciones(personaje, bonoCompetencia.valor);
  const habilidades = calcularTodasHabilidades(personaje, bonoCompetencia.valor);

  const competencias = personaje.competencias_habilidad || {};
  const esCompetentePercepcion = competencias.competente?.includes('percepcion') ?? false;
  const tienePericiaPercepcion = competencias.pericia?.includes('percepcion') ?? false;
  const percepcionPasiva = calcularPercepcionPasiva(
    personaje,
    bonoCompetencia.valor,
    esCompetentePercepcion,
    tienePericiaPercepcion
  );

  return {
    modificadoresCaracteristicas: modificadoresCaracteristicas(personaje.caracteristicas),
    bonoCompetencia,
    puntosVida: {
      maximo: puntosVida.valor,
      anulado: puntosVida.anulado,
      actual: Math.min(personaje.puntos_vida?.actual ?? puntosVida.valor, puntosVida.valor),
      temporales: personaje.puntos_vida?.temporales ?? 0,
      dadosGolpe: calcularReservaDadosGolpe(personaje.nivel),
      tamanoDadoGolpe: obtenerDadoGolpe(personaje.clase, personaje.dado_golpe_personalizado),
    },
    claseArmadura,
    espaciosConjuro,
    salvaciones,
    habilidades,
    modificadorIniciativa: calcularModificadorIniciativa(personaje),
    percepcionPasiva,
  };
}

/**
 * Aplica un cambio de nivel y devuelve tanto el personaje actualizado como
 * sus estadisticas derivadas ya recalculadas. Soporta tanto subir como bajar.
 * `entradaVida` es opcional y sigue la forma { modo: 'fijo'|'tirada'|'manual', valor_tirada?, valor_manual?, dado_golpe? }
 */
export function aplicarSubidaNivel(personaje, { nuevoNivel, entradaVida } = {}) {
  if (nuevoNivel < 1) {
    throw new Error('El nivel mínimo es 1');
  }
  if (nuevoNivel > 20) {
    throw new Error('El nivel máximo es 20');
  }

  // Conservamos solo las entradas de HP del nuevo nivel o inferiores
  const porNivel = [...(personaje.puntos_vida?.por_nivel || [])].filter(e => e.nivel <= nuevoNivel);
  
  // Si estamos añadiendo una nueva entrada de vida (al subir de nivel)
  if (entradaVida) {
    const idx = porNivel.findIndex((e) => e.nivel === nuevoNivel);
    const entrada = { nivel: nuevoNivel, ...entradaVida };
    if (idx >= 0) porNivel[idx] = entrada;
    else porNivel.push(entrada);
  }

  const personajeActualizado = {
    ...personaje,
    nivel: nuevoNivel,
    puntos_vida: { ...personaje.puntos_vida, por_nivel: porNivel },
  };

  return { personaje: personajeActualizado, derivado: recalcularPersonaje(personajeActualizado) };
}
