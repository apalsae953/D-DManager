import { useCallback, useMemo, useState } from 'react';
import { recalcularPersonaje, aplicarSubidaNivel } from '../motor/index.js';

export function crearPersonajePorDefecto() {
  return {
    nombre: '',
    raza: 'humano',
    subraza: '',
    clase: 'guerrero',
    subclase: '',
    trasfondo: '',
    alineamiento: '',
    nivel: 1,
    puntos_experiencia: 0,
    es_multiclase: false,
    niveles_multiclase: [],
    metodo_caracteristicas: 'compra_puntos',
    caracteristicas: {
      fue: { base: 8, anulacion: null },
      des: { base: 8, anulacion: null },
      con: { base: 8, anulacion: null },
      int: { base: 8, anulacion: null },
      sab: { base: 8, anulacion: null },
      car: { base: 8, anulacion: null },
    },
    puntos_vida: {
      modo_subida: 'fijo',
      por_nivel: [],
      anulacion: { activada: false, valor: null },
      actual: null,
      temporales: 0,
    },
    clase_armadura: { equipado: [], anulacion: { activada: false, valor: null } },
    bono_competencia: { anulacion: { activada: false, valor: null } },
    percepcion_pasiva: { anulacion: { activada: false, valor: null } },
    competencias_salvacion: [],
    competencias_habilidad: { competente: [], pericia: [] },
    espacios_conjuro: { anulacion: { activada: false, valor: null } },
    conjuros_conocidos: [],
    inventario: [],
    monedas: { pc: 0, pp: 0, pe: 0, po: 0, pt: 0 },
    rasgos: [],
    condiciones: [],
    notas: '',
  };
}

// Asigna `valor` en `objeto` siguiendo una ruta tipo "clase_armadura.anulacion.valor",
// devolviendo un objeto nuevo en cada nivel del camino (actualizacion inmutable).
function establecerEnRuta(objeto, ruta, valor) {
  const [primeraClave, ...resto] = ruta.split('.');
  if (resto.length === 0) {
    return { ...objeto, [primeraClave]: valor };
  }
  return {
    ...objeto,
    [primeraClave]: establecerEnRuta(objeto[primeraClave] ?? {}, resto.join('.'), valor),
  };
}

export function useFichaPersonaje(personajeInicial) {
  const [personaje, setPersonaje] = useState(personajeInicial ?? crearPersonajePorDefecto());

  const derivado = useMemo(() => recalcularPersonaje(personaje), [personaje]);

  const actualizarCampo = useCallback((ruta, valor) => {
    setPersonaje((anterior) => establecerEnRuta(anterior, ruta, valor));
  }, []);

  // ruta apunta al objeto padre que contiene `anulacion` (p. ej. "clase_armadura",
  // "puntos_vida", "caracteristicas.fue"), no al propio campo `anulacion`.
  const alternarAnulacion = useCallback((ruta, activada, valor) => {
    setPersonaje((anterior) => establecerEnRuta(anterior, `${ruta}.anulacion`, { activada, valor: valor ?? null }));
  }, []);

  const subirNivel = useCallback((nuevoNivel, entradaVida) => {
    setPersonaje((anterior) => aplicarSubidaNivel(anterior, { nuevoNivel, entradaVida }).personaje);
  }, []);

  return { personaje, setPersonaje, derivado, actualizarCampo, alternarAnulacion, subirNivel };
}
