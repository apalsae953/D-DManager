import { createPortal } from 'react-dom';
import { X, Upload, Trash2, User } from 'lucide-react';

export function ModalFotoPersonaje({ abierto, alCerrar, avatar, nombrePersonaje, clasePersonaje, nivelPersonaje, onCambiarFoto, onQuitarFoto, modoLectura = false }) {
  if (!abierto) return null;

  const handleSeleccionarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onCambiarFoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={alCerrar}
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-dndoscuro-900 border border-sangre-600/40 p-6 shadow-2xl flex flex-col items-center animate-scale-in text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={alCerrar}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Título de Cabecera */}
        <div className="text-center mb-5 pr-6 pl-6">
          <h2 className="text-2xl font-cinzel font-bold text-sangre-100 drop-shadow-md">
            {nombrePersonaje || 'Retrato del Personaje'}
          </h2>
          {(clasePersonaje || nivelPersonaje) && (
            <p className="text-sm font-serif text-stone-400 mt-0.5">
              {clasePersonaje} · Nivel {nivelPersonaje || 1}
            </p>
          )}
        </div>

        {/* Imagen en Grande */}
        <div className="relative w-72 h-96 sm:w-80 sm:h-[400px] rounded-xl overflow-hidden border-2 border-sangre-700/60 shadow-neon bg-dndoscuro-950 flex items-center justify-center mb-6">
          {avatar ? (
            <img 
              src={avatar} 
              alt={nombrePersonaje || 'Avatar'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-stone-600 p-6 text-center">
              <User className="w-24 h-24 mb-3 opacity-40" />
              <span className="text-sm font-cinzel text-stone-500">Sin retrato asignado</span>
            </div>
          )}
        </div>

        {/* Opciones y Acciones */}
        {!modoLectura ? (
          <div className="flex flex-wrap items-center justify-center gap-3 w-full border-t border-white/10 pt-4">
            <label className="btn-primary flex items-center gap-2 cursor-pointer px-5 py-2.5 text-sm">
              <Upload className="w-4 h-4" />
              <span>{avatar ? 'Cambiar Foto' : 'Subir Foto'}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleSeleccionarArchivo} 
                className="hidden" 
              />
            </label>

            {avatar && (
              <button
                onClick={() => {
                  if (window.confirm('¿Seguro que quieres quitar el retrato de tu personaje?')) {
                    onQuitarFoto();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dndoscuro-400 hover:bg-red-950/60 text-stone-300 hover:text-red-400 border border-white/10 hover:border-red-600/40 text-sm font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Quitar Foto
              </button>
            )}

            <button
              onClick={alCerrar}
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="flex justify-center w-full border-t border-white/10 pt-4">
            <button
              onClick={alCerrar}
              className="btn-secondary px-8 py-2 text-sm"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
