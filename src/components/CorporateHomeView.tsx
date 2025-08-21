import React from 'react';
import { Users, UserCheck, ArrowRight } from 'lucide-react';

interface CorporateHomeViewProps {
  onSelectRole: (role: 'user' | 'coordinator') => void;
}

const CorporateHomeView: React.FC<CorporateHomeViewProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <img
              src="https://i.imgur.com/E9Kt3nz.png"
              alt="Logo TNR"
              className="h-20 w-auto sm:h-24 lg:h-28 mb-4 sm:mb-6"
            />
            <div className="text-center">
              <p className="text-lg sm:text-xl lg:text-2xl text-[#151830] font-medium">
                Unión Temporal Nuevo Renetur
              </p>
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed px-4">
            Bienvenido. Por favor, seleccione su rol para acceder al sistema.
          </p>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* User Portal Card */}
          <button
            onClick={() => onSelectRole('user')}
            className="group bg-white shadow-lg hover:shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300 flex flex-col items-center text-center focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] border border-gray-200 hover:border-[#151830]/20"
          >
            <div className="bg-gradient-to-br from-[#151830] to-[#1a1d3a] text-white p-4 sm:p-5 lg:p-6 rounded-full mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#151830] mb-3 sm:mb-4">
              Portal de Usuario
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 flex-grow leading-relaxed max-w-sm">
              Acceda para solicitar y gestionar sus servicios de transporte médico de forma eficiente.
            </p>
            <div className="mt-auto w-full bg-gradient-to-r from-[#151830] to-[#1a1d3a] hover:from-[#1a1d3a] hover:to-[#151830] text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md group-hover:shadow-lg text-sm sm:text-base lg:text-lg">
              Ingresar como Usuario
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Coordinator Panel Card */}
          <button
            onClick={() => onSelectRole('coordinator')}
            className="group bg-white shadow-lg hover:shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300 flex flex-col items-center text-center focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02] border border-gray-200 hover:border-green-200"
          >
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 sm:p-5 lg:p-6 rounded-full mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#151830] mb-3 sm:mb-4">
              Panel de Coordinación
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 flex-grow leading-relaxed max-w-sm">
              Administre y supervise los servicios de transporte, asignaciones y recursos.
            </p>
            <div className="mt-auto w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md group-hover:shadow-lg text-sm sm:text-base lg:text-lg">
              Ingresar como Coordinador
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            © 2025 Todos los derechos reservados.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            Sistema de Gestión de Transporte Médico
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CorporateHomeView;