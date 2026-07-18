// ═══════════════════════════════════════════════════════════════════════════
// Opciones de equipo inicial por clase – SRD 5.1 en español
// Cada clase tiene un array de "elecciones". Cada elección es un grupo
// con un label y un array de opciones. El jugador elige una opción por grupo.
// ═══════════════════════════════════════════════════════════════════════════

export const EQUIPO_INICIAL = {
  barbaro: {
    nombre: 'Bárbaro',
    elecciones: [
      {
        label: 'Arma principal',
        opciones: [
          { nombre: 'Gran hacha', objetos: ['Gran hacha'] },
          { nombre: 'Cualquier arma marcial cuerpo a cuerpo', objetos: ['Espada larga'] },
        ],
      },
      {
        label: 'Arma secundaria',
        opciones: [
          { nombre: '2 hachas de mano', objetos: ['Hacha de mano', 'Hacha de mano'] },
          { nombre: 'Cualquier arma simple', objetos: ['Jabalina'] },
        ],
      },
    ],
    fijo: ['Paquete de Explorador', 'Jabalina', 'Jabalina', 'Jabalina', 'Jabalina'],
  },

  bardo: {
    nombre: 'Bardo',
    elecciones: [
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Estoque', objetos: ['Estoque'] },
          { nombre: 'Espada larga', objetos: ['Espada larga'] },
          { nombre: 'Cualquier arma simple', objetos: ['Daga'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Diplomático', objetos: ['Paquete de Diplomático'] },
          { nombre: 'Paquete de Artista', objetos: ['Paquete de Artista'] },
        ],
      },
      {
        label: 'Instrumento',
        opciones: [
          { nombre: 'Laúd', objetos: ['Laúd'] },
          { nombre: 'Cualquier instrumento musical', objetos: ['Flauta'] },
        ],
      },
    ],
    fijo: ['Armadura de cuero', 'Daga'],
  },

  brujo: {
    nombre: 'Brujo',
    elecciones: [
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Ballesta ligera y 20 virotes', objetos: ['Ballesta ligera', 'Virotes de ballesta (20)'] },
          { nombre: 'Cualquier arma simple', objetos: ['Daga'] },
        ],
      },
      {
        label: 'Foco',
        opciones: [
          { nombre: 'Bolsa de componentes', objetos: ['Bolsa de componentes'] },
          { nombre: 'Foco arcano', objetos: ['Orbe (foco arcano)'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Erudito', objetos: ['Paquete de Erudito'] },
          { nombre: 'Paquete de Dungeoneo', objetos: ['Paquete de Dungeoneo'] },
        ],
      },
    ],
    fijo: ['Armadura de cuero', 'Daga', 'Daga'],
  },

  clerigo: {
    nombre: 'Clérigo',
    elecciones: [
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Maza', objetos: ['Maza'] },
          { nombre: 'Martillo de guerra (si competente)', objetos: ['Martillo de guerra'] },
        ],
      },
      {
        label: 'Armadura',
        opciones: [
          { nombre: 'Cota de malla (camisa)', objetos: ['Cota de malla (camisa)'] },
          { nombre: 'Armadura de cuero', objetos: ['Armadura de cuero'] },
          { nombre: 'Cota de malla (si competente)', objetos: ['Cota de malla'] },
        ],
      },
      {
        label: 'Arma secundaria',
        opciones: [
          { nombre: 'Ballesta ligera y 20 virotes', objetos: ['Ballesta ligera', 'Virotes de ballesta (20)'] },
          { nombre: 'Cualquier arma simple', objetos: ['Maza'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Sacerdote', objetos: ['Paquete de Sacerdote'] },
          { nombre: 'Paquete de Explorador', objetos: ['Paquete de Explorador'] },
        ],
      },
    ],
    fijo: ['Escudo', 'Símbolo sagrado'],
  },

  druida: {
    nombre: 'Druida',
    elecciones: [
      {
        label: 'Arma / Escudo',
        opciones: [
          { nombre: 'Escudo de madera', objetos: ['Escudo'] },
          { nombre: 'Cualquier arma simple', objetos: ['Bastón'] },
        ],
      },
      {
        label: 'Arma secundaria',
        opciones: [
          { nombre: 'Cimitarra', objetos: ['Cimitarra'] },
          { nombre: 'Cualquier arma simple cuerpo a cuerpo', objetos: ['Clava'] },
        ],
      },
    ],
    fijo: ['Armadura de cuero', 'Paquete de Explorador', 'Foco druídico – Rama de muérdago'],
  },

  explorador: {
    nombre: 'Explorador',
    elecciones: [
      {
        label: 'Armadura',
        opciones: [
          { nombre: 'Cota de malla (camisa)', objetos: ['Cota de malla (camisa)'] },
          { nombre: 'Armadura de cuero', objetos: ['Armadura de cuero'] },
        ],
      },
      {
        label: 'Arma',
        opciones: [
          { nombre: '2 espadas cortas', objetos: ['Espada corta', 'Espada corta'] },
          { nombre: '2 armas simples cuerpo a cuerpo', objetos: ['Hacha de mano', 'Hacha de mano'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Dungeoneo', objetos: ['Paquete de Dungeoneo'] },
          { nombre: 'Paquete de Explorador', objetos: ['Paquete de Explorador'] },
        ],
      },
    ],
    fijo: ['Arco largo', 'Flechas (20)'],
  },

  guerrero: {
    nombre: 'Guerrero',
    elecciones: [
      {
        label: 'Armadura',
        opciones: [
          { nombre: 'Cota de malla', objetos: ['Cota de malla'] },
          { nombre: 'Armadura de cuero, arco largo y 20 flechas', objetos: ['Armadura de cuero', 'Arco largo', 'Flechas (20)'] },
        ],
      },
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Un arma marcial y un escudo', objetos: ['Espada larga', 'Escudo'] },
          { nombre: '2 armas marciales', objetos: ['Espada larga', 'Espada corta'] },
        ],
      },
      {
        label: 'Arma a distancia',
        opciones: [
          { nombre: 'Ballesta ligera y 20 virotes', objetos: ['Ballesta ligera', 'Virotes de ballesta (20)'] },
          { nombre: '2 hachas de mano', objetos: ['Hacha de mano', 'Hacha de mano'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Dungeoneo', objetos: ['Paquete de Dungeoneo'] },
          { nombre: 'Paquete de Explorador', objetos: ['Paquete de Explorador'] },
        ],
      },
    ],
    fijo: [],
  },

  hechicero: {
    nombre: 'Hechicero',
    elecciones: [
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Ballesta ligera y 20 virotes', objetos: ['Ballesta ligera', 'Virotes de ballesta (20)'] },
          { nombre: 'Cualquier arma simple', objetos: ['Bastón'] },
        ],
      },
      {
        label: 'Foco',
        opciones: [
          { nombre: 'Bolsa de componentes', objetos: ['Bolsa de componentes'] },
          { nombre: 'Foco arcano', objetos: ['Orbe (foco arcano)'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Dungeoneo', objetos: ['Paquete de Dungeoneo'] },
          { nombre: 'Paquete de Explorador', objetos: ['Paquete de Explorador'] },
        ],
      },
    ],
    fijo: ['Daga', 'Daga'],
  },

  mago: {
    nombre: 'Mago',
    elecciones: [
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Bastón', objetos: ['Bastón'] },
          { nombre: 'Daga', objetos: ['Daga'] },
        ],
      },
      {
        label: 'Foco',
        opciones: [
          { nombre: 'Bolsa de componentes', objetos: ['Bolsa de componentes'] },
          { nombre: 'Foco arcano', objetos: ['Orbe (foco arcano)'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Erudito', objetos: ['Paquete de Erudito'] },
          { nombre: 'Paquete de Explorador', objetos: ['Paquete de Explorador'] },
        ],
      },
    ],
    fijo: ['Libro de conjuros'],
  },

  monje: {
    nombre: 'Monje',
    elecciones: [
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Espada corta', objetos: ['Espada corta'] },
          { nombre: 'Cualquier arma simple', objetos: ['Bastón'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Dungeoneo', objetos: ['Paquete de Dungeoneo'] },
          { nombre: 'Paquete de Explorador', objetos: ['Paquete de Explorador'] },
        ],
      },
    ],
    fijo: ['Dardo', 'Dardo', 'Dardo', 'Dardo', 'Dardo', 'Dardo', 'Dardo', 'Dardo', 'Dardo', 'Dardo'],
  },

  paladin: {
    nombre: 'Paladín',
    elecciones: [
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Un arma marcial y un escudo', objetos: ['Espada larga', 'Escudo'] },
          { nombre: '2 armas marciales', objetos: ['Espada larga', 'Espada corta'] },
        ],
      },
      {
        label: 'Arma secundaria',
        opciones: [
          { nombre: '5 jabalinas', objetos: ['Jabalina', 'Jabalina', 'Jabalina', 'Jabalina', 'Jabalina'] },
          { nombre: 'Cualquier arma simple cuerpo a cuerpo', objetos: ['Maza'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Sacerdote', objetos: ['Paquete de Sacerdote'] },
          { nombre: 'Paquete de Explorador', objetos: ['Paquete de Explorador'] },
        ],
      },
    ],
    fijo: ['Cota de malla', 'Símbolo sagrado'],
  },

  picaro: {
    nombre: 'Pícaro',
    elecciones: [
      {
        label: 'Arma',
        opciones: [
          { nombre: 'Estoque', objetos: ['Estoque'] },
          { nombre: 'Espada corta', objetos: ['Espada corta'] },
        ],
      },
      {
        label: 'Arma a distancia',
        opciones: [
          { nombre: 'Arco corto y 20 flechas', objetos: ['Arco corto', 'Flechas (20)'] },
          { nombre: 'Espada corta', objetos: ['Espada corta'] },
        ],
      },
      {
        label: 'Paquete',
        opciones: [
          { nombre: 'Paquete de Burglar', objetos: ['Paquete de Burglar'] },
          { nombre: 'Paquete de Dungeoneo', objetos: ['Paquete de Dungeoneo'] },
          { nombre: 'Paquete de Explorador', objetos: ['Paquete de Explorador'] },
        ],
      },
    ],
    fijo: ['Armadura de cuero', 'Daga', 'Daga', 'Herramientas de ladrón'],
  },
};
