import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, FileText, Plus, Trash2, User, X, Edit3 } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { UserInfo, PatientInfo, Authorization, ServiceFormData } from '../types';
import UserDropdown from './UserDropdown';
import PatientInfoBlock from './PatientInfoBlock';
import ConfirmationModal from './ConfirmationModal';
import AddressSelector from './AddressSelector';
import generateUUID from '../utils/generateUUID';

// Register Spanish locale
registerLocale('es', es);

interface BulkServiceRequestViewProps {
  userInfo: UserInfo;
  patientInfo: PatientInfo;
  authorization: Authorization;
  onGoBack: () => void;
  onScheduleServices: (services: ServiceFormData[]) => void;
  onUpdateUserInfo: (updatedInfo: { email: string; phoneNumber: string; address: string }) => void;
  onLogout: () => void;
}

const BulkServiceRequestView: React.FC<BulkServiceRequestViewProps> = ({
  userInfo,
  patientInfo,
  authorization,
  onGoBack,
  onScheduleServices,
  onUpdateUserInfo,
  onLogout
}) => {
  const [services, setServices] = useState<ServiceFormData[]>([]);
  const [hasReadInfo, setHasReadInfo] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [editingAddresses, setEditingAddresses] = useState<{[key: string]: { origen: boolean; destino: boolean }}>({});

  // Common parameters for all services
  const [commonParams, setCommonParams] = useState({
    ciudadOrigen: '',
    ciudadDestino: '',
    origen: '',
    destino: '',
    barrioOrigen: '',
    barrioDestino: '',
    conAcompanante: false,
    telefonoAdicional: '',
    observaciones: ''
  });

  // If grouped authorization (doble volante), expose list of volantes
  const volantesList: string[] = (authorization as any)?.volantes?.length
    ? (authorization as any).volantes
    : [authorization.volante];

  // Get available cities from authorization
  const availableCities = [authorization.ciudadA, authorization.ciudadB];

  // Get the current date and time
  const now = new Date();
  const currentHour = now.getHours();

  // Calculate the minimum selectable date
  const getMinDate = () => {
    const baseDate = startOfDay(now);
    return currentHour >= 16 ? addDays(baseDate, 2) : addDays(baseDate, 1);
  };

  // Filter available times
  const filterTime = (time: Date) => {
    const hour = time.getHours();
    return hour >= 6 && hour < 18;
  };

  // Custom day class names
  const getDayClassName = (date: Date) => {
    const minDate = getMinDate();
    if (date < minDate) return 'react-datepicker__day--disabled';
    return 'react-datepicker__day--enabled';
  };

  // Initialize with 10 empty service slots
  useEffect(() => {
    const initialServices = Array.from({ length: 10 }, (_, index) => ({
      id: generateUUID(),
      origen: '',
      destino: '',
      ciudadOrigen: '',
      ciudadDestino: '',
      barrioOrigen: '',
      barrioDestino: '',
      fechaHora: null,
      idaYRegreso: false,
      conAcompanante: false,
      telefonoAdicional: '',
      tipo: 'ADICIONAL' as const,
      observaciones: ''
    }));
    setServices(initialServices);
  }, []);

  // Update all services when common parameters change
  useEffect(() => {
    setServices(prev => prev.map(service => ({
      ...service,
      ciudadOrigen: commonParams.ciudadOrigen,
      ciudadDestino: commonParams.ciudadDestino,
      origen: commonParams.origen,
      destino: commonParams.destino,
      barrioOrigen: commonParams.barrioOrigen,
      barrioDestino: commonParams.barrioDestino,
      conAcompanante: commonParams.conAcompanante,
      telefonoAdicional: commonParams.telefonoAdicional,
      observaciones: commonParams.observaciones
    })));
  }, [commonParams]);

  const handleCommonParamChange = (field: string, value: any) => {
    setCommonParams(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceDateChange = (serviceId: string, date: Date | null) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId ? { ...service, fechaHora: date } : service
    ));
  };

  const handleServiceCompanionChange = (serviceId: string, hasCompanion: boolean) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId ? { ...service, conAcompanante: hasCompanion } : service
    ));
  };

  const handleServiceObservationChange = (serviceId: string, observation: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId ? { ...service, observaciones: observation } : service
    ));
  };

  const handleServiceAddressChange = (serviceId: string, field: 'origen' | 'destino', value: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId ? { ...service, [field]: value } : service
    ));
  };

  const toggleAddressEditing = (serviceId: string, field: 'origen' | 'destino') => {
    setEditingAddresses(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [field]: !prev[serviceId]?.[field]
      }
    }));
  };

  const addMoreServices = () => {
    const newServices = Array.from({ length: 10 }, () => ({
      id: generateUUID(),
      origen: commonParams.origen,
      destino: commonParams.destino,
      ciudadOrigen: commonParams.ciudadOrigen,
      ciudadDestino: commonParams.ciudadDestino,
      barrioOrigen: commonParams.barrioOrigen,
      barrioDestino: commonParams.barrioDestino,
      fechaHora: null,
      idaYRegreso: false,
      conAcompanante: commonParams.conAcompanante,
      telefonoAdicional: commonParams.telefonoAdicional,
      tipo: 'ADICIONAL' as const,
      observaciones: commonParams.observaciones
    }));
    setServices(prev => [...prev, ...newServices]);
  };

  const removeService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out services without dates and validate common parameters
    const validServices = services.filter(service => service.fechaHora !== null);

    if (validServices.length === 0) {
      setWarningMessage('Debe programar al menos un servicio con fecha y hora.');
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    if (!commonParams.origen || !commonParams.destino || !commonParams.ciudadOrigen || !commonParams.ciudadDestino) {
      setWarningMessage('Por favor complete todos los campos de origen y destino.');
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    if (validServices.length > authorization.disponible) {
      setWarningMessage(`Solo puede programar ${authorization.disponible} servicios con esta autorización.`);
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmSchedule = () => {
    const validServices = services.filter(service => service.fechaHora !== null);
    onScheduleServices(validServices);
  };

  const validServicesCount = services.filter(service => service.fechaHora !== null).length;
  const isFormSubmittable = hasReadInfo && validServicesCount > 0 && 
    commonParams.origen && commonParams.destino && commonParams.ciudadOrigen && commonParams.ciudadDestino;

  return (
    <div className="min-h-screen bg-[#eef2f5]">
      <header className="bg-[#020432] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="https://web.tnrapp.com.co/assets/image/logo-menu.png"
              alt="Logo"
              className="h-8 w-auto cursor-pointer"
              onClick={onGoBack}
            />
          </div>
          <UserDropdown 
            userInfo={userInfo}
            onUpdateUserInfo={onUpdateUserInfo}
            onLogout={onLogout}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Solicitud de Múltiples Servicios
          </h1>
          <div className="text-sm text-gray-600">
            Servicios programados: <span className="font-semibold text-blue-600">{validServicesCount}</span> / 
            <span className="font-semibold text-green-600">{authorization.disponible}</span> disponibles
          </div>
        </div>

        <PatientInfoBlock patientInfo={patientInfo} />

        <div className="bg-[#e6f4ea] rounded-lg shadow-md border border-green-200 p-6">
          <h2 className="text-lg font-semibold text-[#020432] mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Información del Volante - {authorization.tarifaUT}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                {volantesList.length > 1 ? 'Volantes Vigentes:' : 'Volante:'}
              </label>
              <div className="flex flex-col gap-2">
                {volantesList.map(v => (
                  <div
                    key={v}
                    className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-900 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='h-3.5 w-3.5'>
                          <rect x='3' y='5' width='18' height='14' rx='2' />
                          <path d='M7 9h10M7 13h6' />
                        </svg>
                      </span>
                      <span className="font-semibold">Volante {v}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                Tarifa asignada:
              </label>
              <p className="text-sm text-gray-900 font-medium">
                {authorization.tarifaUT || '-'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                Servicios Disponibles:
              </label>
              <p className="text-sm text-gray-900 font-medium">
                {authorization.disponible ?? '-'} de {authorization.cantidad}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                Vigencia:
              </label>
              <p className="text-sm text-gray-900 font-medium">
                {authorization.fechaInicial} - {authorization.fechaFinal}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
              Ciudades Autorizadas:
            </label>
            <div className="text-sm text-gray-900 font-medium">
              <p>{authorization.ciudadA}</p>
              <p>{authorization.ciudadB}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#020432] mb-6">
            Parámetros Comunes para Todos los Servicios
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Origin Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 text-green-500 mr-2" />
                Información de Origen
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad de Origen <span className="text-red-500">*</span>
                </label>
                <select
                  value={commonParams.ciudadOrigen}
                  onChange={(e) => handleCommonParamChange('ciudadOrigen', e.target.value)}
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
                  Dirección de Origen <span className="text-red-500">*</span>
                </label>
                <AddressSelector
                  value={commonParams.origen}
                  onChange={(value) => handleCommonParamChange('origen', value)}
                  userInfo={userInfo}
                  placeholder={commonParams.ciudadOrigen ? `Dirección en ${commonParams.ciudadOrigen}` : "Primero seleccione una ciudad"}
                  disabled={!commonParams.ciudadOrigen}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento de Origen
                </label>
                <input
                  type="text"
                  value={commonParams.barrioOrigen}
                  onChange={(e) => handleCommonParamChange('barrioOrigen', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                  placeholder="Apartamento, oficina, etc."
                  disabled={!commonParams.ciudadOrigen}
                />
              </div>
            </div>

            {/* Destination Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2" />
                Información de Destino
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad de Destino <span className="text-red-500">*</span>
                </label>
                <select
                  value={commonParams.ciudadDestino}
                  onChange={(e) => handleCommonParamChange('ciudadDestino', e.target.value)}
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
                  Dirección de Destino <span className="text-red-500">*</span>
                </label>
                <AddressSelector
                  value={commonParams.destino}
                  onChange={(value) => handleCommonParamChange('destino', value)}
                  userInfo={userInfo}
                  placeholder={commonParams.ciudadDestino ? `Dirección en ${commonParams.ciudadDestino}` : "Primero seleccione una ciudad"}
                  disabled={!commonParams.ciudadDestino}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento de Destino
                </label>
                <input
                  type="text"
                  value={commonParams.barrioDestino}
                  onChange={(e) => handleCommonParamChange('barrioDestino', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                  placeholder="Apartamento, oficina, etc."
                  disabled={!commonParams.ciudadDestino}
                />
              </div>
            </div>
          </div>

          {/* Additional Common Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono Adicional
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={commonParams.telefonoAdicional}
                  onChange={(e) => handleCommonParamChange('telefonoAdicional', e.target.value)}
                  className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                  placeholder="(XXX) XXX-XXXX"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="conAcompanante"
                checked={commonParams.conAcompanante}
                onChange={(e) => handleCommonParamChange('conAcompanante', e.target.checked)}
                className="h-4 w-4 text-[#01be6a] focus:ring-[#01be6a] border-gray-300 rounded"
              />
              <label htmlFor="conAcompanante" className="ml-2 flex items-center text-sm text-gray-900">
                <User className="h-4 w-4 mr-2" />
                Con Acompañante
              </label>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones Generales
            </label>
            <div className="relative">
              <textarea
                value={commonParams.observaciones}
                onChange={(e) => handleCommonParamChange('observaciones', e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                placeholder="Información adicional que se aplicará a todos los servicios (opcional)"
                rows={3}
              />
              <div className="absolute top-2 right-2 text-gray-500">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Datos del traslado - Main Grid Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#01be6a]">
              Datos del traslado
            </h2>
            <button
              type="button"
              onClick={addMoreServices}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#01be6a] hover:bg-[#00a85d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01be6a]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar más
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Header */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
              <div className="col-span-2">Fecha y hora del servicio:</div>
              <div className="col-span-1 text-center">Acompañante:</div>
              <div className="col-span-3">Dirección de origen:</div>
              <div className="col-span-3">Dirección de destino:</div>
              <div className="col-span-2">Observaciones:</div>
              <div className="col-span-1"></div>
            </div>

            {/* Service Grid */}
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={service.id} className="grid grid-cols-12 gap-4 items-start py-3 border-b border-gray-100 last:border-b-0">
                  {/* Date and Time */}
                  <div className="col-span-2">
                    <div className="relative">
                      <DatePicker
                        selected={service.fechaHora}
                        onChange={(date: Date | null) => handleServiceDateChange(service.id, date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-xs focus:ring-[#01be6a] focus:border-[#01be6a]"
                        placeholderText="dd/mm/yyyy --:--"
                        minDate={getMinDate()}
                        filterTime={filterTime}
                        dayClassName={getDayClassName}
                        locale="es"
                        timeCaption="Hora"
                        minTime={setHours(setMinutes(new Date(), 0), 6)}
                        maxTime={setHours(setMinutes(new Date(), 0), 17)}
                        popperPlacement="auto"
                        popperModifiers={[
                          {
                            name: 'preventOverflow',
                            options: {
                              padding: 8
                            }
                          }
                        ]}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Companion */}
                  <div className="col-span-1 flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={service.conAcompanante}
                      onChange={(e) => handleServiceCompanionChange(service.id, e.target.checked)}
                      className="h-4 w-4 text-[#01be6a] focus:ring-[#01be6a] border-gray-300 rounded"
                    />
                    <span className="ml-1 text-xs text-gray-600">Sí</span>
                  </div>

                  {/* Origin Address */}
                  <div className="col-span-3">
                    <div className="space-y-2">
                      <div className="relative">
                        {editingAddresses[service.id]?.origen ? (
                          <input
                            type="text"
                            value={service.origen}
                            onChange={(e) => handleServiceAddressChange(service.id, 'origen', e.target.value)}
                            onBlur={() => toggleAddressEditing(service.id, 'origen')}
                            onKeyPress={(e) => e.key === 'Enter' && toggleAddressEditing(service.id, 'origen')}
                            className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Dirección de origen"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => toggleAddressEditing(service.id, 'origen')}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between group"
                          >
                            <span className="truncate">{service.origen || 'Dirección de origen'}</span>
                            <Edit3 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Destination Address */}
                  <div className="col-span-3">
                    <div className="space-y-2">
                      <div className="relative">
                        {editingAddresses[service.id]?.destino ? (
                          <input
                            type="text"
                            value={service.destino}
                            onChange={(e) => handleServiceAddressChange(service.id, 'destino', e.target.value)}
                            onBlur={() => toggleAddressEditing(service.id, 'destino')}
                            onKeyPress={(e) => e.key === 'Enter' && toggleAddressEditing(service.id, 'destino')}
                            className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Dirección de destino"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => toggleAddressEditing(service.id, 'destino')}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between group"
                          >
                            <span className="truncate">{service.destino || 'Dirección de destino'}</span>
                            <Edit3 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="col-span-2">
                    <textarea
                      value={service.observaciones}
                      onChange={(e) => handleServiceObservationChange(service.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-[#01be6a] focus:border-[#01be6a] resize-none"
                      rows={3}
                      placeholder="Observaciones específicas..."
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1 flex justify-center">
                    {services.length > 10 && (
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Eliminar servicio"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {warningMessage && (
              <p className="mt-2 text-sm text-red-600 font-medium">{warningMessage}</p>
            )}

            <div className="bg-[#fffbeb] rounded-lg shadow-sm border border-yellow-200 p-5">
              <h3 className="text-md font-semibold text-[#020432] mb-3">
                Información Importante
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Los servicios de traslado están disponibles de lunes a viernes de 6:00 AM a 6:00 PM.</li>
                <li>Para cancelaciones, debe notificar con al menos 3 horas de anticipación al servicio programado.</li>
                <li>El tiempo de espera máximo del vehículo en el lugar de recogida es de 10 minutos.</li>
                <li>Todos los servicios compartirán los mismos parámetros de origen, destino y observaciones.</li>
                <li>Solo se programarán los servicios que tengan fecha y hora asignada.</li>
                <li>Solo se permiten traslados entre las ciudades autorizadas: {authorization.ciudadA} y {authorization.ciudadB}.</li>
                <li>Haga clic en las direcciones para editarlas manualmente si es necesario.</li>
              </ul>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="hasReadInfo"
                  checked={hasReadInfo}
                  onChange={(e) => setHasReadInfo(e.target.checked)}
                  className="h-4 w-4 text-[#01be6a] focus:ring-[#01be6a] border-gray-300 rounded"
                />
                <label htmlFor="hasReadInfo" className="ml-2 block text-sm text-gray-900 font-medium">
                  He leído y acepto las condiciones.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={onGoBack}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Regresar
              </button>
              
              <button
                type="submit"
                className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#01be6a] hover:bg-[#00a85d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01be6a] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormSubmittable}
              >
                Confirmar Servicios
              </button>
            </div>
          </form>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSchedule}
        services={services.filter(service => service.fechaHora !== null)}
        authorization={authorization}
        userEmail={userInfo.email}
      />
    </div>
  );
};

export default BulkServiceRequestView;
