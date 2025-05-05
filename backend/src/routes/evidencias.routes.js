const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const evidenciasController = require('../controllers/evidencias.controller');
const { auth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const validateRequest = require('../middleware/validateRequest');

// Middleware de validación para parámetros
const validateParams = [
  param('id').isUUID().withMessage('ID de denuncia inválido'),
  param('evidenciaId').optional().isUUID().withMessage('ID de evidencia inválido'),
  validateRequest
];

// Rutas de evidencias
router.post(
  '/:id/evidencias',
  auth,
  validateParams,
  upload.single('archivo'),
  handleUploadError,
  evidenciasController.addEvidencia
);

router.get(
  '/:id/evidencias',
  auth,
  validateParams,
  evidenciasController.getEvidencias
);

router.delete(
  '/:id/evidencias/:evidenciaId',
  auth,
  validateParams,
  evidenciasController.deleteEvidencia
);

module.exports = router; 