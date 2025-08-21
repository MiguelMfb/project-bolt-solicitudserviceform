import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Calendar, ChevronDown, CheckCircle, XCircle, AlertTriangle, FileText, User } from 'lucide-react';
import { Service } from '../types';

interface BulkAuthorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onAuthorize: (serviceIds: string[], authorized: boolean, observacion?: string) => void;
}

const BulkAuthorizationModal: React.FC<BulkAuthorizationModalProps> = ({
  isOpen,
  onClose,
  services,
  onAuthorize,
}) => {
  const [observacion, setObservacion] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(services.map(s => s.id));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'authorize' | 'reject'>('authorize');

  const handleSelectAll = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services.map(s => s.id));
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAction = (action: 'authorize' | 'reject') => {
    if (selectedServices.length === 0) {
      alert('Por favor seleccione al menos un servicio');
      return;
    }
    setActionType(action);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onAuthorize(selectedServices, actionType === 'authorize', observacion);
    setShowConfirmation(false);
    onClose();
  };

  const getSignatureStatus = (service: Service) => {
    if (service.hasValidSignature) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'Firma válida',
        size: `${service.firmaSize?.toFixed(1)} KB`
      };
    } else {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'Firma inválida',
        size: `${service.firmaSize?.toFixed(1)} KB`
      };
    }
  };

  if (!showConfirmation) {
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
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                      Autorización Masiva de Servicios ({services.length} servicios)
                    </Dialog.Title>
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
                    {/* Selection Controls */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.length === services.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          {selectedServices.length === services.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                        </button>
                        <span className="text-sm text-blue-700">
                          {selectedServices.length} de {services.length} servicios seleccionados
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <AlertTriangle className="h-4 w-4" />
                        Solo servicios con firma válida ({'>'} 1KB) pueden ser autorizados
                      </div>
                    </div>

                    {/* Services List */}
                    <div className="space-y-4 mb-6">
                      {services.map((service) => {
                        const signatureStatus = getSignatureStatus(service);
                        const StatusIcon = signatureStatus.icon;
                        const isSelected = selectedServices.includes(service.id);
                        const canBeAuthorized = service.hasValidSignature;

                        return (
                          <div
                            key={service.id}
                            className={`border-2 rounded-lg p-4 transition-all ${
                              isSelected 
                                ? canBeAuthorized 
                                  ? 'border-green-300 bg-green-50' 
                                  : 'border-orange-300 bg-orange-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex items-center pt-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleServiceToggle(service.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </div>

                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Service Info */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-900">#{service.numero}</span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <p>Volante: {service.volante}</p>
                                    <p>Fecha: {service.fechaHoraInicial}</p>
                                  </div>
                                </div>

                                {/* Route Info */}
                                <div className="space-y-2">
                                  <div className="text-sm">
                                    <p className="text-gray-500">Origen:</p>
                                    <p className="text-gray-900 truncate" title={service.origen}>
                                      {service.origen}
                                    </p>
                                  </div>
                                  <div className="text-sm">
                                    <p className="text-gray-500">Destino:</p>
                                    <p className="text-gray-900 truncate" title={service.destino}>
                                      {service.destino}
                                    </p>
                                  </div>
                                </div>

                                {/* Signature Status */}
                                <div className="space-y-2">
                                  <div className={`flex items-center gap-2 p-2 rounded-lg border ${signatureStatus.bg} ${signatureStatus.border}`}>
                                    <StatusIcon className={`h-4 w-4 ${signatureStatus.color}`} />
                                    <div className="text-sm">
                                      <p className={`font-medium ${signatureStatus.color}`}>
                                        {signatureStatus.text}
                                      </p>
                                      <p className="text-gray-600 text-xs">
                                        Tamaño: {signatureStatus.size}
                                      </p>
                                    </div>
                                  </div>
                                  {!canBeAuthorized && (
                                    <p className="text-xs text-red-600">
                                      No se puede autorizar (firma {'<'} 1KB)
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Global Observation */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observación General (aplicará a todos los servicios seleccionados)
                      </label>
                      <textarea
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Ingrese observaciones que se aplicarán a todos los servicios seleccionados..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction('reject')}
                        disabled={selectedServices.length === 0}
                        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Rechazar Seleccionados ({selectedServices.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction('authorize')}
                        disabled={selectedServices.length === 0 || !selectedServices.some(id => services.find(s => s.id === id)?.hasValidSignature)}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Autorizar Seleccionados ({selectedServices.filter(id => services.find(s => s.id === id)?.hasValidSignature).length})
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  // Confirmation Dialog
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  {actionType === 'authorize' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Confirmar {actionType === 'authorize' ? 'Autorización' : 'Rechazo'} Masiva
                  </Dialog.Title>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    ¿Está seguro que desea {actionType === 'authorize' ? 'autorizar' : 'rechazar'} {selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''}?
                  </p>
                  
                  {actionType === 'authorize' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-green-800">
                        Solo se autorizarán los servicios con firma válida (≥1KB).
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900 mb-2">Servicios afectados:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {selectedServices.map(serviceId => {
                        const service = services.find(s => s.id === serviceId);
                        return service ? (
                          <div key={serviceId} className="text-xs text-gray-600 flex justify-between">
                            <span>#{service.numero}</span>
                            <span className={service.hasValidSignature ? 'text-green-600' : 'text-red-600'}>
                              {service.hasValidSignature ? '✓ Firma válida' : '✗ Firma inválida'}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none ${
                      actionType === 'authorize' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    onClick={handleConfirm}
                  >
                    Confirmar {actionType === 'authorize' ? 'Autorización' : 'Rechazo'}
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

export default BulkAuthorizationModal;