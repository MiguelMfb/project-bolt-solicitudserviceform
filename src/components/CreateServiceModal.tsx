import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Plus, MapPin, FileText, Calendar, User, Phone, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns';
import { ServiceFormData, Authorization } from '../types';
import AddressSelector from './AddressSelector';
import { UserInfo } from '../types';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateService: (service: ServiceFormData & { documentNumber: string; selectedAuthorization: Authorization }) => void;
  userInfo: UserInfo;
  availableCities: string[];
  destinations?: string[];
  concepts?: string[];
}

// Mock function to simulate document lookup
const mockDocumentLookup = (documentNumber: string) => {
  // Simulate API call delay
  return new Promise<{ user: any; authorizations: Authorization[] }>((resolve) => {
    setTimeout(() => {
      if (documentNumber === '52.123.456') {
        resolve({
          user: {
            name: 'Ana María López García',
            email: 'ana.lopez@ejemplo.com',
            phone: '(601) 123-4567',
            address: 'Calle 123 # 45-67, Bogotá'
          },
          authorizations: [
            {
              id: '1',
              periodo: '202503',
              volante: '20000031',
              fechaInicial: '16/03/2025',
              fechaFinal: '30/03/2025',
              tarifaAutorizada: 'TMR00001',
              tarifaUT: 'RAMPA BTA',
              cantidad: 10,
              disponible: 10,
              usadas: 0,
              estado: 'Disponibles' as const,
              ciudadA: 'Bogotá D.C.',
              ciudadB: 'Aeropuerto El Dorado'
            },
            {
              id: '2',
              periodo: '202503',
              volante: '20000032',
              fechaInicial: '16/03/2025',
              fechaFinal: '30/03/2025',
              tarifaAutorizada: 'TEI00062',
              tarifaUT: 'CHIA/BTA',
              cantidad: 4,
              disponible: 2,
              usadas: 2,
              estado: 'Disponibles' as const,
              ciudadA: 'Chía',
              ciudadB: 'Bogotá D.C.'
            }
          ]
        });
      } else {
        resolve({
          user: null,
          authorizations: []
        });
      }
    }, 1000);
  });
};

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  onCreateService,
  userInfo,
  availableCities,
  destinations = [],
  concepts = []
}) => {
  const [currentStep, setCurrentStep] = useState<'document' | 'authorization' | 'service'>('document');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  const [availableAuthorizations, setAvailableAuthorizations] = useState<Authorization[]>([]);
  const [selectedAuthorization, setSelectedAuthorization] = useState<Authorization | null>(null);
  
  const [service, setService] = useState<ServiceFormData>({
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
  });

  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

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

  const handleDocumentSearch = async () => {
    if (!documentNumber.trim()) {
      setSearchError('Por favor ingrese un número de documento');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const result = await mockDocumentLookup(documentNumber);
      
      if (result.user && result.authorizations.length > 0) {
        setFoundUser(result.user);
        setAvailableAuthorizations(result.authorizations);
        setCurrentStep('authorization');
      } else {
        setSearchError('No se encontraron autorizaciones activas para este documento');
      }
    } catch (error) {
      setSearchError('Error al buscar el documento. Por favor intente nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAuthorizationSelect = (authorization: Authorization) => {
    setSelectedAuthorization(authorization);
    setCurrentStep('service');
  };

  const handleServiceChange = (field: keyof ServiceFormData, value: any) => {
    setService(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const isValid = service.origen && service.destino && service.ciudadOrigen && service.ciudadDestino && service.fechaHora && selectedAuthorization;
    
    if (!isValid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const finalService = {
      ...service,
      destinoAsignado: selectedDestination,
      conceptoAsignado: selectedConcept,
      documentNumber,
      selectedAuthorization
    };

    setIsConfirmed(true);
    onCreateService(finalService);
    
    // Reset and close after delay
    setTimeout(() => {
      resetModal();
      onClose();
    }, 2000);
  };

  const resetModal = () => {
    setCurrentStep('document');
    setDocumentNumber('');
    setFoundUser(null);
    setAvailableAuthorizations([]);
    setSelectedAuthorization(null);
    setSearchError('');
    setIsConfirmed(false);
    setService({
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
    });
    setSelectedDestination('');
    setSelectedConcept('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'document' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          <span className="text-sm font-medium">1</span>
        </div>
        <div className={`w-12 h-1 ${currentStep !== 'document' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'authorization' ? 'bg-blue-600 text-white' : currentStep === 'service' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          <span className="text-sm font-medium">2</span>
        </div>
        <div className={`w-12 h-1 ${currentStep === 'service' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 'service' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          <span className="text-sm font-medium">3</span>
        </div>
      </div>
    </div>
  );

  const renderDocumentStep = () => (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <Search className="h-8 w-8 text-blue-600" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Buscar Usuario
      </h3>
      <p className="text-gray-600 mb-8">
        Ingrese el número de documento del usuario para buscar sus autorizaciones disponibles
      </p>
      
      <div className="max-w-md mx-auto">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Documento
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 52.123.456"
            onKeyPress={(e) => e.key === 'Enter' && handleDocumentSearch()}
          />
          <button
            onClick={handleDocumentSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
            Buscar
          </button>
        </div>
        
        {searchError && (
          <p className="mt-3 text-sm text-red-600">{searchError}</p>
        )}
      </div>
    </div>
  );

  const renderAuthorizationStep = () => (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Seleccionar Autorización
        </h3>
        <p className="text-gray-600">
          Usuario encontrado: <span className="font-medium">{foundUser?.name}</span>
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Información del Usuario</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Documento:</span>
            <span className="ml-2 font-medium">{documentNumber}</span>
          </div>
          <div>
            <span className="text-gray-600">Teléfono:</span>
            <span className="ml-2 font-medium">{foundUser?.phone}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Dirección:</span>
            <span className="ml-2 font-medium">{foundUser?.address}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Autorizaciones Disponibles:</h4>
        {availableAuthorizations.map((auth) => (
          <button
            key={auth.id}
            onClick={() => handleAuthorizationSelect(auth)}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium text-gray-900">{auth.tarifaUT}</h5>
                <p className="text-sm text-gray-600">Volante: {auth.volante}</p>
                <p className="text-sm text-gray-600">Vigencia: {auth.fechaInicial} - {auth.fechaFinal}</p>
                <p className="text-sm text-gray-600">Ciudades: {auth.ciudadA} ↔ {auth.ciudadB}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {auth.disponible} disponibles
                </span>
                <p className="text-xs text-gray-500 mt-1">{auth.cantidad} total</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-blue-600">
              <span className="text-sm">Seleccionar esta autorización</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-start">
        <button
          onClick={() => setCurrentStep('document')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Volver a búsqueda
        </button>
      </div>
    </div>
  );

  const renderServiceStep = () => (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Crear Servicio
        </h3>
        <p className="text-gray-600">
          Autorización: <span className="font-medium">{selectedAuthorization?.tarifaUT}</span> - 
          Usuario: <span className="font-medium">{foundUser?.name}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Origin Section */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <MapPin className="h-5 w-5 text-green-600 mr-2" />
            Información de Origen
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad de Origen <span className="text-red-500">*</span>
              </label>
              <select
                value={service.ciudadOrigen}
                onChange={(e) => handleServiceChange('ciudadOrigen', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccione una ciudad</option>
                <option value={selectedAuthorization?.ciudadA}>{selectedAuthorization?.ciudadA}</option>
                <option value={selectedAuthorization?.ciudadB}>{selectedAuthorization?.ciudadB}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complemento de Origen
              </label>
              <input
                type="text"
                value={service.barrioOrigen}
                onChange={(e) => handleServiceChange('barrioOrigen', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Apartamento, oficina, etc."
                disabled={!service.ciudadOrigen}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección de Origen <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={service.origen}
              onChange={(e) => handleServiceChange('origen', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={service.ciudadOrigen ? `Dirección en ${service.ciudadOrigen}` : "Primero seleccione una ciudad"}
              disabled={!service.ciudadOrigen}
            />
          </div>
        </div>

        {/* Destination Section */}
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
            <MapPin className="h-5 w-5 text-red-600 mr-2" />
            Información de Destino
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad de Destino <span className="text-red-500">*</span>
              </label>
              <select
                value={service.ciudadDestino}
                onChange={(e) => handleServiceChange('ciudadDestino', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Seleccione una ciudad</option>
                <option value={selectedAuthorization?.ciudadA}>{selectedAuthorization?.ciudadA}</option>
                <option value={selectedAuthorization?.ciudadB}>{selectedAuthorization?.ciudadB}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complemento de Destino
              </label>
              <input
                type="text"
                value={service.barrioDestino}
                onChange={(e) => handleServiceChange('barrioDestino', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Apartamento, oficina, etc."
                disabled={!service.ciudadDestino}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección de Destino <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={service.destino}
              onChange={(e) => handleServiceChange('destino', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={service.ciudadDestino ? `Dirección en ${service.ciudadDestino}` : "Primero seleccione una ciudad"}
              disabled={!service.ciudadDestino}
            />
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            Detalles del Servicio
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={service.fechaHora}
                  onChange={(date: Date | null) => handleServiceChange('fechaHora', date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy, HH:mm"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholderText="Seleccione fecha y hora"
                  minDate={getMinDate()}
                  filterTime={filterTime}
                  locale="es"
                  timeCaption="Hora"
                  minTime={setHours(setMinutes(new Date(), 0), 6)}
                  maxTime={setHours(setMinutes(new Date(), 0), 17)}
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono Adicional
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={service.telefonoAdicional}
                  onChange={(e) => handleServiceChange('telefonoAdicional', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(XXX) XXX-XXXX"
                />
                <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Assignment Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destino Asignado
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar destino...</option>
                {destinations.map((destination) => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concepto del Servicio
              </label>
              <select
                value={selectedConcept}
                onChange={(e) => setSelectedConcept(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar concepto...</option>
                {concepts.map((concept) => (
                  <option key={concept} value={concept}>
                    {concept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <div className="relative">
              <textarea
                value={service.observaciones}
                onChange={(e) => handleServiceChange('observaciones', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Información adicional sobre el servicio (opcional)"
                rows={3}
              />
              <FileText className="absolute top-3 right-3 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="conAcompanante"
              checked={service.conAcompanante}
              onChange={(e) => handleServiceChange('conAcompanante', e.target.checked)}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="conAcompanante" className="ml-3 flex items-center text-sm font-medium text-gray-700">
              <User className="h-4 w-4 mr-2" />
              Con Acompañante
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep('authorization')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Cambiar autorización
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Crear Servicio
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        ¡Servicio Creado Exitosamente!
      </h3>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Usuario:</span> {foundUser?.name}
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Documento:</span> {documentNumber}
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Autorización:</span> {selectedAuthorization?.tarifaUT}
        </p>
        <p className="text-sm text-gray-700">
          El servicio ha sido creado y está listo para ser programado
        </p>
      </div>
      
      <p className="text-sm text-green-600 font-medium">
        Redirigiendo...
      </p>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                {!isConfirmed ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Plus className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Crear Nuevo Servicio
                        </h2>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        onClick={handleClose}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {!isConfirmed && renderStepIndicator()}

                    {currentStep === 'document' && renderDocumentStep()}
                    {currentStep === 'authorization' && renderAuthorizationStep()}
                    {currentStep === 'service' && renderServiceStep()}
                  </>
                ) : (
                  renderConfirmation()
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateServiceModal;