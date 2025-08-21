import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Clock, Calendar, MapPin, User, FileText, Edit } from 'lucide-react';
import { Service } from '../types';

interface CancellationApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  onAction: (action: 'approve' | 'reject') => void;
}

const CancellationApprovalModal: React.FC<CancellationApprovalModalProps> = ({
  isOpen,
  onClose,
  service,
  onAction,
}) => {
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock signature data - in a real app this would come from the service data
  const mockUserSignature = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleActionSelect = (action: 'approve' | 'reject') => {
    setSelectedAction(action);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedAction) {
      onAction(selectedAction);
    }
  };

  const handleCancel = () => {
    setSelectedAction(null);
    setShowConfirmation(false);
  };

  const getActionConfig = (action: 'approve' | 'reject') => {
    if (action === 'approve') {
      return {
        title: 'Aprobar Cancelación',
        description: 'El servicio será marcado como CANCELADO',
        buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
        icon: CheckCircle,
        iconClass: 'text-green-600'
      };
    } else {
      return {
        title: 'Rechazar Cancelación',
        description: 'El servicio será marcado como NO SHOW',
        buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
        icon: XCircle,
        iconClass: 'text-red-600'
      };
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {!showConfirmation ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                        <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                          Gestionar Solicitud de Cancelación
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

                    {/* Service Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Información del Servicio</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-xs text-gray-500">Número de Servicio:</span>
                            <p className="text-sm font-medium text-gray-900">{service.numero}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-xs text-gray-500">Fecha/Hora Programada:</span>
                            <p className="text-sm font-medium text-gray-900">{service.fechaHoraInicial}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-xs text-gray-500">Conductor:</span>
                            <p className="text-sm font-medium text-gray-900">
                              {service.conductor || 'Sin asignar'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Volante:</span>
                          <p className="text-sm font-medium text-gray-900">{service.volante}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <span className="text-xs text-gray-500">Origen:</span>
                            <p className="text-sm text-gray-900">{service.origen}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                          <div>
                            <span className="text-xs text-gray-500">Destino:</span>
                            <p className="text-sm text-gray-900">{service.destino}</p>
                          </div>
                        </div>
                      </div>

                      {service.observaciones && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-xs font-medium text-blue-700">Observaciones del servicio:</span>
                          <p className="text-sm text-blue-800 mt-1">{service.observaciones}</p>
                        </div>
                      )}
                    </div>

                    {/* Cancellation Timeline */}
                    <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200">
                      <h4 className="text-sm font-medium text-orange-900 mb-3">Cronología de Cancelación</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <span className="text-xs text-gray-600">Servicio solicitado:</span>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDateTime(service.fechaSolicitud)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div>
                            <span className="text-xs text-gray-600">Cancelación solicitada:</span>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDateTime(service.fechaCancelacionSolicitada)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <div>
                            <span className="text-xs text-gray-600">Pendiente de aprobación</span>
                            <p className="text-sm text-orange-600 font-medium">Esperando decisión del coordinador</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Digital Signature Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-purple-900 flex items-center">
                          <Edit className="h-5 w-5 mr-2" />
                          Firma Digital del Usuario
                        </h4>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                          ✓ Firma válida ({service.firmaSize?.toFixed(1)}KB)
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-sm">
                        <div className="text-center">
                          <div className="mb-3">
                            <p className="text-sm font-medium text-purple-900 mb-2">
                              Firma registrada al solicitar la cancelación
                            </p>
                            <p className="text-xs text-purple-700">
                              Fecha: {formatDateTime(service.fechaCancelacionSolicitada)}
                            </p>
                          </div>
                          
                          {/* Mock signature display */}
                          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-3">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-64 h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2 shadow-sm">
                                <div className="text-center">
                                  <div className="text-2xl font-script text-blue-600 mb-1" style={{ fontFamily: 'cursive' }}>
                                    Ana María López García
                                  </div>
                                  <div className="text-xs text-gray-500">Firma digital del usuario</div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600">
                                Firmado digitalmente el {formatDateTime(service.fechaCancelacionSolicitada)}
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-green-600 bg-green-50 rounded p-2">
                            ✓ Firma verificada y válida para solicitud de cancelación
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">Marcar Estado:</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => handleActionSelect('approve')}
                          className="flex items-center justify-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                        >
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div className="text-left">
                            <p className="font-medium text-green-900">Aprobar Cancelación</p>
                            <p className="text-sm text-green-700">Estado: CANCELADO</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleActionSelect('reject')}
                          className="flex items-center justify-center gap-3 p-4 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="h-6 w-6 text-red-600" />
                          <div className="text-left">
                            <p className="font-medium text-red-900">Rechazar Cancelación</p>
                            <p className="text-sm text-red-700">Estado: NO SHOW</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={onClose}
                      >
                        Cerrar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                        Confirmar Acción
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={handleCancel}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {selectedAction && (
                      <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                          {React.createElement(getActionConfig(selectedAction).icon, {
                            className: `h-6 w-6 ${getActionConfig(selectedAction).iconClass}`
                          })}
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {getActionConfig(selectedAction).title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4">
                          ¿Está seguro que desea {selectedAction === 'approve' ? 'aprobar' : 'rechazar'} la solicitud de cancelación del servicio {service.numero}?
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-6">
                          <p className="text-sm font-medium text-gray-900">
                            {getActionConfig(selectedAction).description}
                          </p>
                        </div>

                        <div className="flex justify-center space-x-3">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            onClick={handleCancel}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none ${getActionConfig(selectedAction).buttonClass}`}
                            onClick={handleConfirm}
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CancellationApprovalModal;