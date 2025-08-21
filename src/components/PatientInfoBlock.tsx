import React from 'react';
import { PatientInfo } from '../types';
import { Phone, Mail, MapPin } from 'lucide-react';

interface PatientInfoBlockProps {
  patientInfo: PatientInfo;
}

const PatientInfoBlock: React.FC<PatientInfoBlockProps> = ({ patientInfo }) => {
  const displayData = (data: string | undefined | null) =>
    data || <span className="text-gray-400 italic">No disponible</span>;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-start gap-6">
        {/* Information Section */}
        <div className="flex-1 min-w-0">
          {/* Primary Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {displayData(patientInfo.name)}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {displayData(patientInfo.documentNumber)}
            </p>
          </div>

          {/* Secondary Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Phone Information */}
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Teléfono
                </span>
                <span className="block text-sm text-gray-900 mt-0.5">
                  {displayData(patientInfo.phone)}
                </span>
              </div>
            </div>

            {/* Email Information */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Correo Electrónico
                </span>
                <span className="block text-sm text-gray-900 mt-0.5 break-all">
                  {displayData(patientInfo.email)}
                </span>
              </div>
            </div>

            {/* Address Information - Spans full width on md+ screens */}
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Dirección
                </span>
                <span className="block text-sm text-gray-900 mt-0.5">
                  {displayData(patientInfo.address)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoBlock;