import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Download, Upload, FileText, AlertCircle, CheckCircle, File, ArrowDown, Edit, ArrowUp } from 'lucide-react';

interface FileManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileManagementModal: React.FC<FileManagementModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'upload'>('download');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(() => {
        setUploadStatus('idle');
        setSelectedFile(null);
      }, 2000);
    }, 2000);
  };

  const handleDownload = () => {
    // Simulate download
    alert('Iniciando descarga del archivo plano con los filtros aplicados...');
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                      Gestión de Archivos Planos
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('download')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'download'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Descargar Archivo</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'upload'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span>Cargar Archivo</span>
                      </div>
                    </button>
                  </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                  {activeTab === 'download' ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Descargar Archivo Plano</h4>
                        <p className="text-gray-600">
                          Se generará un archivo con los servicios según los filtros aplicados actualmente
                        </p>
                      </div>

                      {/* Visual Process Flow */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <h5 className="font-bold text-blue-900 mb-4 text-center">Proceso de Descarga</h5>
                        
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                          {/* Step 1 */}
                          <div className="flex flex-col items-center max-w-xs">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                              <Download className="h-8 w-8 text-white" />
                            </div>
                            <h6 className="font-semibold text-blue-900 mb-2">1. Descargar</h6>
                            <p className="text-sm text-blue-800 text-center leading-tight">
                              Se descarga el archivo con los servicios filtrados
                            </p>
                          </div>

                          <ArrowDown className="h-6 w-6 text-blue-400 mx-4 transform rotate-90" />

                          {/* Step 2 */}
                          <div className="flex flex-col items-center max-w-xs">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                              <Edit className="h-8 w-8 text-white" />
                            </div>
                            <h6 className="font-semibold text-orange-900 mb-2">2. Completar</h6>
                            <p className="text-sm text-orange-800 text-center leading-tight">
                              Complete los campos faltantes: <strong>Placa, Concepto, Destino</strong>
                            </p>
                          </div>

                          <ArrowDown className="h-6 w-6 text-blue-400 mx-4 transform rotate-90" />

                          {/* Step 3 */}
                          <div className="flex flex-col items-center max-w-xs">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                              <Upload className="h-8 w-8 text-white" />
                            </div>
                            <h6 className="font-semibold text-green-900 mb-2">3. Cargar</h6>
                            <p className="text-sm text-green-800 text-center leading-tight">
                              Suba el archivo modificado para procesar los cambios
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Download Information */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-2">El archivo descargado incluirá:</p>
                            <ul className="space-y-1 text-xs">
                              <li>• Servicios según los filtros aplicados en la vista actual</li>
                              <li>• Columnas para: Número, Fecha, Origen, Destino, Estado</li>
                              <li>• Campos vacíos para completar: <strong>Placa, Concepto, Destino</strong></li>
                              <li>• Formato Excel (.xlsx) para fácil edición</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Download Button */}
                      <div className="text-center">
                        <button
                          onClick={handleDownload}
                          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <Download className="h-5 w-5 mr-3" />
                          Descargar Archivo Plano
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          El archivo se descargará según los filtros actuales
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Cargar Archivo Modificado</h4>
                        <p className="text-gray-600">
                          Suba el archivo que descargó previamente con los campos completados
                        </p>
                      </div>

                      {/* Visual Upload Process */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <h5 className="font-bold text-green-900 mb-4 text-center">Proceso de Carga</h5>
                        
                        <div className="flex items-center justify-center space-x-8">
                          {/* Step 1 */}
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                              <File className="h-7 w-7 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-green-900">Archivo Completado</p>
                            <p className="text-xs text-green-700 text-center mt-1">Con Placa, Concepto, Destino</p>
                          </div>

                          <ArrowUp className="h-6 w-6 text-green-400" />

                          {/* Step 2 */}
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                              <Upload className="h-7 w-7 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-blue-900">Procesamiento</p>
                            <p className="text-xs text-blue-700 text-center mt-1">Validación automática</p>
                          </div>

                          <ArrowUp className="h-6 w-6 text-green-400" />

                          {/* Step 3 */}
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                              <CheckCircle className="h-7 w-7 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-purple-900">Actualización</p>
                            <p className="text-xs text-purple-700 text-center mt-1">Servicios programados</p>
                          </div>
                        </div>
                      </div>

                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-200">
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-green-600" />
                          </div>
                          
                          <div>
                            <h5 className="text-lg font-medium text-gray-900 mb-2">
                              Subir Archivo Completado
                            </h5>
                            <p className="text-sm text-gray-600 mb-4">
                              Seleccione el archivo Excel (.xlsx) que descargó y completó
                            </p>
                            
                            <input
                              type="file"
                              onChange={handleFileSelect}
                              className="hidden"
                              id="file-upload"
                              accept=".xlsx,.xls"
                            />
                            <label
                              htmlFor="file-upload"
                              className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Seleccionar Archivo
                            </label>
                          </div>
                          
                          <p className="text-xs text-gray-500">
                            Solo archivos Excel (.xlsx) - Máximo 10MB
                          </p>
                        </div>
                      </div>

                      {/* Selected File */}
                      {selectedFile && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {uploadStatus === 'success' && (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-5 w-5 mr-1" />
                                  <span className="text-sm font-medium">Procesado</span>
                                </div>
                              )}
                              
                              <button
                                onClick={handleUpload}
                                disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                              >
                                {uploadStatus === 'uploading' ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Procesando...
                                  </>
                                ) : uploadStatus === 'success' ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Completado
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Procesar Archivo
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Instructions */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-2">Campos requeridos en el archivo:</p>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <p className="font-medium">Placa:</p>
                                <p>Ej: ABC-123</p>
                              </div>
                              <div>
                                <p className="font-medium">Concepto:</p>
                                <p>Ej: TRASLADO RAMPA</p>
                              </div>
                              <div>
                                <p className="font-medium">Destino:</p>
                                <p>Ej: Hospital Central</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    onClick={onClose}
                  >
                    Cerrar
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

export default FileManagementModal;