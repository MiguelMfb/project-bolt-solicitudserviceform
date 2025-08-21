import React from 'react';
import { ChevronDown, ClipboardList, Users, FileText } from 'lucide-react';
import CoordinatorView from './CoordinatorView';
import { Service } from '../types';

interface CoordinatorPanelProps {
  services: Service[];
  onGoBack: () => void;
  onUpdateService: (updatedService: Service) => void;
  onCancellationAction: (serviceId: string, action: 'approve' | 'reject') => void;
}

const CoordinatorPanel: React.FC<CoordinatorPanelProps> = ({
  services,
  onGoBack,
  onUpdateService,
  onCancellationAction,
}) => {
  return (
    <div className="flex min-h-screen">
      <nav className="w-64 bg-[#020432] text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-white/20">
          Panel interactivo
        </div>
        <div className="px-4 py-2 flex items-center justify-between text-sm font-semibold border-b border-white/20">
          <span>Gestión de servicios</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <ul className="flex-1 py-2 space-y-1 text-sm">
          {['Seguimiento de servicios', 'Servicios en ejecución', 'Servicios programados'].map((text) => (
            <li
              key={text}
              className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed"
            >
              <ClipboardList className="h-4 w-4" />
              <span>{text}</span>
            </li>
          ))}
          <li className="px-4 py-2 flex items-center space-x-2 bg-blue-600">
            <ClipboardList className="h-4 w-4" />
            <span>Servicios solicitados por el cliente</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <ClipboardList className="h-4 w-4" />
            <span>Servicios cancelados</span>
          </li>
        </ul>
        <ul className="py-2 space-y-1 text-sm">
          {['Solicitar servicio', 'Generar Link de Servicio', 'Cargue de servicios', 'Paradas programadas'].map((text) => (
            <li
              key={text}
              className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed"
            >
              <FileText className="h-4 w-4" />
              <span>{text}</span>
            </li>
          ))}
          <li className="px-4 py-2 flex items-center space-x-2 hover:bg-gray-700">
            <Users className="h-4 w-4" />
            <a
              href="https://capable-buttercream-d72771.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gestion de usuarios
            </a>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <FileText className="h-4 w-4" />
            <span>Reportes</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <FileText className="h-4 w-4" />
            <span>Geolocalizador</span>
          </li>
        </ul>
      </nav>
      <div className="flex-1">
        <CoordinatorView
          services={services}
          onGoBack={onGoBack}
          onUpdateService={onUpdateService}
          onCancellationAction={onCancellationAction}
        />
      </div>
    </div>
  );
};

export default CoordinatorPanel;
