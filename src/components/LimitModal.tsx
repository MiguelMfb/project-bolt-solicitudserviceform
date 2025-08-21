import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { ServiceFormData, Authorization } from '../types';

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceFormData[];
  authorization: Authorization;
  onDeleteService: (serviceId: string) => void;
}

const LimitModal: React.FC<LimitModalProps> = ({
  isOpen,
  onClose,
  services,
  authorization,
  onDeleteService,
}) => {
  const getServiceTypeLabel = (type?: string) => {
    switch (type) {
      case 'IDA':
        return 'Servicio de Ida';
      case 'REGRESO':
        return 'Servicio de Regreso';
      case 'ADICIONAL':
        return 'Servicio Adicional';
      default:
        return 'Servicio';
    }
  };

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
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                      Límite de Servicios Alcanzado
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Solo puedes programar un máximo de {authorization.disponible} servicios para esta autorización.
                  </p>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Servicios Planificados ({services.length}):
                    </h4>
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {getServiceTypeLabel(service.tipo)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Origen: {service.origen}
                            </p>
                            <p className="text-xs text-gray-500">
                              Destino: {service.destino}
                            </p>
                          </div>
                          <button
                            onClick={() => onDeleteService(service.id)}
                            className="ml-2 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-[#01be6a] px-4 py-2 text-sm font-medium text-white hover:bg-[#01a85d] focus:outline-none"
                    onClick={onClose}
                  >
                    Entendido
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LimitModal;