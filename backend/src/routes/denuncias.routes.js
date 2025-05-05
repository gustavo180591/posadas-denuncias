const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const denunciasController = require('../controllers/denuncias.controller');
const { auth, checkRole } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

// Middleware de validación para crear denuncia
const createDenunciaValidation = [
  body('tipoIncidente')
    .isIn(['ROBO', 'VANDALISMO', 'AGRESION', 'ACOSO', 'OTRO'])
    .withMessage('Tipo de incidente inválido'),
  body('fechaHora')
    .isISO8601()
    .withMessage('Fecha y hora inválida'),
  body('ubicacion')
    .isObject()
    .withMessage('Ubicación inválida'),
  body('direccion')
    .notEmpty()
    .withMessage('La dirección es requerida'),
  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es requerida'),
  body('evidencias')
    .optional()
    .isArray()
    .withMessage('Las evidencias deben ser un array'),
  validateRequest
];

// Middleware de validación para actualizar denuncia
const updateDenunciaValidation = [
  param('id')
    .isUUID()
    .withMessage('ID de denuncia inválido'),
  body('tipoIncidente')
    .optional()
    .isIn(['ROBO', 'VANDALISMO', 'AGRESION', 'ACOSO', 'OTRO'])
    .withMessage('Tipo de incidente inválido'),
  body('fechaHora')
    .optional()
    .isISO8601()
    .withMessage('Fecha y hora inválida'),
  body('ubicacion')
    .optional()
    .isObject()
    .withMessage('Ubicación inválida'),
  body('direccion')
    .optional()
    .notEmpty()
    .withMessage('La dirección es requerida'),
  body('descripcion')
    .optional()
    .notEmpty()
    .withMessage('La descripción es requerida'),
  body('estado')
    .optional()
    .isIn(['PENDIENTE', 'EN_PROCESO', 'RESUELTA', 'CERRADA'])
    .withMessage('Estado inválido'),
  body('prioridad')
    .optional()
    .isIn(['BAJA', 'MEDIA', 'ALTA', 'URGENTE'])
    .withMessage('Prioridad inválida'),
  validateRequest
];

// Middleware de validación para filtros de búsqueda
const getDenunciasValidation = [
  query('tipoIncidente')
    .optional()
    .isIn(['ROBO', 'VANDALISMO', 'AGRESION', 'ACOSO', 'OTRO'])
    .withMessage('Tipo de incidente inválido'),
  query('estado')
    .optional()
    .isIn(['PENDIENTE', 'EN_PROCESO', 'RESUELTA', 'CERRADA'])
    .withMessage('Estado inválido'),
  query('prioridad')
    .optional()
    .isIn(['BAJA', 'MEDIA', 'ALTA', 'URGENTE'])
    .withMessage('Prioridad inválida'),
  query('fechaDesde')
    .optional()
    .isISO8601()
    .withMessage('Fecha desde inválida'),
  query('fechaHasta')
    .optional()
    .isISO8601()
    .withMessage('Fecha hasta inválida'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página inválida'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite inválido'),
  validateRequest
];

// Rutas de denuncias
router.post(
  '/',
  auth,
  createDenunciaValidation,
  denunciasController.createDenuncia
);

router.get(
  '/',
  auth,
  getDenunciasValidation,
  denunciasController.getDenuncias
);

router.get(
  '/:id',
  auth,
  param('id').isUUID().withMessage('ID de denuncia inválido'),
  validateRequest,
  denunciasController.getDenuncia
);

router.put(
  '/:id',
  auth,
  updateDenunciaValidation,
  denunciasController.updateDenuncia
);

router.delete(
  '/:id',
  auth,
  param('id').isUUID().withMessage('ID de denuncia inválido'),
  validateRequest,
  denunciasController.deleteDenuncia
);

// Ruta de estadísticas (solo para policías y admin)
router.get(
  '/estadisticas',
  auth,
  checkRole(['ROLE_POLICIA', 'ROLE_SUPER_ADMIN']),
  denunciasController.getEstadisticas
);

module.exports = router; 