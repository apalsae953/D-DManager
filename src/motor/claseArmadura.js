import { TOPE_DESTREZA_ARMADURA } from './datos/tablasSRD.js';
import { modificadorCaracteristica, resolverValorCaracteristica } from './caracteristicas.js';

export function calcularClaseArmadura(personaje) {
  const ca = personaje.clase_armadura || {};

  if (ca.anulacion?.activada) {
    return { valor: ca.anulacion.valor, anulado: true, desglose: 'Valor manual' };
  }

  const modDes = modificadorCaracteristica(resolverValorCaracteristica(personaje.caracteristicas?.des));
  const modCon = modificadorCaracteristica(resolverValorCaracteristica(personaje.caracteristicas?.con));
  const modSab = modificadorCaracteristica(resolverValorCaracteristica(personaje.caracteristicas?.sab));

  const equipo = personaje.equipo || [];
  const equipado = equipo.filter(item => item.equipado);

  const armaduraCuerpo = equipado.find((item) => item.tipo === 'Armadura' && ['Ligera', 'Media', 'Pesada'].includes(item.subtipo));
  const escudo = equipado.find((item) => item.tipo === 'Armadura' && item.subtipo === 'Escudo');
  
  const bonoEscudo = escudo ? (escudo.ca_base || 2) : 0;

  if (armaduraCuerpo) {
    const tipoArmadura = armaduraCuerpo.subtipo.toLowerCase();
    const topeDes = TOPE_DESTREZA_ARMADURA[tipoArmadura];
    
    let bonoDes = modDes;
    if (topeDes === 0) {
      bonoDes = 0; // Armadura pesada ignora la Destreza, incluso si es negativa
    } else if (topeDes !== null) {
      bonoDes = Math.min(modDes, topeDes); // Armadura media tiene tope positivo
    }

    const caBase = armaduraCuerpo.ca_base || 10;
    
    return {
      valor: caBase + bonoDes + bonoEscudo,
      anulado: false,
      desglose: `${armaduraCuerpo.nombre} (${caBase}) + Des (${bonoDes}) + Escudo (${bonoEscudo})`,
    };
  }

  const clase = personaje.clase?.toLowerCase();

  if (clase === 'bárbaro' || clase === 'barbaro') {
    return {
      valor: 10 + modDes + modCon + bonoEscudo,
      anulado: false,
      desglose: `Defensa sin armadura (Bárbaro): 10 + Des (${modDes}) + Con (${modCon}) + Escudo (${bonoEscudo})`,
    };
  }

  if (clase === 'monje' && !escudo) {
    return {
      valor: 10 + modDes + modSab,
      anulado: false,
      desglose: `Defensa sin armadura (Monje): 10 + Des (${modDes}) + Sab (${modSab})`,
    };
  }

  return { 
    valor: 10 + modDes + bonoEscudo, 
    anulado: false, 
    desglose: `10 + Des (${modDes}) + Escudo (${bonoEscudo})` 
  };
}
