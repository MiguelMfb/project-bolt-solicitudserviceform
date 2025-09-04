import React from 'react';
import { GroupedAuthorization } from '../types';

interface AuthorizationTableProps {
  authorizations: GroupedAuthorization[];
  onViewServices?: (volante: string) => void;
}

const AuthorizationTable: React.FC<AuthorizationTableProps> = ({ authorizations, onViewServices }) => {
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

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tarifa / Código Único</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Número de Volante</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Vigencia</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Servicios (T-D-U)</th>
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
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {auth.cantidad} T
                    </span>
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      {auth.disponible} D
                    </span>
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                      {auth.usadas} U
                    </span>
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
                    <button
                      onClick={() => onViewServices(auth.volantes[0])}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Ver Servicios
                    </button>
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
