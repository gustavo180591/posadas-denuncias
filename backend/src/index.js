require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const denunciasRoutes = require('./routes/denuncias.routes');
const evidenciaRoutes = require('./routes/evidencias.routes');
const mapsRoutes = require('./routes/maps.routes');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/denuncias', denunciasRoutes);
app.use('/api/evidencias', evidenciaRoutes);
app.use('/api/maps', mapsRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join_denuncia', (denunciaId) => {
    socket.join(`denuncia_${denunciaId}`);
  });

  socket.on('leave_denuncia', (denunciaId) => {
    socket.leave(`denuncia_${denunciaId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Error handling
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sync database models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Modelos sincronizados con la base de datos.');

    httpServer.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer(); 