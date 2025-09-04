import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { UserInfo, PatientInfo, Authorization, Service, GroupedAuthorization } from '../types';
import UserDropdown from './UserDropdown';
import PatientInfoBlock from './PatientInfoBlock';
import ModifyServiceModal from './ModifyServiceModal';
import CancelServiceModal from './CancelServiceModal';
import ServiceHistoryCard from './ServiceHistoryCard';
import AuthorizationTable from './AuthorizationTable';

interface ListaServiciosViewProps {
  userInfo: UserInfo;
  patientInfo: PatientInfo;
  authorizations: Authorization[];
  pastServices: Service[];
  newlyAddedServiceId: string | null;
  onShowForm: (authorization: Authorization) => void;
  onShowBulkForm: (authorization: Authorization) => void;
  onUpdateService: (updatedService: Service) => void;
  onCancelService: (serviceId: string) => void;
  onUpdateUserInfo: (updatedInfo: { email: string; phoneNumber: string; address: string }) => void;
  onLogout: () => void;
}

const ListaServiciosView: React.FC<ListaServiciosViewProps> = ({
  userInfo,
  patientInfo,
  authorizations,
  pastServices,
  newlyAddedServiceId,
  onShowForm: _onShowForm,
  onShowBulkForm: _onShowBulkForm,
  onUpdateService,
  onCancelService,
  onUpdateUserInfo,
  onLogout
}) => {
  const [authSearchTerm, setAuthSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [serviceToCancel, setServiceToCancel] = useState<Service | null>(null);
  const [selectedVolante, setSelectedVolante] = useState<string | null>(null);

  const sortAuthorizations = (auths: GroupedAuthorization[]) => {
    return [...auths].sort((a, b) => {
      const statusPriority = {
        'Disponibles': 0,
        'No Disponibles': 1,
        'Volante Cerrado': 2
      };
      
      const statusDiff = statusPriority[a.estado] - statusPriority[b.estado];
      if (statusDiff !== 0) return statusDiff;
      
      return b.periodo.localeCompare(a.periodo);
    });
  };

  const groupAuthorizations = (auths: Authorization[]): GroupedAuthorization[] => {
    const groups: Record<string, Authorization[]> = {};
    auths.forEach((auth) => {
      const key = auth.tarifaAutorizada;
      if (!groups[key]) groups[key] = [];
      groups[key].push(auth);
    });

    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day).getTime();
    };

    return Object.values(groups).map((group) => {
      const sortedGroup = [...group].sort(
        (a, b) => parseDate(a.fechaInicial) - parseDate(b.fechaInicial)
      );
      const first = sortedGroup[0];
      const volantes = group.map((a) => a.volante);

      // Aggregate totals across all volantes in the group
      const cantidad = group.reduce((sum, a) => sum + (a.cantidad || 0), 0);
      const disponible = group.reduce((sum, a) => sum + (a.disponible || 0), 0);
      const usadas = group.reduce((sum, a) => sum + (a.usadas || 0), 0);

      // Compute overall date window
      const fechaInicial = group.reduce((min, a) => parseDate(a.fechaInicial) < parseDate(min) ? a.fechaInicial : min, group[0].fechaInicial);
      const fechaFinal = group.reduce((max, a) => parseDate(a.fechaFinal) > parseDate(max) ? a.fechaFinal : max, group[0].fechaFinal);

      // Derive estado based on availability
      const estado: Authorization['estado'] = disponible > 0
        ? 'Disponibles'
        : group.every(a => a.estado === 'Volante Cerrado')
          ? 'Volante Cerrado'
          : 'No Disponibles';

      return {
        ...first,
        cantidad,
        disponible,
        usadas,
        fechaInicial,
        fechaFinal,
        estado,
        volantes,
      } as GroupedAuthorization;
    });
  };

  const groupedAuthorizations = groupAuthorizations(authorizations);

  const filteredAuthorizations = sortAuthorizations(
    groupedAuthorizations.filter((auth) =>
      [
        auth.tarifaUT,
        auth.periodo,
        auth.fechaInicial,
        auth.fechaFinal,
        auth.ciudadA,
        auth.ciudadB,
        auth.estado,
        ...auth.volantes
      ].some((value) =>
        String(value).toLowerCase().includes(authSearchTerm.toLowerCase())
      )
    )
  );

  const filteredServices = pastServices.filter((service) => {
    const matchesSearch = Object.values(service).some((value) =>
      String(value).toLowerCase().includes(historySearchTerm.toLowerCase())
    );
    
    if (selectedVolante) {
      return matchesSearch && service.volante === selectedVolante;
    }
    
    return matchesSearch;
  });

  const handleOpenModifyModal = (service: Service) => {
    setSelectedService(service);
    setIsModifyModalOpen(true);
  };

  const handleCloseModifyModal = () => {
    setIsModifyModalOpen(false);
    setSelectedService(null);
  };

  const handleSaveModifiedService = (updatedService: Service) => {
    onUpdateService(updatedService);
    handleCloseModifyModal();
  };

  const handleOpenCancelModal = (service: Service) => {
    setServiceToCancel(service);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setServiceToCancel(null);
  };

  const handleConfirmCancel = () => {
    if (serviceToCancel) {
      onCancelService(serviceToCancel.id);
      handleCloseCancelModal();
    }
  };

  const handleViewServices = (volante: string) => {
    setSelectedVolante(volante);
    setHistorySearchTerm('');
    document.getElementById('services-history')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Acciones para abrir los formularios desde la tabla
  const handleRequestSingle = (auth: GroupedAuthorization) => {
    _onShowForm(auth);
  };

  const handleRequestBulk = (auth: GroupedAuthorization) => {
    _onShowBulkForm(auth);
  };

  const clearFilters = () => {
    setSelectedVolante(null);
    setHistorySearchTerm('');
  };

  return (
    <div className="min-h-screen bg-[#eef2f5]">
      <header className="bg-[#020432] text-white py-4 px-4 sm:px-6 shadow-md sticky top-0 z-40">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="https://web.tnrapp.com.co/assets/image/logo-menu.png"
              alt="Logo TNR"
              className="h-8 md:h-9 w-auto"
            />
          </div>
          <UserDropdown 
            userInfo={userInfo} 
            onUpdateUserInfo={onUpdateUserInfo}
            onLogout={onLogout}
          />
        </div>
      </header>

      <main className="max-w-full mx-auto py-6 sm:py-8 px-4 space-y-6 sm:space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Solicitud de Transporte
        </h1>

        <PatientInfoBlock patientInfo={patientInfo} />

        <section className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 border-b border-gray-200 pb-4 mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-[#020432]">
              Mis Autorizaciones
            </h2>
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#01be6a] focus:border-[#01be6a] sm:text-sm transition duration-150 ease-in-out"
                placeholder="Buscar autorización..."
                value={authSearchTerm}
                onChange={(e) => setAuthSearchTerm(e.target.value)}
                aria-label="Buscar Autorizaciones"
              />
            </div>
          </div>

          {/* Authorization Table */}
          <AuthorizationTable
            authorizations={filteredAuthorizations}
            onViewServices={handleViewServices}
            onRequestSingle={handleRequestSingle}
            onRequestBulk={handleRequestBulk}
          />

          {filteredAuthorizations.length === 0 && (
            <div className="text-center py-10 px-4 text-gray-500">
              No se encontraron autorizaciones que coincidan con la búsqueda.
            </div>
          )}
        </section>

        <section id="services-history" className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 border-b border-gray-200 pb-4 mb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-[#020432]">
                Historial de Servicios
              </h2>
              {selectedVolante && (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                    Volante: {selectedVolante}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Borrar filtro
                  </button>
                </div>
              )}
            </div>
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#01be6a] focus:border-[#01be6a] sm:text-sm transition duration-150 ease-in-out"
                placeholder="Buscar en historial..."
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
                aria-label="Buscar Historial"
              />
            </div>
          </div>

          <ServiceHistoryCard
            services={filteredServices}
            onModify={handleOpenModifyModal}
            onCancel={handleOpenCancelModal}
            isHighlighted={(id) => id === newlyAddedServiceId}
          />
        </section>
      </main>

      {/* Modals */}
      {selectedService && isModifyModalOpen && (
        <ModifyServiceModal
          isOpen={isModifyModalOpen}
          onClose={handleCloseModifyModal}
          service={selectedService}
          onSave={handleSaveModifiedService}
        />
      )}

      {serviceToCancel && isCancelModalOpen && (
        <CancelServiceModal
          isOpen={isCancelModalOpen}
          onClose={handleCloseCancelModal}
          service={serviceToCancel}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};

export default ListaServiciosView;
