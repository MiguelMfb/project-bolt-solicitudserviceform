import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, FileText, Users, Truck, Filter, X, Download, Eye, CheckCircle, XCircle, AlertTriangle, Clock, UserX, User, Car, MapPin, MoreVertical, Edit, Ban, LogOut, ChevronDown, Plus } from 'lucide-react';
import { Service, Driver, ServiceStats, ApprovalStats } from '../types';
import ServiceDashboard from './ServiceDashboard';
import ApprovalDashboard from './ApprovalDashboard';
import ProgramServiceModal from './ProgramServiceModal';
import AuthorizationModal from './AuthorizationModal';
import BulkAuthorizationModal from './BulkAuthorizationModal';
import CancellationApprovalModal from './CancellationApprovalModal';
import MassiveProgramModal from './MassiveProgramModal';
import CreateServiceModal from './CreateServiceModal';
import FileManagementModal from './FileManagementModal';
import StatusMultiSelect from './StatusMultiSelect';
import MultiSelectFilter from './MultiSelectFilter';

interface CoordinatorViewProps {
  services: Service[];
  onGoBack: () => void;
  onUpdateService: (updatedService: Service) => void;
  onCancellationAction: (serviceId: string, action: 'approve' | 'reject') => void;
}

// Mock drivers data
const mockDrivers: Driver[] = [
  { id: '1', name: 'Carlos Mendez', plate: 'ABC-123', displayName: 'Carlos Mendez - ABC-123', isAvailable: true },
  { id: '2', name: 'Ana Rodriguez', plate: 'DEF-456', displayName: 'Ana Rodriguez - DEF-456', isAvailable: true },
  { id: '3', name: 'Luis Garcia', plate: 'GHI-789', displayName: 'Luis Garcia - GHI-789', isAvailable: true },
  { id: '4', name: 'Maria Lopez', plate: 'JKL-012', displayName: 'Maria Lopez - JKL-012', isAvailable: false },
  { id: '5', name: 'Pedro Martinez', plate: 'MNO-345', displayName: 'Pedro Martinez - MNO-345', isAvailable: true },
  { id: '6', name: 'Sofia Hernandez', plate: 'PQR-678', displayName: 'Sofia Hernandez - PQR-678', isAvailable: true }
];

// Mock destinations and concepts for API simulation
const mockDestinations = [
  'Hospital Central',
  'Clínica del Norte',
  'Centro Médico Sur',
  'IPS Oriente',
  'Hospital Universitario',
  'Clínica Santa Fe',
  'Centro de Especialistas',
  'Hospital San Rafael',
  'Clínica del Country',
  'Centro Médico Imbanaco'
];

const mockConcepts = [
  'TRASLADO RAMPA',
  'TRASLADO INTERNO',
  'TRASLADO EXTERNO',
  'CONSULTA MÉDICA',
  'PROCEDIMIENTO',
  'URGENCIAS',
  'HOSPITALIZACIÓN',
  'CIRUGÍA',
  'TERAPIAS',
  'EXÁMENES'
];

// Mock user info for create service modal
const mockUserInfo = {
  name: 'Ana',
  email: 'ana.rodriguez@ejemplo.com',
  phoneNumber: '(601) 987-6543',
  username: 'ana.rodriguez',
  password: 'password123',
  documentNumber: '52.123.456',
  address: 'Calle 123 # 45-67, Bogotá'
};

const CoordinatorView: React.FC<CoordinatorViewProps> = ({
  services,
  onGoBack,
  onUpdateService,
  onCancellationAction
}) => {
  const [activeTab, setActiveTab] = useState<'programming' | 'approval'>('programming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [filters, setFilters] = useState({
    dependency: 'TRANSPORTE PACIENTES REGIONAL CENTRAL',
    selectedStatuses: [] as string[],
    selectedPassengers: [] as string[],
    selectedAuthorizationStatus: [] as string[]
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [isProgrammingMode, setIsProgrammingMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showCoordinatorDropdown, setShowCoordinatorDropdown] = useState(false);
  
  // Modal states
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [authorizationModalOpen, setAuthorizationModalOpen] = useState(false);
  const [bulkAuthorizationModalOpen, setBulkAuthorizationModalOpen] = useState(false);
  const [cancellationModalOpen, setCancellationModalOpen] = useState(false);
  const [massiveProgramModalOpen, setMassiveProgramModalOpen] = useState(false);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);
  const [isFileManagementModalOpen, setIsFileManagementModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Status options for filter
  const statusOptions = [
    { value: 'PENDIENTE', label: 'Pendiente', color: 'yellow' },
    { value: 'FINALIZADO', label: 'Finalizado', color: 'blue' },
    { value: 'CANCELADO', label: 'Cancelado', color: 'red' },
    { value: 'CANCELACION_SOLICITADA', label: 'Cancelación Solicitada', color: 'orange' },
    { value: 'NO_SHOW', label: 'No Show', color: 'purple' }
  ];

  // Authorization status options for filter
  const authorizationStatusOptions = [
    { value: 'true', label: 'Autorizado', color: 'green' },
    { value: 'false', label: 'No Autorizado', color: 'red' }
  ];

  // Passenger options for filter (extracted from services)
  const passengerOptions = useMemo(() => {
    const uniquePassengers = Array.from(new Set(services.map(s => s.numero)))
      .map(numero => {
        const service = services.find(s => s.numero === numero);
        return {
          id: numero,
          label: `${numero} - Ana María López García`,
          documentNumber: '52.123.456',
          name: 'Ana María López García'
        };
      });
    return uniquePassengers;
  }, [services]);

  // Get available cities from services
  const availableCities = Array.from(new Set(
    services.flatMap(service => [service.ciudadOrigen, service.ciudadDestino].filter(Boolean))
  ));

  // Get date string for filtering
  const getDateString = (date: Date) => {
    return date.toLocaleDateString('es-ES');
  };

  // Filter services based on active filters and programming mode
  const filteredServices = useMemo(() => {
    let filtered = services.filter(service => {
      const matchesSearch = searchTerm === '' || 
        Object.values(service).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus = filters.selectedStatuses.length === 0 ||
        filters.selectedStatuses.includes(service.estado);

      const matchesPassenger = filters.selectedPassengers.length === 0 ||
        filters.selectedPassengers.includes(service.numero);

      // Authorization status filter
      const matchesAuthorizationStatus = filters.selectedAuthorizationStatus.length === 0 ||
        filters.selectedAuthorizationStatus.includes(String(service.estadoAutorizacion));

      return matchesSearch && matchesStatus && matchesPassenger && matchesAuthorizationStatus;
    });

    // Apply programming mode filter - filter by selected date for PENDIENTE and CANCELACION_SOLICITADA services
    if (isProgrammingMode || activeTab === 'programming') {
      const selectedDateStr = getDateString(selectedDate);
      filtered = filtered.filter(service => 
        service.fechaContratada === selectedDateStr && 
        (service.estado === 'PENDIENTE' || service.estado === 'CANCELACION_SOLICITADA')
      );
    }

    return filtered;
  }, [services, searchTerm, filters, isProgrammingMode, activeTab, selectedDate]);

  // Get services that can be authorized (have valid signature and not yet authorized)
  const authorizableServices = useMemo(() => {
    return filteredServices.filter(service => 
      activeTab === 'approval' && 
      !service.estadoAutorizacion && // false = not authorized yet
      service.hasValidSignature
    );
  }, [filteredServices, activeTab]);

  // Get services that can be programmed (PENDIENTE status for selected date)
  const programmableServices = useMemo(() => {
    if (activeTab !== 'programming') return [];
    const selectedDateStr = getDateString(selectedDate);
    return services.filter(service => 
      service.fechaContratada === selectedDateStr && service.estado === 'PENDIENTE'
    );
  }, [services, activeTab, selectedDate]);

  // Calculate statistics based on selected date for programming tab
  const serviceStats: ServiceStats = useMemo(() => {
    let statsServices = filteredServices;
    
    // For programming tab, filter by selected date
    if (activeTab === 'programming') {
      const selectedDateStr = getDateString(selectedDate);
      statsServices = services.filter(service => 
        service.fechaContratada === selectedDateStr
      );
    }

    return statsServices.reduce((stats, service) => {
      switch (service.estado) {
        case 'PENDIENTE':
          stats.pendiente++;
          break;
        case 'PROGRAMADO':
          stats.programado++;
          break;
        case 'CANCELACION_SOLICITADA':
          stats.cancelacionSolicitada++;
          break;
        case 'NO_SHOW':
          stats.noShow++;
          break;
      }
      return stats;
    }, {
      pendiente: 0,
      programado: 0,
      cancelacionSolicitada: 0,
      noShow: 0
    });
  }, [services, activeTab, selectedDate]);

  const approvalStats: ApprovalStats = useMemo(() => {
    return filteredServices.reduce((stats, service) => {
      if (service.estadoAutorizacion === true) {
        stats.autorizado++;
      } else if (service.estadoAutorizacion === false) {
        stats.noAutorizado++;
      }
      return stats;
    }, {
      autorizado: 0,
      noAutorizado: 0
    });
  }, [filteredServices]);

  const clearFilters = () => {
    setFilters({
      dependency: 'TRANSPORTE PACIENTES REGIONAL CENTRAL',
      selectedStatuses: [],
      selectedPassengers: [],
      selectedAuthorizationStatus: []
    });
    setSearchTerm('');
    setIsProgrammingMode(false);
  };

  const handleProgramService = (service: Service) => {
    setSelectedService(service);
    setProgramModalOpen(true);
    setActiveDropdown(null);
  };

  const handleAuthorizeService = (service: Service) => {
    setSelectedService(service);
    setAuthorizationModalOpen(true);
    setActiveDropdown(null);
  };

  const handleBulkAuthorize = () => {
    if (authorizableServices.length === 0) {
      alert('No hay servicios con firma válida para autorizar');
      return;
    }
    setBulkAuthorizationModalOpen(true);
  };

  const handleMassiveProgram = () => {
    if (programmableServices.length === 0) {
      alert('No hay servicios pendientes para programar en la fecha seleccionada');
      return;
    }
    setMassiveProgramModalOpen(true);
  };

  const handleCancellationRequest = (service: Service) => {
    setSelectedService(service);
    setCancellationModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCreateService = (serviceData: any) => {
    // In a real application, this would create a new service
    console.log('Creating new service:', serviceData);
    // For now, just close the modal
    setIsCreateServiceModalOpen(false);
  };

  const handleProgramConfirm = (driverId: string, destination?: string, concept?: string) => {
    if (!selectedService) return;
    
    const driver = mockDrivers.find(d => d.id === driverId);
    if (!driver) return;

    const updatedService = {
      ...selectedService,
      estado: 'PROGRAMADO' as const,
      conductor: driver.displayName,
      placa: driver.plate,
      // Add destination and concept if provided
      ...(destination && { destinoAsignado: destination }),
      ...(concept && { conceptoAsignado: concept })
    };

    onUpdateService(updatedService);
    setProgramModalOpen(false);
    setSelectedService(null);
  };

  const handleMassiveProgramConfirm = (assignments: { serviceId: string; driverId: string; destination?: string; concept?: string }[]) => {
    assignments.forEach(assignment => {
      const service = services.find(s => s.id === assignment.serviceId);
      const driver = mockDrivers.find(d => d.id === assignment.driverId);
      
      if (service && driver) {
        const updatedService = {
          ...service,
          estado: 'PROGRAMADO' as const,
          conductor: driver.displayName,
          placa: driver.plate,
          ...(assignment.destination && { destinoAsignado: assignment.destination }),
          ...(assignment.concept && { conceptoAsignado: assignment.concept })
        };
        onUpdateService(updatedService);
      }
    });
    setMassiveProgramModalOpen(false);
  };

  const handleAuthorizationConfirm = (authorized: boolean, observacion?: string) => {
    if (!selectedService) return;

    const updatedService = {
      ...selectedService,
      estadoAutorizacion: authorized,
      observaciones: observacion || selectedService.observaciones
    };

    onUpdateService(updatedService);
    setAuthorizationModalOpen(false);
    setSelectedService(null);
  };

  const handleBulkAuthorizationConfirm = (serviceIds: string[], authorized: boolean, observacion?: string) => {
    serviceIds.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service && (authorized ? service.hasValidSignature : true)) {
        const updatedService = {
          ...service,
          estadoAutorizacion: authorized,
          observaciones: observacion || service.observaciones
        };
        onUpdateService(updatedService);
      }
    });
    setBulkAuthorizationModalOpen(false);
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      selectedStatuses: [status]
    }));
  };

  // New function to handle approval dashboard clicks
  const handleApprovalDashboardClick = (type: 'autorizado' | 'noAutorizado') => {
    setFilters(prev => ({
      ...prev,
      selectedAuthorizationStatus: [type === 'autorizado' ? 'true' : 'false']
    }));
  };

  const toggleDropdown = (serviceId: string) => {
    setActiveDropdown(activeDropdown === serviceId ? null : serviceId);
  };

  const handleCoordinatorLogout = () => {
    setShowCoordinatorDropdown(false);
    alert('Sesión cerrada exitosamente');
    onGoBack();
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      'FINALIZADO': { style: 'bg-blue-100 text-blue-800 border border-blue-200', icon: CheckCircle },
      'PROGRAMADO': { style: 'bg-green-100 text-green-800 border border-green-200', icon: CheckCircle },
      'PENDIENTE': { style: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: Clock },
      'CANCELADO': { style: 'bg-red-100 text-red-800 border border-red-200', icon: XCircle },
      'CANCELACION_SOLICITADA': { style: 'bg-orange-100 text-orange-800 border border-orange-200', icon: AlertTriangle },
      'NO_SHOW': { style: 'bg-purple-100 text-purple-800 border border-purple-200', icon: UserX },
      'ABIERTO': { style: 'bg-cyan-100 text-cyan-800 border border-cyan-200', icon: Clock }
    };
    return configs[status] || { style: 'bg-gray-100 text-gray-800 border border-gray-200', icon: Clock };
  };

  const getAuthorizationStatusConfig = (authorized: boolean) => {
    if (authorized) {
      return { style: 'bg-green-100 text-green-800 border border-green-200', icon: CheckCircle };
    } else {
      return { style: 'bg-red-100 text-red-800 border border-red-200', icon: XCircle };
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.style}`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const AuthorizationStatusBadge = ({ authorized }: { authorized: boolean }) => {
    const config = getAuthorizationStatusConfig(authorized);
    const StatusIcon = config.icon;
    const displayStatus = authorized ? 'AUTORIZADO' : 'NO AUTORIZADO';
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.style}`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {displayStatus}
      </span>
    );
  };

  const SignatureBadge = ({ service }: { service: Service }) => {
    if (service.hasValidSignature) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Firma válida ({service.firmaSize?.toFixed(1)}KB)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Firma inválida ({service.firmaSize?.toFixed(1)}KB)
        </span>
      );
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Helper function to generate mock start and end times based on contracted time
  const generateServiceTimes = (contractedTime: string) => {
    try {
      // Parse the contracted time
      const [datePart, timePart] = contractedTime.split(' ');
      if (!timePart) return { start: contractedTime, end: contractedTime };
      
      const [hours, minutes] = timePart.split(':').map(Number);
      
      // Create start time (same as contracted)
      const startDate = new Date();
      const [day, month, year] = datePart.split('/').map(Number);
      startDate.setFullYear(year, month - 1, day);
      startDate.setHours(hours, minutes, 0, 0);
      
      // Create end time (add 45 minutes for typical service duration)
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + 45);
      
      const formatTime = (date: Date) => {
        return date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
      
      return {
        start: formatTime(startDate),
        end: formatTime(endDate)
      };
    } catch {
      return { start: contractedTime, end: contractedTime };
    }
  };

  const ActionDropdown = ({ service }: { service: Service }) => {
    const canProgram = activeTab === 'programming' && service.estado === 'PENDIENTE';
    const canManageCancellation = activeTab === 'programming' && service.estado === 'CANCELACION_SOLICITADA';
    const canAuthorize = activeTab === 'approval' && !service.estadoAutorizacion && service.hasValidSignature;

    if (!canProgram && !canManageCancellation && !canAuthorize) {
      return null;
    }

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(service.id)}
          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          title="Acciones"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        
        {activeDropdown === service.id && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            {canProgram && (
              <button
                onClick={() => handleProgramService(service)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Truck className="h-4 w-4 mr-3 text-green-600" />
                Programar Servicio
              </button>
            )}
            
            {canManageCancellation && (
              <button
                onClick={() => handleCancellationRequest(service)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-3 text-orange-600" />
                Gestionar Cancelación
              </button>
            )}
            
            {canAuthorize && (
              <button
                onClick={() => handleAuthorizeService(service)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-3 text-blue-600" />
                Autorizar Servicio
              </button>
            )}
            
            <button
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              title="Ver detalles"
            >
              <Eye className="h-4 w-4 mr-3 text-gray-600" />
              Ver Detalles
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#eef2f5]">
      {/* Header */}
      <header className="bg-[#020432] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onGoBack}
              className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>
            <div className="h-6 w-px bg-white/30"></div>
            <img
              src="https://web.tnrapp.com.co/assets/image/logo-menu.png"
              alt="Logo TNR"
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold">Panel de Coordinación</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowCoordinatorDropdown(!showCoordinatorDropdown)}
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors focus:outline-none"
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Coorditutelas</span>
                <ChevronDown className={`h-4 w-4 transform transition-transform ${showCoordinatorDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showCoordinatorDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={handleCoordinatorLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Dashboard Stats - Only show Service Dashboard for Programming tab */}
        {activeTab === 'programming' && (
          <ServiceDashboard
            title="Resumen de Servicios"
            currentStats={serviceStats}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            showDateNavigation={true}
            onStatusFilter={handleStatusFilter}
          />
        )}

        {/* Approval Dashboard - Only show for Approval tab with click handlers */}
        {activeTab === 'approval' && (
          <div onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('button')) {
              const button = target.closest('button');
              if (button?.textContent?.includes('Autorizados')) {
                handleApprovalDashboardClick('autorizado');
              } else if (button?.textContent?.includes('No Autorizados')) {
                handleApprovalDashboardClick('noAutorizado');
              }
            }
          }}>
            <ApprovalDashboard
              title="Estado de Autorizaciones"
              currentStats={approvalStats}
              previousStats={{ autorizado: 45, noAutorizado: 8 }}
              dateRange="Últimos 30 días"
              showComparison={false}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('programming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'programming'
                    ? 'border-[#01be6a] text-[#01be6a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Programación</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('approval')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'approval'
                    ? 'border-[#01be6a] text-[#01be6a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Autorización de servicios</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Filters Section */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-green-600 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                >
                  {showFilters ? 'Ocultar' : 'Mostrar'} filtros
                </button>
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
                >
                  Limpiar
                </button>
                <button className="px-3 py-1 text-sm bg-[#01be6a] text-white rounded hover:bg-[#01a85d] transition-colors">
                  Buscar
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dependencia
                  </label>
                  <select
                    value={filters.dependency}
                    onChange={(e) => setFilters(prev => ({ ...prev, dependency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                  >
                    <option value="TRANSPORTE PACIENTES REGIONAL CENTRAL">
                      TRANSPORTE PACIENTES REGIONAL CENTRAL
                    </option>
                    <option value="TRANSPORTE PACIENTES REGIONAL NORTE">
                      TRANSPORTE PACIENTES REGIONAL NORTE
                    </option>
                    <option value="TRANSPORTE PACIENTES REGIONAL SUR">
                      TRANSPORTE PACIENTES REGIONAL SUR
                    </option>
                  </select>
                </div>

                <div>
                  <StatusMultiSelect
                    label="Estados"
                    options={statusOptions}
                    selectedValues={filters.selectedStatuses}
                    onChange={(values) => setFilters(prev => ({ ...prev, selectedStatuses: values }))}
                    placeholder="Seleccionar estados..."
                  />
                </div>

                <MultiSelectFilter
                  label="Pasajeros"
                  options={passengerOptions}
                  selectedValues={filters.selectedPassengers}
                  onChange={(values) => setFilters(prev => ({ ...prev, selectedPassengers: values }))}
                  placeholder="Seleccionar pasajeros..."
                />
              </div>
            )}

            {/* Additional filters row - Show authorization status filter only for approval tab */}
            {showFilters && activeTab === 'approval' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <StatusMultiSelect
                    label="Estado de Autorización"
                    options={authorizationStatusOptions}
                    selectedValues={filters.selectedAuthorizationStatus}
                    onChange={(values) => setFilters(prev => ({ ...prev, selectedAuthorizationStatus: values }))}
                    placeholder="Seleccionar estado de autorización..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Búsqueda general
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                      placeholder="Buscar en todos los campos..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Regular search filter for programming tab */}
            {showFilters && activeTab === 'programming' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Búsqueda general
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent"
                      placeholder="Buscar en todos los campos..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                {activeTab === 'programming' && (
                  <>
                    <button
                      onClick={() => setIsCreateServiceModalOpen(true)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Servicio
                    </button>
                    <button
                      onClick={() => setIsFileManagementModalOpen(true)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Archivo Plano
                    </button>
                    <button
                      onClick={handleMassiveProgram}
                      disabled={programmableServices.length === 0}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Programar servicios ({programmableServices.length})
                    </button>
                  </>
                )}

                {activeTab === 'approval' && (
                  <button
                    onClick={handleBulkAuthorize}
                    disabled={authorizableServices.length === 0}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Autorización Masiva ({authorizableServices.length})
                  </button>
                )}
                
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de solicitud
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dependencia
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre pasajero
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Hora Contratada
                  </th>
                  {activeTab === 'approval' && (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha/Hora Inicio
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha/Hora Finalización
                      </th>
                    </>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destino
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  {activeTab === 'approval' && (
                    <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado Autorización
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Firma Digital
                      </th>
                    </>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => {
                  const serviceTimes = generateServiceTimes(service.fechaHoraInicial);
                  
                  return (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{service.numero}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">Solicitado</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{filters.dependency}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">Ana María López García</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{service.fechaHoraInicial}</span>
                      </td>
                      {activeTab === 'approval' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{serviceTimes.start}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{serviceTimes.end}</span>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-start max-w-xs">
                          <MapPin className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-900 truncate" title={service.origen}>
                            {service.origen}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start max-w-xs">
                          <MapPin className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-900 truncate" title={service.destino}>
                            {service.destino}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={service.estado} />
                      </td>
                      {activeTab === 'approval' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <AuthorizationStatusBadge authorized={service.estadoAutorizacion} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <SignatureBadge service={service} />
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <ActionDropdown service={service} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay servicios</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron servicios que coincidan con los filtros aplicados.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {selectedService && programModalOpen && (
        <ProgramServiceModal
          isOpen={programModalOpen}
          onClose={() => {
            setProgramModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
          drivers={mockDrivers}
          destinations={mockDestinations}
          concepts={mockConcepts}
          onConfirm={handleProgramConfirm}
          allServices={services}
        />
      )}

      {massiveProgramModalOpen && (
        <MassiveProgramModal
          isOpen={massiveProgramModalOpen}
          onClose={() => setMassiveProgramModalOpen(false)}
          services={programmableServices}
          drivers={mockDrivers}
          destinations={mockDestinations}
          concepts={mockConcepts}
          onConfirm={handleMassiveProgramConfirm}
          allServices={services}
        />
      )}

      {selectedService && authorizationModalOpen && (
        <AuthorizationModal
          isOpen={authorizationModalOpen}
          onClose={() => {
            setAuthorizationModalOpen(false);
            setSelectedService(null);
          }}
          serviceData={{
            numero: selectedService.numero,
            tipoSolicitud: 'Solicitado',
            fechaSolicitud: formatDateTime(selectedService.fechaSolicitud),
            fechaContratada: selectedService.fechaContratada,
            fechaHoraContratada: selectedService.fechaHoraInicial,
            fechaHoraInicio: generateServiceTimes(selectedService.fechaHoraInicial).start,
            fechaHoraFinalizacion: generateServiceTimes(selectedService.fechaHoraInicial).end,
            dependencia: filters.dependency,
            nombrePasajero: 'Ana María López García',
            identificacion: '52.123.456',
            origen: selectedService.origen,
            destino: selectedService.destino,
            observacion: selectedService.observaciones || 'Sin observaciones',
            volante: selectedService.volante,
            tarifaUT: selectedService.tarifaUT,
            codTarifa: 'TEI00001',
            placa: selectedService.placa || 'Sin asignar',
            estado: selectedService.estado,
            soporte: 'Documento médico',
            firma: 'Firmado digitalmente',
            gestion: 'Automática',
            tiempoRecorrido: '45 minutos',
            conductor: selectedService.conductor || 'Sin asignar',
            kmRecorridos: '15.2 km',
            valorRecargoACobrar: '$0',
            valorRecargoAPagar: '$0',
            fechaInicial: generateServiceTimes(selectedService.fechaHoraInicial).start,
            fechaFinal: generateServiceTimes(selectedService.fechaHoraInicial).end,
            concepto: 'Transporte médico',
            pdfUrl: selectedService.pdfUrl
          }}
          onAuthorize={handleAuthorizationConfirm}
        />
      )}

      {bulkAuthorizationModalOpen && (
        <BulkAuthorizationModal
          isOpen={bulkAuthorizationModalOpen}
          onClose={() => setBulkAuthorizationModalOpen(false)}
          services={authorizableServices}
          onAuthorize={handleBulkAuthorizationConfirm}
        />
      )}

      {selectedService && cancellationModalOpen && (
        <CancellationApprovalModal
          isOpen={cancellationModalOpen}
          onClose={() => {
            setCancellationModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
          onAction={(action) => {
            onCancellationAction(selectedService.id, action);
            setCancellationModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}

      <CreateServiceModal
        isOpen={isCreateServiceModalOpen}
        onClose={() => setIsCreateServiceModalOpen(false)}
        onCreateService={handleCreateService}
        userInfo={mockUserInfo}
        availableCities={availableCities}
        destinations={mockDestinations}
        concepts={mockConcepts}
      />

      <FileManagementModal
        isOpen={isFileManagementModalOpen}
        onClose={() => setIsFileManagementModalOpen(false)}
      />
    </div>
  );
};

export default CoordinatorView;