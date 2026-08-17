import { HABILIDADES_INFO, NOMBRE_CARACTERISTICA } from '../../datos/datosCreacion.js';

const ORDEN_CARACTERISTICAS = ['fue', 'des', 'con', 'int', 'sab', 'car'];

function formatoBono(valor) {
  return valor >= 0 ? `+${valor}` : `${valor}`;
}

export function PanelHabilidades({ personaje, derivado, actualizarCampo }) {
  const competencias = personaje.competencias_habilidad || { competente: [], pericia: [] };

  const alternarCompetencia = (clave, lista) => {
    const competenteSet = new Set(competencias.competente || []);
    const periciaSet = new Set(competencias.pericia || []);

    if (lista === 'competente') {
      if (competenteSet.has(clave)) {
        competenteSet.delete(clave);
        periciaSet.delete(clave); // Si se quita competencia, también se quita pericia
      } else {
        competenteSet.add(clave);
      }
    } else if (lista === 'pericia') {
      if (periciaSet.has(clave)) {
        periciaSet.delete(clave);
      } else {
        competenteSet.add(clave); // Pericia requiere ser competente
        periciaSet.add(clave);
      }
    }

    actualizarCampo('competencias_habilidad', {
      competente: Array.from(competenteSet),
      pericia: Array.from(periciaSet)
    });
  };

  const alternarSalvacion = (caracteristica) => {
    const conjunto = new Set(personaje.competencias_salvacion || []);
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
            <div className="text-left pl-2">Característica (✔ Salvación)</div>
            <div>Mod</div>
            <div>Salvación</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {ORDEN_CARACTERISTICAS.map((car) => {
              const objCar = personaje.caracteristicas[car] || {};
              const valor = objCar.anulacion?.activada ? objCar.anulacion.valor : objCar.base;
              const mod = derivado.modificadoresCaracteristicas[car];
              const salvacion = derivado.salvaciones[car];
              const esCompetenteSalvacion = (personaje.competencias_salvacion || []).includes(car);

              return (
                <div key={car} className="grid grid-cols-[1fr_3fr_1.5fr_1.5fr] gap-1 p-2 items-center text-sm hover:bg-white/5 transition-colors group">
                  <div className="text-center font-bold text-stone-200 bg-white/5 py-1 rounded">{valor}</div>
                  
                  <label className="text-left pl-2 font-bold text-stone-300 flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      title="Competencia en Tirada de Salvación"
                      checked={esCompetenteSalvacion} 
                      onChange={() => alternarSalvacion(car)} 
                      className="accent-sangre-600 w-4 h-4 cursor-pointer rounded" 
                    />
                    <span>{NOMBRE_CARACTERISTICA[car]}</span>
                  </label>
                  
                  <div className="text-center text-stone-400 font-mono">{formatoBono(mod)}</div>
                  <div className={`text-center font-bold font-mono ${esCompetenteSalvacion ? 'text-sangre-400' : 'text-stone-300'}`}>
                    {esCompetenteSalvacion ? `* ${formatoBono(salvacion)}` : formatoBono(salvacion)}
                  </div>
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
          <div className="grid grid-cols-[1.5fr_4fr] gap-1 p-2 border-b border-white/10 text-[10px] sm:text-xs font-bold text-stone-400 uppercase text-center tracking-wider bg-dndoscuro-300">
            <div>Bono</div>
            <div className="text-left pl-2">Habilidad (C = Competente *, P = Pericia **)</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {HABILIDADES_INFO.map((hab) => {
              const bono = derivado.habilidades[hab.clave];
              const esCompetente = (competencias.competente || []).includes(hab.clave);
              const tienePericia = esCompetente && (competencias.pericia || []).includes(hab.clave);

              return (
                <div key={hab.clave} className="grid grid-cols-[1.5fr_4fr] gap-1 p-2 items-center text-sm hover:bg-white/5 transition-colors group">
                  <div className={`text-center font-bold font-mono py-1 rounded bg-white/5 ${tienePericia ? 'text-indigo-400' : esCompetente ? 'text-sangre-400' : 'text-stone-200'}`}>
                    {tienePericia ? `** ${formatoBono(bono)}` : esCompetente ? `* ${formatoBono(bono)}` : formatoBono(bono)}
                  </div>
                  
                  <div className="text-left pl-2 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="flex items-center gap-1 cursor-pointer" title="Competente (*)">
                        <input
                          type="checkbox"
                          checked={esCompetente}
                          onChange={() => alternarCompetencia(hab.clave, 'competente')}
                          className="accent-sangre-600 w-3.5 h-3.5 cursor-pointer rounded"
                        />
                        <span className="text-[10px] font-bold text-stone-500">C</span>
                      </label>

                      <label className="flex items-center gap-1 cursor-pointer" title="Pericia (**)">
                        <input
                          type="checkbox"
                          disabled={!esCompetente}
                          checked={tienePericia}
                          onChange={() => alternarCompetencia(hab.clave, 'pericia')}
                          className="accent-indigo-600 w-3.5 h-3.5 cursor-pointer disabled:opacity-20 rounded"
                        />
                        <span className="text-[10px] font-bold text-stone-500">P</span>
                      </label>
                    </div>
                    
                    <span className={`font-bold transition-colors ${tienePericia ? 'text-indigo-300' : esCompetente ? 'text-sangre-300' : 'text-stone-300'}`}>
                      {hab.nombre}
                      {tienePericia ? ' **' : esCompetente ? ' *' : ''}
                    </span>
                    <span className="text-stone-500 text-xs ml-1">({hab.caracteristica.toUpperCase()})</span>
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
