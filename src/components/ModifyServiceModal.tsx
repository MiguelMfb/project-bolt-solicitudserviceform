import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { Service } from '../types';

interface ModifyServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  onSave: (updatedService: Service) => void;
}

const ModifyServiceModal: React.FC<ModifyServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave
}) => {
  const [modifiedService, setModifiedService] = useState<Service>(service);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (!service.fechaContratada) return null;
    
    const parsedDate = new Date(service.fechaContratada);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  });

  // Available cities (in a real app, this would come from props or context)
  const availableCities = ['Bogotá D.C.', 'Chía', 'Soacha', 'Facatativá', 'Zipaquirá', 'Aeropuerto El Dorado'];

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    onSave({
      ...modifiedService,
      fechaContratada: selectedDate ? selectedDate.toLocaleDateString('es-ES') : null
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Modificar Servicio #{service.numero}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 space-y-6">
            {/* Origin Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 text-green-500 mr-2" />
                Información de Origen
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad de Origen
                  </label>
                  <select
                    value={modifiedService.ciudadOrigen || ''}
                    onChange={(e) => setModifiedService({...modifiedService, ciudadOrigen: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                  >
                    <option value="">Seleccione una ciudad</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento de Origen
                  </label>
                  <input
                    type="text"
                    value={modifiedService.complementoOrigen || ''}
                    onChange={(e) => setModifiedService({...modifiedService, complementoOrigen: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                    placeholder="Apartamento, oficina, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección de Origen
                </label>
                <input
                  type="text"
                  value={modifiedService.origen}
                  onChange={(e) => setModifiedService({...modifiedService, origen: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                />
              </div>
            </div>

            {/* Destination Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2" />
                Información de Destino
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad de Destino
                  </label>
                  <select
                    value={modifiedService.ciudadDestino || ''}
                    onChange={(e) => setModifiedService({...modifiedService, ciudadDestino: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                  >
                    <option value="">Seleccione una ciudad</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento de Destino
                  </label>
                  <input
                    type="text"
                    value={modifiedService.complementoDestino || ''}
                    onChange={(e) => setModifiedService({...modifiedService, complementoDestino: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                    placeholder="Apartamento, oficina, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección de Destino
                </label>
                <input
                  type="text"
                  value={modifiedService.destino}
                  onChange={(e) => setModifiedService({...modifiedService, destino: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora
              </label>
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                  placeholderText="Seleccione fecha y hora"
                  popperPlacement="auto"
                  popperModifiers={[
                    {
                      name: 'preventOverflow',
                      options: {
                        padding: 8
                      }
                    }
                  ]}
                />
                <div className="absolute right-2 top-2 text-gray-500">
                  <Calendar className="h-5 w-5" />
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
              Cancelar
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-[#01be6a] px-4 py-2 text-sm font-medium text-white hover:bg-[#01a85d] focus:outline-none"
              onClick={handleSave}
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyServiceModal;