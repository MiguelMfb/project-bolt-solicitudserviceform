import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Users, User, Truck, CheckCircle2, AlertCircle, Car, MapPin, FileText, Clock } from 'lucide-react';
import { Service, Driver } from '../types';

interface MassiveProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  drivers: Driver[];
  destinations?: string[];
  concepts?: string[];
  onConfirm: (assignments: { serviceId: string; driverId: string; destination?: string; concept?: string }[]) => void;
  allServices: Service[];
}

const MassiveProgramModal: React.FC<MassiveProgramModalProps> = ({
  isOpen,
  onClose,
  services,
  drivers,
  destinations = [],
  concepts = [],
  onConfirm,
  allServices
}) => {
  const [assignments, setAssignments] = useState<Record<string, { driverId: string; destination?: string; concept?: string }>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Filter available drivers only
  const availableDrivers = drivers.filter(driver => driver.isAvailable);

  // Check for schedule conflicts
  const checkScheduleConflicts = () => {
    const conflicts: Record<string, { hasConflict: boolean; conflictingService?: any }> = {};
    
    Object.entries(assignments).forEach(([serviceId, assignment]) => {
      if (assignment.driverId) {
        const service = services.find(s => s.id === serviceId);
        const driver = drivers.find(d => d.id === assignment.driverId);
        
        if (service && driver) {
          // For this example, we'll simulate conflicts for demonstration
          // In a real application, you would check against actual scheduled services
          conflicts[serviceId] = {
            hasConflict: true,
            conflictingService: {
              numero: `113${Math.floor(Math.random() * 9)}`,
              fechaHora: service.fechaHoraInicial,
              origen: 'Hospital Central',
              destino: 'Centro Médico Norte'
            }
          };
        }
      }
    });
    
    return conflicts;
  };

  const handleDriverAssignment = (serviceId: string, driverId: string) => {
    setAssignments(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], driverId }
    }));
  };

  const handleDestinationAssignment = (serviceId: string, destination: string) => {
    setAssignments(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], destination }
    }));
  };

  const handleConceptAssignment = (serviceId: string, concept: string) => {
    setAssignments(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], concept }
    }));
  };

  const handleConfirm = () => {
    const assignedServices = Object.keys(assignments).filter(serviceId => assignments[serviceId]?.driverId);
    if (assignedServices.length === 0) {
      alert('Por favor asigne al menos un conductor a un servicio');
      return;
    }
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    const assignmentArray = Object.entries(assignments)
      .filter(([_, assignment]) => assignment.driverId)
      .map(([serviceId, assignment]) => ({ 
        serviceId, 
        driverId: assignment.driverId,
        destination: assignment.destination,
        concept: assignment.concept
      }));
    
    setIsConfirmed(true);
    onConfirm(assignmentArray);
    
    // Reset state after a delay
    setTimeout(() => {
      setIsConfirmed(false);
      setShowConfirmation(false);
      setAssignments({});
      onClose();
    }, 2000);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const assignedCount = Object.values(assignments).filter(assignment => assignment.driverId).length;
  const conflicts = checkScheduleConflicts();
  const conflictCount = Object.values(conflicts).filter(c => c.hasConflict).length;

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
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                {!showConfirmation ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-blue-500" />
                        <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                          Programar servicios
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

                    {/* Summary */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          {services.length} servicios seleccionados - {assignedCount} asignados
                        </span>
                        {conflictCount > 0 && (
                          <span className="ml-4 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            ⚠️ {conflictCount} conflicto{conflictCount !== 1 ? 's' : ''} detectado{conflictCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-700">
                        Asigne conductores a los servicios que desea programar. Los servicios sin conductor asignado no serán programados.
                        Solo se muestran conductores disponibles. Destino y concepto son opcionales.
                      </p>
                    </div>

                    {/* Services Assignment Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Servicio
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado Actual
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha/Hora
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ruta
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Conductor y Placa
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Destino
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Concepto
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {services.map((service) => {
                            const assignment = assignments[service.id];
                            const selectedDriver = assignment?.driverId ? drivers.find(d => d.id === assignment.driverId) : null;
                            const conflict = conflicts[service.id];

                            return (
                              <tr key={service.id} className={`hover:bg-gray-50 ${conflict?.hasConflict ? 'bg-red-50' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Truck className="h-4 w-4 text-gray-400 mr-2" />
                                    <div>
                                      <span className="text-sm font-medium text-gray-900">{service.numero}</span>
                                      <p className="text-xs text-gray-500">Volante: {service.volante}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    PENDIENTE
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">{service.fechaHoraInicial}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">
                                    <div className="truncate max-w-xs" title={service.origen}>
                                      <span className="text-green-600">Desde:</span> {service.origen}
                                    </div>
                                    <div className="truncate max-w-xs" title={service.destino}>
                                      <span className="text-red-600">Hasta:</span> {service.destino}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={assignment?.driverId || ''}
                                    onChange={(e) => handleDriverAssignment(service.id, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <option value="">Seleccionar conductor...</option>
                                    {availableDrivers.map((driver) => (
                                      <option key={driver.id} value={driver.id}>
                                        {driver.displayName}
                                      </option>
                                    ))}
                                  </select>
                                  {selectedDriver && (
                                    <div className="mt-1 flex items-center gap-2">
                                      <div className="flex items-center gap-1 text-xs text-green-600">
                                        <User className="h-3 w-3" />
                                        {selectedDriver.name}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-blue-600">
                                        <Car className="h-3 w-3" />
                                        {selectedDriver.plate}
                                      </div>
                                    </div>
                                  )}
                                  {assignment?.driverId && (
                                    <div className="mt-1 text-xs text-green-600">
                                      ✓ Estado cambiará a PROGRAMADO
                                    </div>
                                  )}
                                  {conflict?.hasConflict && selectedDriver && (
                                    <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                      <AlertTriangle className="h-3 w-3" />
                                      <span>Conflicto de horario detectado</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={assignment?.destination || ''}
                                    onChange={(e) => handleDestinationAssignment(service.id, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!assignment?.driverId}
                                  >
                                    <option value="">Seleccionar destino...</option>
                                    {destinations.map((destination) => (
                                      <option key={destination} value={destination}>
                                        {destination}
                                      </option>
                                    ))}
                                  </select>
                                  {assignment?.destination && (
                                    <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                                      <MapPin className="h-3 w-3" />
                                      {assignment.destination}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={assignment?.concept || ''}
                                    onChange={(e) => handleConceptAssignment(service.id, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!assignment?.driverId}
                                  >
                                    <option value="">Seleccionar concepto...</option>
                                    {concepts.map((concept) => (
                                      <option key={concept} value={concept}>
                                        {concept}
                                      </option>
                                    ))}
                                  </select>
                                  {assignment?.concept && (
                                    <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                                      <FileText className="h-3 w-3" />
                                      {assignment.concept}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Conflict Summary */}
                    {conflictCount > 0 && (
                      <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-red-900 mb-2">
                              ⚠️ {conflictCount} Conflicto{conflictCount !== 1 ? 's' : ''} de Horario Detectado{conflictCount !== 1 ? 's' : ''}
                            </h5>
                            <p className="text-sm text-red-800">
                              Se han detectado conflictos de horario para algunos conductores. 
                              Puede continuar con la programación, pero se recomienda revisar y resolver estos conflictos.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={onClose}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={assignedCount === 0}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Programar {assignedCount} Servicio{assignedCount !== 1 ? 's' : ''}
                        {conflictCount > 0 && ` (${conflictCount} conflicto${conflictCount !== 1 ? 's' : ''})`}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    {!isConfirmed ? (
                      <>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                          <AlertCircle className="h-6 w-6 text-yellow-600" />
                        </div>
                        
                        <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
                          Confirmar Programación Masiva
                        </Dialog.Title>

                        <div className="mb-6">
                          <p className="text-sm text-gray-600 mb-4">
                            ¿Está seguro que desea programar {assignedCount} servicio{assignedCount !== 1 ? 's' : ''} con los conductores asignados?
                          </p>
                          
                          {conflictCount > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                              <div className="flex items-center gap-2 text-red-800 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span className="font-medium">
                                  Advertencia: {conflictCount} conflicto{conflictCount !== 1 ? 's' : ''} de horario detectado{conflictCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                            <h4 className="font-medium text-gray-900 mb-3">Servicios a programar:</h4>
                            <div className="space-y-2">
                              {Object.entries(assignments)
                                .filter(([_, assignment]) => assignment.driverId)
                                .map(([serviceId, assignment]) => {
                                  const service = services.find(s => s.id === serviceId);
                                  const driver = drivers.find(d => d.id === assignment.driverId);
                                  const conflict = conflicts[serviceId];
                                  return (
                                    <div key={serviceId} className={`flex items-center justify-between text-sm p-3 rounded border ${
                                      conflict?.hasConflict ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                                    }`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-900 font-medium">{service?.numero}</span>
                                        <span className="text-xs text-yellow-600">PENDIENTE → PROGRAMADO</span>
                                        {conflict?.hasConflict && (
                                          <span className="text-xs text-red-600 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            Conflicto
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                          <User className="h-3 w-3 text-blue-600" />
                                          <span className="text-blue-600">{driver?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Car className="h-3 w-3 text-blue-600" />
                                          <span className="text-blue-600">{driver?.plate}</span>
                                        </div>
                                        {assignment.destination && (
                                          <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-green-600" />
                                            <span className="text-green-600">{assignment.destination}</span>
                                          </div>
                                        )}
                                        {assignment.concept && (
                                          <div className="flex items-center gap-1">
                                            <FileText className="h-3 w-3 text-purple-600" />
                                            <span className="text-purple-600">{assignment.concept}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
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
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                            onClick={handleFinalConfirm}
                          >
                            {conflictCount > 0 ? 'Confirmar con Conflictos' : 'Confirmar Programación'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        
                        <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-2">
                          ¡Servicios Programados!
                        </Dialog.Title>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{assignedCount} servicio{assignedCount !== 1 ? 's han' : ' ha'} sido programado{assignedCount !== 1 ? 's' : ''} exitosamente</p>
                          <p className="text-green-600 font-medium">Estado actualizado: PENDIENTE → PROGRAMADO</p>
                          {conflictCount > 0 && (
                            <p className="text-yellow-600 font-medium">
                              {conflictCount} conflicto{conflictCount !== 1 ? 's' : ''} de horario registrado{conflictCount !== 1 ? 's' : ''} para revisión
                            </p>
                          )}
                        </div>
                      </>
                    )}
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

export default MassiveProgramModal;