const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendValidationEmail } = require('../utils/email');

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      dni,
      direccion,
      email,
      telefono,
      password,
      fotoRostro,
      fotoDniFrente,
      fotoDniDorso
    } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { dni }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El email o DNI ya está registrado'
        }
      });
    }

    // Crear nuevo usuario
    const user = await User.create({
      nombre,
      apellido,
      dni,
      direccion,
      email,
      telefono,
      password,
      fotoRostro,
      fotoDniFrente,
      fotoDniDorso,
      estado: 'pendiente'
    });

    // Enviar email de validación
    await sendValidationEmail(user.email, user.nombre);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Aguarde la validación por parte del 911.',
      data: {
        id: user.id,
        email: user.email,
        estado: user.estado
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al registrar usuario'
      }
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciales inválidas'
        }
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciales inválidas'
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

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    // Generar token
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: user.rol
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al iniciar sesión'
      }
    });
  }
};

// Obtener perfil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado'
        }
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener perfil'
      }
    });
  }
};

// Actualizar perfil
exports.updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, direccion, telefono } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado'
        }
      });
    }

    // Actualizar campos
    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (direccion) user.direccion = direccion;
    if (telefono) user.telefono = telefono;

    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          direccion: user.direccion,
          telefono: user.telefono
        }
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar perfil'
      }
    });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuario no encontrado'
        }
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await user.comparePassword(currentPassword);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Contraseña actual incorrecta'
        }
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al cambiar contraseña'
      }
    });
  }
}; 