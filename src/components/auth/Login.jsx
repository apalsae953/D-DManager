import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

export function Login({ onModoLocal }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Convertimos el usuario en un email falso para que Supabase lo acepte
  const getFakeEmail = (user) => `${user.trim().toLowerCase().replace(/\s+/g, '')}@dndmanager.com`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!username.trim()) {
      setError("El nombre de usuario no puede estar vacío");
      setLoading(false);
      return;
    }

    const email = getFakeEmail(username);

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: username
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("User already exists")) {
          setError("Ese nombre de usuario ya existe. Por favor, elige otro.");
        } else {
          setError("Error al registrar: " + error.message);
        }
      } else {
        if (data.session) {
          // Auto login exitoso
        } else {
          // Si auto login está desactivado o requiere confirmación (aunque los .local no pueden confirmar)
          setSuccessMsg('¡Usuario creado correctamente! Ahora inicia sesión.');
          setIsRegistering(false);
          setPassword('');
          setConfirmPassword('');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Usuario o contraseña incorrectos");
        } else {
          setError("Error al iniciar sesión: " + error.message);
        }
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-stone-900 border border-white/10 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-cinzel font-bold text-sangre-500 mb-6 text-center">
          {isRegistering ? 'Crear Nuevo Usuario' : 'Acceder a D&D Manager'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded text-sm text-center">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-900/50 border border-emerald-500/50 text-emerald-200 rounded text-sm text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-400 mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-stone-950 border border-white/10 rounded-lg px-4 py-2 text-stone-200 focus:outline-none focus:border-sangre-500 transition-colors"
              placeholder="Ej: Gandalf"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-400 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-stone-200 focus:outline-none focus:border-sangre-500 transition-colors"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">
                Repetir Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-stone-200 focus:outline-none focus:border-sangre-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sangre-600 hover:bg-sangre-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Cargando...' : (isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión')}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccessMsg(null);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-stone-400 hover:text-white text-sm transition-colors"
            >
              {isRegistering 
                ? '¿Ya tienes un usuario? Inicia sesión' 
                : '¿No tienes usuario? Regístrate aquí'}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-stone-900 text-stone-500">O continuar con</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-stone-900 hover:bg-stone-200 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <button
              type="button"
              onClick={onModoLocal}
              className="text-stone-400 hover:text-white text-sm font-semibold transition-colors"
            >
              Continuar en Modo Local (Sin sincronización)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
