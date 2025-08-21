import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, ChevronDown, Pencil, LogOut } from 'lucide-react';
import { UserInfo } from '../types';
import UpdateUserInfoModal from './UpdateUserInfoModal';

interface UserDropdownProps {
  userInfo: UserInfo;
  onUpdateUserInfo: (updatedInfo: { email: string; phoneNumber: string; address: string }) => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userInfo, onUpdateUserInfo, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleUpdateData = () => {
    setIsOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const handleSaveUserInfo = (updatedInfo: { email: string; phoneNumber: string; address: string }) => {
    onUpdateUserInfo(updatedInfo);
    setIsUpdateModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 text-white focus:outline-none"
          onClick={toggleDropdown}
        >
          <UserCircle className="h-6 w-6" />
          <span>{userInfo.name}</span>
          <ChevronDown className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={handleUpdateData}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Mi Perfil
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      <UpdateUserInfoModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        currentUser={userInfo}
        onSave={handleSaveUserInfo}
      />
    </>
  );
};

export default UserDropdown;