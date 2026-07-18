import { Heart, Shield, Zap, Eye, Award, Activity, Droplet, Plus } from 'lucide-react';

export function PanelCombate({ personaje, derivado, actualizarCampo }) {
  const { puntosVida, claseArmadura, bonoCompetencia, percepcionPasiva, modificadorIniciativa } = derivado;
  
  const velocidad = personaje.velocidad || 30;
  const inspiracion = personaje.inspiracion || 0;

  const porcentajeVida = Math.max(0, Math.min(100, (puntosVida.actual / puntosVida.maximo) * 100));
  const porcentajeDados = Math.max(0, Math.min(100, ((puntosVida.dadosGolpe.total - puntosVida.dadosGolpe.usados) / puntosVida.dadosGolpe.total) * 100));

  const ajustarVidaActual = (delta) => {
    const nuevaActual = Math.max(0, Math.min(puntosVida.maximo, puntosVida.actual + delta));
    actualizarCampo('puntos_vida.actual', nuevaActual);
  };

  const equipo = personaje.equipo || [];
  const esArma = (item) => item.tipo && item.tipo.toLowerCase().includes('arma') && !item.tipo.toLowerCase().includes('armadura');
  const armasEquipadas = equipo.filter(item => item.equipado && esArma(item));
  const armasDesequipadas = equipo.filter(item => !item.equipado && esArma(item));
  const municion = equipo.filter(item => item.tipo && (item.tipo.toLowerCase().includes('munici') || item.subtipo?.toLowerCase().includes('munici')));

  // Calculo de bonos de ataque
  const calcularAtaque = (arma) => {
    const modFuerza = derivado.modificadoresCaracteristicas.fue;
    const modDestreza = derivado.modificadoresCaracteristicas.des;
    const props = (arma.propiedades || '').toLowerCase();
    const sub = (arma.subtipo || '').toLowerCase();
    const esSutil = props.includes('sutil');
    const esDistancia = sub.includes('distancia') || props.includes('munición') || props.includes('arrojadiza');
    
    let mod;
    if (esSutil) {
      mod = Math.max(modFuerza, modDestreza);
    } else if (esDistancia) {
      mod = modDestreza;
    } else {
      mod = modFuerza;
    }
    const bono = mod + bonoCompetencia.valor;
    return bono >= 0 ? `+${bono}` : `${bono}`;
  };

  const calcularDaño = (arma) => {
    const modFuerza = derivado.modificadoresCaracteristicas.fue;
    const modDestreza = derivado.modificadoresCaracteristicas.des;
    const props = (arma.propiedades || '').toLowerCase();
    const sub = (arma.subtipo || '').toLowerCase();
    const esSutil = props.includes('sutil');
    const esDistancia = sub.includes('distancia') || props.includes('munición') || props.includes('arrojadiza');
    
    let mod;
    if (esSutil) {
      mod = Math.max(modFuerza, modDestreza);
    } else if (esDistancia) {
      mod = modDestreza;
    } else {
      mod = modFuerza;
    }
    const modDaño = mod >= 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`;
    return `${arma.daño} ${modDaño}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEALTH */}
      <div>
        <h2 className="text-2xl font-cinzel text-sangre-100 border-b-2 border-sangre-800/50 pb-2 mb-3">Salud</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-1">
              <div className="font-bold text-stone-200">PV <span className="font-normal text-stone-400 ml-2">{puntosVida.actual}/{puntosVida.maximo}</span></div>
              <div className="flex gap-2">
                <button onClick={() => ajustarVidaActual(-1)} className="px-2 py-0.5 bg-dndoscuro-400 hover:bg-sangre-900 rounded text-stone-300">-</button>
                <button onClick={() => ajustarVidaActual(1)} className="px-2 py-0.5 bg-dndoscuro-400 hover:bg-emerald-900 rounded text-stone-300">+</button>
              </div>
            </div>
            <div className="h-4 w-full bg-dndoscuro-400 rounded-sm overflow-hidden border border-white/5">
              <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${porcentajeVida}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <div className="font-bold text-stone-200">DG <span className="font-normal text-stone-400 ml-2">{puntosVida.dadosGolpe.total - puntosVida.dadosGolpe.usados}d{puntosVida.tamanoDadoGolpe}</span></div>
            </div>
            <div className="h-4 w-full bg-dndoscuro-400 rounded-sm overflow-hidden border border-white/5">
              <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${porcentajeDados}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* CONDITIONS */}
      <div>
        <div className="flex justify-between items-center border-b-2 border-sangre-800/50 pb-2 mb-3">
          <h2 className="text-2xl font-cinzel text-sangre-100">Condiciones</h2>
          <div className="flex items-center gap-4">
            <Droplet className="w-5 h-5 text-sangre-600" />
            <button className="text-stone-400 hover:text-sangre-400"><Plus className="w-5 h-5" /></button>
          </div>
        </div>
        <p className="text-stone-500 text-sm italic">Ninguna condición activa.</p>
      </div>

      {/* STATISTICS */}
      <div>
        <div className="flex justify-between items-center border-b-2 border-sangre-800/50 pb-2 mb-3">
          <h2 className="text-2xl font-cinzel text-sangre-100">Estadísticas</h2>
          <button className="text-stone-400 hover:text-sangre-400"><Plus className="w-5 h-5" /></button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <CajaStat titulo="Clase de Armadura" valor={claseArmadura.valor} />
          <CajaStat titulo="Iniciativa" valor={modificadorIniciativa >= 0 ? `+${modificadorIniciativa}` : modificadorIniciativa} />
          <CajaStat titulo="Velocidad" valor={`${velocidad} pies`} />
          <CajaStat titulo="Percepción Pasiva" valor={percepcionPasiva.valor} />
          <CajaStat titulo="Competencia" valor={`+${bonoCompetencia.valor}`} />
          <CajaStat titulo="Inspiración" valor={inspiracion} />
        </div>
      </div>

      {/* ATTACKS */}
      <div>
        <div className="flex justify-between items-center border-b-2 border-sangre-800/50 pb-2 mb-3">
          <h2 className="text-2xl font-cinzel text-sangre-100">Ataques</h2>
          <button className="text-stone-400 hover:text-sangre-400"><Plus className="w-5 h-5" /></button>
        </div>
        
        <div className="bg-dndoscuro-400/50 rounded-lg overflow-hidden border border-white/5 mb-6">
          <div className="grid grid-cols-[2fr_1fr_1.5fr] gap-1 p-2 border-b border-white/10 text-[10px] sm:text-xs font-bold text-stone-400 uppercase text-center tracking-wider bg-dndoscuro-300">
            <div className="text-left pl-2">Nombre</div>
            <div>Bono de Ataque</div>
            <div>Daño / Tipo</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {armasEquipadas.length > 0 ? armasEquipadas.map((arma) => (
              <div key={arma.id_instancia} className="grid grid-cols-[2fr_1fr_1.5fr] gap-1 p-2 items-center hover:bg-white/5 transition-colors">
                <div className="text-left pl-2 font-bold text-stone-200 bg-white/5 py-2 px-2 rounded truncate">{arma.nombre}</div>
                <div className="text-center font-bold text-stone-300 bg-white/5 py-2 rounded mx-1">{calcularAtaque(arma)}</div>
                <div className="text-center font-bold text-stone-300 bg-white/5 py-2 rounded">{arma.daño ? calcularDaño(arma) : '--'}</div>
              </div>
            )) : (
              <p className="text-stone-500 text-xs p-4 text-center">No tienes armas equipadas en el inventario.</p>
            )}
          </div>
        </div>

        {/* UNEQUIPPED */}
        <h3 className="text-xl font-cinzel text-sangre-200 border-b border-sangre-800/30 pb-1 mb-2">Armas Desequipadas</h3>
        <div className="bg-dndoscuro-400/30 rounded-lg overflow-hidden border border-white/5 mb-6">
           <div className="divide-y divide-white/5">
            {armasDesequipadas.length > 0 ? armasDesequipadas.map((arma) => (
              <div key={arma.id_instancia} className="grid grid-cols-[2fr_1fr_1.5fr] gap-1 p-2 items-center opacity-70">
                <div className="text-left pl-2 font-bold text-stone-400 bg-white/5 py-2 px-2 rounded truncate">{arma.nombre}</div>
                <div className="text-center font-bold text-stone-500 bg-white/5 py-2 rounded mx-1">{calcularAtaque(arma)}</div>
                <div className="text-center font-bold text-stone-500 bg-white/5 py-2 rounded">{arma.daño ? calcularDaño(arma) : '--'}</div>
              </div>
            )) : (
              <p className="text-stone-500 text-xs p-3 text-center">No tienes armas sin equipar.</p>
            )}
          </div>
        </div>

        {/* AMMUNITION */}
        <h3 className="text-xl font-cinzel text-sangre-200 border-b border-sangre-800/30 pb-1 mb-2">Munición</h3>
        <div className="flex flex-wrap gap-2">
          {municion.length > 0 ? municion.map((mun) => (
            <div key={mun.id_instancia} className="bg-dndoscuro-400/50 border border-white/10 rounded-lg p-2 text-center min-w-[100px]">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-1 truncate max-w-[120px]">{mun.nombre}</div>
              <div className="text-xl font-bold text-stone-200 bg-white/5 rounded py-1">{mun.cantidad || 1}</div>
            </div>
          )) : (
            <p className="text-stone-500 text-xs p-3">No tienes munición en el inventario.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CajaStat({ titulo, valor }) {
  return (
    <div className="flex flex-col border border-white/10 bg-dndoscuro-400/30 rounded-md">
      <div className="text-[9px] sm:text-[10px] text-center uppercase tracking-wider text-stone-400 bg-dndoscuro-400/50 p-1 border-b border-white/5 truncate px-1">
        {titulo}
      </div>
      <div className="flex-1 flex items-center justify-center p-2 text-xl font-bold text-stone-200 bg-white/5">
        {valor}
      </div>
    </div>
  );
}
