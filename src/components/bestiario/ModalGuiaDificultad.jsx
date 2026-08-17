import { createPortal } from 'react-dom';
import { X, HelpCircle, Shield, Skull, Flame, Award, BookOpen, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export function ModalGuiaDificultad({ abierto, alCerrar }) {
  if (!abierto) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in text-stone-200"
      onClick={alCerrar}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-dndoscuro-900 border border-sangre-600/50 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-dndoscuro-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sangre-900/40 border border-sangre-600/30 text-sangre-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-sangre-100 drop-shadow-md">
                Guía de Dificultad de Encuentros (D&D 5e)
              </h2>
              <p className="text-xs text-stone-400">Reglas oficiales del Dungeon Master's Guide explicadas de forma sencilla.</p>
            </div>
          </div>
          <button 
            onClick={alCerrar} 
            className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm leading-relaxed">
          
          {/* 1. ¿Para qué sirve? */}
          <div className="p-4 rounded-xl bg-dndoscuro-950/60 border border-white/5 space-y-2">
            <h3 className="text-base font-cinzel font-bold text-amber-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> ¿Qué es y para qué sirve esta herramienta?
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm">
              En Dungeons & Dragons 5ª Edición, la dificultad de un encuentro mide la cantidad de recursos (puntos de golpe, espacios de conjuros, habilidades de un solo uso) que el grupo de aventureros probablemente tendrá que gastar para salir victorioso.
            </p>
            <p className="text-stone-400 text-xs italic">
              Su objetivo es ayudarte como Dungeon Master a preparar combates desafiantes y emocionantes, evitando tanto los combates aburridos como las muertes accidentales injustas de todo el grupo (<strong className="text-red-400">TPK - Total Party Kill</strong>).
            </p>
          </div>

          {/* 2. Los 4 Niveles de Dificultad */}
          <div>
            <h3 className="text-sm font-cinzel font-bold text-stone-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sangre-500" /> Los 4 Umbrales de Dificultad
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel font-bold text-emerald-400 text-sm">Fácil (Easy)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 font-bold uppercase">Sin peligro</span>
                </div>
                <p className="text-xs text-stone-300">
                  Un combate ligero. Los aventureros saldrán casi ilesos sin gastar prácticamente recursos ni hechizos importantes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel font-bold text-amber-400 text-sm">Medio (Medium)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/50 text-amber-300 font-bold uppercase">Estándar</span>
                </div>
                <p className="text-xs text-stone-300">
                  El desafío habitual. Los personajes sufrirán algún daño menor y gastarán recursos de nivel bajo, pero ganarán sin riesgo de muerte.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-950/30 border border-orange-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel font-bold text-orange-400 text-sm">Difícil (Hard)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-900/50 text-orange-300 font-bold uppercase">Amenaza Real</span>
                </div>
                <p className="text-xs text-stone-300">
                  Un combate serio. Los enemigos golpean duro; los personajes necesitarán táctica, curación y gastar recursos valiosos para no caer.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel font-bold text-sangre-400 text-sm">Mortal (Deadly)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-bold uppercase">Riesgo de Muerte</span>
                </div>
                <p className="text-xs text-stone-300">
                  Peligro letal. Uno o varios héroes pueden caer a 0 PV o morir si no juegan con astucia, buen posicionamiento y cooperación.
                </p>
              </div>
            </div>
          </div>

          {/* 3. ¿Cómo se calcula? PX Base vs PX Ajustado */}
          <div className="p-4 rounded-xl bg-dndoscuro-950/60 border border-white/5 space-y-3">
            <h3 className="text-sm font-cinzel font-bold text-stone-200 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> ¿Cómo funciona el cálculo de PX y Multiplicadores?
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-dndoscuro-800/80 border border-white/5">
                <strong className="text-stone-200 block mb-1">1. PX Total (Base)</strong>
                <p className="text-stone-400">
                  Es la suma real de experiencia de cada monstruo. Esta es la experiencia que <strong className="text-stone-200">se reparten los jugadores</strong> al ganar el combate.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-dndoscuro-800/80 border border-white/5">
                <strong className="text-amber-400 block mb-1">2. Multiplicador de Número</strong>
                <p className="text-stone-400">
                  En D&D, enfrentarse a muchos enemigos a la vez es más difícil debido a la <strong className="text-stone-200">Economía de Acciones</strong> (más ataques enemigos por turno).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-dndoscuro-800/80 border border-white/5">
                <strong className="text-emerald-400 block mb-1">3. PX Ajustado</strong>
                <p className="text-stone-400">
                  Es el <strong className="text-stone-200">PX Total × Multiplicador</strong>. Se usa únicamente para calcular la dificultad frente al presupuesto del grupo.
                </p>
              </div>
            </div>

            {/* Tabla de Multiplicadores */}
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400">
                    <th className="py-1.5 px-3">Cantidad de Monstruos</th>
                    <th className="py-1.5 px-3">Multiplicador Oficial</th>
                    <th className="py-1.5 px-3">Efecto en la Batalla</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-stone-300">
                  <tr><td className="py-1.5 px-3">1 monstruo</td><td className="py-1.5 px-3 font-bold text-stone-200">x1</td><td className="py-1.5 px-3 text-stone-400">Combate estándar 1 contra grupo</td></tr>
                  <tr><td className="py-1.5 px-3">2 monstruos</td><td className="py-1.5 px-3 font-bold text-amber-400">x1.5</td><td className="py-1.5 px-3 text-stone-400">Pareja de enemigos</td></tr>
                  <tr><td className="py-1.5 px-3">3 a 6 monstruos</td><td className="py-1.5 px-3 font-bold text-amber-400">x2</td><td className="py-1.5 px-3 text-stone-400">Grupo o patrulla enemiga</td></tr>
                  <tr><td className="py-1.5 px-3">7 a 10 monstruos</td><td className="py-1.5 px-3 font-bold text-orange-400">x2.5</td><td className="py-1.5 px-3 text-stone-400">Enjambre / horda menor</td></tr>
                  <tr><td className="py-1.5 px-3">11 a 14 monstruos</td><td className="py-1.5 px-3 font-bold text-red-400">x3</td><td className="py-1.5 px-3 text-stone-400">Asedio o gran emboscada</td></tr>
                  <tr><td className="py-1.5 px-3">15+ monstruos</td><td className="py-1.5 px-3 font-bold text-red-400">x4</td><td className="py-1.5 px-3 text-stone-400">Ejército o enjambre masivo</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Consejos del DM */}
          <div className="p-4 rounded-xl bg-sangre-950/30 border border-sangre-700/30 space-y-2">
            <h3 className="text-xs font-cinzel font-bold text-sangre-300 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4" /> Consejos prácticos para el Dungeon Master
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-300 list-disc list-inside">
              <li><strong>El Día de Aventura:</strong> Un grupo suele resistir entre 6 y 8 encuentros fáciles/medios (o 2-3 difíciles/mortales) antes de necesitar un Descanso Largo.</li>
              <li><strong>El Terreno y la Sorpresa:</strong> Si los monstruos tienden una emboscada con ventaja táctica o terreno elevado, el combate puede sentirse una categoría más difícil de lo calculado.</li>
              <li><strong>Jefes Solitarios (Legendarios):</strong> Un solo monstruo suele ser rodeado fácilmente. Dale siempre Acciones Legendarias o esbirros menores para que no caiga en la primera ronda.</li>
            </ul>
          </div>

        </div>

        {/* Pie */}
        <div className="border-t border-white/10 px-6 py-3 bg-dndoscuro-950/90 flex justify-end shrink-0">
          <button 
            onClick={alCerrar} 
            className="btn-primary px-6 py-2 text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
