import React, { useState, useRef, useEffect } from 'react';
import { UserInfo } from '../types';
import { Home } from 'lucide-react';

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  userInfo: UserInfo;
  placeholder?: string;
  disabled?: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  userInfo,
  placeholder,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestion(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (disabled) return;
    setIsFocused(true);
    if (userInfo.address && userInfo.address !== value) {
      setShowSuggestion(true);
    }
  };

  const handleBlur = () => {
    // Don't immediately hide suggestions to allow click events to register
  };

  const handleSelectAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(userInfo.address);
    setShowSuggestion(false);
    setIsFocused(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestion(userInfo.address && userInfo.address.toLowerCase().includes(newValue.toLowerCase()));
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01be6a] focus:border-transparent pr-10 ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
          }`}
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Home className={`h-4 w-4 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
        </div>
      </div>

      {showSuggestion && isFocused && userInfo.address && !disabled && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 transition-all duration-200 ease-in-out"
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        >
          <button
            type="button"
            onClick={handleSelectAddress}
            className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 cursor-pointer group"
          >
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
              <div>
                <span className="block text-blue-600 font-medium mb-0.5">Mi dirección</span>
                <span className="block text-gray-600 text-sm">{userInfo.address}</span>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;