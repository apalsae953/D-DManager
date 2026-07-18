import { useState } from 'react';
import { Users, Swords, Skull, Calculator, Scroll } from 'lucide-react';
import { usePanelMaster } from '../../hooks/usePanelMaster.js';
import { useBestiario } from '../../hooks/useBestiario.js';
import { modificadorCaracteristica } from '../../motor/index.js';
import { GestorPartidas } from './GestorPartidas.jsx';
import { VistaGlobalPersonajes } from './VistaGlobalPersonajes.jsx';
import { TrackerIniciativa } from './TrackerIniciativa.jsx';
import { ModalAgregarParticipante } from './ModalAgregarParticipante.jsx';
import { Bestiario } from '../bestiario/Bestiario.jsx';
import { CalculadoraEncuentros } from '../bestiario/CalculadoraEncuentros.jsx';

import { FichaPersonaje } from '../ficha-personaje/FichaPersonaje.jsx';

const PESTANIAS = [
  { clave: 'personajes', etiqueta: 'Personajes', Icono: Users },
  { clave: 'combate', etiqueta: 'Tracker de Iniciativa', Icono: Swords },
  { clave: 'bestiario', etiqueta: 'Bestiario', Icono: Skull },
  { clave: 'calculadora', etiqueta: 'Dificultad de Encuentros', Icono: Calculator },
  { clave: 'notas', etiqueta: 'Notas de Campaña', Icono: Scroll },
];

function tirarIniciativa(modificador) {
  return 1 + Math.floor(Math.random() * 20) + modificador;
}

export function PanelMaster({ session, partida, personajes, misPartidasMaster, onSeleccionarPartida, onCrearPartida, onUnirsePartida, onSalirPartida, onExpulsarPersonaje, onEliminarPartida, onGuardarNotas }) {
  const {
    resumenesPersonajes,
    participantes,
    ronda,
    turnoActivoId,
    combateIniciado,
    agregarParticipante,
    quitarParticipante,
    actualizarParticipante,
    iniciarCombate,
    siguienteTurno,
    turnoAnterior,
    terminarCombate,
  } = usePanelMaster(personajes);

  const { 
    monstruos, 
    todos: todosLosMonstruos, 
    busqueda, 
    setBusqueda, 
    crearMonstruo,
    eliminarMonstruo,
    toggleVisibilidad,
    userId 
  } = useBestiario(session);

  const [pestaniaActiva, setPestaniaActiva] = useState('personajes');
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [personajeInspeccionadoId, setPersonajeInspeccionadoId] = useState(null);

  const personajeInspeccionado = personajes.find(p => p.id === personajeInspeccionadoId);

  if (personajeInspeccionado) {
    return (
      <div className="h-full">
        <FichaPersonaje 
          personajeInicial={personajeInspeccionado} 
          onGuardar={() => {}} 
          onVolver={() => setPersonajeInspeccionadoId(null)}
          modoLectura={true}
        />
      </div>
    );
  }

  const agregarMonstruoAIniciativa = (monstruo) => {
    const modIniciativa = modificadorCaracteristica(monstruo.caracteristicas.des);
    agregarParticipante({
      personaje_id: null,
      monstruo_id: monstruo.id,
      nombre_visible: monstruo.nombre,
      iniciativa: tirarIniciativa(modIniciativa),
      pv_actual: monstruo.puntos_vida.promedio,
      pv_maximo: monstruo.puntos_vida.promedio,
      clase_armadura: monstruo.clase_armadura.valor,
      visible_para_jugadores: false,
    });
    setPestaniaActiva('combate');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
      <GestorPartidas 
        partidaActual={partida} 
        misPartidasMaster={misPartidasMaster}
        onSeleccionarPartida={onSeleccionarPartida}
        onCrearPartida={onCrearPartida} 
        onUnirsePartida={onUnirsePartida} 
        onSalirPartida={onSalirPartida} 
        onEliminarPartida={onEliminarPartida}
      />

      {partida && (
        <>
          <nav className="flex flex-wrap gap-2 rounded-xl bg-dndoscuro-400/50 p-2 glass-panel border border-white/5">
            {PESTANIAS.map(({ clave, etiqueta, Icono }) => (
              <button
                key={clave}
                onClick={() => setPestaniaActiva(clave)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-cinzel font-semibold transition-all ${
                  pestaniaActiva === clave ? 'bg-sangre-700 text-white shadow-md' : 'text-stone-400 hover:bg-white/10 hover:text-stone-200'
                }`}
              >
                <Icono className="h-4 w-4" /> {etiqueta}
              </button>
            ))}
          </nav>

          <main className="rounded-xl glass-panel p-4 shadow-inner relative overflow-hidden min-h-[500px]">
            {pestaniaActiva === 'personajes' && (
              <VistaGlobalPersonajes 
                resumenesPersonajes={resumenesPersonajes} 
                onExpulsarPersonaje={onExpulsarPersonaje} 
                onInspeccionarPersonaje={setPersonajeInspeccionadoId}
              />
            )}
            {pestaniaActiva === 'combate' && (
              <TrackerIniciativa
                participantes={participantes}
                ronda={ronda}
                turnoActivoId={turnoActivoId}
                combateIniciado={combateIniciado}
                onIniciarCombate={iniciarCombate}
                onSiguienteTurno={siguienteTurno}
                onTurnoAnterior={turnoAnterior}
                onTerminarCombate={terminarCombate}
                onQuitar={quitarParticipante}
                onActualizar={actualizarParticipante}
                onAbrirModalAgregar={() => setModalAgregarAbierto(true)}
              />
            )}
            {pestaniaActiva === 'bestiario' && (
              <Bestiario 
                monstruos={monstruos}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                onCrearMonstruo={crearMonstruo}
                onAgregarAIniciativa={agregarMonstruoAIniciativa}
                onEliminarMonstruo={eliminarMonstruo}
                toggleVisibilidad={toggleVisibilidad}
                currentUserId={userId}
              />
            )}
            {pestaniaActiva === 'calculadora' && (
              <CalculadoraEncuentros monstruosDisponibles={todosLosMonstruos} />
            )}
            {pestaniaActiva === 'notas' && (
              <div className="h-full flex flex-col p-4 animate-fade-in overflow-y-auto pr-2 pb-10">
                <h3 className="text-xl font-cinzel text-stone-200 mb-4 flex items-center gap-2">
                  <Scroll className="w-6 h-6 text-sangre-500" /> Notas de la Campaña
                </h3>
                <textarea
                  value={partida.notas_master || ''}
                  onChange={(e) => {
                    onGuardarNotas?.(e.target.value);
                    e.target.style.height = '0px';
                    e.target.style.height = (e.target.scrollHeight + 2) + 'px';
                  }}
                  ref={(el) => {
                    if (el) {
                      el.style.height = '0px';
                      el.style.height = (el.scrollHeight + 2) + 'px';
                    }
                  }}
                  placeholder="Apunta aquí la trama, nombres de NPCs, secretos o recordatorios para la próxima sesión..."
                  className="w-full bg-dndoscuro-400/50 text-stone-200 border border-white/10 rounded-lg p-4 resize-none focus:outline-none focus:border-sangre-500/50 transition-colors overflow-hidden min-h-[400px]"
                />
              </div>
            )}
          </main>

          <ModalAgregarParticipante
            abierto={modalAgregarAbierto}
            alCerrar={() => setModalAgregarAbierto(false)}
            resumenesPersonajes={resumenesPersonajes}
            participantesActuales={participantes}
            onAgregar={agregarParticipante}
          />
        </>
      )}
    </div>
  );
}
