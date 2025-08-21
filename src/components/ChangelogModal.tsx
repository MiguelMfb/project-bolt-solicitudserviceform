import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, CheckCircle, Eye, Users, UserCheck, Settings, Calendar, AlertTriangle, FileText } from 'lucide-react';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChange: (changeId: string) => void;
}

interface Change {
  id: string;
  title: string;
  description: string;
  category: 'user' | 'coordinator' | 'general';
  icon: React.ElementType;
  color: string;
}

const ChangelogModal: React.FC<ChangelogModalProps> = ({
  isOpen,
  onClose,
  onNavigateToChange
}) => {
  const changes: Change[] = [
    {
      id: 'profile-address-readonly',
      title: 'Campo de dirección protegido en perfil de usuario',
      description: 'El campo de dirección en la edición del perfil de usuario ahora es de solo lectura para mantener la integridad de los datos registrados.',
      category: 'user',
      icon: Settings,
      color: 'blue'
    },
    {
      id: 'programmed-services-no-cancel',
      title: 'Restricción de cancelación para servicios programados',
      description: 'Los servicios con estado "PROGRAMADO" ya no permiten solicitar cancelación para evitar conflictos operativos.',
      category: 'user',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      id: 'bulk-confirmation-improved',
      title: 'Mejora en confirmación de servicios masivos',
      description: 'La modal de confirmación para servicios masivos ahora agrupa los servicios por fecha y optimiza el espacio con un diseño más compacto tipo tabla.',
      category: 'user',
      icon: Calendar,
      color: 'green'
    },
    {
      id: 'coordinator-date-filter',
      title: 'Nuevo filtro por fecha contratada en coordinación',
      description: 'Se reemplazó el filtro de identificación por un filtro de fecha contratada en el portal coordinador para mejor gestión temporal.',
      category: 'coordinator',
      icon: Calendar,
      color: 'purple'
    },
    {
      id: 'massive-programming-button',
      title: 'Renombrado de botón de programación masiva',
      description: 'El botón para programación masiva ahora se llama "Programar servicios" para mayor claridad.',
      category: 'coordinator',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'driver-conflict-validation',
      title: 'Validación de conflictos de horario de conductores',
      description: 'El sistema ahora valida y alerta cuando un conductor ya tiene un servicio programado en el mismo horario.',
      category: 'coordinator',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'cancellation-request-management',
      title: 'Gestión de solicitudes de cancelación',
      description: 'Se agregó la funcionalidad para gestionar servicios con estado "CANCELACION_SOLICITADA" incluyendo firma digital del usuario.',
      category: 'coordinator',
      icon: FileText,
      color: 'orange'
    },
    {
      id: 'cancellation-in-programming-tab',
      title: 'Solicitudes de cancelación en pestaña Programación',
      description: 'Los servicios con solicitud de cancelación ahora aparecen en la pestaña de Programación del panel coordinador.',
      category: 'coordinator',
      icon: UserCheck,
      color: 'indigo'
    }
  ];

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'user':
        return {
          label: 'Portal Usuario',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      case 'coordinator':
        return {
          label: 'Portal Coordinador',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      default:
        return {
          label: 'General',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800'
        };
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  const handleViewChange = (changeId: string) => {
    onNavigateToChange(changeId);
    onClose();
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                        Últimos Cambios
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 mt-1">
                        Nuevas funcionalidades y mejoras implementadas
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-900">
                          Fecha de cambios
                        </span>
                      </div>
                      <p className="text-lg font-bold text-green-800">
                        18 de junio de 2025
                      </p>
                    </div>
                  </div>

                  {/* Changes List */}
                  <div className="space-y-4">
                    {changes.map((change, index) => {
                      const categoryConfig = getCategoryConfig(change.category);
                      const IconComponent = change.icon;
                      
                      return (
                        <div
                          key={change.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            {/* Change Number & Icon */}
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                              </div>
                              <div className={`p-2 rounded-lg ${getColorClasses(change.color)}`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                            </div>

                            {/* Change Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                    {change.title}
                                  </h4>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryConfig.bgColor} ${categoryConfig.textColor} ${categoryConfig.borderColor} border`}>
                                    {categoryConfig.label}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleViewChange(change.id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md flex-shrink-0"
                                >
                                  <Eye className="h-4 w-4" />
                                  Ver Cambio
                                </button>
                              </div>
                              
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {change.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Resumen de Cambios</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-700">Portal Usuario:</span>
                        <ul className="text-gray-600 mt-1 space-y-1">
                          <li>• Protección de datos de dirección</li>
                          <li>• Control de cancelaciones</li>
                          <li>• Mejora en confirmaciones masivas</li>
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Portal Coordinador:</span>
                        <ul className="text-gray-600 mt-1 space-y-1">
                          <li>• Filtros optimizados por fecha</li>
                          <li>• Validación de conflictos</li>
                          <li>• Gestión de cancelaciones</li>
                          <li>• Interfaz mejorada</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    onClick={onClose}
                  >
                    Cerrar
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

export default ChangelogModal;