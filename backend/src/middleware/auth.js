const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token no proporcionado'
        }
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = verifyToken(token);

    // Buscar usuario
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Usuario no encontrado'
        }
      });
    }

    // Verificar si el usuario está validado
    if (user.estado !== 'validado') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Usuario pendiente de validación'
        }
      });
    }

    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({
      success: false,
      error: {
        message: 'No autorizado'
      }
    });
  }
};

// Middleware para verificar rol
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tiene permisos para realizar esta acción'
        }
      });
    }
    next();
  };
};

module.exports = {
  auth,
  checkRole
}; 