// Datos de ejemplo para probar el Panel del Master sin depender aun de
// Supabase. `PERSONAJES_DEMO` sigue el mismo shape que usa la Ficha de
// Personaje, para que usePanelMaster pueda recalcular sus stats con el motor.

function caracteristicasDemo({ fue = 10, des = 10, con = 10, int = 10, sab = 10, car = 10 }) {
  return {
    fue: { base: fue, anulacion: null },
    des: { base: des, anulacion: null },
    con: { base: con, anulacion: null },
    int: { base: int, anulacion: null },
    sab: { base: sab, anulacion: null },
    car: { base: car, anulacion: null },
  };
}

function personajeDemo({ id, nombre, clase, nivel, caracteristicas, pvActual, competente = [], condiciones = [] }) {
  return {
    id,
    nombre,
    raza: 'humano',
    subraza: '',
    clase,
    subclase: '',
    trasfondo: '',
    alineamiento: '',
    nivel,
    puntos_experiencia: 0,
    es_multiclase: false,
    niveles_multiclase: [],
    metodo_caracteristicas: 'compra_puntos',
    caracteristicas: caracteristicasDemo(caracteristicas),
    puntos_vida: { modo_subida: 'fijo', por_nivel: [], anulacion: { activada: false, valor: null }, actual: pvActual, temporales: 0 },
    clase_armadura: { equipado: [], anulacion: { activada: false, valor: null } },
    bono_competencia: { anulacion: { activada: false, valor: null } },
    percepcion_pasiva: { anulacion: { activada: false, valor: null } },
    competencias_salvacion: [],
    competencias_habilidad: { competente, pericia: [] },
    espacios_conjuro: { anulacion: { activada: false, valor: null } },
    conjuros_conocidos: [],
    inventario: [],
    monedas: { pc: 0, pp: 0, pe: 0, po: 0, pt: 0 },
    rasgos: [],
    condiciones,
    notas: '',
  };
}

export const PARTIDA_DEMO = {
  id: 'partida-demo',
  master_id: 'master-demo',
  nombre: 'La Maldicion de Strahd',
  descripcion: '',
  codigo_invitacion: 'X7K2QP',
  esta_activa: true,
};

export const PERSONAJES_DEMO = [
  personajeDemo({
    id: 'pj-1',
    nombre: 'Elyndra Lunanoche',
    clase: 'mago',
    nivel: 5,
    caracteristicas: { fue: 8, des: 14, con: 14, int: 17, sab: 12, car: 10 },
    pvActual: 22,
    competente: ['percepcion', 'arcanos'],
  }),
  personajeDemo({
    id: 'pj-2',
    nombre: 'Grommash',
    clase: 'barbaro',
    nivel: 5,
    caracteristicas: { fue: 18, des: 12, con: 16, int: 8, sab: 10, car: 8 },
    pvActual: 40,
    competente: ['percepcion', 'atletismo'],
  }),
  personajeDemo({
    id: 'pj-3',
    nombre: 'Fenwick',
    clase: 'picaro',
    nivel: 5,
    caracteristicas: { fue: 10, des: 17, con: 12, int: 13, sab: 12, car: 14 },
    pvActual: 15,
    competente: ['percepcion', 'sigilo'],
    condiciones: ['Envenenado'],
  }),
];
