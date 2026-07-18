import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const UMBRALES_XP = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

export function MiniBarraXP({ personaje, actualizarCampo, subirNivel, modoSubida, setEntradaNivel, soloLectura }) {
  const [sumarXP, setSumarXP] = useState('');

  const xpActual = personaje.puntos_experiencia || 0;
  const xpBaseNivelActual = UMBRALES_XP[personaje.nivel - 1] || 0;
  const xpSiguienteNivel = UMBRALES_XP[personaje.nivel] || UMBRALES_XP[19];
  const progresoXP = personaje.nivel >= 20 ? 100 : Math.min(100, Math.max(0, ((xpActual - xpBaseNivelActual) / (xpSiguienteNivel - xpBaseNivelActual)) * 100));

  const solicitarSubidaNivel = () => {
    if (personaje.nivel >= 20) return;
    if (modoSubida === 'fijo') {
      subirNivel(personaje.nivel + 1);
    } else {
      setEntradaNivel({ valor: modoSubida === 'tirada' ? 1 : 0 });
    }
  };

  const bajarNivel = () => {
    if (personaje.nivel <= 1) return;
    subirNivel(personaje.nivel - 1);
  };

  const manejarAñadirXP = () => {
    const xpAñadida = parseInt(sumarXP);
    if (!isNaN(xpAñadida) && xpAñadida > 0) {
      const nuevaXP = xpActual + xpAñadida;
      actualizarCampo('puntos_experiencia', nuevaXP);
      setSumarXP('');
      
      if (nuevaXP >= xpSiguienteNivel && personaje.nivel < 20) {
        solicitarSubidaNivel();
      }
    }
  };

  // Auto-level
  if (xpActual >= xpSiguienteNivel && personaje.nivel < 20 && !soloLectura && setEntradaNivel) {
    solicitarSubidaNivel();
  }

  return (
    <div className="flex flex-col gap-1 w-full max-w-[200px] mt-2">
      <div className="flex items-center gap-1">
        <button onClick={bajarNivel} className="rounded-full p-0.5 text-stone-500 hover:text-white transition-colors">
          <Minus className="h-3 w-3" />
        </button>
        <span className="text-xs font-bold text-stone-200">Nvl {personaje.nivel}</span>
        <button onClick={solicitarSubidaNivel} className="rounded-full p-0.5 text-stone-500 hover:text-white transition-colors">
          <Plus className="h-3 w-3" />
        </button>
        <div className="flex flex-col ml-1 flex-1">
          <div className="flex justify-between text-[9px] font-semibold text-stone-500 mb-[1px]">
            <span>{xpActual}</span>
            <span>{personaje.nivel < 20 ? xpSiguienteNivel : 'MAX'}</span>
          </div>
          <div className="h-1.5 w-full bg-dndoscuro-400 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${progresoXP}%` }}></div>
          </div>
        </div>
      </div>
      {!soloLectura && personaje.nivel < 20 && (
        <div className="flex items-center gap-1 justify-end mt-0.5">
          <input 
            type="number" 
            value={sumarXP} 
            onChange={(e) => setSumarXP(e.target.value)} 
            placeholder="+XP" 
            className="bg-dndoscuro-400/50 border border-white/5 text-stone-300 rounded text-[10px] py-0.5 px-1 w-12 outline-none focus:border-sangre-600"
          />
          <button onClick={manejarAñadirXP} className="bg-sangre-700/80 hover:bg-sangre-600 text-white rounded text-[9px] py-0.5 px-1.5 font-bold transition-colors uppercase tracking-wider">Añadir</button>
        </div>
      )}
    </div>
  );
}
