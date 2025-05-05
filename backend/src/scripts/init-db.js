require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/User');
const Denuncia = require('../models/Denuncia');
const Evidencia = require('../models/Evidencia');

const initDatabase = async () => {
  try {
    // Sincronizar todos los modelos
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada');

    // Crear usuario administrador
    const adminUser = await User.create({
      email: 'admin@posadasdenuncias.com',
      password: 'Admin123!',
      nombre: 'Admin',
      apellido: 'Sistema',
      dni: '12345678',
      role: 'ROLE_SUPER_ADMIN'
    });

    // Crear usuario policía
    const policiaUser = await User.create({
      email: 'policia@posadasdenuncias.com',
      password: 'Policia123!',
      nombre: 'Oficial',
      apellido: 'Policia',
      dni: '87654321',
      role: 'ROLE_POLICIA'
    });

    // Crear usuario normal
    const normalUser = await User.create({
      email: 'usuario@posadasdenuncias.com',
      password: 'Usuario123!',
      nombre: 'Usuario',
      apellido: 'Normal',
      dni: '11223344',
      role: 'ROLE_USER'
    });

    console.log('Usuarios de prueba creados');
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

initDatabase(); 