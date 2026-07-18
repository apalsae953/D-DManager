import { useState, useEffect } from 'react';
import { ALINEAMIENTOS } from '../../datos/datosCreacion.js';
import { useDatosPersonalizados } from '../../hooks/useDatosPersonalizados.js';

function Campo({ etiqueta, ayuda, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">{etiqueta}</span>
      {children}
      {ayuda && <span className="mt-1 block text-[11px] text-stone-400">{ayuda}</span>}
    </label>
  );
}

export function PanelDatosGenerales({ personaje, actualizarCampo, soloLectura = false }) {
  const { razas, clases, trasfondos } = useDatosPersonalizados();
  const razaNormalizada = personaje.raza?.toLowerCase() || '';
  const claseNormalizada = personaje.clase?.toLowerCase() || '';

  const razaSeleccionada = razas.find((r) => r.clave === razaNormalizada);
  const claseSeleccionada = clases.find((c) => c.clave === claseNormalizada);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Nombre del personaje">
          <input
            value={personaje.nombre}
            onChange={(evento) => actualizarCampo('nombre', evento.target.value)}
            disabled={soloLectura}
            placeholder="Ej. Elyndra Lunanoche"
            className="input-dnd"
          />
        </Campo>

        <Campo etiqueta="Raza">
          <select
            value={razaNormalizada}
            onChange={(evento) => {
              actualizarCampo('raza', evento.target.value);
              actualizarCampo('subraza', '');
            }}
            disabled={true}
            className="input-dnd appearance-none"
          >
            {razas.map((r) => (
              <option key={r.clave} value={r.clave} className="bg-dndoscuro-400">
                {r.nombre}
              </option>
            ))}
            {/* Si la raza personalizada de este personaje se borró o renombró después, seguimos mostrando su nombre en vez de dejar el select en blanco. */}
            {!razaSeleccionada && personaje.raza && (
              <option value={razaNormalizada} className="bg-dndoscuro-400">{personaje.raza} (eliminada)</option>
            )}
          </select>
        </Campo>

        {(razaSeleccionada?.subrazas.length > 0 || personaje.subraza) && (
          <Campo etiqueta="Subraza">
            <select
              value={personaje.subraza}
              onChange={(evento) => actualizarCampo('subraza', evento.target.value)}
              disabled={true}
              className="input-dnd appearance-none"
            >
              <option value="" className="bg-dndoscuro-400">-- Selecciona --</option>
              {razaSeleccionada?.subrazas.map((s) => (
                <option key={s} value={s} className="bg-dndoscuro-400">
                  {s}
                </option>
              ))}
              {!razaSeleccionada?.subrazas.includes(personaje.subraza) && personaje.subraza && (
                <option value={personaje.subraza} className="bg-dndoscuro-400">{personaje.subraza} (eliminada)</option>
              )}
            </select>
          </Campo>
        )}

        <Campo etiqueta="Clase">
          <select
            value={claseNormalizada}
            onChange={(evento) => actualizarCampo('clase', evento.target.value)}
            disabled={true}
            className="input-dnd appearance-none"
          >
            {clases.map((c) => (
              <option key={c.clave} value={c.clave} className="bg-dndoscuro-400">
                {c.nombre}
              </option>
            ))}
            {!claseSeleccionada && personaje.clase && (
              <option value={claseNormalizada} className="bg-dndoscuro-400">{personaje.clase} (eliminada)</option>
            )}
          </select>
        </Campo>

        <Campo
          etiqueta={claseSeleccionada?.nombreSubclase || "Subclase"}
          ayuda={
            personaje.nivel < (claseSeleccionada?.nivelSubclase || 1)
              ? `Especialización en Nivel ${claseSeleccionada?.nivelSubclase}`
              : `Elige tu especialidad`
          }
        >
          {personaje.nivel < (claseSeleccionada?.nivelSubclase || 1) ? (
            <div className="input-dnd bg-dndoscuro-400 text-stone-500 cursor-not-allowed">
              Bloqueado (Req. Nivel {claseSeleccionada?.nivelSubclase})
            </div>
          ) : (
            <select
              value={personaje.subclase ?? ''}
              onChange={(evento) => {
                actualizarCampo('subclase', evento.target.value);
                if (!personaje.subclase_original && evento.target.value !== '') {
                  actualizarCampo('subclase_original', evento.target.value);
                }
              }}
              disabled={soloLectura}
              className="input-dnd appearance-none"
            >
              <option value="" className="bg-dndoscuro-400">-- Selecciona tu camino --</option>
              {claseSeleccionada?.subclases?.map((sub) => {
                const subKey = sub.toLowerCase();
                const esOriginal = personaje.subclase_original === subKey;
                return (
                  <option key={sub} value={subKey} className="bg-dndoscuro-400">
                    {sub} {esOriginal ? '(Elección Original)' : ''}
                  </option>
                );
              })}
            </select>
          )}
        </Campo>

        <Campo etiqueta="Trasfondo">
          <input
            list="trasfondos-list"
            value={personaje.trasfondo || ''}
            onChange={(evento) => actualizarCampo('trasfondo', evento.target.value)}
            disabled={soloLectura}
            placeholder="Escribe o selecciona..."
            className="input-dnd"
          />
          <datalist id="trasfondos-list">
            {trasfondos.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </Campo>

        <Campo etiqueta="Alineamiento">
          <select
            value={personaje.alineamiento}
            onChange={(evento) => actualizarCampo('alineamiento', evento.target.value)}
            disabled={soloLectura}
            className="input-dnd appearance-none"
          >
            <option value="" className="bg-dndoscuro-400">-- Selecciona --</option>
            {ALINEAMIENTOS.map((a) => (
              <option key={a} value={a} className="bg-dndoscuro-400">
                {a}
              </option>
            ))}
          </select>
        </Campo>
      </div>
    </div>
  );
}
