// Tablas de referencia para construccion de encuentros (guia del DM).
// Umbrales de PX por nivel de personaje: Facil, Medio, Dificil, Mortal.
// Indexado desde el nivel 1 (indice 0), igual que el resto de tablas del motor.
export const UMBRALES_PX_POR_NIVEL = [
  { facil: 25, medio: 50, dificil: 75, mortal: 100 },
  { facil: 50, medio: 100, dificil: 150, mortal: 200 },
  { facil: 75, medio: 150, dificil: 225, mortal: 400 },
  { facil: 125, medio: 250, dificil: 375, mortal: 500 },
  { facil: 250, medio: 500, dificil: 750, mortal: 1100 },
  { facil: 300, medio: 600, dificil: 900, mortal: 1400 },
  { facil: 350, medio: 750, dificil: 1100, mortal: 1700 },
  { facil: 450, medio: 900, dificil: 1400, mortal: 2100 },
  { facil: 550, medio: 1100, dificil: 1600, mortal: 2400 },
  { facil: 600, medio: 1200, dificil: 1900, mortal: 2800 },
  { facil: 800, medio: 1600, dificil: 2400, mortal: 3600 },
  { facil: 1000, medio: 2000, dificil: 3000, mortal: 4500 },
  { facil: 1100, medio: 2200, dificil: 3400, mortal: 5100 },
  { facil: 1250, medio: 2500, dificil: 3800, mortal: 5700 },
  { facil: 1400, medio: 2800, dificil: 4300, mortal: 6400 },
  { facil: 1600, medio: 3200, dificil: 4800, mortal: 7200 },
  { facil: 2000, medio: 3900, dificil: 5900, mortal: 8800 },
  { facil: 2100, medio: 4200, dificil: 6300, mortal: 9500 },
  { facil: 2400, medio: 4900, dificil: 7300, mortal: 10900 },
  { facil: 2800, medio: 5700, dificil: 8500, mortal: 12700 },
];

// Multiplicador de PX segun la cantidad de monstruos del encuentro.
export const MULTIPLICADORES_ENCUENTRO = [
  { maximo: 1, multiplicador: 1 },
  { maximo: 2, multiplicador: 1.5 },
  { maximo: 6, multiplicador: 2 },
  { maximo: 10, multiplicador: 2.5 },
  { maximo: 14, multiplicador: 3 },
  { maximo: Infinity, multiplicador: 4 },
];

// PX otorgados por Nivel de Desafio (ND). Usado por el creador de monstruos
// para autocompletar el campo PX al elegir un ND.
export const PX_POR_NIVEL_DESAFIO = {
  0: 10,
  0.125: 25,
  0.25: 50,
  0.5: 100,
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 8400,
  13: 10000,
  14: 11500,
  15: 13000,
  16: 15000,
  17: 18000,
  18: 20000,
  19: 22000,
  20: 25000,
  21: 33000,
  22: 41000,
  23: 50000,
  24: 62000,
};
