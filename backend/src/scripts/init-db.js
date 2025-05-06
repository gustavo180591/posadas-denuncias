require('dotenv').config();
const { sequelize } = require('../config/database');
const User = require('../models/User');
const Denuncia = require('../models/Denuncia');
const Evidencia = require('../models/Evidencia');

async function initDatabase() {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada');

    // Crear usuario administrador
    const admin = await User.create({
      nombre: 'Admin',
      apellido: 'Sistema',
      dni: '12345678',
      direccion: 'Calle Principal 123',
      email: 'admin@sac.posadas.gob.ar',
      telefono: '3764123456',
      password: 'Admin123!',
      fotoRostro: 'admin.jpg',
      fotoDniFrente: 'admin_dni_frente.jpg',
      fotoDniDorso: 'admin_dni_dorso.jpg',
      estado: 'validado',
      rol: 'admin'
    });

    console.log('Usuario administrador creado:', admin.email);

    // Crear usuario operador 911
    const operador = await User.create({
      nombre: 'Operador',
      apellido: '911',
      dni: '87654321',
      direccion: 'Calle Secundaria 456',
      email: 'operador@sac.posadas.gob.ar',
      telefono: '3764654321',
      password: 'Operador123!',
      fotoRostro: 'operador.jpg',
      fotoDniFrente: 'operador_dni_frente.jpg',
      fotoDniDorso: 'operador_dni_dorso.jpg',
      estado: 'validado',
      rol: 'operador911'
    });

    console.log('Usuario operador creado:', operador.email);

    console.log('Inicialización de la base de datos completada');
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initDatabase(); 