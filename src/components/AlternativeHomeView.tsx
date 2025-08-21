import React from 'react';
import { Users, UserCheck, ArrowRight } from 'lucide-react';

interface AlternativeHomeViewProps {
  onSelectRole: (role: 'user' | 'coordinator') => void;
}

const AlternativeHomeView: React.FC<AlternativeHomeViewProps> = ({ onSelectRole }) => {
  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-white"
      style={{
        backgroundImage: 'url(https://i.imgur.com/rxJNz2M.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay with subtle opacity */}
      <div className="absolute inset-0 bg-slate-900 bg-opacity-75"></div>
      
      <div className="relative z-10 w-full max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="mb-6 sm:mb-8">
            <img
              src="https://web.tnrapp.com.co/assets/image/logo-menu.png"
              alt="Logo TNR"
              className="h-16 w-auto sm:h-20 lg:h-24 mx-auto mb-4 sm:mb-6 drop-shadow-2xl"
            />
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-300 mb-2">
            Unión Temporal Nuevo Renetur
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400">
            Seleccione su perfil para continuar
          </p>
        </header>

        {/* Main Content - Full Width Cards */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 min-h-[50vh] sm:min-h-[60vh]">
          {/* User Card */}
          <button
            onClick={() => onSelectRole('user')}
            className="group flex flex-col items-center justify-center bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 p-8 sm:p-10 lg:p-12 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-center h-full border border-slate-700/50"
          >
            <div className="bg-green-500 p-4 sm:p-5 lg:p-6 rounded-full shadow-md mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
              <Users className="text-white h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3 sm:mb-4">
              Soy Usuario
            </h2>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 flex-grow max-w-md leading-relaxed px-2">
              Solicite y gestione sus servicios de transporte médico de manera fácil y rápida.
            </p>
            <div className="mt-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg lg:text-xl font-medium text-white bg-green-500 border border-transparent rounded-full shadow-sm hover:bg-green-600 group-hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 transition-colors">
              Acceder como Usuario
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Coordinator Card */}
          <button
            onClick={() => onSelectRole('coordinator')}
            className="group flex flex-col items-center justify-center bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 p-8 sm:p-10 lg:p-12 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-center h-full border border-slate-700/50"
          >
            <div className="bg-indigo-500 p-4 sm:p-5 lg:p-6 rounded-full shadow-md mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
              <UserCheck className="text-white h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3 sm:mb-4">
              Soy Coordinador
            </h2>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 flex-grow max-w-md leading-relaxed px-2">
              Administre y supervise todos los servicios de transporte solicitados por los usuarios.
            </p>
            <div className="mt-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg lg:text-xl font-medium text-white bg-indigo-500 border border-transparent rounded-full shadow-sm hover:bg-indigo-600 group-hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors">
              Acceder como Coordinador
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 sm:mt-16 lg:mt-20">
          <p className="text-sm sm:text-base text-slate-500">
            © 2025 TNR WEB. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AlternativeHomeView;