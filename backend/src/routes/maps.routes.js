const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const mapsService = require('../services/maps.service');
const validateRequest = require('../middleware/validateRequest');

// Middleware de validación para geocodificación
const geocodeValidation = [
  query('address')
    .notEmpty()
    .withMessage('La dirección es requerida'),
  validateRequest
];

// Middleware de validación para coordenadas
const coordinatesValidation = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud inválida'),
  query('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud inválida'),
  validateRequest
];

// Geocodificar una dirección
router.get(
  '/geocode',
  geocodeValidation,
  async (req, res, next) => {
    try {
      const { address } = req.query;
      const location = await mapsService.geocode(address);
      res.json(location);
    } catch (error) {
      next(error);
    }
  }
);

// Validar una ubicación
router.get(
  '/validate',
  coordinatesValidation,
  async (req, res, next) => {
    try {
      const { lat, lng } = req.query;
      const result = await mapsService.validateLocation(
        parseFloat(lat),
        parseFloat(lng)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Obtener comisarías cercanas
router.get(
  '/nearby-police',
  coordinatesValidation,
  async (req, res, next) => {
    try {
      const { lat, lng } = req.query;
      const stations = await mapsService.getNearbyPoliceStations(
        parseFloat(lat),
        parseFloat(lng)
      );
      res.json(stations);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router; 