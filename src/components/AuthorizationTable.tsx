import React from 'react';
import { GroupedAuthorization } from '../types';

interface AuthorizationTableProps {
  authorizations: GroupedAuthorization[];
  onViewServices?: (volante: string) => void;
  onRequestSingle?: (authorization: GroupedAuthorization) => void;
  onRequestBulk?: (authorization: GroupedAuthorization) => void;
}

const AuthorizationTable: React.FC<AuthorizationTableProps> = ({ authorizations, onViewServices, onRequestSingle, onRequestBulk }) => {
  const getRowColor = (estado: GroupedAuthorization['estado']) => {
    switch (estado) {
      case 'Disponibles':
        return 'bg-green-50';
      case 'No Disponibles':
        return 'bg-yellow-50';
      default:
        return 'bg-red-50';
    }
  };

  const getStatusClasses = (estado: GroupedAuthorization['estado']) => {
    switch (estado) {
      case 'Disponibles':
        return 'bg-green-100 text-green-800';
      case 'No Disponibles':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const [openActionId, setOpenActionId] = React.useState<string | null>(null);

  return (
    <div className="relative overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-[1100px] md:min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tarifa asignada / Código Único</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Número de Volante</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Vigencia</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Servicios</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ciudades</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Estado</th>
            {onViewServices && (
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {authorizations.map((auth) => {
            const rowColor = getRowColor(auth.estado);
            const statusClasses = getStatusClasses(auth.estado);
            const statusText = auth.estado === 'Volante Cerrado' ? 'No Vigente' : auth.estado;

            return (
              <tr key={auth.id} className={`${rowColor} hover:bg-gray-100`}>
                <td className="px-4 py-3 align-top whitespace-pre-line break-words">
                  <div className="text-sm font-medium text-gray-900">{auth.tarifaUT}</div>
                  <div className="text-sm text-gray-500">{auth.tarifaAutorizada}</div>
                </td>
                <td className="px-4 py-3 align-top text-sm text-gray-900 whitespace-pre-line break-words">
                  {auth.volantes.join('\n')}
                </td>
                <td className="px-4 py-3 align-top text-sm text-gray-900 whitespace-pre-line break-words">
                  {auth.fechaInicial} - {auth.fechaFinal}
                </td>
                <td className="px-4 py-3 align-top text-sm text-gray-900">
                  <div className="flex flex-wrap gap-3">
                    {/* Total */}
                    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/40 px-3 py-2 shadow-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                          <path d="M4 19h16M6 17V7m6 10V5m6 12V9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-base leading-none font-semibold text-blue-900">{auth.cantidad}</div>
                        <div className="text-[11px] leading-tight text-blue-700">Total</div>
                      </div>
                    </div>

                    {/* Usados */}
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/40 px-3 py-2 shadow-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-base leading-none font-semibold text-red-900">{auth.usadas}</div>
                        <div className="text-[11px] leading-tight text-red-700">Usados</div>
                      </div>
                    </div>

                    {/* Disponibles */}
                    <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50/40 px-3 py-2 shadow-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M8.5 12.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-base leading-none font-semibold text-green-900">{auth.disponible}</div>
                        <div className="text-[11px] leading-tight text-green-700">Disponibles</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-sm text-gray-900 whitespace-pre-line break-words">
                  {auth.ciudadA} - {auth.ciudadB}
                </td>
                <td className="px-4 py-3 align-top text-sm text-gray-900">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
                    {statusText}
                  </span>
                </td>
                {onViewServices && (
                  <td className="px-4 py-3 align-top text-sm">
                    <div className="flex items-center gap-3 relative">
                      <button
                        onClick={() => onViewServices(auth.volantes[0])}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 hover:bg-gray-100 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Ver Servicios
                      </button>

                      {auth.estado === 'Disponibles' && (
                        <div className="relative">
                          <button
                            onClick={() => setOpenActionId(openActionId === auth.id ? null : auth.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-green-600 bg-green-600 px-3 py-2 text-white hover:bg-green-700 shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                            </svg>
                            Solicitar
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 opacity-90">
                              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {openActionId === auth.id && (
                            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-lg z-20">
                              <button
                                onClick={() => { onRequestSingle && onRequestSingle(auth); setOpenActionId(null); }}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3"
                              >
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                                  </svg>
                                </span>
                                <span>
                                  <span className="block text-sm font-medium text-gray-900">Solicitar un servicio</span>
                                  <span className="block text-xs text-gray-500">Programar un solo traslado</span>
                                </span>
                              </button>
                              <div className="border-t border-gray-200" />
                              <button
                                onClick={() => { onRequestBulk && onRequestBulk(auth); setOpenActionId(null); }}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3"
                              >
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                                  </svg>
                                </span>
                                <span>
                                  <span className="block text-sm font-medium text-gray-900">Solicitar varios servicios</span>
                                  <span className="block text-xs text-gray-500">Programar múltiples traslados</span>
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorizationTable;
