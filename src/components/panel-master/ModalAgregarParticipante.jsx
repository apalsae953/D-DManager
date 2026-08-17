import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Skull, Dices, Sparkles, Shield, Heart } from 'lucide-react';
import { modificadorCaracteristica } from '../../motor/caracteristicas.js';

export function ModalAgregarParticipante({ 
  abierto, 
  alCerrar, 
  resumenesPersonajes = [], 
  participantesActuales = [], 
  monstruosDisponibles = [], 
  onAgregar 
}) {
  const [tipo, setTipo] = useState('jugador');
  const [personajeSeleccionadoId, setPersonajeSeleccionadoId] = useState('');
  const [iniciativaJugador, setIniciativaJugador] = useState(10);

  // Campos de Criatura / Monstruo
  const [monstruoSeleccionadoId, setMonstruoSeleccionadoId] = useState('');
  const [nombreMonstruo, setNombreMonstruo] = useState('');
  const [pvMonstruo, setPvMonstruo] = useState(10);
  const [caMonstruo, setCaMonstruo] = useState(10);
  const [modIniciativaMonstruo, setModIniciativaMonstruo] = useState(0);
  const [iniciativaMonstruo, setIniciativaMonstruo] = useState(10);

  if (!abierto) return null;

  const idsYaAgregados = new Set(participantesActuales.filter((p) => p.personaje_id).map((p) => p.personaje_id));
  const disponibles = resumenesPersonajes.filter((p) => !idsYaAgregados.has(p.id));

  // Al elegir una criatura del Bestiario, autorrellenar los campos manteniendo la opción de editar
  const handleSeleccionarMonstruoBestiario = (id) => {
    setMonstruoSeleccionadoId(id);
    if (!id) return;

    const bicho = monstruosDisponibles.find((m) => m.id === id);
    if (!bicho) return;

    // Calcular cuántos de este tipo ya hay en combate para poner número (ej. "Goblin 2")
    const existentes = participantesActuales.filter((p) => 
      p.nombre_visible?.toLowerCase().startsWith(bicho.nombre.toLowerCase())
    );
    const numeroSufijo = existentes.length > 0 ? ` ${existentes.length + 1}` : '';

    const hp = typeof bicho.puntos_vida === 'object' ? (bicho.puntos_vida?.promedio || 10) : (bicho.puntos_vida || 10);
    const ca = typeof bicho.clase_armadura === 'object' ? (bicho.clase_armadura?.valor || 10) : (bicho.clase_armadura || 10);
    const des = bicho.caracteristicas?.des ?? 10;
    const modDes = modificadorCaracteristica(des);

    setNombreMonstruo(`${bicho.nombre}${numeroSufijo}`);
    setPvMonstruo(Number(hp));
    setCaMonstruo(Number(ca));
    setModIniciativaMonstruo(modDes);
    setIniciativaMonstruo(1 + Math.floor(Math.random() * 20) + modDes);
  };

  const tirarIniciativaMonstruo = () => {
    setIniciativaMonstruo(1 + Math.floor(Math.random() * 20) + Number(modIniciativaMonstruo));
  };

  const confirmarJugador = () => {
    const personaje = resumenesPersonajes.find((p) => p.id === personajeSeleccionadoId);
    if (!personaje) return;
    onAgregar({
      personaje_id: personaje.id,
      monstruo_id: null,
      nombre_visible: personaje.nombre || personaje.clase,
      iniciativa: Number(iniciativaJugador),
      pv_actual: personaje.pvActual,
      pv_maximo: personaje.pvMaximo,
      clase_armadura: personaje.clase_armadura,
      visible_para_jugadores: true,
    });
    setPersonajeSeleccionadoId('');
    alCerrar();
  };

  const confirmarMonstruo = () => {
    if (!nombreMonstruo.trim()) return;
    onAgregar({
      personaje_id: null,
      monstruo_id: monstruoSeleccionadoId || null,
      nombre_visible: nombreMonstruo.trim(),
      iniciativa: Number(iniciativaMonstruo),
      pv_actual: Number(pvMonstruo),
      pv_maximo: Number(pvMonstruo),
      clase_armadura: Number(caMonstruo),
      visible_para_jugadores: false,
    });
    // Limpiar
    setNombreMonstruo('');
    setMonstruoSeleccionadoId('');
    alCerrar();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-stone-200" 
      onClick={alCerrar}
    >
      <div 
        className="w-full max-w-md rounded-2xl bg-dndoscuro-900 p-6 shadow-2xl border border-sangre-600/50 animate-scale-in" 
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xl font-cinzel font-bold text-sangre-100">Agregar a la Iniciativa</h2>
          <button 
            onClick={alCerrar} 
            className="rounded-full p-1.5 text-stone-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selector de Tipo */}
        <div className="mb-5 flex gap-2 bg-dndoscuro-950/60 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setTipo('jugador')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-cinzel font-bold transition-all ${
              tipo === 'jugador' 
                ? 'bg-indigo-900/90 text-indigo-100 border border-indigo-500/50 shadow-neon' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserPlus className="h-4 w-4" /> Jugador de Partida
          </button>
          <button
            type="button"
            onClick={() => setTipo('monstruo')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-cinzel font-bold transition-all ${
              tipo === 'monstruo' 
                ? 'bg-sangre-800 text-white border border-sangre-500/50 shadow-neon' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Skull className="h-4 w-4" /> Monstruo / Bestia
          </button>
        </div>

        {/* Formulario JUGADOR */}
        {tipo === 'jugador' && (
          <div className="space-y-4">
            {disponibles.length === 0 ? (
              <p className="text-xs text-stone-400 italic text-center p-6 bg-dndoscuro-950/40 rounded-xl">
                Todos los personajes vinculados a esta partida ya están en el combate.
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Selecciona al Personaje</label>
                  <select
                    value={personajeSeleccionadoId}
                    onChange={(evento) => setPersonajeSeleccionadoId(evento.target.value)}
                    className="w-full input-dnd py-2"
                  >
                    <option value="" className="bg-dndoscuro-400">-- Selecciona un jugador --</option>
                    {disponibles.map((p) => (
                      <option key={p.id} value={p.id} className="bg-dndoscuro-400">
                        {p.nombre || 'Sin nombre'} (Nv{p.nivel} {p.clase})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between bg-dndoscuro-950/60 p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-xs font-bold uppercase text-stone-300 block">Tirada de Iniciativa</span>
                    <span className="text-[10px] text-stone-500">Introduce el resultado del d20 + DES del jugador</span>
                  </div>
                  <input
                    type="number"
                    value={iniciativaJugador}
                    onChange={(evento) => setIniciativaJugador(Number(evento.target.value))}
                    className="w-16 input-dnd py-1.5 text-center text-lg font-bold"
                  />
                </div>

                <button
                  onClick={confirmarJugador}
                  disabled={!personajeSeleccionadoId}
                  className="w-full btn-primary py-2.5 text-sm disabled:opacity-40"
                >
                  Añadir Jugador al Turno
                </button>
              </>
            )}
          </div>
        )}

        {/* Formulario MONSTRUO / CRIATURA */}
        {tipo === 'monstruo' && (
          <div className="space-y-4">
            {/* Opción 1: Selector desde el Bestiario */}
            <div>
              <label className="block text-xs font-bold uppercase text-sangre-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Cargar del Bestiario (Opcional)
              </label>
              <select
                value={monstruoSeleccionadoId}
                onChange={(e) => handleSeleccionarMonstruoBestiario(e.target.value)}
                className="w-full input-dnd py-2 text-sm"
              >
                <option value="" className="bg-dndoscuro-400">-- Elegir criatura del Bestiario --</option>
                {monstruosDisponibles.map((m) => (
                  <option key={m.id} value={m.id} className="bg-dndoscuro-400">
                    {m.nombre} ({m.tamano} {m.tipo}, ND {m.nivel_desafio})
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre editable */}
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Nombre Visible *</label>
              <input
                value={nombreMonstruo}
                onChange={(evento) => setNombreMonstruo(evento.target.value)}
                placeholder="Nombre (ej. Lobo 1, Goblin Arquero)"
                className="w-full input-dnd py-2 font-bold"
                required
              />
            </div>

            {/* PV y CA editables */}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-stone-400 uppercase tracking-wider font-bold">
                <span className="flex items-center gap-1 mb-1 text-red-400"><Heart className="w-3.5 h-3.5" /> Puntos de Vida</span>
                <input
                  type="number"
                  min={1}
                  value={pvMonstruo}
                  onChange={(evento) => setPvMonstruo(Number(evento.target.value))}
                  className="w-full input-dnd text-center py-1.5 font-bold"
                />
              </label>
              <label className="text-xs text-stone-400 uppercase tracking-wider font-bold">
                <span className="flex items-center gap-1 mb-1 text-indigo-400"><Shield className="w-3.5 h-3.5" /> Clase Armadura (CA)</span>
                <input
                  type="number"
                  min={1}
                  value={caMonstruo}
                  onChange={(evento) => setCaMonstruo(Number(evento.target.value))}
                  className="w-full input-dnd text-center py-1.5 font-bold"
                />
              </label>
            </div>
            
            {/* Iniciativa y Tirada Rápida */}
            <div className="bg-dndoscuro-950/70 p-3 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-stone-400 font-bold block">Modificador DES</span>
                  <span className="text-[10px] text-stone-500">Bono de iniciativa</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={modIniciativaMonstruo}
                    onChange={(evento) => setModIniciativaMonstruo(Number(evento.target.value))}
                    className="w-14 input-dnd text-center py-1 font-bold"
                  />
                  <button
                    type="button"
                    onClick={tirarIniciativaMonstruo}
                    className="flex items-center gap-1 rounded-lg bg-sangre-900/60 hover:bg-sangre-700 px-3 py-1.5 text-xs font-bold text-sangre-200 hover:text-white border border-sangre-600/40 transition-colors"
                  >
                    <Dices className="h-4 w-4" /> Tirar d20
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
                <span className="text-xs text-stone-300 font-bold">Iniciativa Final (Editable):</span>
                <input
                  type="number"
                  value={iniciativaMonstruo}
                  onChange={(evento) => setIniciativaMonstruo(Number(evento.target.value))}
                  className="w-16 input-dnd text-center text-lg font-bold text-amber-400"
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={confirmarMonstruo} 
              disabled={!nombreMonstruo.trim()}
              className="w-full btn-primary py-2.5 text-sm disabled:opacity-40"
            >
              Agregar Criatura al Combate
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
