import React, { useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CheckCircle2, Clock, Truck, CheckCircle, Calendar, MapPin, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceFormData, Authorization } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  services: ServiceFormData[];
  authorization: Authorization;
  userEmail?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  services,
  authorization,
  userEmail
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Support grouped authorizations (doble volante): list of volantes and combined disponibles
  const volantesList: string[] = (authorization as any)?.volantes?.length
    ? (authorization as any).volantes
    : [authorization.volante];
  const disponiblesTotales = authorization.disponible;

  // Group services by date for better organization
  const servicesByDate = useMemo(() => {
    const grouped = services.reduce((acc, service) => {
      if (!service.fechaHora) return acc;
      
      const dateKey = service.fechaHora.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(service);
      return acc;
    }, {} as Record<string, ServiceFormData[]>);

    // Sort services within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        if (!a.fechaHora || !b.fechaHora) return 0;
        return a.fechaHora.getTime() - b.fechaHora.getTime();
      });
    });

    return grouped;
  }, [services]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm();
  };

  const toggleDateExpansion = (dateKey: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDates(newExpanded);
  };

  const TimelineStep = ({ icon: Icon, label, isActive, isCompleted }: { 
    icon: React.ElementType; 
    label: string; 
    isActive: boolean;
    isCompleted: boolean;
  }) => (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isActive ? 'bg-green-500 text-white' :
        isCompleted ? 'bg-green-100 text-green-500' :
        'bg-gray-100 text-gray-400'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className={`mt-2 text-sm ${
        isActive ? 'text-green-500 font-medium' :
        isCompleted ? 'text-green-500' :
        'text-gray-500'
      }`}>
        {label}
      </p>
    </div>
  );

  const ServiceCompactCard = ({ service, index, showDate = false }: { 
    service: ServiceFormData; 
    index: number;
    showDate?: boolean;
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-green-600">{index + 1}</span>
          </div>
          <span className="text-sm font-medium text-green-700">
            {index === 0 ? 'Ida' : 
             service.tipo === 'REGRESO' ? 'Regreso' : 
             'Adicional'}
          </span>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {authorization.tarifaUT}
        </span>
      </div>

      <div className="space-y-2">
        {showDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-600">
              {service.fechaHora?.toLocaleDateString('es-ES')} - {service.fechaHora?.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-green-500" />
              <span className="text-gray-500 font-medium">Origen</span>
            </div>
            <p className="text-gray-900 truncate" title={service.origen}>
              {service.origen}
            </p>
            <p className="text-gray-500">{service.ciudadOrigen}</p>
          </div>
          
          <div>
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-red-500" />
              <span className="text-gray-500 font-medium">Destino</span>
            </div>
            <p className="text-gray-900 truncate" title={service.destino}>
              {service.destino}
            </p>
            <p className="text-gray-500">{service.ciudadDestino}</p>
          </div>
        </div>

        {service.observaciones && (
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-700 truncate" title={service.observaciones}>
              <span className="font-medium">Obs:</span> {service.observaciones}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
          <span>Acompañante: {service.conAcompanante ? 'Sí' : 'No'}</span>
          {service.telefonoAdicional && (
            <span>Tel: {service.telefonoAdicional}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                {!isConfirmed ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Confirmar Solicitud de Servicios
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Resumen de la Solicitud</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="md:col-span-2">
                            <span className="text-blue-700">{volantesList.length > 1 ? 'Volantes:' : 'Volante:'}</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {volantesList.map(v => (
                                <span key={v} className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                                  {v}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700">Tarifa asignada:</span>
                            <p className="font-medium text-blue-900">{authorization.tarifaUT}</p>
                          </div>
                          <div>
                            <span className="text-blue-700">Servicios:</span>
                            <p className="font-medium text-blue-900">{services.length}</p>
                          </div>
                          <div>
                            <span className="text-blue-700">Disponibles:</span>
                            <p className="font-medium text-blue-900">{disponiblesTotales}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Servicios Programados ({services.length})
                      </h4>
                      
                      {/* Grouped by Date Layout */}
                      <div className="space-y-4">
                        {Object.entries(servicesByDate).map(([dateKey, dateServices]) => {
                          const isExpanded = expandedDates.has(dateKey);
                          const serviceCount = dateServices.length;
                          
                          return (
                            <div key={dateKey} className="border border-gray-200 rounded-lg overflow-hidden">
                              {/* Date Header */}
                              <button
                                onClick={() => toggleDateExpansion(dateKey)}
                                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 flex items-center justify-between hover:from-blue-100 hover:to-indigo-100 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-5 w-5 text-blue-600" />
                                  <div className="text-left">
                                    <h5 className="font-semibold text-blue-900 capitalize">{dateKey}</h5>
                                    <p className="text-sm text-blue-700">
                                      {serviceCount} servicio{serviceCount !== 1 ? 's' : ''} programado{serviceCount !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    {serviceCount}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronUp className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-blue-600" />
                                  )}
                                </div>
                              </button>

                              {/* Services for this date */}
                              {isExpanded && (
                                <div className="p-4 bg-white">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {dateServices.map((service, index) => (
                                      <ServiceCompactCard 
                                        key={service.id} 
                                        service={service} 
                                        index={index}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Collapsed Preview */}
                              {!isExpanded && (
                                <div className="px-4 pb-3">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Horarios:</span>
                                    {dateServices.slice(0, 3).map((service, index) => (
                                      <span key={service.id} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                        {service.fechaHora?.toLocaleTimeString('es-ES', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    ))}
                                    {dateServices.length > 3 && (
                                      <span className="text-xs text-gray-500">
                                        +{dateServices.length - 3} más
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-6">
                      <h4 className="font-medium text-yellow-800 mb-2">Importante</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Una vez confirmada, la solicitud será enviada para procesamiento</li>
                        <li>• Recibirá confirmación por correo electrónico</li>
                        <li>• Los servicios pueden ser modificados o cancelados hasta 3 horas antes</li>
                        <li>Se descontaran {services.length} servicio(s) de sus autorizaciones disponibles (de {disponiblesTotales} en total)</li>
                      </ul>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={onClose}
                      >
                        Volver Atrás
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#01be6a] px-6 py-2 text-sm font-medium text-white hover:bg-[#01a85d] focus:outline-none"
                        onClick={handleConfirm}
                      >
                        Confirmar Solicitud
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold text-gray-900 mb-4"
                    >
                      ¡Servicios Solicitados Correctamente!
                    </Dialog.Title>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Servicios Confirmados</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service, index) => (
                          <ServiceCompactCard 
                            key={service.id} 
                            service={service} 
                            index={index}
                            showDate={true}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-8 px-4">
                      <TimelineStep
                        icon={CheckCircle2}
                        label="Solicitado"
                        isActive={true}
                        isCompleted={true}
                      />
                      <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
                      <TimelineStep
                        icon={Clock}
                        label="Confirmado"
                        isActive={false}
                        isCompleted={false}
                      />
                      <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
                      <TimelineStep
                        icon={Truck}
                        label="Programado"
                        isActive={false}
                        isCompleted={false}
                      />
                      <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
                      <TimelineStep
                        icon={CheckCircle}
                        label="Finalizado"
                        isActive={false}
                        isCompleted={false}
                      />
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                      <p>Se ha enviado una confirmación detallada al correo:</p>
                      <p className="font-medium mt-1">{userEmail}</p>
                      <p className="mt-2 text-xs">
                        Si no lo visualizas, por favor revisa tu carpeta de Spam, Promociones o Correo no deseado. 
                        La entrega puede tardar unos minutos.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent bg-[#01be6a] px-4 py-2 text-sm font-medium text-white hover:bg-[#01a85d] focus:outline-none"
                      onClick={onClose}
                    >
                      Entendido
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
