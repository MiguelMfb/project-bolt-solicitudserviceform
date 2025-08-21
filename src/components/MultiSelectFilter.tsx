import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search, User } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  documentNumber: string;
  name: string;
}

interface MultiSelectFilterProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  label?: string;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Seleccionar...",
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (optionId: string) => {
    const newSelectedValues = selectedValues.includes(optionId)
      ? selectedValues.filter(id => id !== optionId)
      : [...selectedValues, optionId];
    
    onChange(newSelectedValues);
  };

  const handleRemoveOption = (optionId: string) => {
    onChange(selectedValues.filter(id => id !== optionId));
  };

  const handleSelectAll = () => {
    if (selectedValues.length === filteredOptions.length) {
      onChange([]);
    } else {
      onChange(filteredOptions.map(option => option.id));
    }
  };

  const getSelectedOptions = () => {
    return options.filter(option => selectedValues.includes(option.id));
  };

  const selectedOptions = getSelectedOptions();

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div
        className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer focus-within:ring-2 focus-within:ring-[#01be6a] focus-within:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex flex-wrap gap-1">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-500 text-sm">{placeholder}</span>
            ) : (
              selectedOptions.map(option => (
                <span
                  key={option.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  <User className="h-3 w-3" />
                  {option.documentNumber} - {option.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveOption(option.id);
                    }}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Buscar por documento o nombre..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Select All Option */}
          <div className="p-2 border-b border-gray-100">
            <button
              type="button"
              onClick={handleSelectAll}
              className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              {selectedValues.length === filteredOptions.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              {filteredOptions.length > 0 && (
                <span className="text-gray-500 ml-1">
                  ({filteredOptions.length} {filteredOptions.length === 1 ? 'opción' : 'opciones'})
                </span>
              )}
            </button>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No se encontraron resultados
              </div>
            ) : (
              filteredOptions.map(option => (
                <label
                  key={option.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.id)}
                    onChange={() => handleToggleOption(option.id)}
                    className="h-4 w-4 text-[#01be6a] focus:ring-[#01be6a] border-gray-300 rounded mr-3"
                  />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {option.documentNumber}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {option.name}
                      </div>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>

          {/* Footer with count */}
          {selectedOptions.length > 0 && (
            <div className="p-2 border-t border-gray-100 bg-gray-50">
              <div className="text-xs text-gray-600 text-center">
                {selectedOptions.length} de {options.length} seleccionado{selectedOptions.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;