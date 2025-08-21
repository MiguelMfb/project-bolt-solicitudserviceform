import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { UserInfo } from '../types';

interface UpdateUserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserInfo;
  onSave: (updatedInfo: { email: string; phoneNumber: string; address: string }) => void;
}

const UpdateUserInfoModal: React.FC<UpdateUserInfoModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    email: currentUser.email,
    phoneNumber: currentUser.phoneNumber,
    address: currentUser.address,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;

    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return false;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('El número de teléfono debe tener el formato (XXX) XXX-XXXX');
      return false;
    }

    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setError('Debe ingresar su contraseña actual para cambiar la contraseña');
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('Las contraseñas nuevas no coinciden');
        return false;
      }

      if (formData.newPassword.length < 8) {
        setError('La contraseña nueva debe tener al menos 8 caracteres');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const updateData = {
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address, // Keep the same address, don't allow editing
    };

    onSave(updateData);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Actualizar Información
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Información No Editable */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Nombre</label>
                        <p className="text-sm text-gray-900">{currentUser.name}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Número de Documento</label>
                        <p className="text-sm text-gray-900">{currentUser.documentNumber}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Usuario</label>
                        <p className="text-sm text-gray-900">{currentUser.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Campos Editables */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01be6a] focus:border-[#01be6a]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01be6a] focus:border-[#01be6a]"
                        placeholder="(XXX) XXX-XXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mi Dirección
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        readOnly
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        title="La dirección no puede ser modificada"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        La dirección no puede ser modificada desde este formulario
                      </p>
                    </div>
                  </div>

                  {/* Sección de Contraseña */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Cambiar Contraseña</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01be6a] focus:border-[#01be6a]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nueva Contraseña
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01be6a] focus:border-[#01be6a] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirmar Nueva Contraseña
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01be6a] focus:border-[#01be6a] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 mt-2">{error}</p>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-[#01be6a] px-4 py-2 text-sm font-medium text-white hover:bg-[#01a85d] focus:outline-none"
                    onClick={handleSubmit}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateUserInfoModal;