// Tablas de referencia SRD 5.1 usadas por el motor de reglas.
// Todos los arreglos "por nivel" estan indexados desde el nivel 1 (indice 0).

export const CARACTERISTICAS = ['fue', 'des', 'con', 'int', 'sab', 'car'];

export const HABILIDAD_POR_CARACTERISTICA = {
  acrobacias: 'des',
  trato_con_animales: 'sab',
  arcanos: 'int',
  atletismo: 'fue',
  engano: 'car',
  historia: 'int',
  perspicacia: 'sab',
  intimidacion: 'car',
  investigacion: 'int',
  medicina: 'sab',
  naturaleza: 'int',
  percepcion: 'sab',
  interpretacion: 'car',
  persuasion: 'car',
  religion: 'int',
  juego_de_manos: 'des',
  sigilo: 'des',
  supervivencia: 'sab',
};

export const DADO_GOLPE_POR_CLASE = {
  barbaro: 12,
  guerrero: 10,
  paladin: 10,
  explorador: 10,
  bardo: 8,
  clerigo: 8,
  druida: 8,
  monje: 8,
  picaro: 8,
  brujo: 8,
  hechicero: 6,
  mago: 6,
};

export const COMPETENCIAS_SALVACION_POR_CLASE = {
  barbaro: ['fue', 'con'],
  bardo: ['des', 'car'],
  clerigo: ['sab', 'car'],
  druida: ['int', 'sab'],
  guerrero: ['fue', 'con'],
  monje: ['fue', 'des'],
  paladin: ['sab', 'car'],
  explorador: ['fue', 'des'],
  picaro: ['des', 'int'],
  hechicero: ['con', 'car'],
  brujo: ['sab', 'car'],
  mago: ['int', 'sab'],
};

// Bono de competencia por nivel de personaje (total, sumando multiclase).
export const BONO_COMPETENCIA_POR_NIVEL = [
  2, 2, 2, 2,
  3, 3, 3, 3,
  4, 4, 4, 4,
  5, 5, 5, 5,
  6, 6, 6, 6,
];

// Tipo de lanzador por clase base. 'pacto' (Brujo) usa su propia tabla de
// Magia de Pacto, totalmente independiente de los espacios de conjuro normales.
export const TIPO_LANZADOR_POR_CLASE = {
  bardo: 'completo',
  clerigo: 'completo',
  druida: 'completo',
  hechicero: 'completo',
  mago: 'completo',
  paladin: 'medio',
  explorador: 'medio',
  brujo: 'pacto',
  guerrero: 'ninguno',
  picaro: 'ninguno',
  barbaro: 'ninguno',
  monje: 'ninguno',
};

// Subclases que convierten una clase 'ninguno' en lanzador de un tercio
// (Caballero Arcano / Picaro Arcano), segun el nombre de subclase guardado en la ficha.
export const SUBCLASES_LANZADOR_TERCIO = ['caballero arcano', 'picaro arcano'];

// Espacios de conjuro -- lanzador completo (Bardo, Clerigo, Druida, Hechicero, Mago).
// Tambien es la tabla usada para el nivel de lanzador combinado en multiclase.
export const ESPACIOS_LANZADOR_COMPLETO = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

// Espacios de conjuro -- lanzador de la mitad, tabla propia de clase pura
// (Paladin, Explorador). No se deriva de la tabla completa: es la tabla de
// PHB tal cual, mas generosa que el equivalente "nivel/2" usado en multiclase.
export const ESPACIOS_LANZADOR_MEDIO = [
  [0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0],
  [3, 0, 0, 0, 0],
  [3, 0, 0, 0, 0],
  [4, 2, 0, 0, 0],
  [4, 2, 0, 0, 0],
  [4, 3, 0, 0, 0],
  [4, 3, 0, 0, 0],
  [4, 3, 2, 0, 0],
  [4, 3, 2, 0, 0],
  [4, 3, 3, 0, 0],
  [4, 3, 3, 0, 0],
  [4, 3, 3, 1, 0],
  [4, 3, 3, 1, 0],
  [4, 3, 3, 2, 0],
  [4, 3, 3, 2, 0],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2],
];

// Espacios de conjuro -- lanzador de un tercio, tabla propia de clase pura
// (Caballero Arcano, Picaro Arcano), tope de conjuros de nivel 4.
export const ESPACIOS_LANZADOR_TERCIO = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [2, 0, 0, 0],
  [3, 0, 0, 0],
  [3, 0, 0, 0],
  [3, 0, 0, 0],
  [4, 2, 0, 0],
  [4, 2, 0, 0],
  [4, 2, 0, 0],
  [4, 3, 0, 0],
  [4, 3, 0, 0],
  [4, 3, 0, 0],
  [4, 3, 2, 0],
  [4, 3, 2, 0],
  [4, 3, 2, 0],
  [4, 3, 3, 0],
  [4, 3, 3, 0],
  [4, 3, 3, 0],
  [4, 3, 3, 1],
  [4, 3, 3, 1],
];

// Magia de Pacto (Brujo): numero de espacios y nivel de espacio, por nivel de Brujo.
export const ESPACIOS_MAGIA_PACTO = [
  { espacios: 1, nivelEspacio: 1 },
  { espacios: 2, nivelEspacio: 1 },
  { espacios: 2, nivelEspacio: 2 },
  { espacios: 2, nivelEspacio: 2 },
  { espacios: 2, nivelEspacio: 3 },
  { espacios: 2, nivelEspacio: 3 },
  { espacios: 2, nivelEspacio: 4 },
  { espacios: 2, nivelEspacio: 4 },
  { espacios: 2, nivelEspacio: 5 },
  { espacios: 2, nivelEspacio: 5 },
  { espacios: 3, nivelEspacio: 5 },
  { espacios: 3, nivelEspacio: 5 },
  { espacios: 3, nivelEspacio: 5 },
  { espacios: 3, nivelEspacio: 5 },
  { espacios: 3, nivelEspacio: 5 },
  { espacios: 3, nivelEspacio: 5 },
  { espacios: 4, nivelEspacio: 5 },
  { espacios: 4, nivelEspacio: 5 },
  { espacios: 4, nivelEspacio: 5 },
  { espacios: 4, nivelEspacio: 5 },
];

export const COSTES_COMPRA_PUNTOS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const PRESUPUESTO_COMPRA_PUNTOS = 27;
export const ARREGLO_ESTANDAR = [15, 14, 13, 12, 10, 8];

export const TOPE_DESTREZA_ARMADURA = { ligera: null, media: 2, pesada: 0 };
