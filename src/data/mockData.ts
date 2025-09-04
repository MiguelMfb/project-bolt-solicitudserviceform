import { UserInfo, PatientInfo, Authorization, Service } from '../types';

export const mockUserInfo: UserInfo = {
  name: 'Ana',
  email: 'ana.rodriguez@ejemplo.com',
  phoneNumber: '(601) 987-6543',
  username: 'ana.rodriguez',
  password: 'password123',
  documentNumber: '52.123.456',
  address: 'Calle 123 # 45-67, Bogotá'
};

export const mockPatientInfo: PatientInfo = {
  name: 'Ana María López García',
  documentNumber: '52.123.456',
  gender: 'Femenino',
  birthdate: '01/01/1980',
  address: 'Calle 123 # 45-67, Bogotá',
  phone: '(601) 123-4567',
  email: 'ana.lopez@ejemplo.com'
};

export const mockAuthorizations: Authorization[] = [
  {
    id: '1',
    periodo: '202502',
    volante: '20000029',
    fechaInicial: '1/02/2025',
    fechaFinal: '28/02/2025',
    tarifaAutorizada: 'TEI00001',
    tarifaUT: 'INTERNO BTA',
    cantidad: 20,
    disponible: 0,
    usadas: 20,
    estado: 'Volante Cerrado',
    ciudadA: 'Bogotá D.C.',
    ciudadB: 'Facatativá'
  },
  {
    id: '2',
    periodo: '202503',
    volante: '20000030',
    fechaInicial: '1/03/2025',
    fechaFinal: '30/03/2025',
    tarifaAutorizada: 'TEI00001',
    tarifaUT: 'INTERNO BTA',
    cantidad: 10,
    disponible: 0,
    usadas: 10,
    estado: 'No Disponibles',
    ciudadA: 'Bogotá D.C.',
    ciudadB: 'Zipaquirá'
  },
  {
    id: '3',
    periodo: '202503',
    volante: '20000031',
    fechaInicial: '16/03/2025',
    fechaFinal: '30/03/2025',
    tarifaAutorizada: 'TMR00001',
    tarifaUT: 'RAMPA BTA',
    cantidad: 10,
    disponible: 10,
    usadas: 0,
    estado: 'Disponibles',
    ciudadA: 'Bogotá D.C.',
    ciudadB: 'Aeropuerto El Dorado'
  },
  {
      id: '4',
      periodo: '202503',
      volante: '20000032',
      fechaInicial: '16/03/2025',
      fechaFinal: '30/03/2025',
      tarifaAutorizada: 'TEI00062',
      tarifaUT: 'CHIA/BTA',
      cantidad: 4,
      disponible: 2,
      usadas: 2,
      estado: 'Disponibles',
      ciudadA: 'Chía',
      ciudadB: 'Bogotá D.C.'
    }
  ];

// Get today's date for current services
const today = new Date();
const todayStr = today.toLocaleDateString('es-ES');
const todayISOStr = today.toISOString();

// Helper function to get a date string for today + offset days
const getDateString = (offsetDays: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toLocaleDateString('es-ES');
};

// Helper function to get ISO string for today + offset days
const getISOString = (offsetDays: number = 0, hours: number = 8) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString();
};

export const mockPastServices: Service[] = [
  // Today's services - for current activity
  {
    id: '1',
    numero: '1112',
    fechaContratada: todayStr,
    fechaHoraInicial: `${todayStr} 8:00`,
    origen: 'Kr 141 b 12 - 14, Bogotá',
    destino: 'IPS Sur, Bogotá, Colombia',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: 'ALFONSO ROJAS',
    placa: 'ABC-123',
    estado: 'FINALIZADO',
    fechaSolicitud: getISOString(-1, 8),
    observaciones: 'Paciente con movilidad reducida',
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 2.5,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1112.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Apartamento 301',
    complementoDestino: 'Consulta externa'
  },
  {
    id: '2',
    numero: '1113',
    fechaContratada: todayStr,
    fechaHoraInicial: `${todayStr} 10:00`,
    origen: 'IPS Sur, Bogotá',
    destino: 'Kr 141 b 12 - 14, Bogotá, Colombia',
    tarifaUT: 'RAMPA BTA',
    volante: '20000031',
    conductor: 'CARLOS MENDEZ',
    placa: 'DEF-456',
    estado: 'PROGRAMADO',
    fechaSolicitud: getISOString(-1, 9),
    observaciones: 'Traslado al aeropuerto',
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 1.8,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1113.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Aeropuerto El Dorado',
    complementoOrigen: 'Terminal 1',
    complementoDestino: 'Puerta principal'
  },
  {
    id: '3',
    numero: '1114',
    fechaContratada: todayStr,
    fechaHoraInicial: `${todayStr} 14:00`,
    origen: 'Kr 141 b 12 - 14, Bogotá',
    destino: 'IPS Sur, Bogotá, Colombia',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: null,
    placa: null,
    estado: 'PENDIENTE',
    fechaSolicitud: todayISOStr,
    observaciones: 'Cita médica especializada',
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 2.1,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1114.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Casa 15',
    complementoDestino: 'Piso 3'
  },
  {
    id: '4',
    numero: '1115',
    fechaContratada: todayStr,
    fechaHoraInicial: `${todayStr} 16:00`,
    origen: 'IPS Sur, Bogotá',
    destino: 'Kr 141 b 12 - 14, Bogotá, Colombia',
    tarifaUT: 'CHIA/BTA',
    volante: '20000032',
    conductor: null,
    placa: null,
    estado: 'CANCELADO',
    fechaSolicitud: getISOString(0, 11),
    observaciones: 'Cancelado por el usuario',
    estadoAutorizacion: false, // NO_AUTORIZADO
    firmaSize: 0.8,
    hasValidSignature: false,
    pdfUrl: '/documents/service-1115.pdf',
    ciudadOrigen: 'Chía',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Oficina 205',
    complementoDestino: 'Apartamento 102'
  },
  // Tomorrow's services - THESE ARE THE ONES THAT WILL BE FILTERED BY THE "PROGRAMAR" BUTTON
  {
    id: '5',
    numero: '1116',
    fechaContratada: getDateString(1), // Tomorrow's date
    fechaHoraInicial: `${getDateString(1)} 9:00`,
    origen: 'Kr 141 b 12 - 14, Bogotá',
    destino: 'Centro Médico Norte, Bogotá',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: null,
    placa: null,
    estado: 'PENDIENTE', // PENDIENTE status for tomorrow
    fechaSolicitud: getISOString(0, 7),
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 1.5,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1116.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Torre A',
    complementoDestino: 'Consulta 401'
  },
  {
    id: '6',
    numero: '1117',
    fechaContratada: getDateString(1), // Tomorrow's date
    fechaHoraInicial: `${getDateString(1)} 14:30`,
    origen: 'Centro Médico Norte, Bogotá',
    destino: 'Kr 141 b 12 - 14, Bogotá',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: null,
    placa: null,
    estado: 'PENDIENTE', // PENDIENTE status for tomorrow
    fechaSolicitud: getISOString(0, 12),
    estadoAutorizacion: false, // NO_AUTORIZADO
    firmaSize: 0.5,
    hasValidSignature: false,
    pdfUrl: '/documents/service-1117.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Recepción',
    complementoDestino: 'Apartamento 501'
  },
  {
    id: '7',
    numero: '1118',
    fechaContratada: getDateString(1), // Tomorrow's date
    fechaHoraInicial: `${getDateString(1)} 10:00`,
    origen: 'Kr 141 b 12 - 14, Bogotá',
    destino: 'Hospital Central, Bogotá',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: null,
    placa: null,
    estado: 'PENDIENTE', // PENDIENTE status for tomorrow
    fechaSolicitud: getISOString(0, 8),
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 3.2,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1118.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Edificio principal',
    complementoDestino: 'Urgencias'
  },
  {
    id: '8',
    numero: '1119',
    fechaContratada: getDateString(1), // Tomorrow's date
    fechaHoraInicial: `${getDateString(1)} 15:00`,
    origen: 'Hospital Central, Bogotá',
    destino: 'Kr 141 b 12 - 14, Bogotá',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: null,
    placa: null,
    estado: 'PENDIENTE', // PENDIENTE status for tomorrow
    fechaSolicitud: getISOString(0, 13),
    estadoAutorizacion: false, // NO_AUTORIZADO
    firmaSize: 1.2,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1119.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Salida principal',
    complementoDestino: 'Casa 22'
  },
  // NEW: Service with cancellation request for tomorrow
  {
    id: '15',
    numero: '1126',
    fechaContratada: getDateString(1), // Tomorrow's date
    fechaHoraInicial: `${getDateString(1)} 11:30`,
    origen: 'Kr 141 b 12 - 14, Bogotá',
    destino: 'Clínica del Norte, Bogotá',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: 'LUIS RODRIGUEZ',
    placa: 'JKL-012',
    estado: 'CANCELACION_SOLICITADA', // NEW cancellation request status
    fechaSolicitud: getISOString(0, 9),
    fechaCancelacionSolicitada: getISOString(0, 14), // User requested cancellation
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 2.8,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1126.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Casa principal',
    complementoDestino: 'Piso 2',
    observaciones: 'Usuario solicitó cancelación por motivos de salud'
  },
  // Day after tomorrow's services
  {
    id: '9',
    numero: '1120',
    fechaContratada: getDateString(2),
    fechaHoraInicial: `${getDateString(2)} 10:00`,
    origen: 'Kr 141 b 12 - 14, Bogotá',
    destino: 'Hospital Central, Bogotá',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: null,
    placa: null,
    estado: 'PENDIENTE',
    fechaSolicitud: getISOString(0, 8),
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 2.8,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1120.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Apartamento 201',
    complementoDestino: 'Consulta externa'
  },
  {
    id: '10',
    numero: '1121',
    fechaContratada: getDateString(2),
    fechaHoraInicial: `${getDateString(2)} 15:00`,
    origen: 'Hospital Central, Bogotá',
    destino: 'Kr 141 b 12 - 14, Bogotá',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: 'MARIA GONZALEZ',
    placa: 'GHI-789',
    estado: 'ABIERTO',
    fechaSolicitud: getISOString(0, 13),
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 1.9,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1121.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Lobby principal',
    complementoDestino: 'Portería'
  },
  // Services with cancellation requests
  {
    id: '11',
    numero: '1122',
    fechaContratada: getDateString(3),
    fechaHoraInicial: `${getDateString(3)} 11:30`,
    origen: 'Kr 141 b 12 - 14, Bogotá',
    destino: 'Clínica del Norte, Bogotá',
    tarifaUT: 'INTERNO BTA',
    volante: '20000030',
    conductor: 'LUIS RODRIGUEZ',
    placa: 'JKL-012',
    estado: 'CANCELACION_SOLICITADA',
    fechaSolicitud: getISOString(0, 9),
    fechaCancelacionSolicitada: getISOString(0, 14),
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 0.9,
    hasValidSignature: false,
    pdfUrl: '/documents/service-1122.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Casa principal',
    complementoDestino: 'Piso 2'
  },
  // More services for variety
  {
    id: '12',
    numero: '1123',
    fechaContratada: getDateString(1),
    fechaHoraInicial: `${getDateString(1)} 8:30`,
    origen: 'Clínica del Norte, Bogotá',
    destino: 'Kr 141 b 12 - 14, Bogotá',
    tarifaUT: 'RAMPA BTA',
    volante: '20000031',
    conductor: null,
    placa: null,
    estado: 'PENDIENTE', // PENDIENTE status for tomorrow
    fechaSolicitud: getISOString(0, 10),
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 1.7,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1123.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Entrada principal',
    complementoDestino: 'Apartamento 301'
  },
  {
    id: '13',
    numero: '1124',
    fechaContratada: getDateString(2),
    fechaHoraInicial: `${getDateString(2)} 13:00`,
    origen: 'Kr 141 b 12 - 14, Bogotá',
    destino: 'Aeropuerto El Dorado, Bogotá',
    tarifaUT: 'RAMPA BTA',
    volante: '20000031',
    conductor: 'ANA RODRIGUEZ',
    placa: 'MNO-345',
    estado: 'PROGRAMADO',
    fechaSolicitud: getISOString(0, 11),
    estadoAutorizacion: true, // AUTORIZADO
    firmaSize: 2.3,
    hasValidSignature: true,
    pdfUrl: '/documents/service-1124.pdf',
    ciudadOrigen: 'Bogotá D.C.',
    ciudadDestino: 'Aeropuerto El Dorado',
    complementoOrigen: 'Torre B',
    complementoDestino: 'Terminal 1'
  },
  {
    id: '14',
    numero: '1125',
    fechaContratada: getDateString(1),
    fechaHoraInicial: `${getDateString(1)} 17:00`,
    origen: 'Aeropuerto El Dorado, Bogotá',
    destino: 'Kr 141 b 12 - 14, Bogotá',
    tarifaUT: 'RAMPA BTA',
    volante: '20000031',
    conductor: null,
    placa: null,
    estado: 'NO_SHOW',
    fechaSolicitud: getISOString(-1, 7),
    estadoAutorizacion: false, // NO_AUTORIZADO
    firmaSize: 0.3,
    hasValidSignature: false,
    pdfUrl: '/documents/service-1125.pdf',
    ciudadOrigen: 'Aeropuerto El Dorado',
    ciudadDestino: 'Bogotá D.C.',
    complementoOrigen: 'Llegadas nacionales',
    complementoDestino: 'Apartamento 102'
  }
];