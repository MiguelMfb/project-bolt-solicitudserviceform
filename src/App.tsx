import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import HomeView from './components/HomeView';
import AlternativeHomeView from './components/AlternativeHomeView';
import CorporateHomeView from './components/CorporateHomeView';
import HomeSelector from './components/HomeSelector';
import LoginView from './components/LoginView';
import ListaServiciosView from './components/ListaServiciosView';
import SolicitudTransporteView from './components/SolicitudTransporteView';
import BulkServiceRequestView from './components/BulkServiceRequestView';
import CoordinatorPanel from './components/CoordinatorPanel';
import ChangelogModal from './components/ChangelogModal';
import { Authorization, Service, ServiceFormData } from './types';
import { 
  mockUserInfo, 
  mockPatientInfo, 
  mockAuthorizations, 
  mockPastServices 
} from './data/mockData';

type AppView = 'home' | 'user-login' | 'coordinator-login' | 'user-list' | 'user-form' | 'user-bulk-form' | 'coordinator';
type HomeType = 'original' | 'alternative' | 'corporate';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentHome, setCurrentHome] = useState<HomeType>('corporate');
  const [selectedAuthorization, setSelectedAuthorization] = useState<Authorization | null>(null);
  // Shared services state between user and coordinator
  const [sharedServices, setSharedServices] = useState<Service[]>(mockPastServices);
  const [newlyAddedServiceId, setNewlyAddedServiceId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState(mockUserInfo);
  const [showChangelog, setShowChangelog] = useState(false);

  // Show changelog on first load - ALWAYS show it now
  useEffect(() => {
    // Always show changelog when app loads
    setShowChangelog(true);
  }, []);

  const handleCloseChangelog = () => {
    setShowChangelog(false);
    localStorage.setItem('hasSeenChangelog_v1.0', 'true');
  };

  const handleNavigateToChange = (changeId: string) => {
    // Navigation logic based on change ID
    switch (changeId) {
      case 'profile-address-readonly':
      case 'programmed-services-no-cancel':
      case 'bulk-confirmation-improved':
        // Navigate to user portal
        setCurrentView('user-list');
        break;
      case 'coordinator-date-filter':
      case 'massive-programming-button':
      case 'driver-conflict-validation':
      case 'cancellation-request-management':
      case 'cancellation-in-programming-tab':
        // Navigate to coordinator portal
        setCurrentView('coordinator');
        break;
      default:
        // Stay on home
        break;
    }
  };

  const handleSelectRole = (role: 'user' | 'coordinator') => {
    if (role === 'user') {
      setCurrentView('user-login');
    } else {
      setCurrentView('coordinator-login');
    }
  };

  const handleLoginSuccess = (role: 'user' | 'coordinator') => {
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

  const handleGoBackToLogin = (role: 'user' | 'coordinator') => {
    if (role === 'user') {
      setCurrentView('user-login');
    } else {
      setCurrentView('coordinator-login');
    }
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

      {/* Changelog Button - Only show on home view when modal is not open */}
      {currentView === 'home' && !showChangelog && (
        <button
          onClick={() => setShowChangelog(true)}
          className="fixed top-6 left-6 z-40 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ver cambios
        </button>
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

      {/* Login Views */}
      {currentView === 'user-login' && (
        <LoginView
          role="user"
          onLogin={() => handleLoginSuccess('user')}
          onGoBack={handleGoHome}
        />
      )}

      {currentView === 'coordinator-login' && (
        <LoginView
          role="coordinator"
          onLogin={() => handleLoginSuccess('coordinator')}
          onGoBack={handleGoHome}
        />
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

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={handleCloseChangelog}
        onNavigateToChange={handleNavigateToChange}
      />
    </div>
  );
}

export default App;