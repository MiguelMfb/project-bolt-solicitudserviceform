import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Calendar, ChevronDown, Download, Eye, FileText, Edit } from 'lucide-react';
import SignaturePad from './SignaturePad';

interface AuthorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: {
    numero: string;
    tipoSolicitud: string;
    fechaSolicitud: string;
    fechaContratada: string;
    fechaHoraContratada: string;
    fechaHoraInicio: string;
    fechaHoraFinalizacion: string;
    dependencia: string;
    nombrePasajero: string;
    identificacion: string;
    origen: string;
    destino: string;
    observacion: string;
    volante: string;
    tarifaUT: string;
    codTarifa: string;
    placa: string;
    estado: string;
    soporte: string;
    firma: string;
    gestion: string;
    tiempoRecorrido: string;
    conductor?: string;
    kmRecorridos?: string;
    valorRecargoACobrar?: string;
    valorRecargoAPagar?: string;
    fechaInicial?: string;
    fechaFinal?: string;
    concepto?: string;
    pdfUrl?: string;
  };
  onAuthorize: (authorized: boolean, observacion?: string, signature?: string) => void;
}

const AuthorizationModal: React.FC<AuthorizationModalProps> = ({
  isOpen,
  onClose,
  serviceData,
  onAuthorize,
}) => {
  const [observacion, setObservacion] = useState('');
  const [concepto, setConcepto] = useState(serviceData.concepto || 'TRASLADO RAMPA');
  const [destino, setDestino] = useState('INTERNO');
  const [showParadas, setShowParadas] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [hasSignature, setHasSignature] = useState(false);

  const handleAuthorize = () => {
    if (!hasSignature) {
      alert('Por favor agregue su firma digital antes de autorizar el servicio');
      return;
    }
    onAuthorize(true, observacion, signature);
    onClose();
  };

  const handleReject = () => {
    onAuthorize(false, observacion);
    onClose();
  };

  const handleDownloadPDF = () => {
    if (serviceData.pdfUrl) {
      // In a real application, this would trigger a download
      const link = document.createElement('a');
      link.href = serviceData.pdfUrl;
      link.download = `servicio-${serviceData.numero}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('PDF no disponible para este servicio');
    }
  };

  const handleViewPDF = () => {
    if (serviceData.pdfUrl) {
      // In a real application, this would open the PDF in a new tab or modal
      window.open(serviceData.pdfUrl, '_blank');
    } else {
      alert('PDF no disponible para este servicio');
    }
  };

  const handleSaveSignature = (signatureData: string) => {
    setSignature(signatureData);
    setHasSignature(true);
    setShowSignaturePad(false);
  };

  const handleClearSignature = () => {
    setSignature('');
    setHasSignature(false);
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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Autorizar servicio N° {serviceData.numero}
                  </Dialog.Title>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                      onClick={onClose}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* PDF Actions */}
                <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Documentos del Servicio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleViewPDF}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        Ver PDF
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        Descargar PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Form Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Número */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número
                        </label>
                        <input
                          type="text"
                          value={serviceData.numero}
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Fecha/Hora Contratada */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha/Hora Contratada
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={serviceData.fechaHoraContratada}
                            readOnly
                            className="w-full px-3 py-2 pr-8 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                          />
                          <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-blue-600" />
                        </div>
                      </div>

                      {/* Fecha/Hora de Inicio */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha/Hora de Inicio
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={serviceData.fechaHoraInicio}
                            readOnly
                            className="w-full px-3 py-2 pr-8 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                          />
                          <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-green-600" />
                        </div>
                      </div>

                      {/* Fecha/Hora de Finalización */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha/Hora de Finalización
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={serviceData.fechaHoraFinalizacion}
                            readOnly
                            className="w-full px-3 py-2 pr-8 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                          />
                          <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-red-600" />
                        </div>
                      </div>

                      {/* Dirección de destino */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección de destino
                        </label>
                        <input
                          type="text"
                          value={serviceData.destino}
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Placa del vehículo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Placa del vehículo
                        </label>
                        <input
                          type="text"
                          value={serviceData.placa || 'ETT108'}
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Documento pasajero */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Documento pasajero
                        </label>
                        <input
                          type="text"
                          value="1093602512"
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Valor recargo a cobrar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor recargo a cobrar
                        </label>
                        <input
                          type="text"
                          value="$ 0,00"
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Concepto */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Concepto
                        </label>
                        <div className="relative">
                          <select
                            value={concepto}
                            onChange={(e) => setConcepto(e.target.value)}
                            className="w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded text-sm text-gray-900 appearance-none"
                          >
                            <option value="TRASLADO RAMPA">TRASLADO RAMPA</option>
                            <option value="TRASLADO INTERNO">TRASLADO INTERNO</option>
                            <option value="TRASLADO EXTERNO">TRASLADO EXTERNO</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Destino */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Destino
                        </label>
                        <div className="relative">
                          <select
                            value={destino}
                            onChange={(e) => setDestino(e.target.value)}
                            className="w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded text-sm text-gray-900 appearance-none"
                          >
                            <option value="INTERNO">INTERNO</option>
                            <option value="EXTERNO">EXTERNO</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Dirección de origen */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección de origen
                        </label>
                        <input
                          type="text"
                          value="Cl. 12 #65-64, Bogotá, Colombia"
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Conductor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conductor
                        </label>
                        <input
                          type="text"
                          value="RUBEN DARIO CONTRERAS LOPEZ"
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Nombre pasajero */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre pasajero
                        </label>
                        <input
                          type="text"
                          value="JOHAN SNEIDER QUINTERO ESCALANTE"
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* KM Recorridos */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          KM Recorridos
                        </label>
                        <input
                          type="text"
                          value="0"
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Valor recargo a pagar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor recargo a pagar
                        </label>
                        <input
                          type="text"
                          value="$ 0,00"
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-900"
                        />
                      </div>

                      {/* Observación */}
                      <div className="row-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Observación
                        </label>
                        <textarea
                          value={observacion}
                          onChange={(e) => setObservacion(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={6}
                          placeholder="Ingrese observaciones sobre la autorización..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Digital Signature Section */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-purple-900 flex items-center">
                          <Edit className="h-5 w-5 mr-2" />
                          Firma Digital del Coordinador
                        </h4>
                        {hasSignature && (
                          <button
                            type="button"
                            onClick={() => setShowSignaturePad(true)}
                            className="text-sm text-purple-600 hover:text-purple-700 underline"
                          >
                            Editar firma
                          </button>
                        )}
                      </div>

                      {!hasSignature && !showSignaturePad ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <Edit className="h-8 w-8 text-purple-600" />
                          </div>
                          <p className="text-gray-600 mb-4">
                            Para autorizar este servicio, debe agregar su firma digital
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowSignaturePad(true)}
                            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
                          >
                            <Edit className="h-5 w-5 mr-2" />
                            Agregar Firma Digital
                          </button>
                        </div>
                      ) : hasSignature && !showSignaturePad ? (
                        <div className="text-center py-4">
                          <div className="inline-block p-4 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                            <img 
                              src={signature} 
                              alt="Firma digital" 
                              className="max-w-xs max-h-24 mx-auto"
                            />
                          </div>
                          <p className="text-sm text-green-600 font-medium mt-2">
                            ✓ Firma digital agregada correctamente
                          </p>
                        </div>
                      ) : (
                        <SignaturePad
                          onSave={handleSaveSignature}
                          onClear={handleClearSignature}
                          width={400}
                          height={150}
                        />
                      )}
                    </div>
                  </div>

                  {/* Lista de paradas section */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setShowParadas(!showParadas)}
                      className="flex items-center justify-between w-full p-3 bg-gray-50 border border-gray-200 rounded text-left hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900">Lista de paradas</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showParadas ? 'rotate-180' : ''}`} />
                    </button>
                    {showParadas && (
                      <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded">
                        <p className="text-sm text-gray-600">No hay paradas adicionales configuradas para este servicio.</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium min-w-[120px] shadow-md hover:shadow-lg"
                    >
                      Volver atrás
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium min-w-[120px] shadow-md hover:shadow-lg"
                    >
                      No Autorizar
                    </button>
                    <button
                      type="button"
                      onClick={handleAuthorize}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium min-w-[120px] shadow-md hover:shadow-lg"
                    >
                      Autorizar
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthorizationModal;