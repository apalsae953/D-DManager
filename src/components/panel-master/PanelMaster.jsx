import { useState } from 'react';
import { Users, Swords, Skull, Calculator } from 'lucide-react';
import { usePanelMaster } from '../../hooks/usePanelMaster.js';
import { useBestiario } from '../../hooks/useBestiario.js';
import { modificadorCaracteristica } from '../../motor/index.js';
import { GestorPartidas } from './GestorPartidas.jsx';
import { VistaGlobalPersonajes } from './VistaGlobalPersonajes.jsx';
import { TrackerIniciativa } from './TrackerIniciativa.jsx';
import { ModalAgregarParticipante } from './ModalAgregarParticipante.jsx';
import { Bestiario } from '../bestiario/Bestiario.jsx';
import { CalculadoraEncuentros } from '../bestiario/CalculadoraEncuentros.jsx';

const PESTANIAS = [
  { clave: 'personajes', etiqueta: 'Personajes', Icono: Users },
  { clave: 'combate', etiqueta: 'Tracker de Iniciativa', Icono: Swords },
  { clave: 'bestiario', etiqueta: 'Bestiario', Icono: Skull },
  { clave: 'calculadora', etiqueta: 'Dificultad de Encuentros', Icono: Calculator },
];

function tirarIniciativa(modificador) {
  return 1 + Math.floor(Math.random() * 20) + modificador;
}

export function PanelMaster({ partida, personajes, onCrearPartida, onUnirsePartida, onSalirPartida }) {
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

  const { monstruos, todos: todosLosMonstruos, busqueda, setBusqueda, crearMonstruo } = useBestiario();

  const [pestaniaActiva, setPestaniaActiva] = useState('personajes');
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);

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
        onCrearPartida={onCrearPartida} 
        onUnirsePartida={onUnirsePartida} 
        onSalirPartida={onSalirPartida} 
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
            {pestaniaActiva === 'personajes' && <VistaGlobalPersonajes resumenesPersonajes={resumenesPersonajes} />}
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
              />
            )}
            {pestaniaActiva === 'calculadora' && <CalculadoraEncuentros monstruosDisponibles={todosLosMonstruos} />}
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
