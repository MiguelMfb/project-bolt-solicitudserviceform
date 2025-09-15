import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, FileText, Plus, X, Edit3, CheckCircle2 } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { UserInfo, PatientInfo, Authorization, ServiceFormData } from '../types';
import UserDropdown from './UserDropdown';
import PatientInfoBlock from './PatientInfoBlock';
import ConfirmationModal from './ConfirmationModal';
import AddressSelector from './AddressSelector';
import LimitModal from './LimitModal';
import CancelRequestModal from './CancelRequestModal';

// Register Spanish locale
registerLocale('es', es);

interface SolicitudTransporteViewProps {
  userInfo: UserInfo;
  patientInfo: PatientInfo;
  authorization: Authorization;
  onGoBack: () => void;
  onScheduleServices: (services: ServiceFormData[]) => void;
  onUpdateUserInfo: (updatedInfo: { email: string; phoneNumber: string; address: string }) => void;
  onLogout: () => void;
  initialMode?: 'single' | 'bulk';
}

const SolicitudTransporteView: React.FC<SolicitudTransporteViewProps> = ({
  userInfo,
  patientInfo,
  authorization,
  onGoBack,
  onScheduleServices,
  onUpdateUserInfo,
  onLogout,
  initialMode = 'single'
}) => {
  // If the authorization comes from a grouped item, it may include multiple volantes
  const volantesList: string[] = (authorization as any)?.volantes?.length
    ? (authorization as any).volantes
    : [authorization.volante];
  const [services, setServices] = useState<ServiceFormData[]>([{
    id: crypto.randomUUID(),
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
    tipo: 'IDA',
    observaciones: ''
  }]);

  const [requestMode, setRequestMode] = useState<'single' | 'bulk'>(initialMode);
  const [bulkServices, setBulkServices] = useState<ServiceFormData[]>([]);
  const [editingBulkAddresses, setEditingBulkAddresses] = useState<Record<string, { origen?: boolean; destino?: boolean }>>({});
  const [hasReturnService, setHasReturnService] = useState(false);
  const [hasReadInfo, setHasReadInfo] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [servicesToConfirm, setServicesToConfirm] = useState<ServiceFormData[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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

  const syncReturnWithMain = (list: ServiceFormData[]) => {
    const mainService = list.find(service => service.tipo === 'IDA');
    const returnService = list.find(service => service.tipo === 'REGRESO');

    if (!mainService || !returnService) {
      return list;
    }

    return list.map(service =>
      service.id === returnService.id
        ? {
            ...service,
            origen: mainService.destino || '',
            destino: mainService.origen || '',
            ciudadOrigen: mainService.ciudadDestino || '',
            ciudadDestino: mainService.ciudadOrigen || '',
            barrioOrigen: mainService.barrioDestino || '',
            barrioDestino: mainService.barrioOrigen || '',
            conAcompanante: mainService.conAcompanante,
            telefonoAdicional: mainService.telefonoAdicional,
          }
        : service
    );
  };

  const createBulkService = (template?: ServiceFormData, tipo: 'IDA' | 'REGRESO' = 'IDA'): ServiceFormData => ({
    id: crypto.randomUUID(),
    origen: template?.origen || '',
    destino: template?.destino || '',
    ciudadOrigen: template?.ciudadOrigen || '',
    ciudadDestino: template?.ciudadDestino || '',
    barrioOrigen: template?.barrioOrigen || '',
    barrioDestino: template?.barrioDestino || '',
    fechaHora: null,
    idaYRegreso: false,
    conAcompanante: template?.conAcompanante || false,
    telefonoAdicional: template?.telefonoAdicional || '',
    tipo,
    observaciones: template?.observaciones || '',
  });

  const buildInitialBulkServices = () => {
    const mainService = services.find(service => service.tipo === 'IDA') || services[0];
    const returnService = services.find(service => service.tipo === 'REGRESO');

    if (!mainService) {
      return Array.from({ length: 10 }, () => createBulkService());
    }

    const alternateWithReturn = hasReturnService && !!returnService;

    return Array.from({ length: 10 }, (_, index) => {
      if (alternateWithReturn) {
        const isReturnRow = index % 2 === 1;
        return createBulkService(isReturnRow ? returnService : mainService, isReturnRow ? 'REGRESO' : 'IDA');
      }

      return createBulkService(mainService, 'IDA');
    });
  };

  useEffect(() => {
    setServices([{
      id: crypto.randomUUID(),
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
      tipo: 'IDA',
      observaciones: ''
    }]);
    setHasReturnService(false);
    setWarningMessage(null);
    setHasReadInfo(false);
    setRequestMode(initialMode);
    setBulkServices([]);
    setEditingBulkAddresses({});
    setServicesToConfirm([]);
    setIsCancelModalOpen(false);
  }, [authorization, initialMode]);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- se recalcula solo al activar modo masivo o regreso
  useEffect(() => {
    if (requestMode === 'bulk') {
      setBulkServices(buildInitialBulkServices());
      setEditingBulkAddresses({});
    }
  }, [requestMode, hasReturnService]);

  const handleServiceChange = (serviceId: string, field: keyof ServiceFormData, value: any) => {
    setServices(prev => {
      const updated = prev.map(service =>
        service.id === serviceId ? { ...service, [field]: value } : service
      );
      return syncReturnWithMain(updated);
    });
  };

  const canToggleReturn = () => {
    const mainService = services.find(s => s.tipo === 'IDA');
    return mainService?.origen && mainService?.destino && mainService?.ciudadOrigen && mainService?.ciudadDestino;
  };

  const handleToggleReturn = (enabled: boolean) => {
    if (!canToggleReturn()) return;

    if (enabled && services.length + 1 > authorization.disponible) {
      setIsLimitModalOpen(true);
      return;
    }

    setHasReturnService(enabled);
    if (enabled) {
      const mainService = services.find(s => s.tipo === 'IDA');
      setServices(prev => {
        const updated = [
          ...prev,
          {
            id: crypto.randomUUID(),
            origen: mainService?.destino || '',
            destino: mainService?.origen || '',
            ciudadOrigen: mainService?.ciudadDestino || '',
            ciudadDestino: mainService?.ciudadOrigen || '',
            barrioOrigen: mainService?.barrioDestino || '',
            barrioDestino: mainService?.barrioOrigen || '',
            fechaHora: null,
            idaYRegreso: false,
            conAcompanante: mainService?.conAcompanante || false,
            telefonoAdicional: mainService?.telefonoAdicional || '',
            tipo: 'REGRESO',
            observaciones: ''
          }
        ];
        return syncReturnWithMain(updated);
      });
    } else {
      setServices(prev => prev.filter(s => s.tipo !== 'REGRESO'));
    }
  };

  const handleAddService = () => {
    if (services.length + 1 > authorization.disponible) {
      setIsLimitModalOpen(true);
      return;
    }

    setServices(prev => [...prev, {
      id: crypto.randomUUID(),
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
      tipo: 'ADICIONAL',
      observaciones: ''
    }]);
  };

  const handleDeleteService = (serviceId: string) => {
    const serviceToDelete = services.find(s => s.id === serviceId);
    if (serviceToDelete?.tipo === 'REGRESO') {
      setHasReturnService(false);
    }
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleBulkDateChange = (serviceId: string, date: Date | null) => {
    setBulkServices(prev => prev.map(service =>
      service.id === serviceId ? { ...service, fechaHora: date } : service
    ));
  };

  const handleBulkCompanionChange = (serviceId: string, hasCompanion: boolean) => {
    setBulkServices(prev => prev.map(service =>
      service.id === serviceId ? { ...service, conAcompanante: hasCompanion } : service
    ));
  };

  const handleBulkObservationChange = (serviceId: string, observation: string) => {
    setBulkServices(prev => prev.map(service =>
      service.id === serviceId ? { ...service, observaciones: observation } : service
    ));
  };

  const handleBulkAddressChange = (serviceId: string, field: 'origen' | 'destino', value: string) => {
    setBulkServices(prev => prev.map(service =>
      service.id === serviceId ? { ...service, [field]: value } : service
    ));
  };

  const toggleBulkAddressEditing = (serviceId: string, field: 'origen' | 'destino') => {
    setEditingBulkAddresses(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [field]: !prev[serviceId]?.[field]
      }
    }));
  };

  const addBulkRows = () => {
    const newRows = buildInitialBulkServices().map(service => ({
      ...service,
      id: crypto.randomUUID()
    }));
    setBulkServices(prev => [...prev, ...newRows]);
  };

  const removeBulkRow = (serviceId: string) => {
    setBulkServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleToggleBulkMode = () => {
    setRequestMode(prev => (prev === 'bulk' ? 'single' : 'bulk'));
    setWarningMessage(null);
    setServicesToConfirm([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (requestMode === 'bulk') {
      const bulkMainService = services.find(service => service.tipo === 'IDA');
      const bulkBaseComplete = Boolean(
        bulkMainService?.origen &&
        bulkMainService?.destino &&
        bulkMainService?.ciudadOrigen &&
        bulkMainService?.ciudadDestino
      );

      if (!bulkBaseComplete) {
        setWarningMessage('Completa los datos de origen y destino antes de programar varios servicios.');
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }

      const validBulk = bulkServices.filter(service =>
        service.fechaHora &&
        service.origen &&
        service.destino &&
        service.ciudadOrigen &&
        service.ciudadDestino
      );

      if (validBulk.length === 0) {
        setWarningMessage('Debes programar al menos un servicio con fecha y hora.');
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }

      if (validBulk.length > authorization.disponible) {
        setWarningMessage(`Solo puedes programar ${authorization.disponible} servicios con esta autorización.`);
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }

      setServicesToConfirm(validBulk);
      setIsConfirmModalOpen(true);
      return;
    }

    const isValid = services.every(service =>
      service.origen &&
      service.destino &&
      service.ciudadOrigen &&
      service.ciudadDestino &&
      service.fechaHora
    );

    if (!isValid) {
      setWarningMessage('Por favor completa todos los campos requeridos (*) en cada servicio.');
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    setServicesToConfirm(services);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSchedule = () => {
    onScheduleServices(servicesToConfirm);
  };

  const mainService = services.find(service => service.tipo === 'IDA');
  const isBaseComplete = Boolean(
    mainService?.origen &&
    mainService?.destino &&
    mainService?.ciudadOrigen &&
    mainService?.ciudadDestino
  );

  const areSingleServicesValid = services.every(service =>
    service.origen &&
    service.destino &&
    service.ciudadOrigen &&
    service.ciudadDestino &&
    service.fechaHora
  );

  const validBulkServices = bulkServices.filter(service =>
    service.fechaHora &&
    service.origen &&
    service.destino &&
    service.ciudadOrigen &&
    service.ciudadDestino
  );

  const canSubmitBulk = isBaseComplete &&
    validBulkServices.length > 0 &&
    validBulkServices.length <= authorization.disponible;

  const isFormSubmittable = hasReadInfo && (
    requestMode === 'bulk' ? canSubmitBulk : areSingleServicesValid
  );

  const renderServiceForm = (service: ServiceFormData) => (
    <div key={service.id} className="p-4 bg-gray-50/50 rounded-lg border border-gray-200 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-green-700">
          {service.tipo === 'IDA' ? 'Servicio de Ida' : 
           service.tipo === 'REGRESO' ? 'Servicio de Regreso' : 
           'Servicio Adicional'}
        </h3>
        {service.tipo !== 'IDA' && (
          <button
            type="button"
            onClick={() => handleDeleteService(service.id)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Eliminar
          </button>
        )}
      </div>

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
            value={service.ciudadOrigen}
            onChange={(e) => handleServiceChange(service.id, 'ciudadOrigen', e.target.value)}
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
            value={service.origen}
            onChange={(value) => handleServiceChange(service.id, 'origen', value)}
            userInfo={userInfo}
            placeholder={service.ciudadOrigen ? `Dirección en ${service.ciudadOrigen}` : "Primero seleccione una ciudad"}
            disabled={!service.ciudadOrigen}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complemento de Origen
          </label>
          <input
            type="text"
            value={service.barrioOrigen}
            onChange={(e) => handleServiceChange(service.id, 'barrioOrigen', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
            placeholder="Apartamento, oficina, etc."
            disabled={!service.ciudadOrigen}
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
            value={service.ciudadDestino}
            onChange={(e) => handleServiceChange(service.id, 'ciudadDestino', e.target.value)}
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
            value={service.destino}
            onChange={(value) => handleServiceChange(service.id, 'destino', value)}
            userInfo={userInfo}
            placeholder={service.ciudadDestino ? `Dirección en ${service.ciudadDestino}` : "Primero seleccione una ciudad"}
            disabled={!service.ciudadDestino}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complemento de Destino
          </label>
          <input
            type="text"
            value={service.barrioDestino}
            onChange={(e) => handleServiceChange(service.id, 'barrioDestino', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
            placeholder="Apartamento, oficina, etc."
            disabled={!service.ciudadDestino}
          />
        </div>
      </div>

      {/* Date, Time and Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y Hora <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DatePicker
              selected={service.fechaHora}
              onChange={(date: Date | null) => handleServiceChange(service.id, 'fechaHora', date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy, HH:mm"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 focus:ring-[#01be6a] focus:border-[#01be6a] sm:text-sm"
              placeholderText="dd/mm/yyyy, --:--"
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
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono Adicional
          </label>
          <div className="relative">
            <input
              type="tel"
              value={service.telefonoAdicional}
              onChange={(e) => handleServiceChange(service.id, 'telefonoAdicional', e.target.value)}
              className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
              placeholder="(XXX) XXX-XXXX"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              <Phone className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Observations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <div className="relative">
          <textarea
            value={service.observaciones}
            onChange={(e) => handleServiceChange(service.id, 'observaciones', e.target.value)}
            className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
            placeholder="Información adicional sobre el servicio (opcional)"
            rows={3}
          />
          <div className="absolute top-2 right-2 text-gray-500">
            <FileText className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id={`conAcompanante-${service.id}`}
          checked={service.conAcompanante}
          onChange={(e) => handleServiceChange(service.id, 'conAcompanante', e.target.checked)}
          className="h-4 w-4 text-[#01be6a] focus:ring-[#01be6a] border-gray-300 rounded"
        />
        <label htmlFor={`conAcompanante-${service.id}`} className="ml-2 block text-sm text-gray-900">
          Con Acompañante
        </label>
      </div>
    </div>
  );

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
        <h1 className="text-2xl font-bold text-gray-900">
          Solicitud de Transporte
        </h1>

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
                {volantesList.map((v) => (
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
                Tarifa UT:
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
          <h2 className="text-lg font-semibold text-[#020432] mb-4">
            Programar Traslado(s)
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {services.map(service => renderServiceForm(service))}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#01be6a] hover:bg-[#00a85d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01be6a] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddService}
                >
                  + Añadir más servicios
                </button>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasReturnService}
                    onChange={(e) => handleToggleReturn(e.target.checked)}
                    disabled={!canToggleReturn()}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#01be6a]" />
                  <span className="ms-3 text-sm font-medium text-gray-900">Añadir Regreso</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleToggleBulkMode}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!isBaseComplete && requestMode !== 'bulk'}
              >
                {requestMode === 'bulk' ? (
                  <>
                    <X className="h-4 w-4" />
                    Cerrar solicitud masiva
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Solicitar varios servicios
                  </>
                )}
              </button>
            </div>

            {requestMode === 'bulk' && (
              <div className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[#020432]">Solicitud de varios servicios</h3>
                    <p className="text-sm text-gray-600">Ajusta la fecha y hora de cada traslado programado.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span>
                      Programados: <span className="font-semibold text-blue-600">{validBulkServices.length}</span>{' '}
                      / <span className="font-semibold text-green-600">{authorization.disponible}</span>
                    </span>
                    <button
                      type="button"
                      onClick={addBulkRows}
                      className="inline-flex items-center gap-2 rounded-md border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar 10 más
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 text-[11px] font-semibold uppercase tracking-wide text-blue-900 border-b border-blue-200 pb-2">
                  <div className="col-span-2">Tipo / Fecha y hora</div>
                  <div className="col-span-1 text-center">Acompañante</div>
                  <div className="col-span-3">Dirección de origen</div>
                  <div className="col-span-3">Dirección de destino</div>
                  <div className="col-span-2">Observaciones</div>
                  <div className="col-span-1 text-center">Acción</div>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {bulkServices.map((service, index) => (
                    <div
                      key={service.id}
                      className="grid grid-cols-12 gap-4 items-start py-3 border-b border-blue-100 last:border-b-0"
                    >
                      <div className="col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold ${service.tipo === 'REGRESO' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
                          >
                            {service.tipo === 'REGRESO' ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5" />
                            )}
                            {service.tipo === 'REGRESO' ? 'Regreso' : 'Ida'}
                          </span>
                          <span className="text-[10px] font-medium text-gray-500">#{index + 1}</span>
                        </div>
                        <div className="relative">
                          <DatePicker
                            selected={service.fechaHora}
                            onChange={(date: Date | null) => handleBulkDateChange(service.id, date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy, HH:mm"
                            className="w-full border border-blue-200 rounded-md shadow-sm p-2 pr-10 text-xs focus:ring-blue-400 focus:border-blue-400"
                            placeholderText="dd/mm/yyyy, --:--"
                            minDate={getMinDate()}
                            filterTime={filterTime}
                            dayClassName={getDayClassName}
                            locale="es"
                            timeCaption="Hora"
                            minTime={setHours(setMinutes(new Date(), 0), 6)}
                            maxTime={setHours(setMinutes(new Date(), 0), 17)}
                          />
                          <Calendar className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-center pt-6">
                        <input
                          type="checkbox"
                          checked={service.conAcompanante}
                          onChange={(e) => handleBulkCompanionChange(service.id, e.target.checked)}
                          className="h-4 w-4 text-[#01be6a] focus:ring-[#01be6a] border-gray-300 rounded"
                        />
                      </div>

                      <div className="col-span-3 space-y-1 pt-2">
                        {editingBulkAddresses[service.id]?.origen ? (
                          <input
                            type="text"
                            value={service.origen}
                            onChange={(e) => handleBulkAddressChange(service.id, 'origen', e.target.value)}
                            onBlur={() => toggleBulkAddressEditing(service.id, 'origen')}
                            onKeyDown={(e) => e.key === 'Enter' && toggleBulkAddressEditing(service.id, 'origen')}
                            className="w-full rounded-md border border-blue-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Dirección de origen"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => toggleBulkAddressEditing(service.id, 'origen')}
                            className="flex items-center justify-between rounded-md border border-blue-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-blue-100 cursor-pointer"
                          >
                            <span className="truncate">{service.origen || 'Dirección de origen'}</span>
                            <Edit3 className="h-3 w-3 text-blue-500" />
                          </div>
                        )}
                        <p className="text-[11px] text-gray-500">{service.ciudadOrigen}</p>
                      </div>

                      <div className="col-span-3 space-y-1 pt-2">
                        {editingBulkAddresses[service.id]?.destino ? (
                          <input
                            type="text"
                            value={service.destino}
                            onChange={(e) => handleBulkAddressChange(service.id, 'destino', e.target.value)}
                            onBlur={() => toggleBulkAddressEditing(service.id, 'destino')}
                            onKeyDown={(e) => e.key === 'Enter' && toggleBulkAddressEditing(service.id, 'destino')}
                            className="w-full rounded-md border border-blue-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Dirección de destino"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => toggleBulkAddressEditing(service.id, 'destino')}
                            className="flex items-center justify-between rounded-md border border-blue-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-blue-100 cursor-pointer"
                          >
                            <span className="truncate">{service.destino || 'Dirección de destino'}</span>
                            <Edit3 className="h-3 w-3 text-blue-500" />
                          </div>
                        )}
                        <p className="text-[11px] text-gray-500">{service.ciudadDestino}</p>
                      </div>

                      <div className="col-span-2">
                        <textarea
                          value={service.observaciones}
                          onChange={(e) => handleBulkObservationChange(service.id, e.target.value)}
                          className="w-full rounded-md border border-blue-200 px-2 py-1 text-xs focus:ring-blue-400 focus:border-blue-400 resize-none"
                          rows={3}
                          placeholder="Observaciones específicas..."
                        />
                      </div>

                      <div className="col-span-1 flex justify-center pt-4">
                        {bulkServices.length > 10 && (
                          <button
                            type="button"
                            onClick={() => removeBulkRow(service.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Eliminar servicio"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <li>Los servicios adicionales como acompañantes o paradas extra deben ser solicitados al momento de la reserva.</li>
                <li>El conductor no está autorizado a realizar cambios en la ruta o destinos sin previa autorización.</li>
                <li>Solo se permiten traslados entre las ciudades autorizadas: {authorization.ciudadA} y {authorization.ciudadB}.</li>
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#01be6a] hover:bg-[#00a85d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01be6a] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormSubmittable}
              >
                Confirmar Solicitud
              </button>
            </div>
          </form>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSchedule}
        services={servicesToConfirm}
        authorization={authorization}
        userEmail={userInfo.email}
      />

      <LimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        services={services}
        authorization={authorization}
        onDeleteService={handleDeleteService}
      />

      <CancelRequestModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => {
          setIsCancelModalOpen(false);
          onGoBack();
        }}
      />
    </div>
  );
};

export default SolicitudTransporteView;
