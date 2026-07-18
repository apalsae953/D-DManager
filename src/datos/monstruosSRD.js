// Biblioteca de monstruos del SRD 5.1 integrada en la app. Cada entrada sigue
// el mismo shape que la tabla `monstruos` del esquema (db/esquema.sql), con
// es_srd:true y sin propietario, tal como se insertarian via seed en Supabase.

function monstruoSRD(datos) {
  return {
    subtipo: '',
    salvaciones: {},
    habilidades: {},
    damage_vulnerabilities: [],
    damage_resistances: [],
    damage_immunities: [],
    condition_immunities: [],
    habilidades_especiales: [],
    acciones_legendarias: [],
    reacciones: [],
    fuente: 'SRD 5.1',
    es_srd: true,
    ...datos,
  };
}

export const MONSTRUOS_SRD = [
  monstruoSRD({
    id: 'srd-goblin',
    nombre: 'Goblin',
    tamano: 'Pequeno',
    tipo: 'humanoide',
    subtipo: 'goblinoide',
    alineamiento: 'Legal Malvado',
    clase_armadura: { valor: 15, notas: 'armadura de cuero, escudo' },
    puntos_vida: { promedio: 7, formula: '2d6' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 8, des: 14, con: 10, int: 10, sab: 8, car: 8 },
    habilidades: { sigilo: 6 },
    sentidos: 'vision en la oscuridad 60 pies, percepcion pasiva 9',
    idiomas: 'comun, goblin',
    nivel_desafio: 0.25,
    px: 50,
    habilidades_especiales: [
      { nombre: 'Fuga Agil', descripcion: 'Como accion adicional, el goblin puede realizar la accion Esconderse o Retirarse.' },
    ],
    acciones: [
      { nombre: 'Cimitarra', descripcion: 'Ataque con arma cuerpo a cuerpo: +4 a impactar, alcance 5 pies. Impacto: 5 (1d6+2) de dano cortante.' },
      { nombre: 'Arco Corto', descripcion: 'Ataque con arma a distancia: +4 a impactar, alcance 80/320 pies. Impacto: 5 (1d6+2) de dano perforante.' },
    ],
  }),

  monstruoSRD({
    id: 'srd-orco',
    nombre: 'Orco',
    tamano: 'Mediano',
    tipo: 'humanoide',
    subtipo: 'orco',
    alineamiento: 'Caotico Malvado',
    clase_armadura: { valor: 13, notas: 'armadura de piel' },
    puntos_vida: { promedio: 15, formula: '2d8+6' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 16, des: 12, con: 16, int: 7, sab: 11, car: 10 },
    habilidades: { intimidacion: 2 },
    sentidos: 'vision en la oscuridad 60 pies, percepcion pasiva 10',
    idiomas: 'comun, orco',
    nivel_desafio: 0.5,
    px: 100,
    habilidades_especiales: [
      { nombre: 'Agresivo', descripcion: 'Como accion adicional, el orco puede moverse hasta su velocidad hacia una criatura hostil que pueda ver.' },
    ],
    acciones: [
      { nombre: 'Hacha Grande', descripcion: 'Ataque con arma cuerpo a cuerpo: +5 a impactar, alcance 5 pies. Impacto: 9 (1d12+3) de dano cortante.' },
      { nombre: 'Jabalina', descripcion: 'Ataque con arma cuerpo a cuerpo o a distancia: +5 a impactar, alcance 5 pies o 30/120 pies. Impacto: 6 (1d6+3) de dano perforante.' },
    ],
  }),

  monstruoSRD({
    id: 'srd-lobo',
    nombre: 'Lobo',
    tamano: 'Mediano',
    tipo: 'bestia',
    alineamiento: 'Neutral',
    clase_armadura: { valor: 13, notas: null },
    puntos_vida: { promedio: 11, formula: '2d8+2' },
    velocidad: { caminar: 40 },
    caracteristicas: { fue: 12, des: 15, con: 12, int: 3, sab: 12, car: 6 },
    habilidades: { percepcion: 3, sigilo: 4 },
    sentidos: 'percepcion pasiva 13',
    idiomas: '--',
    nivel_desafio: 0.25,
    px: 50,
    habilidades_especiales: [
      { nombre: 'Tacticas de Manada', descripcion: 'El lobo tiene ventaja en tiradas de ataque contra una criatura si al menos un aliado del lobo esta a 5 pies de ella.' },
      { nombre: 'Oido y Olfato Agudos', descripcion: 'El lobo tiene ventaja en pruebas de Sabiduria (Percepcion) que dependan del oido o el olfato.' },
    ],
    acciones: [
      {
        nombre: 'Mordisco',
        descripcion:
          'Ataque con arma cuerpo a cuerpo: +4 a impactar, alcance 5 pies. Impacto: 7 (2d4+2) de dano perforante. Si el objetivo es una criatura, debe superar una salvacion de Fuerza CD 11 o cae derribado.',
      },
    ],
  }),

  monstruoSRD({
    id: 'srd-oso-pardo',
    nombre: 'Oso Pardo',
    tamano: 'Grande',
    tipo: 'bestia',
    alineamiento: 'Neutral',
    clase_armadura: { valor: 11, notas: null },
    puntos_vida: { promedio: 34, formula: '4d10+12' },
    velocidad: { caminar: 40 },
    caracteristicas: { fue: 19, des: 10, con: 16, int: 2, sab: 13, car: 7 },
    habilidades: { percepcion: 3 },
    sentidos: 'percepcion pasiva 13',
    idiomas: '--',
    nivel_desafio: 1,
    px: 200,
    habilidades_especiales: [{ nombre: 'Olfato Agudo', descripcion: 'El oso tiene ventaja en pruebas de Sabiduria (Percepcion) que dependan del olfato.' }],
    acciones: [
      { nombre: 'Multiataque', descripcion: 'El oso hace dos ataques: uno de mordisco y otro de zarpazo.' },
      { nombre: 'Mordisco', descripcion: 'Ataque con arma cuerpo a cuerpo: +6 a impactar, alcance 5 pies. Impacto: 8 (1d8+4) de dano perforante.' },
      { nombre: 'Zarpazo', descripcion: 'Ataque con arma cuerpo a cuerpo: +6 a impactar, alcance 5 pies. Impacto: 11 (2d6+4) de dano cortante.' },
    ],
  }),

  monstruoSRD({
    id: 'srd-esqueleto',
    nombre: 'Esqueleto',
    tamano: 'Mediano',
    tipo: 'no-muerto',
    alineamiento: 'Legal Malvado',
    clase_armadura: { valor: 13, notas: 'restos de armadura' },
    puntos_vida: { promedio: 13, formula: '2d8+4' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 10, des: 14, con: 15, int: 6, sab: 8, car: 5 },
    damage_vulnerabilities: ['contundente'],
    damage_immunities: ['veneno'],
    condition_immunities: ['exhausto', 'envenenado'],
    sentidos: 'vision en la oscuridad 60 pies, percepcion pasiva 9',
    idiomas: 'entiende los idiomas que conocia en vida pero no puede hablar',
    nivel_desafio: 0.25,
    px: 50,
    acciones: [
      { nombre: 'Espada Corta', descripcion: 'Ataque con arma cuerpo a cuerpo: +4 a impactar, alcance 5 pies. Impacto: 5 (1d6+2) de dano perforante.' },
      { nombre: 'Arco Corto', descripcion: 'Ataque con arma a distancia: +4 a impactar, alcance 80/320 pies. Impacto: 5 (1d6+2) de dano perforante.' },
    ],
  }),

  monstruoSRD({
    id: 'srd-zombi',
    nombre: 'Zombi',
    tamano: 'Mediano',
    tipo: 'no-muerto',
    alineamiento: 'Neutral Malvado',
    clase_armadura: { valor: 8, notas: null },
    puntos_vida: { promedio: 22, formula: '3d8+9' },
    velocidad: { caminar: 20 },
    caracteristicas: { fue: 13, des: 6, con: 16, int: 3, sab: 6, car: 5 },
    damage_immunities: ['veneno'],
    condition_immunities: ['envenenado'],
    sentidos: 'vision en la oscuridad 60 pies, percepcion pasiva 8',
    idiomas: 'entiende los idiomas que conocia en vida pero no puede hablar',
    nivel_desafio: 0.25,
    px: 50,
    habilidades_especiales: [
      {
        nombre: 'Fortaleza de No-muerto',
        descripcion:
          'Si el dano reduce al zombi a 0 puntos de vida, debe superar una salvacion de Constitucion con CD 5 + el dano recibido (a menos que el dano sea radiante o de un critico) para quedar en 1 punto de vida en su lugar.',
      },
    ],
    acciones: [{ nombre: 'Golpe', descripcion: 'Ataque con arma cuerpo a cuerpo: +3 a impactar, alcance 5 pies. Impacto: 4 (1d6+1) de dano contundente.' }],
  }),

  monstruoSRD({
    id: 'srd-ogro',
    nombre: 'Ogro',
    tamano: 'Grande',
    tipo: 'gigante',
    alineamiento: 'Caotico Malvado',
    clase_armadura: { valor: 11, notas: 'armadura de piel' },
    puntos_vida: { promedio: 59, formula: '7d10+21' },
    velocidad: { caminar: 40 },
    caracteristicas: { fue: 19, des: 8, con: 16, int: 5, sab: 7, car: 7 },
    sentidos: 'vision en la oscuridad 60 pies, percepcion pasiva 8',
    idiomas: 'comun, gigante',
    nivel_desafio: 2,
    px: 450,
    acciones: [
      { nombre: 'Maza Grande', descripcion: 'Ataque con arma cuerpo a cuerpo: +6 a impactar, alcance 5 pies. Impacto: 13 (2d8+4) de dano contundente.' },
      { nombre: 'Jabalina', descripcion: 'Ataque con arma cuerpo a cuerpo o a distancia: +6 a impactar, alcance 5 pies o 30/120 pies. Impacto: 11 (2d6+4) de dano perforante.' },
    ],
  }),

  monstruoSRD({
    id: 'srd-osgo',
    nombre: 'Osgo',
    tamano: 'Mediano',
    tipo: 'humanoide',
    subtipo: 'goblinoide',
    alineamiento: 'Legal Malvado',
    clase_armadura: { valor: 18, notas: 'cota de malla, escudo' },
    puntos_vida: { promedio: 11, formula: '2d8+2' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 13, des: 12, con: 12, int: 10, sab: 10, car: 9 },
    sentidos: 'vision en la oscuridad 60 pies, percepcion pasiva 10',
    idiomas: 'comun, goblin',
    nivel_desafio: 0.5,
    px: 100,
    habilidades_especiales: [
      {
        nombre: 'Ventaja Marcial',
        descripcion:
          'Una vez por turno, el osgo puede infligir 2d6 de dano adicional a una criatura si al menos un aliado esta a 5 pies de ella y el osgo no tiene desventaja en la tirada de ataque.',
      },
    ],
    acciones: [
      { nombre: 'Espada Larga', descripcion: 'Ataque con arma cuerpo a cuerpo: +3 a impactar, alcance 5 pies. Impacto: 5 (1d8+1) de dano cortante, o 6 (1d10+1) si se empuna a dos manos.' },
      { nombre: 'Arco Largo', descripcion: 'Ataque con arma a distancia: +3 a impactar, alcance 150/600 pies. Impacto: 5 (1d8+1) de dano perforante.' },
    ],
  }),

  // -- ANIMALES Y BESTIAS EXTRAS --
  monstruoSRD({
    id: 'srd-pantera',
    nombre: 'Pantera',
    tamano: 'Mediano',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 12, notas: null },
    puntos_vida: { promedio: 13, formula: '3d8' },
    velocidad: { caminar: 50, trepar: 40 },
    caracteristicas: { fue: 14, des: 15, con: 10, int: 3, sab: 14, car: 7 },
    habilidades: { sigilo: 6, percepcion: 4 },
    sentidos: 'percepcion pasiva 14',
    idiomas: '--',
    nivel_desafio: 0.25,
    px: 50,
    habilidades_especiales: [
      { nombre: 'Salto Abrazador', descripcion: 'Si la pantera se mueve al menos 20 pies en línea recta y ataca con su garra, la criatura debe superar una salvación de Fuerza CD 12 o quedar derribada.' }
    ],
    acciones: [
      { nombre: 'Mordisco', descripcion: 'Cuerpo a cuerpo: +4 a impactar. Impacto: 5 (1d6+2) de daño perforante.' },
      { nombre: 'Zarpazo', descripcion: 'Cuerpo a cuerpo: +4 a impactar. Impacto: 4 (1d4+2) de daño cortante.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-lobo-terrible',
    nombre: 'Lobo Terrible',
    tamano: 'Grande',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 14, notas: 'armadura natural' },
    puntos_vida: { promedio: 37, formula: '5d10+10' },
    velocidad: { caminar: 50 },
    caracteristicas: { fue: 17, des: 15, con: 15, int: 3, sab: 12, car: 7 },
    habilidades: { percepcion: 3, sigilo: 4 },
    sentidos: 'percepcion pasiva 13',
    idiomas: '--',
    nivel_desafio: 1,
    px: 200,
    habilidades_especiales: [
      { nombre: 'Tácticas de Manada', descripcion: 'El lobo tiene ventaja si al menos un aliado está a 5 pies del objetivo.' }
    ],
    acciones: [
      { nombre: 'Mordisco', descripcion: 'Cuerpo a cuerpo: +5 a impactar. Impacto: 10 (2d6+3) perforante. Salvación de Fue CD 13 o queda derribado.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-arana-gigante',
    nombre: 'Araña Gigante',
    tamano: 'Grande',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 14, notas: 'armadura natural' },
    puntos_vida: { promedio: 26, formula: '4d10+4' },
    velocidad: { caminar: 30, trepar: 30 },
    caracteristicas: { fue: 14, des: 16, con: 12, int: 2, sab: 11, car: 4 },
    habilidades: { sigilo: 7 },
    sentidos: 'vista ciega 10 pies, vision en la oscuridad 60 pies',
    idiomas: '--',
    nivel_desafio: 1,
    px: 200,
    habilidades_especiales: [
      { nombre: 'Trepar como Arácnido', descripcion: 'Puede trepar superficies difíciles, incluyendo techos, sin requerir pruebas de característica.' },
      { nombre: 'Sentir la Telaraña', descripcion: 'Mientras contacte con una telaraña, conoce la localización exacta de otras criaturas en ella.' }
    ],
    acciones: [
      { nombre: 'Mordisco', descripcion: 'Cuerpo a cuerpo: +5 a impactar. Impacto: 7 (1d8+3) de daño perforante, y el objetivo debe hacer salvación de Con CD 11, sufriendo 9 (2d8) daño de veneno si falla, o la mitad si supera.' },
      { nombre: 'Telaraña (Recarga 5-6)', descripcion: 'Ataque a distancia: +5 a impactar, rango 30/60. Impacto: La criatura queda apresada. Como acción puede escapar (Fuerza CD 12).' }
    ],
  }),
  monstruoSRD({
    id: 'srd-oso-polar',
    nombre: 'Oso Polar',
    tamano: 'Grande',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 12, notas: 'armadura natural' },
    puntos_vida: { promedio: 42, formula: '5d10+15' },
    velocidad: { caminar: 40, nadar: 30 },
    caracteristicas: { fue: 20, des: 10, con: 16, int: 2, sab: 13, car: 7 },
    habilidades: { percepcion: 3 },
    sentidos: 'percepcion pasiva 13',
    idiomas: '--',
    nivel_desafio: 2,
    px: 450,
    habilidades_especiales: [
      { nombre: 'Olfato Agudo', descripcion: 'Tiene ventaja en pruebas de Sabiduría (Percepción) basadas en el olfato.' }
    ],
    acciones: [
      { nombre: 'Multiataque', descripcion: 'Hace dos ataques: un mordisco y un zarpazo.' },
      { nombre: 'Mordisco', descripcion: '+7 impactar. Impacto: 9 (1d8+5) perforante.' },
      { nombre: 'Zarpazo', descripcion: '+7 impactar. Impacto: 12 (2d6+5) cortante.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-buho',
    nombre: 'Búho',
    tamano: 'Diminuto',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 11, notas: null },
    puntos_vida: { promedio: 1, formula: '1d4-1' },
    velocidad: { caminar: 5, volar: 60 },
    caracteristicas: { fue: 3, des: 13, con: 8, int: 2, sab: 12, car: 7 },
    habilidades: { percepcion: 3, sigilo: 3 },
    sentidos: 'vision en la oscuridad 120 pies',
    idiomas: '--',
    nivel_desafio: 0,
    px: 10,
    habilidades_especiales: [
      { nombre: 'Pasar Volando', descripcion: 'El búho no provoca ataques de oportunidad cuando sale del alcance de un enemigo volando.' }
    ],
    acciones: [
      { nombre: 'Garras', descripcion: 'Cuerpo a cuerpo: +3 impactar. Impacto: 1 cortante.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-aguila-gigante',
    nombre: 'Águila Gigante',
    tamano: 'Grande',
    tipo: 'bestia',
    alineamiento: 'Neutral Bueno',
    clase_armadura: { valor: 13, notas: null },
    puntos_vida: { promedio: 26, formula: '4d10+4' },
    velocidad: { caminar: 10, volar: 80 },
    caracteristicas: { fue: 16, des: 17, con: 13, int: 8, sab: 14, car: 10 },
    habilidades: { percepcion: 4 },
    sentidos: 'percepcion pasiva 14',
    idiomas: 'Águila Gigante, entiende común',
    nivel_desafio: 1,
    px: 200,
    acciones: [
      { nombre: 'Multiataque', descripcion: 'Hace dos ataques: un pico y unas garras.' },
      { nombre: 'Pico', descripcion: '+5 impactar. 6 (1d6+3) perforante.' },
      { nombre: 'Garras', descripcion: '+5 impactar. 10 (2d6+3) cortante.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-cocodrilo',
    nombre: 'Cocodrilo',
    tamano: 'Grande',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 12, notas: 'armadura natural' },
    puntos_vida: { promedio: 19, formula: '3d10+3' },
    velocidad: { caminar: 20, nadar: 30 },
    caracteristicas: { fue: 15, des: 10, con: 13, int: 2, sab: 10, car: 5 },
    habilidades: { sigilo: 2 },
    sentidos: 'percepcion pasiva 10',
    idiomas: '--',
    nivel_desafio: 0.5,
    px: 100,
    habilidades_especiales: [
      { nombre: 'Aguantar la respiración', descripcion: 'Puede aguantar la respiración hasta 15 minutos.' }
    ],
    acciones: [
      { nombre: 'Mordisco', descripcion: '+4 impactar. 7 (1d10+2) perforante, y el objetivo es apresado (Escape CD 12).' }
    ],
  }),

  // -- MONSTRUOS CLÁSICOS EXTRAS --
  monstruoSRD({
    id: 'srd-dragon-rojo-joven',
    nombre: 'Dragón Rojo Joven',
    tamano: 'Grande',
    tipo: 'dragón',
    alineamiento: 'Caótico Malvado',
    clase_armadura: { valor: 18, notas: 'armadura natural' },
    puntos_vida: { promedio: 178, formula: '17d10+85' },
    velocidad: { caminar: 40, trepar: 40, volar: 80 },
    caracteristicas: { fue: 23, des: 10, con: 21, int: 14, sab: 11, car: 19 },
    salvaciones: { des: 4, con: 9, sab: 4, car: 8 },
    habilidades: { percepcion: 8, sigilo: 4 },
    damage_immunities: ['fuego'],
    sentidos: 'vista ciega 30 pies, visión en la oscuridad 120 pies',
    idiomas: 'Común, Dracónico',
    nivel_desafio: 10,
    px: 5900,
    acciones: [
      { nombre: 'Multiataque', descripcion: 'Hace tres ataques: un mordisco y dos garras.' },
      { nombre: 'Mordisco', descripcion: '+10 impactar. 17 (2d10+6) perforante más 3 (1d6) fuego.' },
      { nombre: 'Garra', descripcion: '+10 impactar. 13 (2d6+6) cortante.' },
      { nombre: 'Aliento de Fuego (Recarga 5-6)', descripcion: 'Exhala fuego en un cono de 30 pies. Salvación de Des CD 17, 56 (16d6) daño de fuego si falla, la mitad si supera.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-elemental-fuego',
    nombre: 'Elemental de Fuego',
    tamano: 'Grande',
    tipo: 'elemental',
    alineamiento: 'Neutral',
    clase_armadura: { valor: 13, notas: null },
    puntos_vida: { promedio: 102, formula: '12d10+36' },
    velocidad: { caminar: 50 },
    caracteristicas: { fue: 10, des: 17, con: 16, int: 6, sab: 10, car: 7 },
    damage_resistances: ['contundente, perforante y cortante de ataques no mágicos'],
    damage_immunities: ['fuego', 'veneno'],
    condition_immunities: ['envenenado', 'exhausto', 'apresado', 'paralizado', 'petrificado', 'derribado', 'restringido', 'inconsciente'],
    sentidos: 'visión en la oscuridad 60 pies',
    idiomas: 'Ígneo',
    nivel_desafio: 5,
    px: 1800,
    habilidades_especiales: [
      { nombre: 'Forma de Fuego', descripcion: 'Puede moverse a través de espacios de 1 pulgada. Toca e incendia objetos inflamables. Toda criatura que lo toque recibe 5 (1d10) daño de fuego.' },
      { nombre: 'Iluminación', descripcion: 'Emite luz brillante en 30 pies y luz tenue 30 pies más.' }
    ],
    acciones: [
      { nombre: 'Multiataque', descripcion: 'Hace dos ataques de toque.' },
      { nombre: 'Toque', descripcion: '+6 impactar. 10 (2d6+3) fuego. Si es una criatura, se incendia y recibe 5 (1d10) de daño de fuego al inicio de cada uno de sus turnos.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-vampiro',
    nombre: 'Vampiro',
    tamano: 'Mediano',
    tipo: 'no-muerto',
    alineamiento: 'Legal Malvado',
    clase_armadura: { valor: 16, notas: 'armadura natural' },
    puntos_vida: { promedio: 144, formula: '17d8+68' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 18, des: 18, con: 18, int: 17, sab: 15, car: 18 },
    salvaciones: { des: 9, sab: 7, car: 9 },
    habilidades: { percepcion: 7, sigilo: 9 },
    damage_resistances: ['necrótico', 'contundente, perforante y cortante no mágico'],
    sentidos: 'visión en la oscuridad 120 pies',
    idiomas: 'los que conocía en vida',
    nivel_desafio: 13,
    px: 10000,
    habilidades_especiales: [
      { nombre: 'Regeneración', descripcion: 'Recupera 20 PV al inicio de su turno si tiene al menos 1 PV y no está expuesto a la luz solar ni en agua corriente.' },
      { nombre: 'Hipersensibilidad a la luz solar', descripcion: 'Recibe 20 daño radiante cuando inicia su turno a la luz del sol.' }
    ],
    acciones: [
      { nombre: 'Multiataque', descripcion: 'Hace dos ataques, de los cuales solo uno puede ser mordisco.' },
      { nombre: 'Golpe desarmado', descripcion: '+9 impactar. 8 (1d8+4) contundente. El objetivo es apresado (Escape CD 18).' },
      { nombre: 'Mordisco', descripcion: 'Ataque a criatura apresada. +9 impactar. 7 (1d6+4) perforante más 10 (3d6) necrótico. El vampiro se cura PV igual al daño necrótico causado.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-diablillo',
    nombre: 'Diablillo',
    tamano: 'Diminuto',
    tipo: 'infernal',
    alineamiento: 'Legal Malvado',
    clase_armadura: { valor: 13, notas: null },
    puntos_vida: { promedio: 10, formula: '3d4+3' },
    velocidad: { caminar: 20, volar: 40 },
    caracteristicas: { fue: 6, des: 17, con: 13, int: 11, sab: 12, car: 14 },
    habilidades: { engaño: 4, persuasión: 4, sigilo: 5 },
    damage_resistances: ['frío', 'contundente, perforante y cortante no mágico'],
    damage_immunities: ['fuego', 'veneno'],
    condition_immunities: ['envenenado'],
    sentidos: 'visión en la oscuridad 120 pies',
    idiomas: 'Infernal, Común',
    nivel_desafio: 1,
    px: 200,
    habilidades_especiales: [
      { nombre: 'Vista del diablo', descripcion: 'La oscuridad mágica no impide su visión.' },
      { nombre: 'Resistencia a la magia', descripcion: 'Ventaja en tiradas de salvación contra conjuros.' }
    ],
    acciones: [
      { nombre: 'Aguijón', descripcion: '+5 impactar. 5 (1d4+3) perforante, y el objetivo debe superar salvación Con CD 11 o sufrir 10 (3d6) daño de veneno.' },
      { nombre: 'Invisibilidad', descripcion: 'El diablillo se vuelve invisible hasta que ataque o suelte la concentración.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-minotauro',
    nombre: 'Minotauro',
    tamano: 'Grande',
    tipo: 'monstruosidad',
    alineamiento: 'Caótico Malvado',
    clase_armadura: { valor: 14, notas: 'armadura natural' },
    puntos_vida: { promedio: 76, formula: '9d10+27' },
    velocidad: { caminar: 40 },
    caracteristicas: { fue: 18, des: 11, con: 16, int: 6, sab: 16, car: 9 },
    habilidades: { percepcion: 7 },
    sentidos: 'visión en la oscuridad 60 pies',
    idiomas: 'Abismal',
    nivel_desafio: 3,
    px: 700,
    habilidades_especiales: [
      { nombre: 'Carga', descripcion: 'Si se mueve al menos 10 pies directo al objetivo y le impacta con los cuernos, hace 9 (2d8) daño perforante adicional, y el objetivo debe superar Fue CD 14 o ser empujado 10 pies.' },
      { nombre: 'Recuerdo Laberíntico', descripcion: 'El minotauro puede recordar perfectamente cualquier camino por el que ha transitado.' }
    ],
    acciones: [
      { nombre: 'Hacha Grande', descripcion: '+6 impactar. 17 (2d12+4) cortante.' },
      { nombre: 'Cuernos', descripcion: '+6 impactar. 13 (2d8+4) perforante.' }
    ],
  }),

  // -- FAMILIARES DE BRUJO Y MAGO --
  monstruoSRD({
    id: 'srd-quasit',
    nombre: 'Quasit',
    tamano: 'Diminuto',
    tipo: 'infernal',
    alineamiento: 'Caótico Malvado',
    clase_armadura: { valor: 13, notas: null },
    puntos_vida: { promedio: 7, formula: '3d4' },
    velocidad: { caminar: 40 },
    caracteristicas: { fue: 5, des: 17, con: 10, int: 7, sab: 10, car: 10 },
    habilidades: { sigilo: 5 },
    damage_resistances: ['frío', 'fuego', 'relámpago', 'contundente, perforante y cortante no mágico'],
    damage_immunities: ['veneno'],
    condition_immunities: ['envenenado'],
    sentidos: 'visión en la oscuridad 120 pies',
    idiomas: 'Abismal, Común',
    nivel_desafio: 1,
    px: 200,
    habilidades_especiales: [
      { nombre: 'Cambiaformas', descripcion: 'Puede polymorfarse mágicamente a forma de murciélago, ciempiés, sapo o a su forma original.' },
      { nombre: 'Resistencia a la magia', descripcion: 'Ventaja en tiradas de salvación contra conjuros.' }
    ],
    acciones: [
      { nombre: 'Garras', descripcion: '+4 impactar. 5 (1d4+3) perforante, y el objetivo debe superar salvación Con CD 10 o sufrir 5 (2d4) daño de veneno y quedar envenenado por 1 minuto.' },
      { nombre: 'Invisibilidad', descripcion: 'El quasit se vuelve invisible hasta que ataque o suelte la concentración.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-dragon-falso',
    nombre: 'Pseudodragón',
    tamano: 'Diminuto',
    tipo: 'dragón',
    alineamiento: 'Neutral Bueno',
    clase_armadura: { valor: 13, notas: 'armadura natural' },
    puntos_vida: { promedio: 7, formula: '2d4+2' },
    velocidad: { caminar: 15, volar: 60 },
    caracteristicas: { fue: 6, des: 15, con: 13, int: 10, sab: 12, car: 10 },
    habilidades: { percepcion: 3, sigilo: 4 },
    sentidos: 'vista ciega 10 pies, visión en la oscuridad 60 pies',
    idiomas: 'Entiende Común y Dracónico pero no los habla. Telepatía 100 pies.',
    nivel_desafio: 0.25,
    px: 50,
    habilidades_especiales: [
      { nombre: 'Sentidos Agudos', descripcion: 'Tiene ventaja en tiradas de Percepción basadas en vista, oído o vista.' },
      { nombre: 'Resistencia a la magia', descripcion: 'Ventaja en tiradas de salvación contra conjuros y otros efectos mágicos.' }
    ],
    acciones: [
      { nombre: 'Mordisco', descripcion: '+4 impactar. 4 (1d4+2) perforante.' },
      { nombre: 'Aguijón', descripcion: '+4 impactar. 4 (1d4+2) perforante, y el objetivo debe superar Con CD 11 o quedar envenenado 1 hora. Si falla por 5 o más, cae inconsciente.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-duendecillo',
    nombre: 'Duendecillo (Sprite)',
    tamano: 'Diminuto',
    tipo: 'feérico',
    alineamiento: 'Neutral Bueno',
    clase_armadura: { valor: 15, notas: 'armadura de cuero' },
    puntos_vida: { promedio: 2, formula: '1d4' },
    velocidad: { caminar: 10, volar: 40 },
    caracteristicas: { fue: 3, des: 18, con: 10, int: 14, sab: 13, car: 11 },
    habilidades: { percepcion: 3, sigilo: 8 },
    sentidos: 'visión pasiva 13',
    idiomas: 'Común, Élfico, Silvano',
    nivel_desafio: 0.25,
    px: 50,
    acciones: [
      { nombre: 'Espada Larga', descripcion: '+2 impactar. 1 cortante.' },
      { nombre: 'Arco Corto', descripcion: '+6 impactar. 1 perforante, y el objetivo debe superar Con CD 10 o quedar envenenado 1 minuto. Si falla por 5 o más, cae inconsciente.' },
      { nombre: 'Invisibilidad', descripcion: 'Se vuelve invisible hasta que ataque o lance un conjuro.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-buho',
    nombre: 'Búho',
    tamano: 'Diminuto',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 11, notas: null },
    puntos_vida: { promedio: 1, formula: '1d4-1' },
    velocidad: { caminar: 5, volar: 60 },
    caracteristicas: { fue: 3, des: 13, con: 8, int: 2, sab: 12, car: 7 },
    habilidades: { percepcion: 3, sigilo: 3 },
    sentidos: 'visión en la oscuridad 120 pies',
    idiomas: '--',
    nivel_desafio: 0,
    px: 10,
    habilidades_especiales: [
      { nombre: 'Vuelo Ágil', descripcion: 'El búho no provoca ataques de oportunidad cuando sale del alcance de un enemigo volando.' },
      { nombre: 'Vista y Oído Agudos', descripcion: 'Ventaja en tiradas de Percepción basadas en vista y oído.' }
    ],
    acciones: [
      { nombre: 'Garras', descripcion: '+3 impactar. 1 cortante.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-cuervo',
    nombre: 'Cuervo',
    tamano: 'Diminuto',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 12, notas: null },
    puntos_vida: { promedio: 1, formula: '1d4-1' },
    velocidad: { caminar: 10, volar: 50 },
    caracteristicas: { fue: 2, des: 14, con: 8, int: 2, sab: 12, car: 6 },
    habilidades: { percepcion: 3 },
    sentidos: 'visión pasiva 13',
    idiomas: '--',
    nivel_desafio: 0,
    px: 10,
    habilidades_especiales: [
      { nombre: 'Imitar', descripcion: 'Puede imitar sonidos simples (como una voz). Un espectador debe superar Sabiduría (Perspicacia) CD 10 para notar que es falso.' }
    ],
    acciones: [
      { nombre: 'Pico', descripcion: '+4 impactar. 1 perforante.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-gato',
    nombre: 'Gato',
    tamano: 'Diminuto',
    tipo: 'bestia',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 12, notas: null },
    puntos_vida: { promedio: 2, formula: '1d4' },
    velocidad: { caminar: 40, trepar: 30 },
    caracteristicas: { fue: 3, des: 15, con: 10, int: 3, sab: 12, car: 7 },
    habilidades: { percepcion: 3, sigilo: 4 },
    sentidos: 'visión pasiva 13',
    idiomas: '--',
    nivel_desafio: 0,
    px: 10,
    habilidades_especiales: [
      { nombre: 'Olfato Agudo', descripcion: 'Ventaja en tiradas de Percepción basadas en olfato.' }
    ],
    acciones: [
      { nombre: 'Garras', descripcion: '+0 impactar. 1 cortante.' }
    ],
  }),
  // -- MÁS MONSTRUOS CLÁSICOS --
  monstruoSRD({
    id: 'srd-goblin',
    nombre: 'Trasgo (Goblin)',
    tamano: 'Pequeño',
    tipo: 'humanoide',
    alineamiento: 'Neutral Malvado',
    clase_armadura: { valor: 15, notas: 'armadura de cuero, escudo' },
    puntos_vida: { promedio: 7, formula: '2d6' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 8, des: 14, con: 10, int: 10, sab: 8, car: 8 },
    habilidades: { sigilo: 6 },
    sentidos: 'visión en la oscuridad 60 pies',
    idiomas: 'Común, Goblin',
    nivel_desafio: 0.25,
    px: 50,
    habilidades_especiales: [
      { nombre: 'Escape Ágil', descripcion: 'El trasgo puede usar Destrabarse o Esconderse como acción adicional.' }
    ],
    acciones: [
      { nombre: 'Cimitarra', descripcion: '+4 impactar. 5 (1d6+2) cortante.' },
      { nombre: 'Arco Corto', descripcion: '+4 impactar. 5 (1d6+2) perforante. Alcance 80/320 pies.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-orco',
    nombre: 'Orco',
    tamano: 'Mediano',
    tipo: 'humanoide',
    alineamiento: 'Caótico Malvado',
    clase_armadura: { valor: 13, notas: 'armadura de pieles' },
    puntos_vida: { promedio: 15, formula: '2d8+6' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 16, des: 12, con: 16, int: 7, sab: 11, car: 10 },
    habilidades: { intimidacion: 2 },
    sentidos: 'visión en la oscuridad 60 pies',
    idiomas: 'Común, Orco',
    nivel_desafio: 0.5,
    px: 100,
    habilidades_especiales: [
      { nombre: 'Agresivo', descripcion: 'Como acción adicional, el orco puede moverse hasta su velocidad hacia una criatura hostil que pueda ver.' }
    ],
    acciones: [
      { nombre: 'Gran Hacha', descripcion: '+5 impactar. 9 (1d12+3) cortante.' },
      { nombre: 'Jabalina', descripcion: '+5 impactar. 6 (1d6+3) perforante. Alcance 30/120 pies.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-esqueleto',
    nombre: 'Esqueleto',
    tamano: 'Mediano',
    tipo: 'no-muerto',
    alineamiento: 'Legal Malvado',
    clase_armadura: { valor: 13, notas: 'restos de armadura' },
    puntos_vida: { promedio: 13, formula: '2d8+4' },
    velocidad: { caminar: 30 },
    caracteristicas: { fue: 10, des: 14, con: 15, int: 6, sab: 8, car: 5 },
    damage_vulnerabilities: ['contundente'],
    damage_immunities: ['veneno'],
    condition_immunities: ['envenenado', 'exhausto'],
    sentidos: 'visión en la oscuridad 60 pies',
    idiomas: 'entiende los idiomas que hablaba en vida pero no puede hablar',
    nivel_desafio: 0.25,
    px: 50,
    acciones: [
      { nombre: 'Espada Corta', descripcion: '+4 impactar. 5 (1d6+2) perforante.' },
      { nombre: 'Arco Corto', descripcion: '+4 impactar. 5 (1d6+2) perforante. Alcance 80/320 pies.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-oso-lechuza',
    nombre: 'Oso Lechuza',
    tamano: 'Grande',
    tipo: 'monstruosidad',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 13, notas: 'armadura natural' },
    puntos_vida: { promedio: 59, formula: '7d10+21' },
    velocidad: { caminar: 40 },
    caracteristicas: { fue: 20, des: 12, con: 17, int: 3, sab: 12, car: 7 },
    habilidades: { percepcion: 3 },
    sentidos: 'visión en la oscuridad 60 pies',
    idiomas: '--',
    nivel_desafio: 3,
    px: 700,
    habilidades_especiales: [
      { nombre: 'Vista y Olfato Agudos', descripcion: 'Ventaja en tiradas de Percepción basadas en vista y olfato.' }
    ],
    acciones: [
      { nombre: 'Multiataque', descripcion: 'Hace dos ataques: uno de pico y uno de garras.' },
      { nombre: 'Pico', descripcion: '+7 impactar. 10 (1d10+5) perforante.' },
      { nombre: 'Garras', descripcion: '+7 impactar. 14 (2d8+5) cortante.' }
    ],
  }),
  monstruoSRD({
    id: 'srd-cubo-gelatinoso',
    nombre: 'Cubo Gelatinoso',
    tamano: 'Grande',
    tipo: 'cieno',
    alineamiento: 'No alineado',
    clase_armadura: { valor: 6, notas: null },
    puntos_vida: { promedio: 84, formula: '8d10+40' },
    velocidad: { caminar: 15 },
    caracteristicas: { fue: 14, des: 3, con: 20, int: 1, sab: 6, car: 1 },
    condition_immunities: ['cegado', 'sordo', 'exhausto', 'derribado', 'asustado'],
    sentidos: 'vista ciega 60 pies (ciego más allá)',
    idiomas: '--',
    nivel_desafio: 2,
    px: 450,
    habilidades_especiales: [
      { nombre: 'Transparente', descripcion: 'Incluso a plena vista, requiere una tirada exitosa de Percepción CD 15 para verlo si no se ha movido o atacado. Una criatura que camine hacia él sin verlo resulta sorprendida.' }
    ],
    acciones: [
      { nombre: 'Pseudópodo', descripcion: '+4 impactar. 10 (3d6) daño de ácido.' },
      { nombre: 'Envolver', descripcion: 'El cubo se mueve hasta su velocidad en el espacio de una criatura Grande o menor. La criatura debe superar Des CD 12 o ser envuelta. Al ser envuelta recibe 10 (3d6) de daño por ácido y queda apresada (Escape CD 12) y restringida.' }
    ],
  })
];
