const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_BASE = 'https://raw.githubusercontent.com/Magical20-ai/5e-database-spanish/main/src';

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const mapHechizos = (data) => {
  return data.map(h => ({
    nombre: h.name,
    nivel: h.level,
    escuela: h.school?.name || 'desconocida',
    tiempo_lanzamiento: h.casting_time || '1 acción',
    alcance: h.range || 'Toque',
    componentes: h.components ? h.components.join(', ') : '',
    duracion: h.duration || 'Instantánea',
    clases: h.classes ? h.classes.map(c => c.name) : [],
    descripcion: h.desc ? h.desc.join('\n') : ''
  }));
};

const mapMonstruos = (data) => {
  return data.map(m => ({
    nombre: m.name,
    tipo: m.type || 'bestia',
    desafio: m.challenge_rating ? m.challenge_rating.toString() : '0',
    ca: m.armor_class ? m.armor_class[0]?.value : 10,
    pg: m.hit_points || 10,
    velocidad: m.speed ? Object.values(m.speed).join(', ') : '30 pies',
    fue: m.strength || 10,
    des: m.dexterity || 10,
    con: m.constitution || 10,
    int: m.intelligence || 10,
    sab: m.wisdom || 10,
    car: m.charisma || 10,
    descripcion: m.desc || `Un ${m.type || 'bestia'} de desafío ${m.challenge_rating || 0}.`
  }));
};

const mapEquipo = (data) => {
  return data.map(e => ({
    nombre: e.name,
    tipo: e.equipment_category?.name || 'Objeto General',
    coste: e.cost ? `${e.cost.quantity} ${e.cost.unit}` : '0 po',
    peso: e.weight ? `${e.weight} lb` : '0 lb',
    descripcion: e.desc ? e.desc.join('\n') : '',
    // Propiedades extra si es arma o armadura
    daño: e.damage ? `${e.damage.damage_dice} ${e.damage.damage_type?.name}` : undefined,
    ca_base: e.armor_class ? e.armor_class.base : undefined
  }));
};

async function main() {
  console.log('Descargando hechizos...');
  const hechizosData = await fetchJson(`${REPO_BASE}/5e-SRD-Spells.json`);
  const hechizos = mapHechizos(hechizosData);
  fs.writeFileSync(
    path.join(__dirname, '../src/datos/hechizos.js'),
    `export const HECHIZOS = ${JSON.stringify(hechizos, null, 2)};\n`
  );
  console.log(`Guardados ${hechizos.length} hechizos.`);

  console.log('Descargando monstruos...');
  const bestiarioData = await fetchJson(`${REPO_BASE}/5e-SRD-Monsters.json`);
  const bestiario = mapMonstruos(bestiarioData);
  fs.writeFileSync(
    path.join(__dirname, '../src/datos/bestiario.js'),
    `export const BESTIARIO = ${JSON.stringify(bestiario, null, 2)};\n`
  );
  console.log(`Guardados ${bestiario.length} monstruos.`);

  console.log('Descargando equipo...');
  const equipoData = await fetchJson(`${REPO_BASE}/5e-SRD-Equipment.json`);
  const equipo = mapEquipo(equipoData);
  fs.writeFileSync(
    path.join(__dirname, '../src/datos/equipo.js'),
    `export const EQUIPO = ${JSON.stringify(equipo, null, 2)};\n`
  );
  console.log(`Guardados ${equipo.length} objetos de equipo.`);

  console.log('¡Extracción completada con éxito!');
}

main().catch(console.error);
