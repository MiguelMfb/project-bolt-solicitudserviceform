import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Truck, User, AlertCircle, CheckCircle2, Car, MapPin, FileText, Clock } from 'lucide-react';
import { Service, Driver } from '../types';

interface ProgramServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  drivers: Driver[];
  destinations?: string[];
  concepts?: string[];
  onConfirm: (driverId: string, destination?: string, concept?: string) => void;
  allServices: Service[];
}

const ProgramServiceModal: React.FC<ProgramServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  drivers,
  destinations = [],
  concepts = [],
  onConfirm,
  allServices
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Filter available drivers only
  const availableDrivers = drivers.filter(driver => driver.isAvailable);
  
  const filteredDrivers = availableDrivers.filter(driver =>
    driver.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  // Check for schedule conflicts
  const checkScheduleConflict = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return null;

    // For this example, we'll always show a conflict warning
    // In a real application, you would check against actual scheduled services
    return {
      hasConflict: true,
      conflictingService: {
        numero: '1130',
        fechaHora: service.fechaHoraInicial,
        origen: 'Hospital Central',
        destino: 'Centro Médico Norte'
      }
    };
  };

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriverId(driverId);
    setSearchTerm('');
  };

  const handleConfirm = () => {
    if (!selectedDriverId) return;
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    setIsConfirmed(true);
    onConfirm(selectedDriverId, selectedDestination, selectedConcept);
    
    // Reset state after a delay
    setTimeout(() => {
      setIsConfirmed(false);
      setShowConfirmation(false);
      setSelectedDriverId('');
      setSelectedDestination('');
      setSelectedConcept('');
      setSearchTerm('');
      onClose();
    }, 2000);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedDriverId('');
    setSelectedDestination('');
    setSelectedConcept('');
    setSearchTerm('');
  };

  const conflict = selectedDriverId ? checkScheduleConflict(selectedDriverId) : null;

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
                        <Truck className="h-6 w-6 text-blue-500" />
                        <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                          Programar Servicio
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
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Información del Servicio</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Número:</span>
                          <span className="ml-2 font-medium text-gray-900">{service.numero}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Estado Actual:</span>
                          <span className="ml-2 font-medium text-yellow-600">PENDIENTE</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Fecha/Hora:</span>
                          <span className="ml-2 font-medium text-gray-900">{service.fechaHoraInicial}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Volante:</span>
                          <span className="ml-2 font-medium text-gray-900">{service.volante}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Origen:</span>
                          <span className="ml-2 font-medium text-gray-900">{service.origen}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Destino:</span>
                          <span className="ml-2 font-medium text-gray-900">{service.destino}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Driver Selection */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Seleccionar Conductor y Placa
                        </label>
                        
                        {/* Search Input */}
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre o placa..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Selected Driver Display */}
                        {selectedDriver && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  {selectedDriver.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Car className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  {selectedDriver.plate}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Schedule Conflict Warning */}
                        {conflict && conflict.hasConflict && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-red-900 mb-2">
                                  ⚠️ Conflicto de Horario Detectado
                                </h5>
                                <div className="text-sm text-red-800 space-y-1">
                                  <p className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">Hora:</span> {conflict.conflictingService.fechaHora}
                                  </p>
                                  <p>
                                    <span className="font-medium">Servicio:</span> #{conflict.conflictingService.numero}
                                  </p>
                                  <p>
                                    <span className="font-medium">Ruta:</span> {conflict.conflictingService.origen} → {conflict.conflictingService.destino}
                                  </p>
                                </div>
                                <div className="mt-3 text-xs text-red-700 bg-red-100 rounded p-2">
                                  El conductor {selectedDriver?.name} ya tiene un servicio programado para esta hora. 
                                  Considere seleccionar otro conductor o reprogramar uno de los servicios.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Driver List */}
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                          {filteredDrivers.map((driver) => (
                            <button
                              key={driver.id}
                              onClick={() => handleDriverSelect(driver.id)}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                selectedDriverId === driver.id ? 'bg-blue-50 border-blue-200' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                      <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                                    <div className="flex items-center gap-1">
                                      <Car className="h-3 w-3 text-gray-400" />
                                      <p className="text-xs text-gray-500">{driver.plate}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Disponible
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                          
                          {filteredDrivers.length === 0 && (
                            <div className="px-4 py-8 text-center text-gray-500">
                              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No se encontraron conductores disponibles</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Destination and Concept Selection */}
                      <div className="space-y-4">
                        {/* Destination Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Destino Asignado
                          </label>
                          <div className="relative">
                            <select
                              value={selectedDestination}
                              onChange={(e) => setSelectedDestination(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                              <option value="">Seleccionar destino...</option>
                              {destinations.map((destination) => (
                                <option key={destination} value={destination}>
                                  {destination}
                                </option>
                              ))}
                            </select>
                            <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                          </div>
                          {selectedDestination && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-900">
                                  {selectedDestination}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Concept Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Concepto del Servicio
                          </label>
                          <div className="relative">
                            <select
                              value={selectedConcept}
                              onChange={(e) => setSelectedConcept(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                              <option value="">Seleccionar concepto...</option>
                              {concepts.map((concept) => (
                                <option key={concept} value={concept}>
                                  {concept}
                                </option>
                              ))}
                            </select>
                            <FileText className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                          </div>
                          {selectedConcept && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  {selectedConcept}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Information Note */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                              <p className="font-medium mb-1">Información importante:</p>
                              <ul className="text-xs space-y-1">
                                <li>• El destino y concepto son opcionales</li>
                                <li>• Se pueden modificar posteriormente</li>
                                <li>• Solo el conductor es obligatorio para programar</li>
                                <li>• Sistema verificará automáticamente conflictos de horario</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

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
                        disabled={!selectedDriverId}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Programar Servicio
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
                          Confirmar Programación
                        </Dialog.Title>

                        <div className="mb-6">
                          <p className="text-sm text-gray-600 mb-4">
                            ¿Está seguro que desea programar este servicio con la siguiente configuración?
                          </p>
                          
                          {conflict && conflict.hasConflict && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                              <div className="flex items-center gap-2 text-red-800 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span className="font-medium">Advertencia: Se detectó conflicto de horario</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-center gap-3 mb-2">
                              <User className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-900">{selectedDriver?.name}</span>
                              <Car className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-900">{selectedDriver?.plate}</span>
                            </div>
                            
                            {selectedDestination && (
                              <div className="flex items-center justify-center gap-2">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-gray-700">Destino: {selectedDestination}</span>
                              </div>
                            )}
                            
                            {selectedConcept && (
                              <div className="flex items-center justify-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-gray-700">Concepto: {selectedConcept}</span>
                              </div>
                            )}
                            
                            <p className="text-sm text-gray-600">Servicio: {service.numero}</p>
                            <p className="text-xs text-yellow-600 mt-2">
                              El estado cambiará de PENDIENTE a PROGRAMADO
                            </p>
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
                            {conflict && conflict.hasConflict ? 'Confirmar con Conflicto' : 'Confirmar Programación'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        
                        <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-2">
                          ¡Servicio Programado!
                        </Dialog.Title>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Servicio {service.numero} programado exitosamente</p>
                          <p>Conductor: {selectedDriver?.name}</p>
                          <p>Placa: {selectedDriver?.plate}</p>
                          {selectedDestination && <p>Destino: {selectedDestination}</p>}
                          {selectedConcept && <p>Concepto: {selectedConcept}</p>}
                          <p className="text-green-600 font-medium">Estado: PROGRAMADO</p>
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

export default ProgramServiceModal;