import { useState } from 'react';
import { Search, Plus, Trash2, Book, Zap, PawPrint, Shield, Heart, Filter, ChevronDown } from 'lucide-react';
import { HECHIZOS } from '../../datos/hechizos.js';
import { MONSTRUOS_SRD } from '../../datos/monstruosSRD.js';

// Atributo mágico por clase según SRD 5.1
const ATRIBUTO_MAGICO_POR_CLASE = {
  mago: 'int',
  brujo: 'car',
  hechicero: 'car',
  bardo: 'car',
  paladin: 'car',
  clerigo: 'sab',
  druida: 'sab',
  explorador: 'sab',
  monje: 'sab',     // Ki usa SAB
  guerrero: 'int',  // Caballero Arcano usa INT
  picaro: 'int',    // Pícaro Arcano usa INT
  barbaro: null,
};

const NOMBRE_ATRIBUTO = {
  int: 'Inteligencia',
  sab: 'Sabiduría',
  car: 'Carisma',
};

// Nombre de clase normalizado para buscar en el campo "clases" de los hechizos
const NOMBRE_CLASE_HECHIZO = {
  mago: 'Mago',
  brujo: 'Brujo',
  hechicero: 'Hechicero',
  bardo: 'Bardo',
  paladin: 'Paladín',
  clerigo: 'Clérigo',
  druida: 'Druida',
  explorador: 'Explorador',
};

// Trucos conocidos por nivel por clase (SRD 5.1)
const TRUCOS_CONOCIDOS = {
  bardo:     [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  clerigo:   [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
  druida:    [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  hechicero: [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],
  mago:      [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
  brujo:     [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
};

// Conjuros conocidos por nivel por clase (para clases que conocen, no preparan)
const CONJUROS_CONOCIDOS = {
  bardo:     [4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22],
  hechicero: [2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],
  brujo:     [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
  explorador:[0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11],
};

export function PanelConjuros({ personaje, derivado, actualizarCampo }) {
  const [busqueda, setBusqueda] = useState('');
  const [viendoFormaSalvaje, setViendoFormaSalvaje] = useState(false);
  const [viendoFamiliares, setViendoFamiliares] = useState(false);
  const [filtroNivel, setFiltroNivel] = useState('todos');
  const [soloMiClase, setSoloMiClase] = useState(true);
  const [creadorAbierto, setCreadorAbierto] = useState(false);
  const [conjuroEditando, setConjuroEditando] = useState(null);

  const guardarConjuroPersonalizado = (nuevo) => {
    if (conjuroEditando) {
      actualizarCampo('hechizos', hechizosConocidos.map(h => h.nombre === conjuroEditando.nombre ? { ...nuevo, preparado: h.preparado } : h));
    } else {
      añadirHechizo({ ...nuevo, esPersonalizado: true });
    }
    setCreadorAbierto(false);
    setConjuroEditando(null);
  };
  
  const { espacios, espaciosPacto } = derivado.espaciosConjuro;
  const espaciosActuales = personaje.espacios_actuales || [...espacios];
  const hechizosConocidos = personaje.hechizos || [];
  const claseNorm = personaje.clase?.toLowerCase() || '';
  const nivel = personaje.nivel || 1;

  // Atributo mágico correcto según la clase
  const atributoMagicoClave = ATRIBUTO_MAGICO_POR_CLASE[claseNorm] || 'car';
  const mods = derivado.modificadoresCaracteristicas || { fue: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 };
  const modMagico = atributoMagicoClave ? mods[atributoMagicoClave] : 0;
  const nombreAtributo = NOMBRE_ATRIBUTO[atributoMagicoClave] || '—';
  
  const bonoAtaque = derivado.bonoCompetencia.valor + modMagico;
  const cdSalvacion = 8 + derivado.bonoCompetencia.valor + modMagico;

  // Nombre de clase para filtrar en el campo "clases" de los hechizos
  const nombreClaseHechizo = NOMBRE_CLASE_HECHIZO[claseNorm] || '';

  // Límites de trucos/conjuros conocidos
  const maxTrucos = TRUCOS_CONOCIDOS[claseNorm]?.[nivel - 1] ?? null;
  const maxConjuros = CONJUROS_CONOCIDOS[claseNorm]?.[nivel - 1] ?? null;
  const trucosActuales = hechizosConocidos.filter(h => h.nivel === 0).length;
  const conjurosActuales = hechizosConocidos.filter(h => h.nivel > 0).length;

  // Tipo de lanzador para saber si prepara o conoce
  const esPreparador = ['clerigo', 'druida', 'mago', 'paladin'].includes(claseNorm);

  // Max conjuros preparables para clases preparadoras
  const maxPreparables = esPreparador ? Math.max(1, modMagico + (claseNorm === 'paladin' ? Math.floor(nivel / 2) : nivel)) : null;

  // Filtrar hechizos del buscador
  const hechizosFiltrados = HECHIZOS.filter(h => {
    const textoOK = busqueda === '' ||
      h.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      (h.escuela && h.escuela.toLowerCase().includes(busqueda.toLowerCase()));
    const claseOK = !soloMiClase || !nombreClaseHechizo || 
      (h.clases && h.clases.some(c => c.toLowerCase() === nombreClaseHechizo.toLowerCase()));
    const nivelOK = filtroNivel === 'todos' || h.nivel === Number(filtroNivel);
    return textoOK && claseOK && nivelOK;
  }).slice(0, 40);

  const añadirHechizo = (hechizo) => {
    if (!hechizosConocidos.find(h => h.nombre === hechizo.nombre)) {
      actualizarCampo?.('hechizos', [...hechizosConocidos, { ...hechizo, preparado: false }]);
    }
  };

  const eliminarHechizo = (nombre) => {
    actualizarCampo?.('hechizos', hechizosConocidos.filter(h => h.nombre !== nombre));
  };

  const actualizarHechizo = (nombre, campos) => {
    actualizarCampo('hechizos', hechizosConocidos.map(h => h.nombre === nombre ? { ...h, ...campos } : h));
  };

  // Agrupar conjuros por nivel
  const conjurosPorNivel = {};
  for (let i = 0; i <= 9; i++) conjurosPorNivel[i] = [];
  hechizosConocidos.forEach(h => {
    const nv = h.nivel || 0;
    if (conjurosPorNivel[nv]) conjurosPorNivel[nv].push(h);
  });

  const cambiarEspacio = (nivel, delta) => {
    const nuevos = [...espaciosActuales];
    nuevos[nivel] = Math.max(0, Math.min(espacios[nivel], (nuevos[nivel] || 0) + delta));
    actualizarCampo('espacios_actuales', nuevos);
  };

  // Determinar el nivel máximo de conjuros que el personaje puede lanzar
  const nivelMaxConjuro = espacios.reduce((max, val, idx) => val > 0 ? idx + 1 : max, 0);
  // Para brujo usar nivel de espacio de pacto
  const nivelMaxBrujo = espaciosPacto?.nivelEspacio || 0;
  const nivelMaxReal = claseNorm === 'brujo' ? Math.max(nivelMaxConjuro, nivelMaxBrujo) : nivelMaxConjuro;

  // Texto explicativo según tipo de clase
  const textoTipo = esPreparador 
    ? `Puedes preparar hasta ${maxPreparables} conjuros de cualquier nivel al que tengas acceso. Los trucos no cuentan como preparados.`
    : maxConjuros !== null 
      ? `Conoces ${maxConjuros} conjuros en total. Puedes elegirlos de cualquier nivel al que tengas acceso (hasta nivel ${nivelMaxReal}).`
      : null;

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in">
      <div className="flex-1 space-y-6">
        
        {/* Cabecera */}
        <div>
          <div className="flex flex-wrap items-center justify-between border-b-2 border-sangre-800/50 pb-2 mb-4 gap-2">
            <h2 className="text-2xl font-cinzel text-sangre-100">Conjuros de {personaje.clase || 'Clase'}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => { setConjuroEditando(null); setCreadorAbierto(true); }}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-indigo-400 bg-dndoscuro-400/50 hover:bg-dndoscuro-300 border border-white/10 rounded-lg px-2.5 py-1.5 transition-all uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" /> Crear Conjuro
              </button>
              {claseNorm === 'brujo' && (
                <button 
                  onClick={() => { setViendoFamiliares(!viendoFamiliares); setViendoFormaSalvaje(false); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${viendoFamiliares ? 'bg-purple-700 text-white shadow-neon' : 'bg-dndoscuro-400 text-purple-400 border border-purple-500/30 hover:bg-white/10'}`}
                >
                  <Book className="w-4 h-4" /> Familiares
                </button>
              )}
              {claseNorm === 'druida' && (
                <button 
                  onClick={() => { setViendoFormaSalvaje(!viendoFormaSalvaje); setViendoFamiliares(false); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${viendoFormaSalvaje ? 'bg-emerald-700 text-white shadow-neon' : 'bg-dndoscuro-400 text-emerald-500 border border-emerald-500/30 hover:bg-white/10'}`}
                >
                  <PawPrint className="w-4 h-4" /> Forma Salvaje
                </button>
              )}
            </div>
          </div>

          {/* Estadísticas mágicas */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col bg-dndoscuro-400/30 rounded-md border border-white/5">
              <div className="text-[10px] text-center uppercase tracking-wider text-stone-400 bg-dndoscuro-400/50 p-1 border-b border-white/5">Atributo Mágico</div>
              <div className="flex-1 flex items-center justify-center p-2 text-xl font-bold text-stone-200 bg-white/5">{nombreAtributo}</div>
            </div>
            <div className="flex flex-col bg-dndoscuro-400/30 rounded-md border border-white/5">
              <div className="text-[10px] text-center uppercase tracking-wider text-stone-400 bg-dndoscuro-400/50 p-1 border-b border-white/5">CD Salvación</div>
              <div className="flex-1 flex items-center justify-center p-2 text-xl font-bold text-stone-200 bg-white/5">{cdSalvacion}</div>
            </div>
            <div className="flex flex-col bg-dndoscuro-400/30 rounded-md border border-white/5">
              <div className="text-[10px] text-center uppercase tracking-wider text-stone-400 bg-dndoscuro-400/50 p-1 border-b border-white/5">Bono Ataque</div>
              <div className="flex-1 flex items-center justify-center p-2 text-xl font-bold text-stone-200 bg-white/5">{bonoAtaque >= 0 ? `+${bonoAtaque}` : bonoAtaque}</div>
            </div>
          </div>

          {/* Resumen de Conjuros — Tabla visual por nivel */}
          <div className="bg-dndoscuro-400/30 rounded-lg border border-white/5 overflow-hidden mb-2">
            <div className="bg-dndoscuro-400/50 px-3 py-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider">Resumen de Conjuros — Nivel {nivel}</h3>
            </div>
            <div className="p-3 space-y-3">
              {/* Trucos */}
              {maxTrucos !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-stone-300 font-bold">Trucos conocidos</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${trucosActuales > maxTrucos ? 'text-sangre-400' : trucosActuales === maxTrucos ? 'text-emerald-400' : 'text-stone-200'}`}>
                    <span className="text-lg">{trucosActuales}</span>
                    <span className="text-stone-500 font-normal">/ {maxTrucos}</span>
                  </div>
                </div>
              )}

              {/* Conjuros conocidos o preparados */}
              {(maxConjuros !== null || esPreparador) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-stone-300 font-bold">
                      {esPreparador ? 'Conjuros preparables' : 'Conjuros conocidos'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${
                    conjurosActuales > (esPreparador ? maxPreparables : maxConjuros) 
                      ? 'text-sangre-400' 
                      : conjurosActuales === (esPreparador ? maxPreparables : maxConjuros)
                        ? 'text-emerald-400' 
                        : 'text-stone-200'
                  }`}>
                    <span className="text-lg">{conjurosActuales}</span>
                    <span className="text-stone-500 font-normal">/ {esPreparador ? maxPreparables : maxConjuros}</span>
                  </div>
                </div>
              )}

              {/* Nivel máximo accesible */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-stone-300 font-bold">Nivel máx. de conjuro</span>
                </div>
                <span className="text-lg font-bold text-stone-200">{nivelMaxReal || '—'}</span>
              </div>

              {/* Tabla de espacios por nivel */}
              {(espacios.some(s => s > 0) || espaciosPacto) && (
                <div className="mt-2 pt-3 border-t border-white/5">
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold mb-2">Espacios de conjuro por nivel</div>
                  <div className="grid grid-cols-9 gap-1">
                    {[1,2,3,4,5,6,7,8,9].map(nv => {
                      const slotsMax = espacios[nv - 1] || 0;
                      const slotsAct = espaciosActuales[nv - 1] !== undefined ? espaciosActuales[nv - 1] : slotsMax;
                      const esNivelPacto = espaciosPacto && espaciosPacto.nivelEspacio === nv;
                      const maxMostrar = slotsMax > 0 ? slotsMax : (esNivelPacto ? espaciosPacto.espacios : 0);
                      const actMostrar = slotsMax > 0 ? slotsAct : (esNivelPacto ? (espaciosActuales[nv-1] ?? espaciosPacto.espacios) : 0);
                      const tieneEspacios = maxMostrar > 0;
                      const tienConjuros = conjurosPorNivel[nv]?.length > 0;
                      
                      return (
                        <div key={nv} className={`flex flex-col items-center rounded p-1 border ${tieneEspacios ? 'border-white/10 bg-white/5' : 'border-white/5 bg-transparent opacity-40'}`}>
                          <div className="text-[9px] text-stone-500 font-bold">Nv.{nv}</div>
                          {tieneEspacios ? (
                            <>
                              <div className={`text-sm font-bold ${actMostrar === 0 ? 'text-sangre-400' : 'text-amber-400'}`}>{actMostrar}</div>
                              <div className="text-[8px] text-stone-500">/{maxMostrar}</div>
                            </>
                          ) : (
                            <div className="text-sm font-bold text-stone-600">—</div>
                          )}
                          {tienConjuros && (
                            <div className="text-[8px] text-indigo-400 mt-0.5">{conjurosPorNivel[nv].length} conj.</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Texto explicativo */}
              {textoTipo && (
                <p className="text-[11px] text-stone-500 italic mt-2 pt-2 border-t border-white/5">
                  {textoTipo}
                </p>
              )}
            </div>
          </div>
        </div>

        {viendoFormaSalvaje ? (
          <ListaFormaSalvaje />
        ) : viendoFamiliares ? (
          <ListaFamiliares />
        ) : (
          <>
            {hechizosConocidos.length === 0 ? (
              <p className="text-stone-500 text-sm italic p-4 text-center border border-dashed border-white/10 rounded-lg">No conoces ningún conjuro aún. Busca hechizos de {personaje.clase || 'tu clase'} en el buscador.</p>
            ) : (
              <div className="space-y-6">
                {/* Trucos (Nivel 0) */}
                {conjurosPorNivel[0].length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-cinzel text-sangre-200 border-b border-sangre-800/30 pb-1 flex justify-between">
                      Trucos (Cantrips)
                    </h3>
                    <div className="divide-y divide-white/5 bg-dndoscuro-400/30 rounded-lg border border-white/5">
                      {conjurosPorNivel[0].map(h => (
                        <HechizoItem 
                          key={h.nombre} 
                          h={h} 
                          accion={{ 
                            tipo: 'eliminar', 
                            handler: () => eliminarHechizo(h.nombre),
                            editarHandler: () => { setConjuroEditando(h); setCreadorAbierto(true); } 
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Niveles 1 al 9 */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(nv => {
                  if (conjurosPorNivel[nv].length === 0) return null;
                  const slotsMaximos = espacios[nv - 1] || 0;
                  const slotsDisponibles = espaciosActuales[nv - 1] !== undefined ? espaciosActuales[nv - 1] : slotsMaximos;
                  
                  const esNivelPacto = espaciosPacto && espaciosPacto.nivelEspacio === nv;
                  const maximoMostrar = slotsMaximos > 0 ? slotsMaximos : (esNivelPacto ? espaciosPacto.espacios : 0);
                  const actualMostrar = slotsMaximos > 0 ? slotsDisponibles : (esNivelPacto ? (espaciosActuales[nv-1] ?? espaciosPacto.espacios) : 0);

                  return (
                    <div key={nv} className="space-y-2">
                      <div className="flex justify-between items-end border-b border-sangre-800/30 pb-1">
                        <h3 className="text-xl font-cinzel text-sangre-200">
                          Nivel {nv}
                          {nv > nivelMaxConjuro && nivelMaxConjuro > 0 && (
                            <span className="text-xs text-amber-500 ml-2 font-sans">(por encima de tu nivel)</span>
                          )}
                        </h3>
                        {maximoMostrar > 0 && (
                          <div className="flex items-center gap-2 text-sm text-stone-400">
                            <span>Espacios:</span>
                            <div className="flex items-center gap-1 bg-dndoscuro-300 rounded border border-white/10 px-1">
                               <button onClick={() => cambiarEspacio(nv-1, -1)} className="hover:text-white px-1">-</button>
                               <span className="font-bold text-sangre-400 min-w-[20px] text-center">{actualMostrar}</span>
                               <span className="text-stone-500">/ {maximoMostrar}</span>
                               <button onClick={() => cambiarEspacio(nv-1, 1)} className="hover:text-white px-1">+</button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase font-bold tracking-wider px-2 pt-1">
                        <span className="w-8 text-center">Prep</span>
                        <span>Nombre</span>
                      </div>
                      
                      <div className="divide-y divide-white/5 bg-dndoscuro-400/30 rounded-lg border border-white/5">
                        {conjurosPorNivel[nv].map(h => (
                          <HechizoItem 
                            key={h.nombre} 
                            h={h} 
                            accion={{ 
                              tipo: 'eliminar', 
                              handler: () => eliminarHechizo(h.nombre),
                              editarHandler: () => { setConjuroEditando(h); setCreadorAbierto(true); }
                            }} 
                            onActualizar={(campos) => actualizarHechizo(h.nombre, campos)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Creador Conjuros */}
      {creadorAbierto && (
        <ModalCreadorConjuro 
          alCerrar={() => setCreadorAbierto(false)} 
          alGuardar={guardarConjuroPersonalizado} 
          conjuroInicial={conjuroEditando}
        />
      )}

      {/* Buscador lateral */}
      <BuscadorConjuros 
        busqueda={busqueda} 
        setBusqueda={setBusqueda} 
        filtrados={hechizosFiltrados} 
        añadir={añadirHechizo}
        filtroNivel={filtroNivel}
        setFiltroNivel={setFiltroNivel}
        soloMiClase={soloMiClase}
        setSoloMiClase={setSoloMiClase}
        nombreClase={personaje.clase || ''}
        nivelMaxConjuro={nivelMaxConjuro}
      />
    </div>
  );
}

function BuscadorConjuros({ busqueda, setBusqueda, filtrados, añadir, filtroNivel, setFiltroNivel, soloMiClase, setSoloMiClase, nombreClase, nivelMaxConjuro }) {
  return (
    <div className="w-full md:w-1/3 flex flex-col h-[600px] bg-dndoscuro-300/30 rounded-xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-dndoscuro-400/50 space-y-3">
        <h3 className="font-cinzel text-stone-200 flex items-center gap-2">
          <Search className="w-4 h-4" /> Grimorio
        </h3>
        <input 
          type="text" 
          placeholder="Bola de fuego, curar..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-dnd text-sm py-2"
        />
        <div className="flex gap-2 items-center">
          <select 
            value={filtroNivel} 
            onChange={e => setFiltroNivel(e.target.value)}
            className="input-dnd text-xs py-1.5 flex-1 appearance-none"
          >
            <option value="todos" className="bg-dndoscuro-400">Todos los niveles</option>
            <option value="0" className="bg-dndoscuro-400">Trucos</option>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <option key={n} value={n} className="bg-dndoscuro-400">Nivel {n}</option>
            ))}
          </select>
          <button 
            onClick={() => setSoloMiClase(!soloMiClase)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-bold transition-colors whitespace-nowrap ${soloMiClase ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300' : 'bg-dndoscuro-400/30 border-white/10 text-stone-400'}`}
          >
            {soloMiClase ? nombreClase || 'Mi Clase' : 'Todas'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtrados.map(h => (
          <HechizoItem 
            key={h.nombre} 
            h={h} 
            accion={{ tipo: 'añadir', handler: () => añadir(h) }} 
            esBuscador={true}
          />
        ))}
        {filtrados.length === 0 && (
          <p className="text-center text-xs text-stone-500 p-4">No se encontraron conjuros{soloMiClase ? ` de ${nombreClase}` : ''}.</p>
        )}
        {filtrados.length === 40 && (
          <p className="text-center text-[10px] text-stone-500 p-2 italic">Mostrando los primeros 40 resultados.</p>
        )}
      </div>
    </div>
  );
}

function HechizoItem({ h, accion, esBuscador, onActualizar }) {
  const [expandido, setExpandido] = useState(false);
  const esTruco = h.nivel === 0;
  
  return (
    <div className={`p-2 group hover:bg-white/5 transition-colors flex justify-between items-start ${esBuscador ? 'border border-white/5 rounded-lg mb-1 bg-dndoscuro-400/50 cursor-pointer' : ''}`} onClick={() => esBuscador && setExpandido(!expandido)}>
      
      {!esBuscador && !esTruco && (
        <button 
          onClick={(e) => { e.stopPropagation(); onActualizar({ preparado: !h.preparado }); }}
          className="mt-1.5 ml-2 mr-3 flex-shrink-0 w-5 h-5 rounded-full border-2 border-stone-500/50 flex items-center justify-center hover:border-sangre-400/50 transition-colors"
          title={h.preparado ? "Conjuro Preparado" : "Conjuro Sin Preparar"}
        >
          {h.preparado && <div className="w-2.5 h-2.5 bg-sangre-500 rounded-full"></div>}
        </button>
      )}
      {!esBuscador && esTruco && (
        <div className="mt-1.5 ml-2 mr-3 flex-shrink-0 w-5 h-5"></div>
      )}

      <div className="flex-1 cursor-pointer pr-2 pt-0.5" onClick={() => !esBuscador && setExpandido(!expandido)}>
        <h4 className={`font-bold text-stone-200 ${esBuscador ? 'text-sm' : ''}`}>
          {h.nombre} 
          {esBuscador && (
            <span className="text-[10px] font-normal text-indigo-400 ml-2 uppercase tracking-wider">
              {h.nivel === 0 ? 'Truco' : `Niv. ${h.nivel}`}
            </span>
          )}
        </h4>
        <p className="text-xs text-stone-400 mt-0.5 mb-1">
          {h.escuela} • {h.tiempo_lanzamiento} • {h.alcance}
          {esBuscador && h.clases && (
            <span className="text-stone-500 ml-1">• {h.clases.join(', ')}</span>
          )}
        </p>
        {h.descripcion && (
          <p className={`text-xs text-stone-400 transition-all ${expandido ? '' : 'line-clamp-1'}`}>
            {h.descripcion}
          </p>
        )}
      </div>

      {accion.tipo === 'eliminar' ? (
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {h.esPersonalizado && accion.editarHandler && (
            <button 
              onClick={(e) => { e.stopPropagation(); accion.editarHandler(); }}
              className="p-1 text-stone-500 hover:text-indigo-400 hover:bg-indigo-900/30 rounded-md flex-shrink-0"
              title="Editar hechizo"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); accion.handler(); }}
            className="p-1 text-stone-500 hover:text-sangre-500 hover:bg-sangre-900/30 rounded-md flex-shrink-0"
            title="Olvidar hechizo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button 
          onClick={(e) => { e.stopPropagation(); accion.handler(); }}
          className="p-1 rounded bg-indigo-800/50 text-white hover:bg-indigo-600 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1 mr-1"
          title="Añadir a conocidos"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function ListaFormaSalvaje() {
  const [expandidoId, setExpandidoId] = useState(null);
  const bestias = MONSTRUOS_SRD.filter(m => m.tipo === 'bestia').sort((a, b) => a.nivel_desafio - b.nivel_desafio);

  const formatoND = (nd) => {
    if (nd === 0.125) return '1/8';
    if (nd === 0.25) return '1/4';
    if (nd === 0.5) return '1/2';
    return nd;
  };

  return (
    <div className="space-y-3 animate-fade-in pb-8">
      <p className="text-sm text-stone-400 italic mb-4">Como druida, puedes usar tu acción mágica para asumir la forma de una bestia que hayas visto antes.</p>
      <div className="divide-y divide-white/5 bg-dndoscuro-400/30 rounded-lg border border-white/5">
        {bestias.map(b => (
          <div key={b.id} className="p-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setExpandidoId(expandidoId === b.id ? null : b.id)}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold font-cinzel text-stone-200">{b.nombre}</h4>
                <p className="text-xs text-stone-400 capitalize">{b.tamano}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-500/80 text-sm">ND {formatoND(b.nivel_desafio)}</span>
              </div>
            </div>
            
            {expandidoId === b.id && (
              <div className="mt-3 pt-3 border-t border-white/5 space-y-3 animate-fade-in">
                <div className="flex flex-wrap gap-4 text-sm text-stone-300">
                  <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-indigo-400" /> CA: {b.clase_armadura.valor}</span>
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-sangre-500" /> PV: {b.puntos_vida.promedio}</span>
                  <span>Vel: {Object.entries(b.velocidad).map(([k, v]) => `${k} ${v}'`).join(', ')}</span>
                </div>
                
                <div className="grid grid-cols-6 gap-1 text-center text-[10px]">
                  {Object.entries(b.caracteristicas).map(([atr, val]) => (
                    <div key={atr} className="bg-white/5 rounded p-1 border border-white/5">
                      <div className="text-stone-500 font-bold uppercase tracking-wider">{atr}</div>
                      <div className="text-stone-300 font-bold text-sm">{val}</div>
                    </div>
                  ))}
                </div>

                {b.habilidades_especiales?.length > 0 && (
                  <div className="text-sm">
                    <strong className="text-stone-400 uppercase tracking-widest text-[10px] block mb-1">Rasgos</strong>
                    {b.habilidades_especiales.map((h, i) => (
                      <p key={i} className="text-stone-300 mt-1"><strong className="text-stone-200">{h.nombre}.</strong> {h.descripcion}</p>
                    ))}
                  </div>
                )}
                
                <div className="text-sm">
                  <strong className="text-stone-400 uppercase tracking-widest text-[10px] block mb-1 mt-3">Acciones</strong>
                  {b.acciones?.map((a, i) => (
                    <p key={i} className="text-stone-300 mt-1"><strong className="text-stone-200">{a.nombre}.</strong> {a.descripcion}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ListaFamiliares() {
  const [expandidoId, setExpandidoId] = useState(null);
  
  const nombresFamiliares = ['Diablillo', 'Quasit', 'Pseudodragón', 'Duendecillo (Sprite)', 'Búho', 'Murciélago', 'Cuervo', 'Gato'];
  const familiares = MONSTRUOS_SRD.filter(m => nombresFamiliares.includes(m.nombre)).sort((a, b) => a.nivel_desafio - b.nivel_desafio);

  const formatoND = (nd) => {
    if (nd === 0.125) return '1/8';
    if (nd === 0.25) return '1/4';
    if (nd === 0.5) return '1/2';
    return nd;
  };

  return (
    <div className="space-y-3 animate-fade-in pb-8">
      <p className="text-sm text-stone-400 italic mb-4">Como brujo del Pacto de la Cadena o mediante el conjuro Encontrar Familiar, puedes invocar estas criaturas.</p>
      <div className="divide-y divide-white/5 bg-dndoscuro-400/30 rounded-lg border border-white/5">
        {familiares.map(b => (
          <div key={b.id} className="p-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setExpandidoId(expandidoId === b.id ? null : b.id)}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold font-cinzel text-purple-300">{b.nombre}</h4>
                <p className="text-xs text-stone-400 capitalize">{b.tamano} • {b.tipo}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-500/80 text-sm">ND {formatoND(b.nivel_desafio)}</span>
              </div>
            </div>
            
            {expandidoId === b.id && (
              <div className="mt-3 pt-3 border-t border-white/5 space-y-3 animate-fade-in">
                <div className="flex flex-wrap gap-4 text-sm text-stone-300">
                  <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-indigo-400" /> CA: {b.clase_armadura.valor}</span>
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-sangre-500" /> PV: {b.puntos_vida.promedio}</span>
                  <span>Vel: {Object.entries(b.velocidad).map(([k, v]) => `${k} ${v}'`).join(', ')}</span>
                </div>
                
                <div className="grid grid-cols-6 gap-1 text-center text-[10px]">
                  {Object.entries(b.caracteristicas).map(([atr, val]) => (
                    <div key={atr} className="bg-white/5 rounded p-1 border border-white/5">
                      <div className="text-stone-500 font-bold uppercase tracking-wider">{atr}</div>
                      <div className="text-stone-300 font-bold text-sm">{val}</div>
                    </div>
                  ))}
                </div>

                {b.habilidades_especiales?.length > 0 && (
                  <div className="text-sm">
                    <strong className="text-stone-400 uppercase tracking-widest text-[10px] block mb-1">Rasgos</strong>
                    {b.habilidades_especiales.map((h, i) => (
                      <p key={i} className="text-stone-300 mt-1"><strong className="text-stone-200">{h.nombre}.</strong> {h.descripcion}</p>
                    ))}
                  </div>
                )}
                
                <div className="text-sm">
                  <strong className="text-stone-400 uppercase tracking-widest text-[10px] block mb-1 mt-3">Acciones</strong>
                  {b.acciones?.map((a, i) => (
                    <p key={i} className="text-stone-300 mt-1"><strong className="text-stone-200">{a.nombre}.</strong> {a.descripcion}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {familiares.length === 0 && (
          <p className="p-4 text-center text-sm text-stone-500">Añade los monstruos clásicos al archivo monstruosSRD.js para que aparezcan aquí.</p>
        )}
      </div>
    </div>
  );
}

function ModalCreadorConjuro({ alCerrar, alGuardar, conjuroInicial }) {
  const [conjuro, setConjuro] = useState(conjuroInicial || {
    nombre: '',
    nivel: 0,
    escuela: 'Evocación',
    tiempo_lanzamiento: '1 acción',
    alcance: '30 pies',
    componentes: 'V, S',
    duracion: 'Instantánea',
    descripcion: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!conjuro.nombre.trim()) return;
    alGuardar({ ...conjuro, nivel: Number(conjuro.nivel) });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h3 className="font-cinzel text-xl text-stone-200">
            {conjuroInicial ? 'Editar Conjuro' : 'Crear Conjuro Personalizado'}
          </h3>
          <button onClick={alCerrar} className="text-stone-500 hover:text-white transition-colors">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <form id="form-conjuro" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Nombre</label>
              <input 
                autoFocus
                type="text" 
                value={conjuro.nombre}
                onChange={e => setConjuro({...conjuro, nombre: e.target.value})}
                className="input-dnd w-full"
                placeholder="Ej. Toque Explosivo"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Nivel</label>
                <select 
                  value={conjuro.nivel}
                  onChange={e => setConjuro({...conjuro, nivel: e.target.value})}
                  className="input-dnd w-full appearance-none"
                >
                  <option value="0" className="bg-[#111111]">Truco (Nivel 0)</option>
                  {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n} className="bg-[#111111]">Nivel {n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Escuela</label>
                <input 
                  type="text" 
                  value={conjuro.escuela}
                  onChange={e => setConjuro({...conjuro, escuela: e.target.value})}
                  className="input-dnd w-full"
                  placeholder="Ej. Evocación"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Tiempo de Lanzamiento</label>
                <input 
                  type="text" 
                  value={conjuro.tiempo_lanzamiento}
                  onChange={e => setConjuro({...conjuro, tiempo_lanzamiento: e.target.value})}
                  className="input-dnd w-full"
                  placeholder="Ej. 1 acción, Reacción"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Alcance</label>
                <input 
                  type="text" 
                  value={conjuro.alcance}
                  onChange={e => setConjuro({...conjuro, alcance: e.target.value})}
                  className="input-dnd w-full"
                  placeholder="Ej. 60 pies, Toque"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Componentes</label>
                <input 
                  type="text" 
                  value={conjuro.componentes}
                  onChange={e => setConjuro({...conjuro, componentes: e.target.value})}
                  className="input-dnd w-full"
                  placeholder="Ej. V, S, M"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Duración</label>
                <input 
                  type="text" 
                  value={conjuro.duracion}
                  onChange={e => setConjuro({...conjuro, duracion: e.target.value})}
                  className="input-dnd w-full"
                  placeholder="Ej. 1 minuto, Concentración"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Descripción</label>
              <textarea 
                value={conjuro.descripcion}
                onChange={e => setConjuro({...conjuro, descripcion: e.target.value})}
                className="input-dnd w-full h-32 resize-none"
                placeholder="Efectos del conjuro..."
                required
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={alCerrar}
            className="px-4 py-2 rounded-lg text-sm font-bold text-stone-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="form-conjuro"
            className="px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            {conjuroInicial ? 'Guardar Cambios' : 'Añadir Conjuro'}
          </button>
        </div>
      </div>
    </div>
  );
}
