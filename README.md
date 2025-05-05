# Sistema de Denuncias Ciudadanas - Posadas

Sistema integral para la gestión de denuncias ciudadanas en la ciudad de Posadas, permitiendo a los ciudadanos reportar incidentes de seguridad de manera rápida y eficiente.

## Características Principales

- 🖥️ Aplicación web responsiva
- 📱 Aplicación móvil nativa (Android/iOS)
- 🔒 Sistema de autenticación seguro
- 📍 Geolocalización de incidentes
- 📸 Carga de evidencias multimedia
- 🔄 Sincronización offline
- 👮‍♂️ Gestión de roles y permisos
- 📊 Panel de administración

## Tecnologías Utilizadas

### Frontend Web
- React.js
- Material-UI
- Redux Toolkit
- Google Maps API

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

### Aplicación Móvil
- React Native
- Expo
- Redux Toolkit
- React Native Maps

## Estructura del Proyecto

```
posadas-denuncias/
├── frontend/              # Aplicación web React
├── mobile/               # Aplicación móvil React Native
├── backend/              # API REST Node.js
├── docs/                 # Documentación
└── docker/              # Configuración Docker
```

## Requisitos del Sistema

- Node.js >= 18.x
- PostgreSQL >= 14
- Docker (opcional)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/posadas-denuncias.git
cd posadas-denuncias
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:
```bash
cd ../frontend
npm install
```

4. Instalar dependencias de la app móvil:
```bash
cd ../mobile
npm install
```

## Configuración

1. Crear archivo `.env` en el directorio backend:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=posadas_denuncias
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu_secreto_jwt
GOOGLE_MAPS_API_KEY=tu_api_key
```

2. Configurar variables de entorno para el frontend y la app móvil según sea necesario.

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start

# Mobile
cd mobile
npm start
```

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

Para más información, contactar a [tu-email@ejemplo.com]
