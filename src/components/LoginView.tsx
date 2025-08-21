import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, ArrowLeft, Info } from 'lucide-react';

interface LoginViewProps {
  role: 'user' | 'coordinator';
  onLogin: (success: boolean) => void;
  onGoBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ role, onLogin, onGoBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Configuración dinámica basada en el rol
  const roleConfig = {
    user: {
      title: 'Portal de Usuario',
      subtitle: 'Acceso para usuarios del sistema',
      primaryColor: 'from-blue-600 to-indigo-700',
      focusColor: 'focus:ring-indigo-500',
      accentColor: 'text-indigo-600',
      accentBg: 'bg-indigo-600',
      shadowColor: 'shadow-[0_8px_40px_rgb(99,102,241,0.35)]',
      bgShapes: ['bg-blue-300', 'bg-sky-300', 'bg-indigo-300'],
    },
    coordinator: {
      title: 'Panel de Coordinación',
      subtitle: 'Acceso exclusivo para coordinadores',
      primaryColor: 'from-green-600 to-emerald-700',
      focusColor: 'focus:ring-emerald-500',
      accentColor: 'text-emerald-600',
      accentBg: 'bg-emerald-600',
      shadowColor: 'shadow-[0_8px_40px_rgb(16,185,129,0.35)]',
      bgShapes: ['bg-green-300', 'bg-teal-300', 'bg-emerald-300'],
    }
  };

  const config = roleConfig[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Credenciales de demostración
    if (formData.username !== '123' || formData.password !== '123') {
      setError('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onLogin(true);
  };
  
  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña en desarrollo. Por favor, contacte al administrador del sistema.');
  };

  return (
    <>
      <style>{`
        @keyframes blob-move {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob-move 10s infinite; }
        .animation-delay-2000 { animation-delay: -3s; }
        .animation-delay-4000 { animation-delay: -5s; }
      `}</style>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        
        {/* Formas animadas de fondo */}
        <div className="absolute inset-0 -z-10">
          <div className={`absolute top-0 -left-12 w-80 h-80 ${config.bgShapes[0]} rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob`}></div>
          <div className={`absolute top-0 -right-12 w-80 h-80 ${config.bgShapes[1]} rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000`}></div>
          <div className={`absolute -bottom-16 left-20 w-80 h-80 ${config.bgShapes[2]} rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000`}></div>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Botón de regreso */}
          <button
            onClick={onGoBack}
            className="mb-0 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Volver a la selección
          </button>

          {/* Formulario de login con efecto glassmorphism */}
          <div className={`bg-white/75 backdrop-blur-xl rounded-3xl p-8 border border-white/40 ${config.shadowColor} transition-all duration-500`}>
            <div className="text-center mb-10">
              <img
                src="https://i.imgur.com/E9Kt3nz.png"
                alt="Logo TNR"
                className="h-16 w-auto mx-auto mb-4"
              />
              <h1 className={`text-3xl font-bold tracking-tight ${config.accentColor} mb-1`}>
                {config.title}
              </h1>
              <p className="text-gray-600">{config.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de usuario */}
              <div className="relative group">
                <User className={`h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 group-focus-within:${config.accentColor}`} />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 bg-white/60 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${config.focusColor} focus:border-transparent transition-all duration-300`}
                  placeholder="Tu nombre de usuario"
                  required
                />
              </div>

              {/* Campo de contraseña */}
              <div className="relative group">
                <Lock className={`h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 group-focus-within:${config.accentColor}`} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-12 pr-12 py-3 bg-white/60 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${config.focusColor} focus:border-transparent transition-all duration-300`}
                  placeholder="Tu contraseña segura"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-800 rounded-full p-1 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Opciones adicionales */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className={`h-4 w-4 rounded border-gray-300 focus:ring-offset-0 ${config.accentColor} ${config.focusColor}`}
                  />
                  <span className="ml-2 text-sm text-gray-700">Recuérdame</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className={`text-sm font-medium ${config.accentColor} hover:underline focus:outline-none`}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center gap-3 transition-all duration-300" role="alert">
                  <Info className="h-5 w-5 text-red-600"/>
                  <div>
                    <p className="font-bold text-sm">Error de acceso</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Botón de submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${config.primaryColor} text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.focusColor} disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.03] hover:shadow-xl ${config.shadowColor}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Verificando...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
          </div>
            
          {/* Credenciales de demostración */}
          <div className="text-center p-4 bg-white/60 backdrop-blur-lg rounded-2xl border border-white/30">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Credenciales de demostración:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold">Usuario:</span> 123</p>
              <p><span className="font-semibold">Contraseña:</span> 123</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TNR Solutions. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginView;