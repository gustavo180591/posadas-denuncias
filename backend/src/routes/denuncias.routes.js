const express = require('express');
const { body } = require('express-validator');
const denunciasController = require('../controllers/denuncias.controller');
const validateRequest = require('../middleware/validateRequest');
const { auth, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Crear denuncia
router.post(
  '/',
  auth,
  [
    body('tipo').isIn(['robo', 'hurto', 'vandalismo', 'acoso', 'violencia', 'otro']),
    body('descripcion').trim().notEmpty(),
    body('ubicacion').isObject(),
    body('direccion').trim().notEmpty(),
    body('barrio').trim().notEmpty(),
    validateRequest
  ],
  denunciasController.createDenuncia
);

// Obtener denuncias del usuario
router.get('/mis-denuncias', auth, denunciasController.getUserDenuncias);

// Obtener denuncia por ID
router.get('/:id', auth, denunciasController.getDenunciaById);

// Obtener todas las denuncias (solo operadores y admin)
router.get(
  '/',
  auth,
  checkRole(['operador911', 'admin']),
  denunciasController.getAllDenuncias
);

// Actualizar estado de denuncia (solo operadores y admin)
router.patch(
  '/:id/estado',
  auth,
  checkRole(['operador911', 'admin']),
  [
    body('estado').isIn(['recibida', 'en_proceso', 'resuelta', 'archivada']),
    validateRequest
  ],
  denunciasController.updateDenunciaEstado
);

// Subir evidencia
router.post(
  '/:id/evidencias',
  auth,
  upload.array('evidencias', 5),
  denunciasController.uploadEvidencia
);

// Obtener evidencias de una denuncia
router.get(
  '/:id/evidencias',
  auth,
  denunciasController.getDenunciaEvidencias
);

// Obtener estadísticas (solo operadores y admin)
router.get(
  '/stats/global',
  auth,
  checkRole(['operador911', 'admin']),
  denunciasController.getStats
);

// Obtener denuncias por barrio
router.get(
  '/stats/barrio/:barrio',
  auth,
  checkRole(['operador911', 'admin']),
  denunciasController.getDenunciasByBarrio
);

module.exports = router; 