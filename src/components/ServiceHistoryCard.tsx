import React, { useState } from 'react';
import { MapPin, Calendar, User, FileText, Truck, HelpCircle, CheckCircle, Clock, XCircle, AlertTriangle, UserX } from 'lucide-react';
import { Service } from '../types';
import ServiceStatusModal from './ServiceStatusModal';

interface ServiceHistoryCardProps {
  services: Service[];
  onModify?: (service: Service) => void;
  onCancel?: (service: Service) => void;
  isHighlighted?: (id: string) => boolean;
}

const ServiceHistoryCard: React.FC<ServiceHistoryCardProps> = ({
  services = [],
  onModify,
  onCancel,
  isHighlighted
}) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setStatusModalOpen(true);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'FINALIZADO':
        return {
          style: 'bg-blue-100 text-blue-800 border border-blue-200',
          icon: CheckCircle,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          explanation: 'El servicio ha sido completado exitosamente',
          displayText: 'FINALIZADO'
        };
      case 'PROGRAMADO':
        return {
          style: 'bg-green-100 text-green-800 border border-green-200',
          icon: Clock,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          explanation: 'Servicio confirmado con conductor asignado',
          displayText: 'PROGRAMADO'
        };
      case 'PENDIENTE':
        return {
          style: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
          icon: Clock,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          explanation: 'Esperando confirmación y asignación de conductor',
          displayText: 'PENDIENTE'
        };
      case 'CANCELADO':
        return {
          style: 'bg-red-100 text-red-800 border border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          explanation: 'El servicio ha sido cancelado',
          displayText: 'CANCELADO'
        };
      case 'CANCELACION_SOLICITADA':
        return {
          style: 'bg-orange-100 text-orange-800 border border-orange-200',
          icon: AlertTriangle,
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          explanation: 'Solicitud de cancelación en proceso de validación',
          displayText: 'CANCELACIÓN SOLICITADA'
        };
      case 'NO_SHOW':
        return {
          style: 'bg-purple-100 text-purple-800 border border-purple-200',
          icon: UserX,
          iconColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          explanation: 'El usuario no se presentó en el punto de recogida',
          displayText: 'NO SHOW'
        };
      case 'ABIERTO':
        return {
          style: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
          icon: Clock,
          iconColor: 'text-cyan-600',
          bgColor: 'bg-cyan-50',
          borderColor: 'border-cyan-200',
          explanation: 'Servicio actualmente en prestación',
          displayText: 'ABIERTO'
        };
      default:
        return {
          style: 'bg-gray-100 text-gray-800 border border-gray-200',
          icon: HelpCircle,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          explanation: 'Estado del servicio',
          displayText: status
        };
    }
  };

  const StatusBadge = ({ status, showTooltip = false }: { 
    status: string; 
    showTooltip?: boolean; 
  }) => {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    return (
      <button
        onClick={() => handleStatusClick(status)}
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${config.style} hover:shadow-md hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        title="Haz clic para ver el flujo del servicio"
      >
        <StatusIcon className={`w-3 h-3 mr-1.5 ${config.iconColor}`} />
        {config.displayText}
        {showTooltip && (
          <HelpCircle className="ml-1.5 h-3 w-3 opacity-60" />
        )}
      </button>
    );
  };

  // Updated function to check if service can be modified or cancelled
  const canModifyOrCancel = (status: string) => 
    status === 'PENDIENTE'; // Only PENDIENTE services can be modified or cancelled

  if (!Array.isArray(services)) {
    return (
      <div className="text-center py-10 px-4 text-gray-500">
        No hay servicios disponibles.
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10 px-4 text-gray-500">
        No hay servicios en el historial que coincidan con la búsqueda.
      </div>
    );
  }

  // Desktop Table View
  const TableView = () => (
    <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Número
            </th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Volante
            </th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Fecha/Hora Contratada
            </th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Origen
            </th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Destino
            </th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Conductor
            </th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id} className={`
              transition-colors duration-200
              ${isHighlighted?.(service.id) ? 'bg-yellow-50' : 'hover:bg-gray-50'}
            `}>
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Truck className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">#{service.numero}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{service.volante}</p>
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{service.fechaHoraInicial}</p>
                </div>
              </td>
              <td className="px-3 py-4">
                <div className="flex items-start max-w-xs">
                  <MapPin className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <p className="ml-2 text-sm text-gray-900 truncate" title={service.origen}>
                    {service.origen}
                  </p>
                </div>
              </td>
              <td className="px-3 py-4">
                <div className="flex items-start max-w-xs">
                  <MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <p className="ml-2 text-sm text-gray-900 truncate" title={service.destino}>
                    {service.destino}
                  </p>
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {service.conductor ? (
                    <>
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.conductor}</p>
                        {service.placa && (
                          <p className="text-xs text-gray-500">{service.placa}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No asignado</p>
                  )}
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <StatusBadge status={service.estado} showTooltip={true} />
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                {canModifyOrCancel(service.estado) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onModify?.(service)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => onCancel?.(service)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile List View
  const MobileView = () => (
    <div className="md:hidden space-y-4">
      {services.map((service) => (
        <div
          key={service.id}
          className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
            ${isHighlighted?.(service.id) ? 'bg-yellow-50' : ''}`}
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Truck className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Servicio #{service.numero}</p>
                  <p className="text-xs text-gray-500">Volante: {service.volante}</p>
                </div>
              </div>
              <StatusBadge status={service.estado} showTooltip={false} />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Fecha y Hora Contratada</p>
                  <p className="text-sm text-gray-900">{service.fechaHoraInicial}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Origen</p>
                  <p className="text-sm text-gray-900">{service.origen}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-red-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Destino</p>
                  <p className="text-sm text-gray-900">{service.destino}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Conductor</p>
                  {service.conductor ? (
                    <div>
                      <p className="text-sm text-gray-900">{service.conductor}</p>
                      {service.placa && (
                        <p className="text-xs text-gray-500">{service.placa}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No asignado</p>
                  )}
                </div>
              </div>
            </div>

            {canModifyOrCancel(service.estado) && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onModify?.(service)}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-150"
                >
                  Modificar
                </button>
                <button
                  onClick={() => onCancel?.(service)}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-150"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <TableView />
      <MobileView />
      
      <ServiceStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        status={selectedStatus}
      />
    </>
  );
};

export default ServiceHistoryCard;