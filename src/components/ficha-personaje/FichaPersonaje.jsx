import { useState, useEffect } from 'react';
import { User, Sparkles, Swords, BookOpen, Dices, Save, Wand2, ChevronLeft, Shield, Package, AlignLeft, Check, RefreshCw, CheckCircle2, Scroll } from 'lucide-react';
import { useFichaPersonaje } from '../../hooks/useFichaPersonaje.js';
import { PanelDatosGenerales } from './PanelDatosGenerales.jsx';
import { SelectorCaracteristicas } from './SelectorCaracteristicas.jsx';
import { PanelCombate } from './PanelCombate.jsx';

import { PanelConjuros } from './PanelConjuros.jsx';
import { PanelHabilidades } from './PanelHabilidades.jsx';
import { PanelInventario } from './PanelInventario.jsx';
import { PanelRasgos } from './PanelRasgos.jsx';
import { ModalDados } from './ModalDados.jsx';
import { MiniBarraXP } from './MiniBarraXP.jsx';
import { obtenerDadoGolpe } from '../../motor/index.js';
import { useDatosPersonalizados } from '../../hooks/useDatosPersonalizados.js';

const PESTANIAS = [
  { clave: 'combate', etiqueta: 'Combate', Icono: Swords },
  { clave: 'atributos', etiqueta: 'Atributos', Icono: Shield },
  { clave: 'inventario', etiqueta: 'Inventario', Icono: Package },
  { clave: 'conjuros', etiqueta: 'Conjuros', Icono: BookOpen },
  { clave: 'rasgos', etiqueta: 'Rasgos', Icono: AlignLeft },
  { clave: 'notas', etiqueta: 'Diario', Icono: Scroll },
];

export function FichaPersonaje({ personajeInicial, onGuardar, onVolver, modoLectura = false }) {
  const { personaje, derivado, actualizarCampo, alternarAnulacion, subirNivel } = useFichaPersonaje(personajeInicial);
  const { clases } = useDatosPersonalizados();
  const [pestaniaActiva, setPestaniaActiva] = useState('combate');
  const [modalDadosAbierto, setModalDadosAbierto] = useState(false);
  const [estadoGuardado, setEstadoGuardado] = useState('guardado');
  const [entradaNivel, setEntradaNivel] = useState(null);
  const [mostrarModalSubclase, setMostrarModalSubclase] = useState(false);

  // Callbacks protegidos para modo lectura
  const handleActualizarCampo = modoLectura ? () => {} : actualizarCampo;
  const handleAlternarAnulacion = modoLectura ? () => {} : alternarAnulacion;
  const handleSubirNivel = modoLectura ? () => {} : subirNivel;

  const modoSubida = personaje.puntos_vida.modo_subida;
  const claseNormalizada = personaje.clase?.toLowerCase() || '';
  const dadoGolpe = obtenerDadoGolpe(claseNormalizada, personaje.dado_golpe_personalizado);
  const claseSeleccionada = clases.find((c) => c.clave === claseNormalizada);

  const pestaniasVisibles = PESTANIAS.filter(p => !modoLectura || p.clave !== 'notas');

  const confirmarSubidaNivel = () => {
    handleSubirNivel(personaje.nivel + 1, {
      modo: modoSubida,
      valor_tirada: modoSubida === 'tirada' ? entradaNivel.valor : undefined,
      valor_manual: modoSubida === 'manual' ? entradaNivel.valor : undefined,
    });
    setEntradaNivel(null);
  };

  useEffect(() => {
    if (modoLectura) return;
    setEstadoGuardado('guardando');
    const timer = setTimeout(() => {
      onGuardar?.(personaje);
      setEstadoGuardado('guardado');
    }, 500);
    return () => clearTimeout(timer);
  }, [personaje, onGuardar, modoLectura]);

  // Efecto para abrir el modal de subclase
  useEffect(() => {
    if (modoLectura) return;
    if (claseSeleccionada && personaje.nivel >= claseSeleccionada.nivelSubclase && !personaje.subclase) {
      setMostrarModalSubclase(true);
    }
  }, [personaje.nivel, personaje.subclase, claseSeleccionada, modoLectura]);

  const elegirSubclaseModal = (sub) => {
    actualizarCampo('subclase', sub.toLowerCase());
    if (!personaje.subclase_original) {
      actualizarCampo('subclase_original', sub.toLowerCase());
    }
    setMostrarModalSubclase(false);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 animate-fade-in h-full flex flex-col">
      {/* Permitimos clics en la cabecera para poder volver y cambiar pestañas */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 animate-fade-in px-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onVolver}
            className="flex items-center justify-center p-2 rounded-full bg-dndoscuro-400 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-sangre-600 shadow-neon group cursor-pointer">
            {personaje.avatar ? (
              <img src={personaje.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-dndoscuro-300 flex items-center justify-center"><User className="text-stone-500" /></div>
            )}
            {!modoLectura && (
              <>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-[10px] text-white font-bold">Cambiar</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => actualizarCampo('avatar', ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-cinzel font-bold text-sangre-100 drop-shadow-md flex items-center gap-3">
              {personaje.nombre || 'Héroe Anónimo'}
              {modoLectura && <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded font-sans uppercase tracking-widest border border-indigo-500/30">Modo DM</span>}
            </h1>
            <p className="text-sm font-serif text-stone-300">
              Nivel {personaje.nivel} · {personaje.raza || 'Raza'} · {personaje.clase || 'Clase'}
            </p>
          </div>
        </div>
        {!modoLectura && (
          <div className="flex gap-3 items-center">
            <div className={`flex items-center gap-1 text-xs font-bold transition-opacity ${estadoGuardado === 'guardando' ? 'text-stone-400' : 'text-emerald-500'}`}>
              {estadoGuardado === 'guardando' ? (
                <span className="flex items-center gap-2 text-sangre-400">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> Guardado
                </span>
              )}
              
              <div className="flex flex-col items-end">
                <button
                  onClick={() => setModalDadosAbierto(true)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-dndoscuro-400/50 px-4 py-2 font-cinzel text-sm font-bold text-stone-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Dices className="h-5 w-5" />
                  Dados
                </button>
                
                <MiniBarraXP 
                  personaje={personaje} 
                  actualizarCampo={handleActualizarCampo} 
                  subirNivel={handleSubirNivel} 
                  modoSubida={modoSubida}
                  setEntradaNivel={setEntradaNivel}
                  soloLectura={modoLectura} 
                />
              </div>
            </div>
          </div>
        )}
      </header>

      <nav className="mb-6 flex gap-2 overflow-x-auto glass-panel p-2">
        {pestaniasVisibles.map(({ clave, etiqueta, Icono }) => (
          <button
            key={clave}
            onClick={() => setPestaniaActiva(clave)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-cinzel font-semibold transition-all ${
              pestaniaActiva === clave ? 'bg-sangre-700 text-white shadow-md' : 'text-stone-400 hover:bg-white/10 hover:text-stone-200'
            }`}
          >
            <Icono className="h-4 w-4" /> {etiqueta}
          </button>
        ))}
      </nav>

      <main className={`glass-panel p-6 shadow-inner relative overflow-hidden min-h-[500px] ${modoLectura ? 'pointer-events-none' : ''}`}>
        {pestaniaActiva === 'combate' && (
          <div className="animate-fade-in relative z-10 flex flex-col gap-6">
            <PanelDatosGenerales personaje={personaje} actualizarCampo={handleActualizarCampo} soloLectura={modoLectura} />
            <div className="h-px w-full bg-white/10 my-2"></div>
            <PanelCombate personaje={personaje} derivado={derivado} actualizarCampo={handleActualizarCampo} alternarAnulacion={handleAlternarAnulacion} />
          </div>
        )}
        {pestaniaActiva === 'atributos' && (
          <div className="animate-fade-in relative z-10">
            <PanelHabilidades personaje={personaje} derivado={derivado} actualizarCampo={handleActualizarCampo} alternarAnulacion={handleAlternarAnulacion} />
          </div>
        )}
        {pestaniaActiva === 'inventario' && (
          <div className="animate-fade-in relative z-10">
            <PanelInventario personaje={personaje} actualizarCampo={handleActualizarCampo} />
          </div>
        )}
        {pestaniaActiva === 'conjuros' && (
          <div className="animate-fade-in relative z-10">
            <PanelConjuros personaje={personaje} derivado={derivado} alternarAnulacion={handleAlternarAnulacion} actualizarCampo={handleActualizarCampo} />
          </div>
        )}
        {pestaniaActiva === 'rasgos' && (
          <div className="animate-fade-in relative z-10">
            <PanelRasgos personaje={personaje} actualizarCampo={handleActualizarCampo} subirNivel={handleSubirNivel} />
          </div>
        )}
        {pestaniaActiva === 'notas' && (
          <div className="animate-fade-in relative z-10 h-full flex flex-col">
            <textarea
              value={personaje.notas || ''}
              onChange={(e) => handleActualizarCampo('notas', e.target.value)}
              placeholder="Apunta aquí tus misiones, pistas, nombres de PNJs y todo lo que necesites recordar..."
              className="flex-1 w-full bg-dndoscuro-400/50 text-stone-200 border border-white/10 rounded-lg p-4 resize-none focus:outline-none focus:border-sangre-500/50 transition-colors h-[400px]"
            />
          </div>
        )}
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none z-0">
          <Shield className="w-96 h-96" />
        </div>
      </main>

      {entradaNivel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-xl border border-amber-500/50 bg-[#111111] p-6 shadow-2xl shadow-amber-900/20">
            <div className="mb-4 text-center">
              <h2 className="font-cinzel text-xl font-bold text-amber-500 drop-shadow">
                ¡Sube a Nivel {personaje.nivel + 1}!
              </h2>
              <p className="mt-2 text-sm text-stone-300">
                Modo de puntos de vida: <strong className="text-amber-400 capitalize">{modoSubida}</strong>
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full items-center justify-center gap-2">
                <input
                  type="number"
                  value={entradaNivel.valor}
                  onChange={(evento) => setEntradaNivel({ valor: Number(evento.target.value) })}
                  className="w-24 rounded-lg border border-amber-500/30 bg-dndoscuro-900 px-3 py-2 text-center text-xl font-bold text-amber-100"
                />
                {modoSubida === 'tirada' && (
                  <button
                    onClick={() => setEntradaNivel({ valor: 1 + Math.floor(Math.random() * dadoGolpe) })}
                    className="flex items-center gap-2 rounded-lg border border-amber-500 bg-amber-900/30 px-3 py-2 text-sm font-bold text-amber-400 transition-colors hover:bg-amber-500 hover:text-dndoscuro-900"
                  >
                    <Dices className="h-5 w-5" /> Tirar 1d{dadoGolpe}
                  </button>
                )}
              </div>

              <div className="mt-2 flex w-full gap-2">
                <button 
                  onClick={() => setEntradaNivel(null)} 
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-bold text-stone-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmarSubidaNivel} 
                  className="flex-1 rounded-lg bg-amber-600 py-2 text-sm font-bold text-white shadow-lg shadow-amber-900/50 hover:bg-amber-500 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal emergente para elegir Subclase */}
      {mostrarModalSubclase && claseSeleccionada?.subclases && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-xl border border-sangre-600 bg-[#111111] p-6 shadow-2xl shadow-sangre-900/50">
            <div className="mb-6 text-center">
              <h2 className="font-cinzel text-2xl font-bold text-sangre-100 drop-shadow">
                ¡Nivel de Especialización Alcanzado!
              </h2>
              <p className="mt-2 text-sm text-stone-300">
                Tu {claseSeleccionada.nombre} ha alcanzado el nivel necesario para elegir su {claseSeleccionada.nombreSubclase}. Selecciona tu camino:
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              {claseSeleccionada.subclases.map((sub) => (
                <button
                  key={sub}
                  onClick={() => elegirSubclaseModal(sub)}
                  className="rounded-lg border border-stone-600 bg-[#151515] p-3 text-left font-bold text-stone-200 transition-all hover:border-sangre-500 hover:bg-[#1a1a1a] hover:text-white"
                >
                  {sub}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setMostrarModalSubclase(false)}
                className="text-xs text-stone-500 hover:text-stone-300"
              >
                Elegir más tarde
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalDados abierto={modalDadosAbierto} alCerrar={() => setModalDadosAbierto(false)} />
    </div>
  );
}
