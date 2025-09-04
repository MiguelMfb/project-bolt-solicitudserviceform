import React, { useState, useRef, useEffect } from 'react';
import { Authorization, GroupedAuthorization } from '../types';
import { Eye, FileText, Calendar, BarChart3, CheckCircle, XCircle, Clock, AlertTriangle, MapPin, Plus, ChevronDown, PlusCircle } from 'lucide-react';

interface AuthorizationTableProps {
  authorizations: GroupedAuthorization[];
  onShowForm: (authorization: Authorization) => void;
  onShowBulkForm: (authorization: Authorization) => void;
  onViewServices: (volante: string) => void;
}

const AuthorizationTable: React.FC<AuthorizationTableProps> = ({
  authorizations,
  onShowForm,
  onShowBulkForm,
  onViewServices
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const dropdownElement = dropdownRefs.current[activeDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'Disponibles':
        return {
          style: 'bg-green-100 text-green-800 border border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'No Disponibles':
        return {
          style: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600'
        };
      case 'Volante Cerrado':
        return {
          style: 'bg-red-100 text-red-800 border border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600'
        };
      default:
        return {
          style: 'bg-gray-100 text-gray-800 border border-gray-200',
          icon: Clock,
          iconColor: 'text-gray-600'
        };
    }
  };

  const isActionable = (auth: Authorization) => 
    auth.estado === 'Disponibles' && auth.disponible > 0;

  const handleSingleService = (auth: Authorization, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(null);
    onShowForm(auth);
  };

  const handleMultipleServices = (auth: Authorization, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(null);
    onShowBulkForm(auth);
  };

  const toggleDropdown = (authId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === authId ? null : authId);
  };

  // Desktop Table View
  const DesktopTable = () => (
    <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Tarifa / Volantes
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Periodo / Vigencia
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Servicios
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Ciudades
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {authorizations.map((auth) => {
            const statusConfig = getStatusConfig(auth.estado);
            const StatusIcon = statusConfig.icon;
            const actionable = isActionable(auth);

            return (
              <tr key={auth.id} className={`hover:bg-gray-50 transition-all duration-200 ${
                actionable ? 'bg-green-50/30 hover:bg-green-50/50' : ''
              }`}>
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        actionable ? 'bg-green-100 border-2 border-green-200' : 'bg-gray-100 border-2 border-gray-200'
                      }`}>
                        <FileText className={`h-6 w-6 ${
                          actionable ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">
                        {auth.tarifaUT}
                      </div>
                      <div className="text-sm text-gray-600 font-medium whitespace-pre-line">
                        {auth.volantes.join('\n')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-gray-900 font-semibold">
                    {auth.periodo}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {auth.fechaInicial} - {auth.fechaFinal}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-center mb-1">
                        <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-sm font-bold text-blue-900">{auth.cantidad}</span>
                      </div>
                      <span className="text-xs text-blue-700 font-medium">Total</span>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-center mb-1">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm font-bold text-red-900">{auth.usadas}</span>
                      </div>
                      <span className="text-xs text-red-700 font-medium">Usados</span>
                    </div>
                    <div className={`text-center p-2 rounded-lg border-2 ${
                      actionable 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-center mb-1">
                        <CheckCircle className={`h-4 w-4 mr-1 ${actionable ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`text-sm font-bold ${
                          actionable ? 'text-green-900' : 'text-gray-900'
                        }`}>{auth.disponible}</span>
                      </div>
                      <span className={`text-xs font-medium ${
                        actionable ? 'text-green-700' : 'text-gray-700'
                      }`}>Disponibles</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">{auth.ciudadA}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 text-red-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">{auth.ciudadB}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-bold shadow-sm ${statusConfig.style}`}>
                    <StatusIcon className={`w-4 h-4 mr-2 ${statusConfig.iconColor}`} />
                    {auth.estado}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => onViewServices(auth.volantes[0])}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm hover:shadow-md"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Servicios
                    </button>
                    
                    {auth.estado === 'Disponibles' && (
                      <div className="relative" ref={el => dropdownRefs.current[auth.id] = el}>
                        <button
                          onClick={(e) => actionable && toggleDropdown(auth.id, e)}
                          disabled={!actionable}
                          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md ${
                            actionable 
                              ? 'bg-gradient-to-r from-[#01be6a] to-[#00a85d] text-white hover:from-[#01a85d] hover:to-[#009951] focus:ring-[#01be6a] transform hover:scale-105' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {actionable ? (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Solicitar Servicio
                              <ChevronDown className="h-4 w-4 ml-2" />
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Sin Servicios
                            </>
                          )}
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === auth.id && actionable && (
                          <div 
                            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden min-w-max"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => handleSingleService(auth, e)}
                              className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors duration-150"
                            >
                              <Plus className="h-4 w-4 mr-3 text-green-600" />
                              <div className="text-left">
                                <p className="font-medium">Solicitar un servicio</p>
                                <p className="text-xs text-gray-500">Programar un solo traslado</p>
                              </div>
                            </button>
                            
                            <div className="border-t border-gray-100"></div>
                            
                            <button
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => handleMultipleServices(auth, e)}
                              className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150"
                            >
                              <PlusCircle className="h-4 w-4 mr-3 text-blue-600" />
                              <div className="text-left">
                                <p className="font-medium">Solicitar varios servicios</p>
                                <p className="text-xs text-gray-500">Programar múltiples traslados</p>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Tablet Table View
  const TabletTable = () => (
    <div className="hidden md:block lg:hidden">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Autorización
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Servicios
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {authorizations.map((auth) => {
              const statusConfig = getStatusConfig(auth.estado);
              const StatusIcon = statusConfig.icon;
              const actionable = isActionable(auth);

              return (
                <tr key={auth.id} className={`hover:bg-gray-50 transition-colors ${
                  actionable ? 'bg-green-50/30' : ''
                }`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          actionable ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <FileText className={`h-5 w-5 ${
                            actionable ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {auth.tarifaUT}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-pre-line">
                          {auth.volantes.join('\n')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {auth.periodo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-1 bg-blue-50 rounded border border-blue-200">
                        <div className="text-xs font-bold text-blue-900">{auth.cantidad}</div>
                        <div className="text-xs text-blue-700">Total</div>
                      </div>
                      <div className="text-center p-1 bg-red-50 rounded border border-red-200">
                        <div className="text-xs font-bold text-red-900">{auth.usadas}</div>
                        <div className="text-xs text-red-700">Usados</div>
                      </div>
                      <div className={`text-center p-1 rounded border ${
                        actionable 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className={`text-xs font-bold ${
                          actionable ? 'text-green-900' : 'text-gray-900'
                        }`}>{auth.disponible}</div>
                        <div className={`text-xs ${
                          actionable ? 'text-green-700' : 'text-gray-700'
                        }`}>Disp.</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.style}`}>
                      <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
                      {auth.estado}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => onViewServices(auth.volantes[0])}
                        className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Servicios
                      </button>
                      
                      {auth.estado === 'Disponibles' && (
                        <div className="relative" ref={el => dropdownRefs.current[auth.id] = el}>
                          <button
                            onClick={(e) => actionable && toggleDropdown(auth.id, e)}
                            disabled={!actionable}
                            className={`w-full inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg transition-colors shadow-sm ${
                              actionable 
                                ? 'bg-[#01be6a] text-white hover:bg-[#01a85d]' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {actionable ? 'Solicitar' : 'Sin servicios'}
                            {actionable && <ChevronDown className="h-3 w-3 ml-1" />}
                          </button>

                          {/* Dropdown Menu */}
                          {activeDropdown === auth.id && actionable && (
                            <div 
                              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => handleSingleService(auth, e)}
                                className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors duration-150"
                              >
                                <Plus className="h-3 w-3 mr-2 text-green-600" />
                                <div className="text-left">
                                  <p className="font-medium">Un servicio</p>
                                  <p className="text-xs text-gray-500">Solo traslado</p>
                                </div>
                              </button>
                              
                              <div className="border-t border-gray-100"></div>
                              
                              <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => handleMultipleServices(auth, e)}
                                className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150"
                              >
                                <PlusCircle className="h-3 w-3 mr-2 text-blue-600" />
                                <div className="text-left">
                                  <p className="font-medium">Varios servicios</p>
                                  <p className="text-xs text-gray-500">Múltiples traslados</p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Mobile Table View - Enhanced for better readability
  const MobileTable = () => (
    <div className="md:hidden">
      <div className="space-y-4">
        {authorizations.map((auth) => {
          const statusConfig = getStatusConfig(auth.estado);
          const StatusIcon = statusConfig.icon;
          const actionable = isActionable(auth);

          return (
            <div
              key={auth.id}
              className={`bg-white rounded-xl shadow-md border-2 transition-all duration-200 overflow-hidden ${
                actionable 
                  ? 'border-green-200 hover:border-green-300 hover:shadow-lg' 
                  : auth.estado === 'Disponibles' 
                    ? 'border-yellow-200 hover:border-yellow-300' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className={`px-4 py-3 border-b border-gray-100 ${
                actionable ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 
                auth.estado === 'Disponibles' ? 'bg-gradient-to-r from-yellow-50 to-orange-50' :
                'bg-gradient-to-r from-gray-50 to-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      actionable ? 'bg-green-100' : 
                      auth.estado === 'Disponibles' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <FileText className={`h-5 w-5 ${
                        actionable ? 'text-green-600' : 
                        auth.estado === 'Disponibles' ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {auth.tarifaUT}
                      </h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {`Volante:${auth.volantes.length > 1 ? '\n' : ' '}${auth.volantes.join('\n')}`}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${statusConfig.style}`}>
                    <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
                    {auth.estado}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Services Grid - Enhanced for mobile */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Servicios</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-center mb-1">
                        <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-lg font-bold text-blue-900">{auth.cantidad}</span>
                      </div>
                      <span className="text-xs text-blue-700 font-medium">Total</span>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-center mb-1">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-lg font-bold text-red-900">{auth.usadas}</span>
                      </div>
                      <span className="text-xs text-red-700 font-medium">Usados</span>
                    </div>
                    <div className={`text-center p-3 rounded-lg border-2 ${
                      actionable 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-center mb-1">
                        <CheckCircle className={`h-4 w-4 mr-1 ${actionable ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`text-lg font-bold ${
                          actionable ? 'text-green-900' : 'text-gray-900'
                        }`}>{auth.disponible}</span>
                      </div>
                      <span className={`text-xs font-medium ${
                        actionable ? 'text-green-700' : 'text-gray-700'
                      }`}>Disponibles</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Periodo</span>
                    <p className="text-sm font-medium text-gray-900">{auth.periodo}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vigencia</span>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-900">{auth.fechaInicial} - {auth.fechaFinal}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ciudades Autorizadas</span>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 text-green-500 mr-2" />
                        <span className="text-sm text-gray-900">{auth.ciudadA}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 text-red-500 mr-2" />
                        <span className="text-sm text-gray-900">{auth.ciudadB}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => onViewServices(auth.volantes[0])}
                    className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Servicios
                  </button>
                  
                  {auth.estado === 'Disponibles' && (
                    <div className="relative" ref={el => dropdownRefs.current[auth.id] = el}>
                      <button
                        onClick={(e) => actionable && toggleDropdown(auth.id, e)}
                        disabled={!actionable}
                        className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm ${
                          actionable 
                            ? 'bg-gradient-to-r from-[#01be6a] to-[#00a85d] text-white hover:from-[#01a85d] hover:to-[#009951] hover:shadow-md transform hover:scale-105' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {actionable ? (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Solicitar Servicio
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Sin Servicios Disponibles
                          </>
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === auth.id && actionable && (
                        <div 
                          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => handleSingleService(auth, e)}
                            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors duration-150"
                          >
                            <Plus className="h-4 w-4 mr-3 text-green-600" />
                            <div className="text-left">
                              <p className="font-medium">Solicitar un servicio</p>
                              <p className="text-xs text-gray-500">Programar un solo traslado</p>
                            </div>
                          </button>
                          
                          <div className="border-t border-gray-100"></div>
                          
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => handleMultipleServices(auth, e)}
                            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150"
                          >
                            <PlusCircle className="h-4 w-4 mr-3 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium">Solicitar varios servicios</p>
                              <p className="text-xs text-gray-500">Programar múltiples traslados</p>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <DesktopTable />
      <TabletTable />
      <MobileTable />
    </>
  );
};

export default AuthorizationTable;