import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import HomeView from './components/HomeView';
import AlternativeHomeView from './components/AlternativeHomeView';
import CorporateHomeView from './components/CorporateHomeView';
import HomeSelector from './components/HomeSelector';
import ListaServiciosView from './components/ListaServiciosView';
import SolicitudTransporteView from './components/SolicitudTransporteView';
import BulkServiceRequestView from './components/BulkServiceRequestView';
import CoordinatorPanel from './components/CoordinatorPanel';
import { Authorization, Service, ServiceFormData } from './types';
import { 
  mockUserInfo, 
  mockPatientInfo, 
  mockAuthorizations, 
  mockPastServices 
} from './data/mockData';

type AppView = 'home' | 'user-list' | 'user-form' | 'user-bulk-form' | 'coordinator';
type HomeType = 'original' | 'alternative' | 'corporate';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentHome, setCurrentHome] = useState<HomeType>('corporate');
  const [selectedAuthorization, setSelectedAuthorization] = useState<Authorization | null>(null);
  // Shared services state between user and coordinator
  const [sharedServices, setSharedServices] = useState<Service[]>(mockPastServices);
  const [newlyAddedServiceId, setNewlyAddedServiceId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState(mockUserInfo);

  const handleSelectRole = (role: 'user' | 'coordinator') => {
    if (role === 'user') {
      setCurrentView('user-list');
    } else {
      setCurrentView('coordinator');
    }
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedAuthorization(null);
  };

  const handleShowForm = (authorization: Authorization) => {
    setSelectedAuthorization(authorization);
    setCurrentView('user-form');
  };

  const handleShowBulkForm = (authorization: Authorization) => {
    setSelectedAuthorization(authorization);
    setCurrentView('user-bulk-form');
  };

  const handleGoBackToList = () => {
    setSelectedAuthorization(null);
    setCurrentView('user-list');
  };

  const handleScheduleServices = (services: ServiceFormData[]) => {
    const newServices = services.map(serviceData => ({
      id: uuidv4(),
      numero: `SRV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      volante: selectedAuthorization?.volante || '',
      fechaVolante: selectedAuthorization?.fechaVolante || '',
      fechaContratada: serviceData.fechaHora ? 
        new Date(serviceData.fechaHora).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : '',
      fechaHoraInicial: serviceData.fechaHora ? 
        new Date(serviceData.fechaHora).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : '',
      origen: serviceData.origen,
      destino: serviceData.destino,
      tarifaUT: selectedAuthorization?.tarifaUT || '',
      estado: 'PENDIENTE' as const,
      conductor: null,
      placa: null,
      fechaSolicitud: new Date().toISOString(),
      fechaCancelacionSolicitada: null,
      estadoAutorizacion: true, // Default to authorized for new services
      firmaSize: Math.random() * 3 + 0.5, // Random size between 0.5 and 3.5 KB
      hasValidSignature: Math.random() > 0.3, // 70% chance of valid signature
      ciudadOrigen: serviceData.ciudadOrigen,
      ciudadDestino: serviceData.ciudadDestino,
      complementoOrigen: serviceData.barrioOrigen,
      complementoDestino: serviceData.barrioDestino,
      observaciones: serviceData.observaciones
    }));

    setSharedServices(prev => [...newServices, ...prev]);
    setNewlyAddedServiceId(newServices[0].id);
    handleGoBackToList();
  };

  const handleUpdateService = (updatedService: Service) => {
    setSharedServices(prev => 
      prev.map(service => 
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  const handleCancelService = (serviceId: string) => {
    setSharedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { 
              ...service, 
              estado: 'CANCELACION_SOLICITADA' as const,
              fechaCancelacionSolicitada: new Date().toISOString()
            }
          : service
      )
    );
  };

  // New function to handle coordinator actions on cancellation requests
  const handleCancellationAction = (serviceId: string, action: 'approve' | 'reject') => {
    setSharedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { 
              ...service, 
              estado: action === 'approve' ? 'CANCELADO' as const : 'NO_SHOW' as const,
              fechaCancelacionProcesada: new Date().toISOString()
            }
          : service
      )
    );
  };

  const handleUpdateUserInfo = (updatedInfo: { email: string; phoneNumber: string; address: string }) => {
    setUserInfo(prev => ({
      ...prev,
      ...updatedInfo
    }));
  };

  const handleLogout = () => {
    alert('Sesión cerrada exitosamente');
    setCurrentView('home');
  };

  useEffect(() => {
    if (newlyAddedServiceId) {
      const timer = setTimeout(() => {
        setNewlyAddedServiceId(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [newlyAddedServiceId]);

  return (
    <div>
      {/* Home Selector - Only show on home view */}
      {currentView === 'home' && (
        <HomeSelector 
          currentHome={currentHome} 
          onHomeChange={setCurrentHome} 
        />
      )}

      {/* Home Views */}
      {currentView === 'home' && currentHome === 'original' && (
        <HomeView onSelectRole={handleSelectRole} />
      )}

      {currentView === 'home' && currentHome === 'alternative' && (
        <AlternativeHomeView onSelectRole={handleSelectRole} />
      )}

      {currentView === 'home' && currentHome === 'corporate' && (
        <CorporateHomeView onSelectRole={handleSelectRole} />
      )}

      {/* User Views */}
      {currentView === 'user-list' && (
        <ListaServiciosView
          userInfo={userInfo}
          patientInfo={mockPatientInfo}
          authorizations={mockAuthorizations}
          pastServices={sharedServices}
          newlyAddedServiceId={newlyAddedServiceId}
          onShowForm={handleShowForm}
          onShowBulkForm={handleShowBulkForm}
          onUpdateService={handleUpdateService}
          onCancelService={handleCancelService}
          onUpdateUserInfo={handleUpdateUserInfo}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'user-form' && selectedAuthorization && (
        <SolicitudTransporteView
          userInfo={userInfo}
          patientInfo={mockPatientInfo}
          authorization={selectedAuthorization}
          onGoBack={handleGoBackToList}
          onScheduleServices={handleScheduleServices}
          onUpdateUserInfo={handleUpdateUserInfo}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'user-bulk-form' && selectedAuthorization && (
        <BulkServiceRequestView
          userInfo={userInfo}
          patientInfo={mockPatientInfo}
          authorization={selectedAuthorization}
          onGoBack={handleGoBackToList}
          onScheduleServices={handleScheduleServices}
          onUpdateUserInfo={handleUpdateUserInfo}
          onLogout={handleLogout}
        />
      )}
      
      {/* Coordinator View wrapped with side navigation */}
      {currentView === 'coordinator' && (
        <CoordinatorPanel
          services={sharedServices}
          onGoBack={handleGoHome}
          onUpdateService={handleUpdateService}
          onCancellationAction={handleCancellationAction}
        />
      )}

    </div>
  );
}

export default App;
