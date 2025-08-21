import React, { useState } from 'react';
import { Home, Palette, Building2, ChevronDown, ChevronUp } from 'lucide-react';

interface HomeSelectorProps {
  currentHome: 'original' | 'alternative' | 'corporate';
  onHomeChange: (home: 'original' | 'alternative' | 'corporate') => void;
}

const HomeSelector: React.FC<HomeSelectorProps> = ({ currentHome, onHomeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const homeOptions = [
    {
      id: 'corporate' as const,
      name: 'Home Corporativo',
      description: 'Diseño corporativo profesional',
      icon: Building2,
      preview: 'bg-gradient-to-br from-blue-600 to-green-600'
    },
    {
      id: 'original' as const,
      name: 'Home Original',
      description: 'Diseño con imagen de fondo',
      icon: Home,
      preview: 'bg-gradient-to-br from-blue-900 to-purple-900'
    },
    {
      id: 'alternative' as const,
      name: 'Home Minimalista',
      description: 'Diseño minimalista oscuro',
      icon: Palette,
      preview: 'bg-gradient-to-br from-slate-900 to-slate-800'
    }
  ];

  const currentOption = homeOptions.find(option => option.id === currentHome);

  // Show menu on hover over the transparent area
  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setIsOpen(false);
  };

  return (
    <div 
      className="fixed top-6 right-6 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Transparent trigger area - always present but invisible */}
      <div className="w-16 h-16 absolute top-0 right-0 bg-transparent cursor-pointer" />
      
      <div className={`relative transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 text-gray-800 group"
        >
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${currentOption?.preview}`}></div>
            <span className="text-sm font-medium hidden sm:block">{currentOption?.name}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 transition-transform" />
          ) : (
            <ChevronDown className="h-4 w-4 transition-transform" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-600 px-3 py-2 uppercase tracking-wide">
                Seleccionar Diseño
              </div>
              {homeOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = option.id === currentHome;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      onHomeChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-lg ${option.preview} flex items-center justify-center`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{option.name}</div>
                        <div className="text-xs opacity-70 truncate">{option.description}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeSelector;