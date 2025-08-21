# Aplicación de Solicitud de Transporte

Sistema web para la gestión y solicitud de servicios de transporte médico, desarrollado con React, TypeScript y Tailwind CSS.

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Datos de Prueba](#datos-de-prueba)
- [Licencia](#licencia)

## Características Principales

- Gestión de autorizaciones de transporte médico
- Solicitud de servicios de transporte (ida y regreso)
- Historial de servicios solicitados
- Modificación y cancelación de servicios pendientes
- Actualización de información del usuario
- Interfaz responsiva y amigable
- Validaciones en tiempo real
- Notificaciones por correo electrónico
- Autocompletado inteligente de direcciones con sugerencias predictivas

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Navegador web moderno

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Uso

### Gestión de Autorizaciones

- Visualizar autorizaciones disponibles
- Filtrar autorizaciones por diferentes criterios
- Ver detalles de cada autorización

### Solicitud de Servicios

1. Seleccionar una autorización disponible
2. Completar el formulario de solicitud:
   - Dirección de origen y destino
     - Al enfocar los campos de dirección, aparecerá una sugerencia predictiva con la dirección registrada del usuario
   - Fecha y hora del servicio
   - Opción de acompañante
   - Servicio de regreso (opcional)
   - Posibilidad de añadir servicios adicionales (según disponibilidad)

### Historial de Servicios

- Ver todos los servicios solicitados
- Filtrar servicios por estado
- Modificar servicios pendientes
- Cancelar servicios pendientes

### Gestión de Usuario

- Actualizar información de contacto
- Cambiar contraseña
- Ver notificaciones

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
├── data/               # Datos de prueba
├── types/              # Definiciones de TypeScript
├── App.tsx             # Componente principal
└── main.tsx           # Punto de entrada
```

## Componentes Principales

### ListaServiciosView
- Vista principal de autorizaciones y servicios
- Gestión de filtros y búsquedas
- Integración con modales de modificación y cancelación

### SolicitudTransporteView
- Formulario de solicitud de servicios
- Validaciones en tiempo real
- Gestión de servicios de ida y regreso

### UpdateUserInfoModal
- Actualización de datos del usuario
- Cambio de contraseña
- Validaciones de seguridad

### Modales de Confirmación
- Confirmación de solicitudes
- Confirmación de cancelaciones
- Notificaciones de éxito

## Datos de Prueba

La aplicación utiliza datos simulados (mock data) para demostración:
- Información de usuario
- Autorizaciones de transporte
- Historial de servicios

Los datos se encuentran en `src/data/mockData.ts`

## Características Técnicas

- Interfaz moderna y responsiva con Tailwind CSS
- Validaciones en tiempo real
- Gestión de servicios de ida y regreso
- Autocompletado inteligente de direcciones
- Control de límites de servicios

## Licencia

MIT License - ver [LICENSE.md](LICENSE.md) para más detalles.