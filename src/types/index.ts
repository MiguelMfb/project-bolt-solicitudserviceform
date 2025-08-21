export interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  documentNumber: string;
  address: string;
}

export interface PatientInfo {
  name: string;
  documentNumber: string;
  gender: string;
  birthdate: string;
  address: string;
  phone: string;
  email: string;
}

export interface Authorization {
  id: string;
  periodo: string;
  volante: string;
  fechaInicial: string;
  fechaFinal: string;
  tarifaAutorizada: string;
  tarifaUT: string;
  cantidad: number;
  disponible: number;
  usadas: number;
  estado: 'Volante Cerrado' | 'No Disponibles' | 'Disponibles';
  vencimiento?: string;
  ciudadA: string;
  ciudadB: string;
}

export interface Service {
  id: string;
  numero: string;
  fechaContratada: string;
  fechaHoraInicial: string;
  origen: string;
  destino: string;
  tarifaUT: string;
  volante: string;
  conductor: string | null;
  placa?: string | null;
  estado: 'FINALIZADO' | 'PROGRAMADO' | 'PENDIENTE' | 'CANCELADO' | 'CANCELACION_SOLICITADA' | 'NO_SHOW' | 'ABIERTO';
  fechaSolicitud?: string;
  fechaCancelacionSolicitada?: string | null;
  fechaCancelacionProcesada?: string | null;
  observaciones?: string;
  estadoAutorizacion: boolean; // true = AUTORIZADO, false = NO_AUTORIZADO
  firmaSize?: number; // Size of signature in KB
  hasValidSignature?: boolean; // Computed field for signature validation
  pdfUrl?: string; // URL to the service PDF document
  ciudadOrigen?: string;
  ciudadDestino?: string;
  complementoOrigen?: string;
  complementoDestino?: string;
}

export interface ServiceFormData {
  id: string;
  origen: string;
  destino: string;
  ciudadOrigen?: string;
  ciudadDestino?: string;
  barrioOrigen?: string;
  barrioDestino?: string;
  fechaHora: Date | null;
  idaYRegreso: boolean;
  conAcompanante: boolean;
  telefonoAdicional?: string;
  tipo?: 'IDA' | 'REGRESO' | 'ADICIONAL';
  observaciones?: string;
}

export interface Driver {
  id: string;
  name: string;
  plate: string;
  displayName: string;
  isAvailable: boolean;
}

export interface ServiceStats {
  pendiente: number;
  programado: number;
  cancelacionSolicitada: number;
  noShow: number;
}

export interface ApprovalStats {
  autorizado: number;
  noAutorizado: number;
}