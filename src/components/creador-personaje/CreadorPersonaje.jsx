import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Shield, User, Scroll, Swords, Sparkles, Package, Image as ImageIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { ALINEAMIENTOS } from '../../datos/datosCreacion.js';
import { EQUIPO_INICIAL } from '../../datos/equipoInicial.js';
import { EQUIPO } from '../../datos/equipo.js';
import { useDatosPersonalizados } from '../../hooks/useDatosPersonalizados.js';
import { ModalCreadorPersonalizado } from './ModalCreadorPersonalizado.jsx';

const PASOS = [
  { id: 'identidad', titulo: 'Identidad', Icono: User },
  { id: 'raza', titulo: 'Raza', Icono: Shield },
  { id: 'clase', titulo: 'Clase', Icono: Swords },
  { id: 'caracteristicas', titulo: 'Características', Icono: DicesIcon },
  { id: 'trasfondo', titulo: 'Trasfondo', Icono: Scroll },
  { id: 'equipo', titulo: 'Equipo', Icono: Package },
  { id: 'resumen', titulo: 'Revisión', Icono: Check },
];

function DicesIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}>
      <rect width="12" height="12" x="2" y="10" rx="2" ry="2"/>
      <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/>
      <path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/>
    </svg>
  );
}

export function CreadorPersonaje({ alGuardar, alCancelar, misPartidasJugador = [], partidaActual = null }) {
  const {
    razas, clases, trasfondos, esTrasfondoPersonalizado,
    crearRaza, editarRaza, eliminarRaza,
    agregarSubraza, editarSubraza, eliminarSubraza,
    crearClase, editarClase, eliminarClase,
    crearTrasfondo, editarTrasfondo, eliminarTrasfondo,
  } = useDatosPersonalizados();
  const [pasoActual, setPasoActual] = useState(0);
  const [datos, setDatos] = useState({
    nombre: '',
    avatar: '',
    partida_id: partidaActual?.id || '',
    alineamiento: 'Neutral Bueno',
    raza: 'Humano',
    subraza: '',
    clase: 'Guerrero',
    caracteristicas: { fue: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
    trasfondo: 'Forastero',
    nivel: 1,
    pgMax: 10,
    pg: 10,
    ca: 10,
    dadoGolpe: 10,
  });
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({});

  // Calculate default HP and CA based on class and Con/Dex
  useEffect(() => {
    const claseDef = clases.find(c => c.nombre === datos.clase) || clases[1];
    const modCon = Math.floor((datos.caracteristicas.con - 10) / 2);
    const modDes = Math.floor((datos.caracteristicas.des - 10) / 2);
    const hp = claseDef.dadoGolpe + modCon;
    setDatos(d => ({ ...d, pgMax: hp > 0 ? hp : 1, pg: hp > 0 ? hp : 1, ca: 10 + modDes, dadoGolpe: claseDef.dadoGolpe }));
  }, [datos.clase, datos.caracteristicas, clases]);

  const irSiguiente = () => setPasoActual(p => Math.min(PASOS.length - 1, p + 1));
  const irAnterior = () => setPasoActual(p => Math.max(0, p - 1));

  const finalizar = () => {
    // Recopilar equipo: objetos fijos + opciones elegidas
    const claveClase = clases.find(c => c.nombre === datos.clase)?.clave || 'guerrero';
    const equipoClase = EQUIPO_INICIAL[claveClase];
    const nombresObjetos = [];

    // Objetos fijos
    if (equipoClase?.fijo) {
      nombresObjetos.push(...equipoClase.fijo);
    }

    // Opciones elegidas
    if (equipoClase?.elecciones) {
      equipoClase.elecciones.forEach((eleccion, idx) => {
        const selIdx = equipoSeleccionado[idx] ?? 0;
        const opcion = eleccion.opciones[selIdx];
        if (opcion) {
          nombresObjetos.push(...opcion.objetos);
        }
      });
    }

    // Convertir nombres a objetos del catálogo
    const equipoFinal = nombresObjetos.map(nombreOriginal => {
      let nombreBase = nombreOriginal;
      let cantidad = 1;
      
      const match = nombreOriginal.match(/(.+?)\s*\((\d+)\)$/);
      if (match) {
        nombreBase = match[1].trim();
        cantidad = parseInt(match[2], 10);
      }

      const obj = EQUIPO.find(e => e.nombre === nombreOriginal) || EQUIPO.find(e => e.nombre === nombreBase);
      
      return {
        ...(obj || { nombre: nombreOriginal, tipo: 'Equipo', subtipo: 'Equipo de aventurero', coste: '—', peso: '—', descripcion: '' }),
        nombre: nombreBase,
        id_instancia: crypto.randomUUID(),
        cantidad: cantidad,
        equipado: false,
      };
    });

    alGuardar({ ...datos, id: crypto.randomUUID(), equipo: equipoFinal });
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 animate-fade-in flex flex-col h-[calc(100vh-2rem)]">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-cinzel font-bold text-sangre-100">Forja tu Leyenda</h1>
          <button onClick={alCancelar} className="text-stone-400 hover:text-white transition-colors">Cancelar</button>
        </div>
        
        {/* Stepper */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-dndoscuro-300 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className="absolute left-0 top-1/2 h-0.5 bg-sangre-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${(pasoActual / (PASOS.length - 1)) * 100}%` }}></div>
          
          {PASOS.map((paso, index) => {
            const completado = index < pasoActual;
            const actual = index === pasoActual;
            const Icono = paso.Icono;
            return (
              <div key={paso.id} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${actual ? 'bg-sangre-700 border-sangre-400 shadow-neon' : completado ? 'bg-sangre-800 border-sangre-600' : 'bg-dndoscuro-400 border-dndoscuro-200'}`}>
                  <Icono className={`w-5 h-5 ${actual || completado ? 'text-white' : 'text-stone-500'}`} />
                </div>
                <span className={`text-xs font-cinzel hidden sm:block ${actual ? 'text-sangre-100 font-bold' : completado ? 'text-stone-300' : 'text-stone-500'}`}>{paso.titulo}</span>
              </div>
            );
          })}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto glass-panel p-6 sm:p-8 relative">
        {pasoActual === 0 && <PasoIdentidad datos={datos} setDatos={setDatos} misPartidasJugador={misPartidasJugador} />}
        {pasoActual === 1 && (
          <PasoRaza
            datos={datos} setDatos={setDatos} razas={razas}
            crearRaza={crearRaza} editarRaza={editarRaza} eliminarRaza={eliminarRaza}
            agregarSubraza={agregarSubraza} editarSubraza={editarSubraza} eliminarSubraza={eliminarSubraza}
          />
        )}
        {pasoActual === 2 && (
          <PasoClase datos={datos} setDatos={setDatos} clases={clases} crearClase={crearClase} editarClase={editarClase} eliminarClase={eliminarClase} />
        )}
        {pasoActual === 3 && <PasoCaracteristicas datos={datos} setDatos={setDatos} />}
        {pasoActual === 4 && (
          <PasoTrasfondo
            datos={datos} setDatos={setDatos} trasfondos={trasfondos} esTrasfondoPersonalizado={esTrasfondoPersonalizado}
            crearTrasfondo={crearTrasfondo} editarTrasfondo={editarTrasfondo} eliminarTrasfondo={eliminarTrasfondo}
          />
        )}
        {pasoActual === 5 && <PasoEquipo datos={datos} clases={clases} equipoSeleccionado={equipoSeleccionado} setEquipoSeleccionado={setEquipoSeleccionado} />}
        {pasoActual === 6 && <PasoResumen datos={datos} clases={clases} equipoSeleccionado={equipoSeleccionado} />}
      </main>

      <footer className="mt-6 flex justify-between items-center bg-dndoscuro-200/50 p-4 rounded-xl border border-white/5">
        <button onClick={irAnterior} disabled={pasoActual === 0} className={`btn-secondary flex items-center gap-2 ${pasoActual === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        {pasoActual === PASOS.length - 1 ? (
          <button onClick={finalizar} className="btn-primary flex items-center gap-2">
            <Check className="w-4 h-4" /> Finalizar y Crear
          </button>
        ) : (
          <button onClick={irSiguiente} className="btn-primary flex items-center gap-2">
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
}

function PasoIdentidad({ datos, setDatos, misPartidasJugador = [] }) {
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setDatos({ ...datos, avatar: ev.target.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-cinzel text-sangre-100 mb-6 border-b border-white/10 pb-2">¿Quién es tu héroe?</h2>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-6 w-full">
          <div>
            <label className="block text-stone-300 font-cinzel mb-2">Nombre del Personaje</label>
            <input 
              type="text" 
              value={datos.nombre} 
              onChange={e => setDatos({...datos, nombre: e.target.value})}
              placeholder="Ej. Artemis Entreri"
              className="input-dnd text-lg"
            />
          </div>

          {misPartidasJugador.length > 0 && (
            <div>
              <label className="block text-stone-300 font-cinzel mb-2">Asignar a Partida (Opcional)</label>
              <select
                value={datos.partida_id || ''}
                onChange={e => setDatos({...datos, partida_id: e.target.value})}
                className="input-dnd"
              >
                <option value="">-- Sin asignar --</option>
                {misPartidasJugador.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-stone-300 font-cinzel mb-2">Alineamiento</label>
            <select 
              value={datos.alineamiento} 
              onChange={e => setDatos({...datos, alineamiento: e.target.value})}
              className="input-dnd appearance-none"
            >
              {ALINEAMIENTOS.map(a => <option key={a} value={a} className="bg-dndoscuro-400">{a}</option>)}
            </select>
            <p className="text-sm text-stone-400 mt-2 italic">El alineamiento representa la brújula moral de tu personaje.</p>
          </div>
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <label className="block text-stone-300 font-cinzel mb-2 w-full text-center">Retrato</label>
          <div className="relative w-48 h-64 border-2 border-dashed border-stone-600 rounded-xl overflow-hidden group hover:border-sangre-500 transition-colors">
            {datos.avatar ? (
              <img src={datos.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 bg-dndoscuro-400/30">
                <ImageIcon className="w-12 h-12 mb-2 opacity-50 group-hover:text-sangre-400 transition-colors" />
                <span className="text-sm font-cinzel text-center px-4 group-hover:text-stone-300">Haz clic para subir imagen</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhoto} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PasoRaza({ datos, setDatos, razas, crearRaza, editarRaza, eliminarRaza, agregarSubraza, editarSubraza, eliminarSubraza }) {
  const razaActual = razas.find(r => r.nombre === datos.raza) || razas[0];
  const [modalRaza, setModalRaza] = useState(null); // null | 'nueva' | raza (editar)
  const [modalSubraza, setModalSubraza] = useState(null); // null | 'nueva' | nombreSubraza (editar)

  const seleccionarRaza = (raza) => setDatos({ ...datos, raza: raza.nombre, subraza: raza.subrazas[0] || '' });

  const manejarEliminarRaza = (raza) => {
    if (!window.confirm(`¿Eliminar la raza "${raza.nombre}"? Esta acción no se puede deshacer.`)) return;
    eliminarRaza(raza.clave);
    if (datos.raza === raza.nombre) {
      const primeraSrd = razas.find(r => !r.personalizada) || razas[0];
      setDatos(d => ({ ...d, raza: primeraSrd.nombre, subraza: primeraSrd.subrazas[0] || '' }));
    }
  };

  const manejarEliminarSubraza = (sub) => {
    if (!window.confirm(`¿Eliminar la subraza "${sub}"?`)) return;
    eliminarSubraza(razaActual.clave, sub);
    if (datos.subraza === sub) setDatos(d => ({ ...d, subraza: '' }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-cinzel text-sangre-100 mb-6 border-b border-white/10 pb-2">Elige tu Linaje</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {razas.map(raza => (
          <div key={raza.clave} className="group relative">
            <button
              onClick={() => seleccionarRaza(raza)}
              className={`w-full h-full p-4 rounded-xl border text-left transition-all duration-300 ${datos.raza === raza.nombre ? 'bg-sangre-800/40 border-sangre-500 shadow-neon' : 'bg-dndoscuro-400/30 border-white/5 hover:border-white/20'}`}
            >
              <h3 className="font-cinzel text-lg font-bold text-stone-200 pr-10">{raza.nombre}</h3>
            </button>
            {raza.personalizada && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <BotonIcono onClick={() => setModalRaza(raza)} Icono={Pencil} titulo="Editar raza" />
                <BotonIcono onClick={() => manejarEliminarRaza(raza)} Icono={Trash2} titulo="Eliminar raza" />
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => setModalRaza('nueva')}
          className="p-4 rounded-xl border border-dashed border-white/20 text-left transition-all duration-300 hover:border-sangre-500 hover:bg-sangre-900/10 flex items-center gap-2 text-stone-400 hover:text-sangre-300"
        >
          <Plus className="w-5 h-5" /> <span className="font-cinzel font-bold">Crear Raza</span>
        </button>
      </div>

      <div className="mt-8 animate-fade-in">
        <label className="block text-stone-300 font-cinzel mb-3">
          Subraza {razaActual.subrazas.length === 0 && <span className="text-stone-500 font-normal text-sm">(opcional)</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {razaActual.subrazas.map(sub => {
            const esPersonalizada = razaActual.subrazasPersonalizadas.includes(sub);
            const seleccionada = datos.subraza === sub;
            return (
              <div key={sub} className={`group flex items-center rounded-lg overflow-hidden transition-all ${seleccionada ? 'bg-sangre-700' : 'bg-dndoscuro-300'}`}>
                <button
                  onClick={() => setDatos({ ...datos, subraza: sub })}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${seleccionada ? 'text-white' : 'text-stone-400 hover:text-white'}`}
                >
                  {sub}
                </button>
                {esPersonalizada && (
                  <span className="flex items-center gap-1 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <BotonIcono onClick={() => setModalSubraza(sub)} Icono={Pencil} titulo="Editar subraza" />
                    <BotonIcono onClick={() => manejarEliminarSubraza(sub)} Icono={Trash2} titulo="Eliminar subraza" />
                  </span>
                )}
              </div>
            );
          })}
          <button
            onClick={() => setModalSubraza('nueva')}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-dashed border-white/20 text-stone-400 hover:text-sangre-300 hover:border-sangre-500 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Crear Subraza
          </button>
        </div>
      </div>

      {modalRaza && (
        <ModalCreadorPersonalizado
          key={modalRaza === 'nueva' ? 'raza-nueva' : `raza-editar-${modalRaza.clave}`}
          tipo="raza"
          valorInicial={modalRaza === 'nueva' ? null : modalRaza}
          alCerrar={() => setModalRaza(null)}
          onGuardar={(datosForm) => {
            if (modalRaza === 'nueva') {
              const raza = crearRaza(datosForm.nombre, datosForm.subrazas);
              setDatos(d => ({ ...d, raza: raza.nombre, subraza: raza.subrazas[0] || '' }));
            } else {
              const nombreViejo = modalRaza.nombre;
              const razaActualizada = editarRaza(modalRaza.clave, datosForm);
              if (datos.raza === nombreViejo) {
                setDatos(d => ({
                  ...d,
                  raza: razaActualizada.nombre,
                  subraza: razaActualizada.subrazas.includes(d.subraza) ? d.subraza : (razaActualizada.subrazas[0] || ''),
                }));
              }
            }
          }}
        />
      )}
      {modalSubraza && (
        <ModalCreadorPersonalizado
          key={modalSubraza === 'nueva' ? `subraza-nueva-${razaActual.clave}` : `subraza-editar-${razaActual.clave}-${modalSubraza}`}
          tipo="subraza"
          contexto={razaActual.nombre}
          valorInicial={modalSubraza === 'nueva' ? null : { nombre: modalSubraza }}
          alCerrar={() => setModalSubraza(null)}
          onGuardar={(nombreNuevo) => {
            if (modalSubraza === 'nueva') {
              agregarSubraza(razaActual.clave, nombreNuevo);
              setDatos(d => ({ ...d, subraza: nombreNuevo }));
            } else {
              editarSubraza(razaActual.clave, modalSubraza, nombreNuevo);
              if (datos.subraza === modalSubraza) setDatos(d => ({ ...d, subraza: nombreNuevo }));
            }
          }}
        />
      )}
    </div>
  );
}

function PasoClase({ datos, setDatos, clases, crearClase, editarClase, eliminarClase }) {
  const [modalClase, setModalClase] = useState(null); // null | 'nueva' | clase (editar)

  const manejarEliminar = (clase) => {
    if (!window.confirm(`¿Eliminar la clase "${clase.nombre}"? Esta acción no se puede deshacer.`)) return;
    eliminarClase(clase.clave);
    if (datos.clase === clase.nombre) {
      const primeraSrd = clases.find(c => !c.personalizada) || clases[0];
      setDatos(d => ({ ...d, clase: primeraSrd.nombre }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-cinzel text-sangre-100 mb-6 border-b border-white/10 pb-2">Vocación y Clase</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {clases.map(clase => (
          <div key={clase.clave} className="group relative">
            <button
              onClick={() => setDatos({ ...datos, clase: clase.nombre })}
              className={`w-full h-full p-4 rounded-xl border text-left transition-all duration-300 ${datos.clase === clase.nombre ? 'bg-sangre-800/40 border-sangre-500 shadow-neon' : 'bg-dndoscuro-400/30 border-white/5 hover:border-white/20'}`}
            >
              <h3 className="font-cinzel text-lg font-bold text-stone-200 pr-10">{clase.nombre}</h3>
              <p className="text-xs text-stone-500 mt-1">Dado de Golpe: d{clase.dadoGolpe}</p>
            </button>
            {clase.personalizada && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <BotonIcono onClick={() => setModalClase(clase)} Icono={Pencil} titulo="Editar clase" />
                <BotonIcono onClick={() => manejarEliminar(clase)} Icono={Trash2} titulo="Eliminar clase" />
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => setModalClase('nueva')}
          className="p-4 rounded-xl border border-dashed border-white/20 text-left transition-all duration-300 hover:border-sangre-500 hover:bg-sangre-900/10 flex items-center gap-2 text-stone-400 hover:text-sangre-300"
        >
          <Plus className="w-5 h-5" /> <span className="font-cinzel font-bold">Crear Clase</span>
        </button>
      </div>
      {modalClase && (
        <ModalCreadorPersonalizado
          key={modalClase === 'nueva' ? 'clase-nueva' : `clase-editar-${modalClase.clave}`}
          tipo="clase"
          valorInicial={modalClase === 'nueva' ? null : modalClase}
          alCerrar={() => setModalClase(null)}
          onGuardar={(datosForm) => {
            if (modalClase === 'nueva') {
              const clase = crearClase(datosForm.nombre, datosForm.dadoGolpe);
              setDatos(d => ({ ...d, clase: clase.nombre }));
            } else {
              const nombreViejo = modalClase.nombre;
              const claseActualizada = editarClase(modalClase.clave, datosForm);
              if (datos.clase === nombreViejo) setDatos(d => ({ ...d, clase: claseActualizada.nombre }));
            }
          }}
        />
      )}
    </div>
  );
}

function BotonIcono({ onClick, Icono, titulo }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={titulo}
      className="p-1 rounded bg-dndoscuro-900/70 text-stone-300 hover:text-white hover:bg-sangre-700 transition-colors"
    >
      <Icono className="w-3.5 h-3.5" />
    </button>
  );
}

function PasoCaracteristicas({ datos, setDatos }) {
  const caracteristicas = Object.keys(datos.caracteristicas);
  const arrEstandar = [15, 14, 13, 12, 10, 8];
  
  const actualizarCar = (car, val) => {
    setDatos({
      ...datos,
      caracteristicas: { ...datos.caracteristicas, [car]: parseInt(val) || 0 }
    });
  };

  const asigarEstandar = () => {
    setDatos({
      ...datos,
      caracteristicas: { fue: 15, des: 14, con: 13, int: 12, sab: 10, car: 8 }
    });
  };

  const tirarDados = () => {
    const tirar4d6 = () => {
      const tiradas = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      tiradas.sort((a, b) => a - b);
      return tiradas[1] + tiradas[2] + tiradas[3];
    };
    setDatos({
      ...datos,
      caracteristicas: { fue: tirar4d6(), des: tirar4d6(), con: tirar4d6(), int: tirar4d6(), sab: tirar4d6(), car: tirar4d6() }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-6 gap-4">
        <h2 className="text-2xl font-cinzel text-sangre-100">Atributos Base</h2>
        <div className="flex gap-3">
          <button onClick={tirarDados} className="flex items-center gap-2 px-3 py-1.5 rounded bg-dndoscuro-400 border border-white/10 hover:bg-dndoscuro-300 text-sm text-stone-200 transition-colors">
            <DicesIcon className="w-4 h-4" /> Tirar Dados
          </button>
          <button onClick={asigarEstandar} className="flex items-center gap-2 px-3 py-1.5 rounded bg-dndoscuro-400 border border-white/10 hover:bg-dndoscuro-300 text-sm text-stone-200 transition-colors">
            Array Estándar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {caracteristicas.map(car => (
          <div key={car} className="bg-dndoscuro-400/20 p-4 rounded-xl border border-white/5 flex flex-col items-center">
            <label className="font-cinzel text-stone-300 uppercase tracking-widest text-sm mb-3">{car}</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={datos.caracteristicas[car]}
              onChange={(e) => actualizarCar(car, e.target.value)}
              className="bg-transparent text-4xl text-center font-bold text-white w-full outline-none"
            />
            <div className="mt-2 text-stone-500 text-xs font-mono bg-dndoscuro-900/50 px-2 py-1 rounded">
              Mod: {Math.floor((datos.caracteristicas[car] - 10) / 2) >= 0 ? '+' : ''}{Math.floor((datos.caracteristicas[car] - 10) / 2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PasoTrasfondo({ datos, setDatos, trasfondos, esTrasfondoPersonalizado, crearTrasfondo, editarTrasfondo, eliminarTrasfondo }) {
  const [modalTrasfondo, setModalTrasfondo] = useState(null); // null | 'nueva' | nombreString (editar)

  const manejarEliminar = (nombre) => {
    if (!window.confirm(`¿Eliminar el trasfondo "${nombre}"?`)) return;
    eliminarTrasfondo(nombre);
    if (datos.trasfondo === nombre) setDatos(d => ({ ...d, trasfondo: '' }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-cinzel text-sangre-100 mb-6 border-b border-white/10 pb-2">Historia y Trasfondo</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {trasfondos.map(t => {
          const personalizado = esTrasfondoPersonalizado(t);
          return (
            <div key={t} className="group relative">
              <button
                onClick={() => setDatos({ ...datos, trasfondo: t })}
                className={`w-full p-3 rounded-xl border text-center transition-all duration-300 ${datos.trasfondo === t ? 'bg-sangre-800/40 border-sangre-500 text-white shadow-neon' : 'bg-dndoscuro-400/30 border-white/5 text-stone-400 hover:border-white/20'}`}
              >
                {t}
              </button>
              {personalizado && (
                <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BotonIcono onClick={() => setModalTrasfondo(t)} Icono={Pencil} titulo="Editar trasfondo" />
                  <BotonIcono onClick={() => manejarEliminar(t)} Icono={Trash2} titulo="Eliminar trasfondo" />
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={() => setModalTrasfondo('nueva')}
          className="p-3 rounded-xl border border-dashed border-white/20 text-center transition-all duration-300 hover:border-sangre-500 hover:bg-sangre-900/10 flex items-center justify-center gap-1.5 text-stone-400 hover:text-sangre-300"
        >
          <Plus className="w-4 h-4" /> Crear Trasfondo
        </button>
      </div>
      {modalTrasfondo && (
        <ModalCreadorPersonalizado
          key={modalTrasfondo === 'nueva' ? 'trasfondo-nuevo' : `trasfondo-editar-${modalTrasfondo}`}
          tipo="trasfondo"
          valorInicial={modalTrasfondo === 'nueva' ? null : { nombre: modalTrasfondo }}
          alCerrar={() => setModalTrasfondo(null)}
          onGuardar={(nombreNuevo) => {
            if (modalTrasfondo === 'nueva') {
              crearTrasfondo(nombreNuevo);
              setDatos(d => ({ ...d, trasfondo: nombreNuevo }));
            } else {
              editarTrasfondo(modalTrasfondo, nombreNuevo);
              if (datos.trasfondo === modalTrasfondo) setDatos(d => ({ ...d, trasfondo: nombreNuevo }));
            }
          }}
        />
      )}
    </div>
  );
}

function PasoEquipo({ datos, clases, equipoSeleccionado, setEquipoSeleccionado }) {
  const claveClase = clases.find(c => c.nombre === datos.clase)?.clave || 'guerrero';
  const equipoClase = EQUIPO_INICIAL[claveClase];

  if (!equipoClase) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-cinzel text-sangre-100 mb-6 border-b border-white/10 pb-2">Equipo Inicial</h2>
        <p className="text-stone-400">No hay opciones de equipo definidas para esta clase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-cinzel text-sangre-100 mb-2 border-b border-white/10 pb-2">Equipo Inicial de {equipoClase.nombre}</h2>
      <p className="text-sm text-stone-400 -mt-4">Elige tu equipamiento de partida. Cada grupo ofrece varias opciones; selecciona la que prefieras.</p>

      {/* Elecciones */}
      {equipoClase.elecciones.map((eleccion, idx) => (
        <div key={idx} className="bg-dndoscuro-400/20 rounded-xl border border-white/5 p-4">
          <h3 className="font-cinzel text-stone-200 mb-3 text-sm uppercase tracking-wider">{eleccion.label}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {eleccion.opciones.map((opcion, opIdx) => {
              const seleccionada = (equipoSeleccionado[idx] ?? 0) === opIdx;
              return (
                <button
                  key={opIdx}
                  onClick={() => setEquipoSeleccionado({ ...equipoSeleccionado, [idx]: opIdx })}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${seleccionada ? 'bg-sangre-800/40 border-sangre-500 shadow-neon' : 'bg-dndoscuro-400/30 border-white/5 hover:border-white/20'}`}
                >
                  <span className={`font-semibold text-sm ${seleccionada ? 'text-white' : 'text-stone-300'}`}>{opcion.nombre}</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {opcion.objetos.map((obj, oIdx) => (
                      <span key={oIdx} className="text-[10px] bg-dndoscuro-900/50 text-stone-400 px-1.5 py-0.5 rounded">{obj}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Equipo fijo */}
      {equipoClase.fijo.length > 0 && (
        <div className="bg-dndoscuro-400/20 rounded-xl border border-white/5 p-4">
          <h3 className="font-cinzel text-stone-200 mb-3 text-sm uppercase tracking-wider">Equipo Fijo (siempre incluido)</h3>
          <div className="flex flex-wrap gap-2">
            {equipoClase.fijo.map((obj, i) => (
              <span key={i} className="text-xs bg-dndoscuro-300/50 text-stone-300 border border-white/10 px-2 py-1 rounded-lg">{obj}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PasoResumen({ datos, clases, equipoSeleccionado }) {
  // Generar lista de equipo para el resumen
  const claveClase = clases.find(c => c.nombre === datos.clase)?.clave || 'guerrero';
  const equipoClase = EQUIPO_INICIAL[claveClase];
  const nombresEquipo = [];
  if (equipoClase?.fijo) nombresEquipo.push(...equipoClase.fijo);
  if (equipoClase?.elecciones) {
    equipoClase.elecciones.forEach((eleccion, idx) => {
      const selIdx = equipoSeleccionado?.[idx] ?? 0;
      const opcion = eleccion.opciones[selIdx];
      if (opcion) nombresEquipo.push(...opcion.objetos);
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-cinzel text-sangre-100 mb-4 border-b border-white/10 pb-2">El Héroe está Listo</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="w-48 h-64 border border-stone-700 rounded-xl overflow-hidden bg-dndoscuro-400 mb-4 shadow-glass">
            {datos.avatar ? (
              <img src={datos.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-500"><User className="w-16 h-16" /></div>
            )}
          </div>
          <h3 className="text-2xl font-cinzel font-bold text-white text-center">{datos.nombre || 'Héroe Anónimo'}</h3>
          <p className="text-sangre-400 font-serif italic text-center">{datos.alineamiento}</p>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-dndoscuro-300/30 p-4 rounded-xl border border-white/5">
            <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Raza</span>
            <span className="text-lg font-cinzel text-stone-200">{datos.raza} {datos.subraza ? `(${datos.subraza})` : ''}</span>
          </div>
          <div className="bg-dndoscuro-300/30 p-4 rounded-xl border border-white/5">
            <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Clase</span>
            <span className="text-lg font-cinzel text-stone-200">{datos.clase} (Nivel {datos.nivel})</span>
          </div>
          <div className="bg-dndoscuro-300/30 p-4 rounded-xl border border-white/5">
            <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Trasfondo</span>
            <span className="text-lg font-cinzel text-stone-200">{datos.trasfondo}</span>
          </div>
          <div className="bg-dndoscuro-300/30 p-4 rounded-xl border border-white/5 flex gap-4">
            <div>
              <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">Puntos de Golpe</span>
              <span className="text-lg font-bold text-sangre-400">{datos.pgMax}</span>
            </div>
            <div>
              <span className="block text-xs text-stone-500 uppercase tracking-wider mb-1">CA</span>
              <span className="text-lg font-bold text-stone-300">{datos.ca}</span>
            </div>
          </div>
          
          <div className="col-span-2 bg-dndoscuro-300/30 p-4 rounded-xl border border-white/5 mt-4">
            <span className="block text-xs text-stone-500 uppercase tracking-wider mb-3">Atributos Base</span>
            <div className="flex justify-between px-2">
              {Object.keys(datos.caracteristicas).map(c => (
                <div key={c} className="text-center">
                  <span className="block text-stone-400 uppercase text-xs">{c}</span>
                  <span className="font-bold text-white text-lg">{datos.caracteristicas[c]}</span>
                </div>
              ))}
            </div>
          </div>

          {nombresEquipo.length > 0 && (
            <div className="col-span-2 bg-dndoscuro-300/30 p-4 rounded-xl border border-white/5">
              <span className="block text-xs text-stone-500 uppercase tracking-wider mb-3">Equipo Inicial</span>
              <div className="flex flex-wrap gap-1.5">
                {nombresEquipo.map((obj, i) => (
                  <span key={i} className="text-xs bg-dndoscuro-400/50 text-stone-300 border border-white/10 px-2 py-1 rounded">{obj}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-sangre-900/40 border border-sangre-500/30 p-4 rounded-lg text-sm text-sangre-200 flex items-start gap-3">
        <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>Atención: Una vez creado el personaje, atributos vitales como la Raza, Clase, Trasfondo y Características Base no podrán ser modificados desde la Ficha de Personaje.</p>
      </div>
    </div>
  );
}
