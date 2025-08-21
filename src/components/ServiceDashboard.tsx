import React from 'react';
import { Clock, CheckCircle, AlertTriangle, UserX, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';

// Register Spanish locale
registerLocale('es', es);

interface ServiceStats {
  pendiente: number;
  programado: number;
  cancelacionSolicitada: number;
  noShow: number;
}

interface ServiceDashboardProps {
  title: string;
  currentStats: ServiceStats;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  showDateNavigation?: boolean;
  onStatusFilter?: (status: string) => void;
}

const ServiceDashboard: React.FC<ServiceDashboardProps> = ({
  title,
  currentStats,
  selectedDate,
  onDateChange,
  showDateNavigation = false,
  onStatusFilter
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const statCards = [
    {
      label: 'Pendientes',
      current: currentStats.pendiente,
      icon: Clock,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900',
      status: 'PENDIENTE'
    },
    {
      label: 'Programados',
      current: currentStats.programado,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-900',
      status: 'PROGRAMADO'
    },
    {
      label: 'Cancelación Solicitada',
      current: currentStats.cancelacionSolicitada,
      icon: AlertTriangle,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900',
      status: 'CANCELACION_SOLICITADA'
    },
    {
      label: 'No Show',
      current: currentStats.noShow,
      icon: UserX,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900',
      status: 'NO_SHOW'
    }
  ];

  const total = Object.values(currentStats).reduce((sum, value) => sum + value, 0);

  const handlePreviousDay = () => {
    if (selectedDate && onDateChange) {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(previousDay.getDate() - 1);
      onDateChange(previousDay);
    }
  };

  const handleNextDay = () => {
    if (selectedDate && onDateChange) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      onDateChange(nextDay);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return formatDate(date);
  };

  const handleDatePickerChange = (date: Date | null) => {
    if (date && onDateChange) {
      onDateChange(date);
      setShowDatePicker(false);
    }
  };

  const handleStatCardClick = (status: string) => {
    if (onStatusFilter) {
      onStatusFilter(status);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          
          {showDateNavigation && selectedDate && onDateChange && (
            <div className="flex items-center gap-3 ml-6">
              <button
                onClick={handlePreviousDay}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800"
                title="Día anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 min-w-[200px] text-center">
                    {getDateLabel(selectedDate)}
                  </span>
                </button>
                
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDatePickerChange}
                      inline
                      locale="es"
                      calendarClassName="shadow-lg border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>
              
              <button
                onClick={handleNextDay}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800"
                title="Día siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{total}</span> servicios
          {showDateNavigation && selectedDate && (
            <div className="text-xs text-gray-400 mt-1">
              {selectedDate.toLocaleDateString('es-ES')}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <button
            key={stat.label}
            onClick={() => handleStatCardClick(stat.status)}
            className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <div className="flex items-center justify-center mb-3">
              <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.current}
              </p>
              <p className="text-xs font-medium text-gray-600 truncate">
                {stat.label}
              </p>
            </div>

            {/* Progress bar for visual representation */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stat.label === 'Programados' || stat.label === 'Finalizados' ? 'bg-green-500' :
                    stat.label === 'Pendientes' ? 'bg-yellow-500' :
                    stat.label === 'Cancelación Solicitada' ? 'bg-orange-500' :
                    stat.label === 'Cancelados' || stat.label === 'No Show' ? 'bg-red-500' : 'bg-gray-500'
                  }`}
                  style={{ 
                    width: total > 0 ? `${(stat.current / total) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Click outside to close date picker */}
      {showDatePicker && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default ServiceDashboard;