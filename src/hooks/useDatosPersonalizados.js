import { useCallback, useEffect, useMemo, useState } from 'react';
import { RAZAS, CLASES, TRASFONDOS } from '../datos/datosCreacion.js';

const CLAVE_STORAGE = 'dnd_datos_personalizados';

function cargarInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    const datos = guardado ? JSON.parse(guardado) : {};
    return { razas: [], clases: [], trasfondos: [], subrazasExtra: {}, ...datos };
  } catch {
    return { razas: [], clases: [], trasfondos: [], subrazasExtra: {} };
  }
}

// La ficha del personaje guarda raza/clase como su `nombre` tal cual (no un
// id aparte) y los busca en el catalogo comparando en minusculas, asi que la
// clave de una entrada personalizada debe ser esa misma normalizacion para
// que la busqueda siga encontrandola despues de crear el personaje.
function normalizarClave(nombre) {
  return nombre.trim().toLowerCase();
}

// Combina el catalogo SRD (datosCreacion.js) con las razas, subrazas, clases
// y trasfondos que el jugador crea en el asistente de personajes, y permite
// editarlos/eliminarlos (solo los personalizados; el SRD es de solo lectura).
// Se persisten en localStorage con el mismo patron que useBestiario.js;
// llevarlos a Supabase mas adelante seria extender solo estos metodos.
export function useDatosPersonalizados() {
  const [personalizados, setPersonalizados] = useState(cargarInicial);

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(personalizados));
  }, [personalizados]);

  const razas = useMemo(() => {
    const srd = RAZAS.map((raza) => {
      const extra = personalizados.subrazasExtra[raza.clave] || [];
      return {
        ...raza,
        personalizada: false,
        subrazas: extra.length ? [...raza.subrazas, ...extra] : raza.subrazas,
        subrazasPersonalizadas: extra,
      };
    });
    const propias = personalizados.razas.map((raza) => ({
      ...raza,
      personalizada: true,
      subrazasPersonalizadas: raza.subrazas,
    }));
    return [...srd, ...propias];
  }, [personalizados.razas, personalizados.subrazasExtra]);

  const clases = useMemo(
    () => [
      ...CLASES.map((clase) => ({ ...clase, personalizada: false })),
      ...personalizados.clases.map((clase) => ({ ...clase, personalizada: true })),
    ],
    [personalizados.clases]
  );

  const trasfondos = useMemo(() => [...TRASFONDOS, ...personalizados.trasfondos], [personalizados.trasfondos]);
  const esTrasfondoPersonalizado = useCallback((nombre) => personalizados.trasfondos.includes(nombre), [personalizados.trasfondos]);

  const crearRaza = useCallback((nombre, subrazas = []) => {
    const raza = { clave: normalizarClave(nombre), nombre, subrazas };
    setPersonalizados((anterior) => ({ ...anterior, razas: [...anterior.razas, raza] }));
    return raza;
  }, []);

  const editarRaza = useCallback((claveOriginal, { nombre, subrazas }) => {
    let razaActualizada = null;
    setPersonalizados((anterior) => ({
      ...anterior,
      razas: anterior.razas.map((r) => {
        if (r.clave !== claveOriginal) return r;
        razaActualizada = { ...r, nombre, subrazas, clave: normalizarClave(nombre) };
        return razaActualizada;
      }),
    }));
    return razaActualizada;
  }, []);

  const eliminarRaza = useCallback((clave) => {
    setPersonalizados((anterior) => ({ ...anterior, razas: anterior.razas.filter((r) => r.clave !== clave) }));
  }, []);

  const agregarSubraza = useCallback((claveRaza, nombreSubraza) => {
    setPersonalizados((anterior) => {
      const esRazaPersonalizada = anterior.razas.some((r) => r.clave === claveRaza);
      if (esRazaPersonalizada) {
        return {
          ...anterior,
          razas: anterior.razas.map((r) => (r.clave === claveRaza ? { ...r, subrazas: [...r.subrazas, nombreSubraza] } : r)),
        };
      }
      const previas = anterior.subrazasExtra[claveRaza] || [];
      return { ...anterior, subrazasExtra: { ...anterior.subrazasExtra, [claveRaza]: [...previas, nombreSubraza] } };
    });
  }, []);

  const editarSubraza = useCallback((claveRaza, nombreAnterior, nombreNuevo) => {
    setPersonalizados((anterior) => {
      const esRazaPersonalizada = anterior.razas.some((r) => r.clave === claveRaza);
      if (esRazaPersonalizada) {
        return {
          ...anterior,
          razas: anterior.razas.map((r) =>
            r.clave === claveRaza ? { ...r, subrazas: r.subrazas.map((s) => (s === nombreAnterior ? nombreNuevo : s)) } : r
          ),
        };
      }
      const previas = anterior.subrazasExtra[claveRaza] || [];
      if (!previas.includes(nombreAnterior)) return anterior;
      return {
        ...anterior,
        subrazasExtra: { ...anterior.subrazasExtra, [claveRaza]: previas.map((s) => (s === nombreAnterior ? nombreNuevo : s)) },
      };
    });
  }, []);

  const eliminarSubraza = useCallback((claveRaza, nombreSubraza) => {
    setPersonalizados((anterior) => {
      const esRazaPersonalizada = anterior.razas.some((r) => r.clave === claveRaza);
      if (esRazaPersonalizada) {
        return {
          ...anterior,
          razas: anterior.razas.map((r) => (r.clave === claveRaza ? { ...r, subrazas: r.subrazas.filter((s) => s !== nombreSubraza) } : r)),
        };
      }
      const previas = anterior.subrazasExtra[claveRaza] || [];
      return { ...anterior, subrazasExtra: { ...anterior.subrazasExtra, [claveRaza]: previas.filter((s) => s !== nombreSubraza) } };
    });
  }, []);

  const crearClase = useCallback((nombre, dadoGolpe = 8) => {
    const clase = {
      clave: normalizarClave(nombre),
      nombre,
      dadoGolpe,
      lanzador: 'ninguno',
      nivelSubclase: 21,
      nombreSubclase: 'Especialización',
      subclases: [],
    };
    setPersonalizados((anterior) => ({ ...anterior, clases: [...anterior.clases, clase] }));
    return clase;
  }, []);

  const editarClase = useCallback((claveOriginal, { nombre, dadoGolpe }) => {
    let claseActualizada = null;
    setPersonalizados((anterior) => ({
      ...anterior,
      clases: anterior.clases.map((c) => {
        if (c.clave !== claveOriginal) return c;
        claseActualizada = { ...c, nombre, dadoGolpe, clave: normalizarClave(nombre) };
        return claseActualizada;
      }),
    }));
    return claseActualizada;
  }, []);

  const eliminarClase = useCallback((clave) => {
    setPersonalizados((anterior) => ({ ...anterior, clases: anterior.clases.filter((c) => c.clave !== clave) }));
  }, []);

  const crearTrasfondo = useCallback((nombre) => {
    setPersonalizados((anterior) => ({ ...anterior, trasfondos: [...anterior.trasfondos, nombre] }));
    return nombre;
  }, []);

  const editarTrasfondo = useCallback((nombreAnterior, nombreNuevo) => {
    setPersonalizados((anterior) => ({
      ...anterior,
      trasfondos: anterior.trasfondos.map((t) => (t === nombreAnterior ? nombreNuevo : t)),
    }));
  }, []);

  const eliminarTrasfondo = useCallback((nombre) => {
    setPersonalizados((anterior) => ({ ...anterior, trasfondos: anterior.trasfondos.filter((t) => t !== nombre) }));
  }, []);

  return {
    razas,
    clases,
    trasfondos,
    esTrasfondoPersonalizado,
    crearRaza,
    editarRaza,
    eliminarRaza,
    agregarSubraza,
    editarSubraza,
    eliminarSubraza,
    crearClase,
    editarClase,
    eliminarClase,
    crearTrasfondo,
    editarTrasfondo,
    eliminarTrasfondo,
  };
}
