import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, FileText } from 'lucide-react';
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
}

const SolicitudTransporteView: React.FC<SolicitudTransporteViewProps> = ({
  userInfo,
  patientInfo,
  authorization,
  onGoBack,
  onScheduleServices,
  onUpdateUserInfo,
  onLogout
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
  
  const [hasReturnService, setHasReturnService] = useState(false);
  const [hasReadInfo, setHasReadInfo] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

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
  }, [authorization]);

  const handleServiceChange = (serviceId: string, field: keyof ServiceFormData, value: any) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId ? { ...service, [field]: value } : service
    ));

    if (hasReturnService && (field === 'origen' || field === 'destino' || field === 'ciudadOrigen' || field === 'ciudadDestino' || field === 'barrioOrigen' || field === 'barrioDestino')) {
      const mainService = services.find(s => s.tipo === 'IDA');
      const returnService = services.find(s => s.tipo === 'REGRESO');
      
      if (mainService && returnService) {
        setServices(prev => prev.map(service => 
          service.id === returnService.id
            ? {
                ...service,
                origen: field === 'destino' ? value : field === 'origen' ? service.origen : service.origen,
                destino: field === 'origen' ? value : field === 'destino' ? service.destino : service.destino,
                ciudadOrigen: field === 'ciudadDestino' ? value : field === 'ciudadOrigen' ? service.ciudadOrigen : service.ciudadOrigen,
                ciudadDestino: field === 'ciudadOrigen' ? value : field === 'ciudadDestino' ? service.ciudadDestino : service.ciudadDestino,
                barrioOrigen: field === 'barrioDestino' ? value : field === 'barrioOrigen' ? service.barrioOrigen : service.barrioOrigen,
                barrioDestino: field === 'barrioOrigen' ? value : field === 'barrioDestino' ? service.barrioDestino : service.barrioDestino
              }
            : service
        ));
      }
    }
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
      setServices(prev => [...prev, {
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
      }]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = services.every(service =>
      service.origen && service.destino && service.ciudadOrigen && service.ciudadDestino && service.fechaHora
    );

    if (!isValid) {
      setWarningMessage('Por favor complete todos los campos requeridos (*) en todos los servicios.');
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmSchedule = () => {
    onScheduleServices(services);
  };

  const isFormSubmittable = hasReadInfo && services.every(service => 
    service.origen && service.destino && service.ciudadOrigen && service.ciudadDestino && service.fechaHora
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
          <h2 className="text-lg font-semibold text-[#020432] mb-4">
            Programar Traslado(s)
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {services.map(service => renderServiceForm(service))}

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
              <div className="flex items-center gap-4">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#01be6a]"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900">Añadir Regreso</span>
                </label>
              </div>
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

            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#01be6a] hover:bg-[#00a85d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01be6a] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormSubmittable}
              >
                Solicitar Servicios
              </button>
            </div>
          </form>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSchedule}
        services={services}
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
    </div>
  );
};

export default SolicitudTransporteView;
