# SAC - Sistema de Alerta Ciudadana

Sistema integral para el registro, validación y seguimiento de denuncias ciudadanas en Posadas, gestionado por el 911.

## 🚀 Características Principales

- Registro de usuarios con validación manual
- Sistema de denuncias con geolocalización
- Chat automático con respuestas predeterminadas
- Panel administrativo para el 911
- Aplicación web progresiva (PWA)
- Interfaz responsiva para web y móvil

## 🛠 Tecnologías

### Frontend
- React 18
- TailwindCSS
- LeafletJS para mapas
- PWA capabilities
- WebSocket para chat en tiempo real

### Backend
- Node.js + Express
- MySQL
- JWT para autenticación
- WebSocket para chat

### Infraestructura
- Docker
- Nginx
- CI/CD con GitHub Actions

## 📋 Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- MySQL 8.0+
- npm o yarn

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/your-org/sac.git
cd sac
```

2. Instalar dependencias:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Iniciar con Docker:
```bash
docker-compose up -d
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Backend
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=sac_db
JWT_SECRET=your_jwt_secret
PORT=3000

# Frontend
REACT_APP_API_URL=http://localhost:3000
REACT_APP_MAPS_API_KEY=your_maps_api_key
```

## 📱 Uso

1. Acceder a la aplicación web: `http://localhost:3000`
2. Registrarse como nuevo usuario
3. Esperar validación por parte del 911
4. Una vez validado, podrá realizar denuncias

## 👥 Roles de Usuario

- **Ciudadano**: Registro y denuncias
- **Operador 911**: Validación de usuarios y gestión de denuncias
- **Admin**: Gestión completa del sistema

## 🔒 Seguridad

- Autenticación JWT
- Validación manual de usuarios
- Encriptación de datos sensibles
- Protección contra ataques comunes

## 📄 Licencia

Este proyecto es propiedad de la Municipalidad de Posadas.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo del 911. 