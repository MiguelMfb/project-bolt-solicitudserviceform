import React from 'react';
import {
  BarChart2,
  Calendar,
  ChevronDown,
  ClipboardList,
  Clock,
  ExternalLink,
  FilePlus,
  Link as LinkIcon,
  MapPin,
  PlayCircle,
  Upload,
  Users,
  XCircle,
} from 'lucide-react';
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
      <nav className="w-64 bg-[#1e2236] text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-white/20">
          Panel interactivo
        </div>
        <div className="px-4 py-2 flex items-center justify-between text-sm font-semibold border-b border-white/20">
          <span>Gestión de servicios</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <ul className="flex-1 py-2 space-y-1 text-sm">
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <ClipboardList className="h-4 w-4" />
            <span>Seguimiento de servicios</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <PlayCircle className="h-4 w-4" />
            <span>Servicios en ejecución</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <Calendar className="h-4 w-4" />
            <span>Servicios programados</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 hover:bg-white/10 border-l-4 border-green-500">
            <ExternalLink className="h-4 w-4 text-green-400" />
            <a
              href="https://capable-buttercream-d72771.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400"
            >
              Servicios solicitados por el cliente
            </a>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <XCircle className="h-4 w-4" />
            <span>Servicios cancelados</span>
          </li>
        </ul>
        <ul className="py-2 space-y-1 text-sm">
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <FilePlus className="h-4 w-4" />
            <span>Solicitar servicio</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <LinkIcon className="h-4 w-4" />
            <span>Generar Link de Servicio</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <Upload className="h-4 w-4" />
            <span>Cargue de servicios</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <Clock className="h-4 w-4" />
            <span>Paradas programadas</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 hover:bg-white/10">
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
            <BarChart2 className="h-4 w-4" />
            <span>Reportes</span>
          </li>
          <li className="px-4 py-2 flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <MapPin className="h-4 w-4" />
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
