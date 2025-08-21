import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ApprovalStats {
  autorizado: number;
  noAutorizado: number;
}

interface ApprovalDashboardProps {
  title: string;
  currentStats: ApprovalStats;
  previousStats: ApprovalStats;
  showComparison?: boolean;
  dateRange?: string;
}

const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({
  title,
  currentStats,
  dateRange
}) => {
  const statCards = [
    {
      label: 'Autorizados',
      current: currentStats.autorizado,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    {
      label: 'No Autorizados',
      current: currentStats.noAutorizado,
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-900'
    }
  ];

  const total = Object.values(currentStats).reduce((sum, value) => sum + value, 0);
  const getApprovalRate = () => {
    if (total === 0) return 0;
    return Math.round((currentStats.autorizado / total) * 100);
  };

  const approvalRate = getApprovalRate();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {dateRange && (
            <p className="text-sm text-gray-600 mt-1">{dateRange}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            Total: <span className="font-semibold text-gray-900">{total}</span> servicios
          </div>
          <div className="text-sm text-gray-500">
            Tasa de aprobación: <span className={`font-semibold ${approvalRate >= 80 ? 'text-green-600' : approvalRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {approvalRate}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat) => (
          <button
            key={stat.label}
            className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full text-left`}
            title={`Filtrar por ${stat.label.toLowerCase()}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.current}
              </p>
              <p className="text-sm font-medium text-gray-700">
                {stat.label}
              </p>
            </div>

            {/* Progress bar for visual representation */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stat.label === 'Autorizados' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: total > 0 ? `${(stat.current / total) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
            </div>

            {/* Click hint */}
            <div className="mt-3 text-xs text-gray-500 opacity-75">
              Haga clic para filtrar
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApprovalDashboard;