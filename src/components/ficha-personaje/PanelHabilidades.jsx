import { HABILIDADES_INFO, NOMBRE_CARACTERISTICA } from '../../datos/datosCreacion.js';

const ORDEN_CARACTERISTICAS = ['fue', 'des', 'con', 'int', 'sab', 'car'];

function formatoBono(valor) {
  return valor >= 0 ? `+${valor}` : `${valor}`;
}

export function PanelHabilidades({ personaje, derivado, actualizarCampo }) {
  const competencias = personaje.competencias_habilidad;

  const alternarCompetencia = (clave, lista) => {
    const conjunto = new Set(competencias[lista]);
    if (conjunto.has(clave)) conjunto.delete(clave);
    else conjunto.add(clave);
    actualizarCampo(`competencias_habilidad.${lista}`, Array.from(conjunto));
  };

  const alternarSalvacion = (caracteristica) => {
    const conjunto = new Set(personaje.competencias_salvacion);
    if (conjunto.has(caracteristica)) conjunto.delete(caracteristica);
    else conjunto.add(caracteristica);
    actualizarCampo('competencias_salvacion', Array.from(conjunto));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Puntuaciones de Característica */}
      <div>
        <h2 className="text-2xl font-cinzel text-sangre-100 border-b-2 border-sangre-800/50 pb-2 mb-4">Puntuaciones de Característica</h2>
        
        <div className="bg-dndoscuro-400/50 rounded-lg overflow-hidden border border-white/5">
          <div className="grid grid-cols-[1fr_3fr_1.5fr_1.5fr] gap-1 p-2 border-b border-white/10 text-[10px] sm:text-xs font-bold text-stone-400 uppercase text-center tracking-wider bg-dndoscuro-300">
            <div>Valor</div>
            <div className="text-left pl-2">Característica</div>
            <div>Mod</div>
            <div>Salvación</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {ORDEN_CARACTERISTICAS.map((car) => {
              const objCar = personaje.caracteristicas[car] || {};
              const valor = objCar.anulacion?.activada ? objCar.anulacion.valor : objCar.base;
              const mod = derivado.modificadoresCaracteristicas[car];
              const salvacion = derivado.salvaciones[car];
              const esCompetenteSalvacion = personaje.competencias_salvacion.includes(car);

              return (
                <div key={car} className="grid grid-cols-[1fr_3fr_1.5fr_1.5fr] gap-1 p-2 items-center text-sm hover:bg-white/5 transition-colors group">
                  <div className="text-center font-bold text-stone-200 bg-white/5 py-1 rounded">{valor}</div>
                  
                  <div className="text-left pl-2 font-bold text-stone-300 flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      title="Competencia en Salvación"
                      checked={esCompetenteSalvacion} 
                      onChange={() => alternarSalvacion(car)} 
                      className="accent-sangre-600 w-3 h-3 cursor-pointer opacity-50 group-hover:opacity-100 transition-opacity" 
                    />
                    {NOMBRE_CARACTERISTICA[car]}
                  </div>
                  
                  <div className="text-center text-stone-400">{formatoBono(mod)}</div>
                  <div className={`text-center font-bold ${esCompetenteSalvacion ? 'text-sangre-400' : 'text-stone-300'}`}>{formatoBono(salvacion)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Habilidades */}
      <div>
        <h2 className="text-2xl font-cinzel text-sangre-100 border-b-2 border-sangre-800/50 pb-2 mb-4">Habilidades</h2>
        
        <div className="bg-dndoscuro-400/50 rounded-lg overflow-hidden border border-white/5">
          <div className="grid grid-cols-[1fr_4fr] gap-1 p-2 border-b border-white/10 text-[10px] sm:text-xs font-bold text-stone-400 uppercase text-center tracking-wider bg-dndoscuro-300">
            <div>Bono</div>
            <div className="text-left pl-2">Nombre de la Habilidad (* Competente, ** Pericia)</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {HABILIDADES_INFO.map((hab) => {
              const bono = derivado.habilidades[hab.clave];
              const esCompetente = competencias.competente.includes(hab.clave);
              const tienePericia = competencias.pericia.includes(hab.clave);

              return (
                <div key={hab.clave} className="grid grid-cols-[1fr_4fr] gap-1 p-2 items-center text-sm hover:bg-white/5 transition-colors group">
                  <div className={`text-center font-bold py-1 rounded bg-white/5 ${esCompetente || tienePericia ? 'text-sangre-400' : 'text-stone-200'}`}>
                    {formatoBono(bono)}
                  </div>
                  
                  <div className="text-left pl-2 flex items-center gap-2">
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="checkbox"
                        title="Competente"
                        checked={esCompetente}
                        onChange={() => alternarCompetencia(hab.clave, 'competente')}
                        className="accent-sangre-600 w-3 h-3 cursor-pointer"
                      />
                      <input
                        type="checkbox"
                        title="Pericia"
                        disabled={!esCompetente}
                        checked={tienePericia}
                        onChange={() => alternarCompetencia(hab.clave, 'pericia')}
                        className="accent-indigo-600 w-3 h-3 cursor-pointer disabled:opacity-30"
                      />
                    </div>
                    <span className="font-bold text-stone-300">
                      {hab.nombre}{esCompetente && !tienePericia && '*'}{tienePericia && '**'}
                    </span>
                    <span className="text-stone-500 text-xs ml-1">({hab.caracteristica})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
