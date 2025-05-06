const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validateRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Registro de usuario
router.post(
  '/register',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('apellido').trim().notEmpty().withMessage('El apellido es requerido'),
    body('dni')
      .trim()
      .matches(/^\d{7,8}$/)
      .withMessage('El DNI debe tener 7 u 8 dígitos'),
    body('direccion').trim().notEmpty().withMessage('La dirección es requerida'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('El email debe ser válido'),
    body('telefono')
      .trim()
      .matches(/^\d{10}$/)
      .withMessage('El teléfono debe tener 10 dígitos'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('fotoRostro').notEmpty().withMessage('La foto del rostro es requerida'),
    body('fotoDniFrente').notEmpty().withMessage('La foto del DNI (frente) es requerida'),
    body('fotoDniDorso').notEmpty().withMessage('La foto del DNI (dorso) es requerida'),
    validateRequest
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    validateRequest
  ],
  authController.login
);

// Obtener perfil del usuario
router.get('/profile', auth, authController.getProfile);

// Actualizar perfil
router.put(
  '/profile',
  auth,
  [
    body('nombre').optional().trim().notEmpty(),
    body('apellido').optional().trim().notEmpty(),
    body('direccion').optional().trim().notEmpty(),
    body('telefono')
      .optional()
      .trim()
      .matches(/^\d{10}$/)
      .withMessage('El teléfono debe tener 10 dígitos'),
    validateRequest
  ],
  authController.updateProfile
);

// Cambiar contraseña
router.put(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('La contraseña actual es requerida'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
    validateRequest
  ],
  authController.changePassword
);

module.exports = router; 