// Listas de referencia para el asistente de creacion de personajes (SRD 5.1).
// Las claves ('mago', 'humano', ...) coinciden con las usadas por el motor
// de reglas en src/motor, para que el personaje creado aqui sea compatible
// con calcularEspaciosConjuro, obtenerDadoGolpe, etc. sin necesidad de mapear.

export const RAZAS = [
  { clave: 'humano', nombre: 'Humano', subrazas: [] },
  { clave: 'elfo', nombre: 'Elfo', subrazas: ['Alto Elfo', 'Elfo del Bosque', 'Drow'] },
  { clave: 'enano', nombre: 'Enano', subrazas: ['Enano de las Colinas', 'Enano de las Montanias'] },
  { clave: 'mediano', nombre: 'Mediano', subrazas: ['Piesligeros', 'Fornido'] },
  { clave: 'draconido', nombre: 'Draconido', subrazas: [] },
  { clave: 'gnomo', nombre: 'Gnomo', subrazas: ['Gnomo de los Bosques', 'Gnomo de las Rocas'] },
  { clave: 'semielfo', nombre: 'Semielfo', subrazas: [] },
  { clave: 'semiorco', nombre: 'Semiorco', subrazas: [] },
  { clave: 'tiefling', nombre: 'Tiefling', subrazas: [] },
];

// El campo `lanzador` es informativo para la UI; el motor deriva el tipo
// real de lanzador (completo/medio/tercio/pacto/ninguno) a partir de la clase.
export const CLASES = [
  { clave: 'barbaro', nombre: 'Bárbaro', dadoGolpe: 12, lanzador: 'ninguno', nivelSubclase: 3, nombreSubclase: 'Senda Primordial', subclases: ['Senda del Berserker', 'Senda del Guerrero Totémico'] },
  { clave: 'guerrero', nombre: 'Guerrero', dadoGolpe: 10, lanzador: 'ninguno (Caballero Arcano: tercio)', nivelSubclase: 3, nombreSubclase: 'Arquetipo Marcial', subclases: ['Campeón', 'Maestro de Batalla', 'Caballero Arcano'] },
  { clave: 'paladin', nombre: 'Paladín', dadoGolpe: 10, lanzador: 'medio', nivelSubclase: 3, nombreSubclase: 'Juramento Sagrado', subclases: ['Juramento de Devoción', 'Juramento de los Antiguos', 'Juramento de Venganza'] },
  { clave: 'explorador', nombre: 'Explorador', dadoGolpe: 10, lanzador: 'medio', nivelSubclase: 3, nombreSubclase: 'Arquetipo de Explorador', subclases: ['Cazador', 'Señor de las Bestias'] },
  { clave: 'bardo', nombre: 'Bardo', dadoGolpe: 8, lanzador: 'completo', nivelSubclase: 3, nombreSubclase: 'Colegio Bárdico', subclases: ['Colegio del Conocimiento', 'Colegio del Valor'] },
  { clave: 'clerigo', nombre: 'Clérigo', dadoGolpe: 8, lanzador: 'completo', nivelSubclase: 1, nombreSubclase: 'Dominio Divino', subclases: ['Dominio del Conocimiento', 'Dominio de la Vida', 'Dominio de la Luz', 'Dominio de la Naturaleza', 'Dominio de la Tempestad', 'Dominio del Engaño', 'Dominio de la Guerra'] },
  { clave: 'druida', nombre: 'Druida', dadoGolpe: 8, lanzador: 'completo', nivelSubclase: 2, nombreSubclase: 'Círculo Druídico', subclases: ['Círculo de la Tierra', 'Círculo de la Luna'] },
  { clave: 'monje', nombre: 'Monje', dadoGolpe: 8, lanzador: 'ninguno', nivelSubclase: 3, nombreSubclase: 'Tradición Monástica', subclases: ['Camino de la Mano Abierta', 'Camino de las Sombras', 'Camino de los Cuatro Elementos'] },
  { clave: 'picaro', nombre: 'Pícaro', dadoGolpe: 8, lanzador: 'ninguno (Pícaro Arcano: tercio)', nivelSubclase: 3, nombreSubclase: 'Arquetipo Pícaro', subclases: ['Ladrón', 'Asesino', 'Pícaro Arcano'] },
  { clave: 'brujo', nombre: 'Brujo', dadoGolpe: 8, lanzador: 'pacto', nivelSubclase: 1, nombreSubclase: 'Patrón de Otro Mundo', subclases: ['El Archihada', 'El Infernal', 'El Gran Antiguo'] },
  { clave: 'hechicero', nombre: 'Hechicero', dadoGolpe: 6, lanzador: 'completo', nivelSubclase: 1, nombreSubclase: 'Origen Hechicero', subclases: ['Linaje Dracónico', 'Magia Salvaje'] },
  { clave: 'mago', nombre: 'Mago', dadoGolpe: 6, lanzador: 'completo', nivelSubclase: 2, nombreSubclase: 'Tradición Arcana', subclases: ['Escuela de Abjuración', 'Escuela de Conjuración', 'Escuela de Adivinación', 'Escuela de Encantamiento', 'Escuela de Evocación', 'Escuela de Ilusión', 'Escuela de Nigromancia', 'Escuela de Transmutación'] },
];

export const SUBCLASES_TERCIO = ['caballero arcano', 'picaro arcano'];

export const TRASFONDOS = [
  'Acolito',
  'Artesano Gremial',
  'Artista',
  'Charlatan',
  'Criminal',
  'Ermitanio',
  'Forastero',
  'Heroe del Pueblo',
  'Marinero',
  'Noble',
  'Sabio',
  'Soldado',
  'Vagabundo Urbano',
];

export const ALINEAMIENTOS = [
  'Legal Bueno', 'Neutral Bueno', 'Caotico Bueno',
  'Legal Neutral', 'Neutral', 'Caotico Neutral',
  'Legal Malvado', 'Neutral Malvado', 'Caotico Malvado',
];

export const HABILIDADES_INFO = [
  { clave: 'acrobacias', nombre: 'Acrobacias', caracteristica: 'des' },
  { clave: 'trato_con_animales', nombre: 'Trato con Animales', caracteristica: 'sab' },
  { clave: 'arcanos', nombre: 'Arcanos', caracteristica: 'int' },
  { clave: 'atletismo', nombre: 'Atletismo', caracteristica: 'fue' },
  { clave: 'engano', nombre: 'Engano', caracteristica: 'car' },
  { clave: 'historia', nombre: 'Historia', caracteristica: 'int' },
  { clave: 'perspicacia', nombre: 'Perspicacia', caracteristica: 'sab' },
  { clave: 'intimidacion', nombre: 'Intimidacion', caracteristica: 'car' },
  { clave: 'investigacion', nombre: 'Investigacion', caracteristica: 'int' },
  { clave: 'medicina', nombre: 'Medicina', caracteristica: 'sab' },
  { clave: 'naturaleza', nombre: 'Naturaleza', caracteristica: 'int' },
  { clave: 'percepcion', nombre: 'Percepcion', caracteristica: 'sab' },
  { clave: 'interpretacion', nombre: 'Interpretacion', caracteristica: 'car' },
  { clave: 'persuasion', nombre: 'Persuasion', caracteristica: 'car' },
  { clave: 'religion', nombre: 'Religion', caracteristica: 'int' },
  { clave: 'juego_de_manos', nombre: 'Juego de Manos', caracteristica: 'des' },
  { clave: 'sigilo', nombre: 'Sigilo', caracteristica: 'des' },
  { clave: 'supervivencia', nombre: 'Supervivencia', caracteristica: 'sab' },
];

export const NOMBRE_CARACTERISTICA = { fue: 'Fuerza', des: 'Destreza', con: 'Constitucion', int: 'Inteligencia', sab: 'Sabiduria', car: 'Carisma' };

export const TIPOS_ARMADURA = [
  { clave: 'ligera', nombre: 'Ligera' },
  { clave: 'media', nombre: 'Media' },
  { clave: 'pesada', nombre: 'Pesada' },
];

export const CONDICIONES = [
  'Agarrado',
  'Apresado',
  'Asustado',
  'Aturdido',
  'Cegado',
  'Derribado',
  'Encantado',
  'Envenenado',
  'Incapacitado',
  'Inconsciente',
  'Invisible',
  'Paralizado',
  'Petrificado',
];

export const TAMANOS_CRIATURA = ['Diminuto', 'Pequeno', 'Mediano', 'Grande', 'Enorme', 'Gargantuesco'];

export const TIPOS_CRIATURA = [
  'aberracion',
  'bestia',
  'celestial',
  'constructo',
  'dragon',
  'elemental',
  'hada',
  'gigante',
  'humanoide',
  'monstruosidad',
  'cieno',
  'planta',
  'no-muerto',
];

// Etiquetas de Nivel de Desafio (ND) para el selector del creador de
// monstruos; el valor numerico es la clave usada en PX_POR_NIVEL_DESAFIO.
export const NIVELES_DESAFIO = [
  { valor: 0, etiqueta: '0' },
  { valor: 0.125, etiqueta: '1/8' },
  { valor: 0.25, etiqueta: '1/4' },
  { valor: 0.5, etiqueta: '1/2' },
  ...Array.from({ length: 24 }, (_, i) => ({ valor: i + 1, etiqueta: String(i + 1) })),
];
