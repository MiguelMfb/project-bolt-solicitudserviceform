import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, CheckCircle, Clock, XCircle, AlertTriangle, UserX, Truck, ArrowRight, FileText, User } from 'lucide-react';

interface ServiceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
}

const ServiceStatusModal: React.FC<ServiceStatusModalProps> = ({
  isOpen,
  onClose,
  status
}) => {
  const getStatusFlow = (currentStatus: string) => {
    const baseFlow = [
      {
        id: 'PENDIENTE',
        label: 'Pendiente',
        description: 'Servicio recibido, esperando asignación de conductor',
        icon: Clock,
        color: 'yellow',
        details: 'El servicio ha sido registrado en el sistema y está en cola para ser procesado por el coordinador.'
      },
      {
        id: 'PROGRAMADO',
        label: 'Programado',
        description: 'Conductor asignado, servicio confirmado para prestación',
        icon: CheckCircle,
        color: 'green',
        details: 'Se ha asignado un conductor y vehículo. El servicio está listo para ser prestado en la fecha programada.'
      },
      {
        id: 'FINALIZADO',
        label: 'Finalizado',
        description: 'Servicio completado exitosamente',
        icon: Truck,
        color: 'blue',
        details: 'El servicio se ha completado satisfactoriamente. El usuario fue transportado al destino solicitado.'
      }
    ];

    // Alternative flows based on current status
    if (currentStatus === 'CANCELACION_SOLICITADA' || currentStatus === 'CANCELADO') {
      return [
        ...baseFlow.slice(0, 2),
        {
          id: 'CANCELACION_SOLICITADA',
          label: 'Cancelación Solicitada',
          description: 'Solicitud de cancelación en proceso de validación',
          icon: AlertTriangle,
          color: 'orange',
          details: 'El usuario ha solicitado cancelar el servicio. Está pendiente de aprobación por parte del coordinador.'
        },
        {
          id: 'CANCELADO',
          label: 'Cancelado',
          description: 'Servicio cancelado por el usuario o coordinador',
          icon: XCircle,
          color: 'red',
          details: 'El servicio ha sido cancelado oficialmente. La autorización se libera para uso futuro.'
        }
      ];
    } else if (currentStatus === 'NO_SHOW') {
      return [
        ...baseFlow.slice(0, 2),
        {
          id: 'NO_SHOW',
          label: 'No Show',
          description: 'Usuario no se presentó en el punto de recogida',
          icon: UserX,
          color: 'purple',
          details: 'El conductor esperó en el punto de recogida pero el usuario no se presentó en el tiempo establecido.'
        }
      ];
    } else {
      return baseFlow;
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      'FINALIZADO': { color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-900' },
      'PROGRAMADO': { color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-900' },
      'PENDIENTE': { color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-900' },
      'CANCELADO': { color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-900' },
      'CANCELACION_SOLICITADA': { color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-900' },
      'NO_SHOW': { color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-900' },
      'ABIERTO': { color: 'cyan', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', textColor: 'text-cyan-900' }
    };
    return configs[status] || { color: 'gray', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-900' };
  };

  const statusFlow = getStatusFlow(status);
  const currentConfig = getStatusConfig(status);

  const getColorClasses = (color: string, isActive: boolean = false, isCompleted: boolean = false) => {
    const colorMap = {
      yellow: {
        bg: isActive ? 'bg-yellow-500' : isCompleted ? 'bg-yellow-100' : 'bg-gray-100',
        text: isActive ? 'text-white' : isCompleted ? 'text-yellow-600' : 'text-gray-400',
        icon: isActive ? 'text-white' : isCompleted ? 'text-yellow-600' : 'text-gray-400',
        border: isCompleted ? 'border-yellow-200' : 'border-gray-200'
      },
      green: {
        bg: isActive ? 'bg-green-500' : isCompleted ? 'bg-green-100' : 'bg-gray-100',
        text: isActive ? 'text-white' : isCompleted ? 'text-green-600' : 'text-gray-400',
        icon: isActive ? 'text-white' : isCompleted ? 'text-green-600' : 'text-gray-400',
        border: isCompleted ? 'border-green-200' : 'border-gray-200'
      },
      blue: {
        bg: isActive ? 'bg-blue-500' : isCompleted ? 'bg-blue-100' : 'bg-gray-100',
        text: isActive ? 'text-white' : isCompleted ? 'text-blue-600' : 'text-gray-400',
        icon: isActive ? 'text-white' : isCompleted ? 'text-blue-600' : 'text-gray-400',
        border: isCompleted ? 'border-blue-200' : 'border-gray-200'
      },
      red: {
        bg: isActive ? 'bg-red-500' : isCompleted ? 'bg-red-100' : 'bg-gray-100',
        text: isActive ? 'text-white' : isCompleted ? 'text-red-600' : 'text-gray-400',
        icon: isActive ? 'text-white' : isCompleted ? 'text-red-600' : 'text-gray-400',
        border: isCompleted ? 'border-red-200' : 'border-gray-200'
      },
      orange: {
        bg: isActive ? 'bg-orange-500' : isCompleted ? 'bg-orange-100' : 'bg-gray-100',
        text: isActive ? 'text-white' : isCompleted ? 'text-orange-600' : 'text-gray-400',
        icon: isActive ? 'text-white' : isCompleted ? 'text-orange-600' : 'text-gray-400',
        border: isCompleted ? 'border-orange-200' : 'border-gray-200'
      },
      purple: {
        bg: isActive ? 'bg-purple-500' : isCompleted ? 'bg-purple-100' : 'bg-gray-100',
        text: isActive ? 'text-white' : isCompleted ? 'text-purple-600' : 'text-gray-400',
        icon: isActive ? 'text-white' : isCompleted ? 'text-purple-600' : 'text-gray-400',
        border: isCompleted ? 'border-purple-200' : 'border-gray-200'
      }
    };
    return colorMap[color] || colorMap.yellow;
  };

  const getCurrentStepIndex = () => {
    return statusFlow.findIndex(step => step.id === status);
  };

  const currentStepIndex = getCurrentStepIndex();
  const currentStep = statusFlow.find(step => step.id === status);

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
              <Dialog.Panel className={`w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border-2 ${currentConfig.borderColor}`}>
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                    Flujo del Servicio: {currentStep?.label}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Current Status Highlight */}
                <div className={`${currentConfig.bgColor} rounded-xl p-6 mb-8 border-2 ${currentConfig.borderColor}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                      {React.createElement(currentStep?.icon || Clock, {
                        className: `h-8 w-8 text-${currentConfig.color}-600`
                      })}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xl font-bold ${currentConfig.textColor} mb-2`}>
                        Estado Actual: {currentStep?.label}
                      </h4>
                      <p className={`text-sm ${currentConfig.textColor} mb-3 opacity-90`}>
                        {currentStep?.description}
                      </p>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {currentStep?.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Flow Timeline */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Flujo de Estados del Servicio
                  </h4>
                  
                  {/* Desktop Flow */}
                  <div className="hidden lg:block">
                    <div className="flex items-center justify-between">
                      {statusFlow.map((step, index) => {
                        const isActive = step.id === status;
                        const isCompleted = index < currentStepIndex;
                        const colors = getColorClasses(step.color, isActive, isCompleted);
                        const StepIcon = step.icon;

                        return (
                          <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center max-w-xs">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-3 ${colors.bg} ${colors.border} transition-all duration-300 shadow-lg`}>
                                <StepIcon className={`w-8 h-8 ${colors.icon}`} />
                              </div>
                              <div className="mt-4 text-center">
                                <p className={`text-sm font-bold ${colors.text} mb-1`}>
                                  {step.label}
                                </p>
                                <p className="text-xs text-gray-600 leading-tight">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                            {index < statusFlow.length - 1 && (
                              <div className="flex-1 mx-4 flex items-center">
                                <div className={`h-1 flex-1 rounded-full ${
                                  isCompleted || isActive ? 'bg-gray-300' : 'bg-gray-200'
                                }`}></div>
                                <ArrowRight className={`w-6 h-6 mx-2 ${
                                  isCompleted || isActive ? 'text-gray-400' : 'text-gray-300'
                                }`} />
                                <div className={`h-1 flex-1 rounded-full ${
                                  isCompleted ? 'bg-gray-300' : 'bg-gray-200'
                                }`}></div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile/Tablet Flow */}
                  <div className="lg:hidden space-y-4">
                    {statusFlow.map((step, index) => {
                      const isActive = step.id === status;
                      const isCompleted = index < currentStepIndex;
                      const colors = getColorClasses(step.color, isActive, isCompleted);
                      const StepIcon = step.icon;

                      return (
                        <div key={step.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 ${
                          isActive ? colors.border : 'border-gray-200'
                        } ${isActive ? colors.bg.replace('bg-', 'bg-opacity-10 bg-') : 'bg-white'}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${colors.bg} ${colors.border} flex-shrink-0`}>
                            <StepIcon className={`w-6 h-6 ${colors.icon}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <p className={`text-sm font-bold ${colors.text}`}>
                                {step.label}
                              </p>
                              {isActive && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  Actual
                                </span>
                              )}
                              {isCompleted && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  Completado
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {step.description}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {step.details}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Process Information */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h5 className="font-bold text-blue-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Información del Proceso
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    {status === 'PENDIENTE' && (
                      <>
                        <div className="space-y-2">
                          <p>• Su servicio ha sido recibido correctamente</p>
                          <p>• Está en cola para asignación de conductor</p>
                          <p>• Recibirá notificación cuando se programe</p>
                        </div>
                        <div className="space-y-2">
                          <p>• Puede modificar hasta 3 horas antes</p>
                          <p>• Puede cancelar sin penalización</p>
                          <p>• Tiempo estimado de programación: 2-4 horas</p>
                        </div>
                      </>
                    )}
                    {status === 'PROGRAMADO' && (
                      <>
                        <div className="space-y-2">
                          <p>• Conductor y vehículo asignados</p>
                          <p>• Servicio confirmado para la fecha programada</p>
                          <p>• El conductor se comunicará 15 min antes</p>
                        </div>
                        <div className="space-y-2">
                          <p>• Puede cancelar hasta 3 horas antes</p>
                          <p>• Tiempo de espera máximo: 10 minutos</p>
                          <p>• Tenga documentos de identificación listos</p>
                        </div>
                      </>
                    )}
                    {status === 'FINALIZADO' && (
                      <>
                        <div className="space-y-2">
                          <p>• Servicio completado exitosamente</p>
                          <p>• Gracias por usar nuestros servicios</p>
                          <p>• Puede solicitar nuevos servicios</p>
                        </div>
                        <div className="space-y-2">
                          <p>• Califique su experiencia (opcional)</p>
                          <p>• Reporte cualquier incidencia</p>
                          <p>• Conserve el comprobante del servicio</p>
                        </div>
                      </>
                    )}
                    {status === 'CANCELACION_SOLICITADA' && (
                      <>
                        <div className="space-y-2">
                          <p>• Solicitud de cancelación recibida</p>
                          <p>• En proceso de validación</p>
                          <p>• Recibirá confirmación en 2-4 horas</p>
                        </div>
                        <div className="space-y-2">
                          <p>• El servicio permanece activo hasta confirmación</p>
                          <p>• No se aplicarán cargos si se aprueba</p>
                          <p>• Puede contactar soporte para urgencias</p>
                        </div>
                      </>
                    )}
                    {status === 'CANCELADO' && (
                      <>
                        <div className="space-y-2">
                          <p>• Servicio cancelado oficialmente</p>
                          <p>• Autorización liberada para uso futuro</p>
                          <p>• No se aplicaron cargos</p>
                        </div>
                        <div className="space-y-2">
                          <p>• Puede solicitar un nuevo servicio</p>
                          <p>• Revise sus autorizaciones disponibles</p>
                          <p>• Contacte soporte si tiene dudas</p>
                        </div>
                      </>
                    )}
                    {status === 'NO_SHOW' && (
                      <>
                        <div className="space-y-2">
                          <p>• El conductor esperó en el punto de recogida</p>
                          <p>• No se presentó en el tiempo establecido</p>
                          <p>• El servicio se marca como no utilizado</p>
                        </div>
                        <div className="space-y-2">
                          <p>• La autorización se descuenta según políticas</p>
                          <p>• Puede apelar si hubo circunstancias especiales</p>
                          <p>• Contacte soporte para más información</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl border border-transparent bg-[#01be6a] px-6 py-3 text-sm font-medium text-white hover:bg-[#01a85d] focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:ring-offset-2 transition-colors"
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

export default ServiceStatusModal;