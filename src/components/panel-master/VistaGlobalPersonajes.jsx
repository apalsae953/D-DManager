import { Heart, Shield, Eye, UserMinus } from 'lucide-react';

// Vista global en tiempo real de los personajes vinculados a la partida:
// vida actual/maxima, CA, percepcion pasiva y estado (condiciones activas).
export function VistaGlobalPersonajes({ resumenesPersonajes, onExpulsarPersonaje }) {
  if (resumenesPersonajes.length === 0) {
    return <p className="text-sm text-stone-400">Todavia no hay personajes vinculados a esta partida.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 glass-panel">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-dndoscuro-400/50 text-left text-xs font-semibold uppercase tracking-wide text-stone-400">
          <tr>
            <th className="px-3 py-2">Personaje</th>
            <th className="px-3 py-2">
              <Heart className="inline h-3.5 w-3.5 text-sangre-500" /> Vida
            </th>
            <th className="px-3 py-2">
              <Shield className="inline h-3.5 w-3.5 text-indigo-400" /> CA
            </th>
            <th className="px-3 py-2">
              <Eye className="inline h-3.5 w-3.5 text-stone-300" /> Perc. Pasiva
            </th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resumenesPersonajes.map((p) => {
            const porcentajeVida = p.pvMaximo > 0 ? Math.round((p.pvActual / p.pvMaximo) * 100) : 0;
            return (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-3 py-2">
                  <p className="font-bold font-cinzel text-stone-200">{p.nombre || 'Sin nombre'}</p>
                  <p className="text-xs text-stone-400">
                    Nivel {p.nivel} · <span className="capitalize">{p.clase}</span>
                  </p>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-200 w-12 text-right">
                      {p.pvActual}/{p.pvMaximo}
                    </span>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-dndoscuro-400 border border-white/5">
                      <div
                        className={`h-full transition-all ${porcentajeVida > 50 ? 'bg-emerald-500' : porcentajeVida > 20 ? 'bg-amber-500' : 'bg-sangre-500'}`}
                        style={{ width: `${porcentajeVida}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 font-bold text-stone-200 text-center">{p.clase_armadura}</td>
                <td className="px-3 py-2 font-bold text-stone-200 text-center">{p.percepcionPasiva}</td>
                <td className="px-3 py-2">
                  {p.condiciones.length === 0 ? (
                    <span className="text-xs text-stone-500 italic">Sin condiciones</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {p.condiciones.map((c) => (
                        <span key={c} className="rounded-full bg-sangre-900/50 border border-sangre-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sangre-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  {onExpulsarPersonaje && (
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que quieres expulsar a ${p.nombre || 'este personaje'} de la mesa?`)) {
                          onExpulsarPersonaje(p.id);
                        }
                      }}
                      className="text-stone-500 hover:text-red-500 transition-colors p-1 rounded hover:bg-white/5"
                      title="Expulsar personaje"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
