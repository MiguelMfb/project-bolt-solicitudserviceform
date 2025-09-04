import React from 'react';
import { GroupedAuthorization } from '../types';

interface AuthorizationTableProps {
  authorizations: GroupedAuthorization[];
  onViewServices?: (volante: string) => void;
}

const AuthorizationTable: React.FC<AuthorizationTableProps> = ({ authorizations, onViewServices }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tarifa / Código Único</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Número de Volante</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Vigencia</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Servicios (T-D-U)</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ciudades</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {authorizations.map((auth) => (
            <tr key={auth.id}>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{auth.tarifaUT}</div>
                <div className="text-sm text-gray-500">{auth.tarifaAutorizada}</div>
              </td>
              <td className="px-4 py-3 whitespace-pre-line text-sm text-gray-900">
                {auth.volantes.map((volante) => (
                  <div
                    key={volante}
                    className={onViewServices ? 'cursor-pointer text-blue-600 hover:underline' : ''}
                    onClick={() => onViewServices && onViewServices(volante)}
                  >
                    {volante}
                  </div>
                ))}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {auth.fechaInicial} - {auth.fechaFinal}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {auth.cantidad} - {auth.disponible} - {auth.usadas}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {auth.ciudadA} - {auth.ciudadB}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {auth.estado === 'Volante Cerrado' ? 'No Vigente' : 'Vigente'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorizationTable;
