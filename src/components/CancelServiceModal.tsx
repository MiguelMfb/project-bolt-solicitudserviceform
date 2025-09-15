import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertCircle, CheckCircle2, Clock, Truck, CheckCircle, X, MapPin } from 'lucide-react';
import { Service } from '../types';

interface CancelServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  onConfirm: () => void;
}

const CancelServiceModal: React.FC<CancelServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onConfirm,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm();
  };

  const TimelineStep = ({ icon: Icon, label, isActive, isCompleted }: { 
    icon: React.ElementType; 
    label: string; 
    isActive: boolean;
    isCompleted: boolean;
  }) => (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isActive ? 'bg-red-500 text-white' :
        isCompleted ? 'bg-red-100 text-red-500' :
        'bg-gray-100 text-gray-400'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className={`mt-2 text-sm ${
        isActive ? 'text-red-500 font-medium' :
        isCompleted ? 'text-red-500' :
        'text-gray-500'
      }`}>
        {label}
      </p>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {!isConfirmed ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Solicitar Cancelación
                      </Dialog.Title>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-yellow-800">
                        <strong>Importante:</strong> Al solicitar la cancelación del servicio, esta solicitud será enviada a validación para su procesamiento. Si la solicitud de cancelación se realiza después del horario límite (dentro de las 3 horas previas a la hora programada del servicio), el servicio será descontado de las autorizaciones disponibles. Para evitar este descuento, la cancelación debe realizarse con al menos 3 horas de antelación a la hora del servicio.
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">
                        ¿Está seguro que desea solicitar la cancelación del siguiente servicio?
                      </p>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 font-medium">Número:</p>
                              <p className="text-gray-900">{service.numero}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">Fecha:</p>
                              <p className="text-gray-900">{service.fechaHoraInicial}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">Volante:</p>
                              <p className="text-gray-900">{service.volante}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">Tarifa asignada:</p>
                              <p className="text-gray-900">{service.tarifaUT}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                              <div>
                                <p className="text-gray-600 font-medium text-sm">Origen:</p>
                                <p className="text-gray-900 text-sm">{service.origen}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                              <div>
                                <p className="text-gray-600 font-medium text-sm">Destino:</p>
                                <p className="text-gray-900 text-sm">{service.destino}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={onClose}
                      >
                        Volver
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                        onClick={handleConfirm}
                      >
                        Solicitar Cancelación
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <X className="h-6 w-6" />
                    </button>

                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                      <CheckCircle2 className="h-16 w-16 text-red-500" />
                    </div>
                    
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold text-gray-900 mb-4"
                    >
                      ¡Solicitud de Cancelación Enviada!
                    </Dialog.Title>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="mb-4 text-left">
                        <p className="font-medium text-red-700 mb-2">
                          Detalles del Servicio
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Número: {service.numero}</p>
                          <p>Origen: {service.origen}</p>
                          <p>Destino: {service.destino}</p>
                          <p>Fecha/Hora: {service.fechaHoraInicial}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-8 px-4">
                      <TimelineStep
                        icon={CheckCircle2}
                        label="Solicitado"
                        isActive={false}
                        isCompleted={true}
                      />
                      <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
                      <TimelineStep
                        icon={Clock}
                        label="En Validación"
                        isActive={true}
                        isCompleted={false}
                      />
                      <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
                      <TimelineStep
                        icon={Truck}
                        label="Procesado"
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
                      <p>Se ha enviado una confirmación de la solicitud al correo:</p>
                      <p className="font-medium mt-1">usuario@ejemplo.com</p>
                      <p className="mt-2 text-xs">
                        Si no lo visualizas, por favor revisa tu carpeta de Spam, Promociones o Correo no deseado. 
                        La entrega puede tardar unos minutos.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
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

export default CancelServiceModal;