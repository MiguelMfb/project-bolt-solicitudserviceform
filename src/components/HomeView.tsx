import React from 'react';
import { Users, UserCheck, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onSelectRole: (role: 'user' | 'coordinator') => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectRole }) => {
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://i.imgur.com/rxJNz2M.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111426]/60 via-[#1a1b3a]/40 to-[#0d0e1f]/60"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="mb-6 sm:mb-8">
            <img
              src="https://web.tnrapp.com.co/assets/image/logo-menu.png"
              alt="Logo TNR"
              className="h-16 w-auto sm:h-20 lg:h-24 mx-auto mb-4 sm:mb-6 drop-shadow-2xl"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight drop-shadow-lg px-4">
            Union Temporal Nuevo Renetur
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 font-light drop-shadow-md px-4">
            Seleccione su perfil para continuar
          </p>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 w-full max-w-6xl">
          {/* User Card */}
          <div 
            onClick={() => onSelectRole('user')}
            className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col items-center text-center text-white transition-all duration-500 cursor-pointer group transform hover:scale-[1.02] hover:-translate-y-2"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.2),
                inset 0 -1px 0 rgba(0,0,0,0.1),
                0 25px 50px -12px rgba(0,0,0,0.25),
                0 0 0 1px rgba(255,255,255,0.05)
              `
            }}
          >
            {/* Top highlight */}
            <div 
              className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            ></div>
            
            {/* Side highlights */}
            <div 
              className="absolute top-4 bottom-4 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
            ></div>
            <div 
              className="absolute top-4 bottom-4 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
            ></div>

            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#05F26C] to-[#14D969] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div 
                className="relative bg-gradient-to-r from-[#05F26C] to-[#14D969] p-4 sm:p-5 lg:p-6 rounded-2xl group-hover:scale-110 transition-transform duration-300"
                style={{
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.3),
                    inset 0 -1px 0 rgba(0,0,0,0.2),
                    0 8px 16px rgba(1,190,106,0.3)
                  `
                }}
              >
                <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white drop-shadow-md">
              Soy Usuario
            </h2>
            
            <p className="text-gray-100 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-sm drop-shadow-sm px-2">
              Solicite y gestione sus servicios de transporte médico de manera fácil y rápida
            </p>
            
            <div className="inline-flex items-center text-[#05F26C] font-semibold text-base sm:text-lg lg:text-xl hover:text-[#14D969] transition-colors duration-300 group-hover:translate-x-2 transform transition-transform drop-shadow-md">
              <span>Acceder como Usuario</span>
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>

          {/* Coordinator Card */}
          <div 
            onClick={() => onSelectRole('coordinator')}
            className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col items-center text-center text-white transition-all duration-500 cursor-pointer group transform hover:scale-[1.02] hover:-translate-y-2"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.2),
                inset 0 -1px 0 rgba(0,0,0,0.1),
                0 25px 50px -12px rgba(0,0,0,0.25),
                0 0 0 1px rgba(255,255,255,0.05)
              `
            }}
          >
            {/* Top highlight */}
            <div 
              className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            ></div>
            
            {/* Side highlights */}
            <div 
              className="absolute top-4 bottom-4 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
            ></div>
            <div 
              className="absolute top-4 bottom-4 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
            ></div>

            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#111426] to-[#2a2d4a] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div 
                className="relative bg-gradient-to-r from-[#111426] to-[#2a2d4a] p-4 sm:p-5 lg:p-6 rounded-2xl group-hover:scale-110 transition-transform duration-300"
                style={{
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    inset 0 -1px 0 rgba(0,0,0,0.3),
                    0 8px 16px rgba(17,20,38,0.4)
                  `
                }}
              >
                <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white drop-shadow-md">
              Soy Coordinador
            </h2>
            
            <p className="text-gray-100 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-sm drop-shadow-sm px-2">
              Administre y supervise todos los servicios de transporte solicitados por los usuarios
            </p>
            
            <div className="inline-flex items-center text-[#05F26C] font-semibold text-base sm:text-lg lg:text-xl hover:text-[#14D969] transition-colors duration-300 group-hover:translate-x-2 transform transition-transform drop-shadow-md">
              <span>Acceder como Coordinador</span>
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-gray-200 text-sm sm:text-base font-light drop-shadow-sm">
            © 2025 TNR WEB. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomeView;