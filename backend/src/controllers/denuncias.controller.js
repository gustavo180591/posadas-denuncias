const { Denuncia, Evidencia, User } = require('../models');
const { Op } = require('sequelize');
const mapsService = require('../services/maps.service');

// Crear una nueva denuncia
const createDenuncia = async (req, res, next) => {
  try {
    const {
      tipoIncidente,
      fechaHora,
      ubicacion,
      direccion,
      descripcion,
      evidencias
    } = req.body;

    // Validar y geocodificar la ubicación
    let geocodedLocation;
    if (ubicacion) {
      const validationResult = await mapsService.validateLocation(ubicacion.lat, ubicacion.lng);
      geocodedLocation = {
        ...ubicacion,
        formattedAddress: validationResult.address
      };
    } else if (direccion) {
      geocodedLocation = await mapsService.geocode(direccion);
    } else {
      throw new Error('Se requiere ubicación o dirección');
    }

    // Obtener comisarías cercanas
    const nearbyStations = await mapsService.getNearbyPoliceStations(
      geocodedLocation.lat,
      geocodedLocation.lng
    );

    const denuncia = await Denuncia.create({
      tipoIncidente,
      fechaHora,
      ubicacion: {
        lat: geocodedLocation.lat,
        lng: geocodedLocation.lng,
        direccion: geocodedLocation.formattedAddress
      },
      direccion: geocodedLocation.formattedAddress,
      descripcion,
      userId: req.user.id,
      comisariasCercanas: nearbyStations
    });

    // Si hay evidencias, las guardamos
    if (evidencias && evidencias.length > 0) {
      await Promise.all(
        evidencias.map(evidencia =>
          Evidencia.create({
            ...evidencia,
            denunciaId: denuncia.id
          })
        )
      );
    }

    // Obtener la denuncia con sus relaciones
    const denunciaCompleta = await Denuncia.findByPk(denuncia.id, {
      include: [
        { model: Evidencia, as: 'evidencias' },
        { model: User, as: 'user', attributes: ['id', 'nombre', 'apellido', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      data: denunciaCompleta
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las denuncias (con filtros)
const getDenuncias = async (req, res, next) => {
  try {
    const {
      tipoIncidente,
      estado,
      prioridad,
      fechaDesde,
      fechaHasta,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    if (tipoIncidente) where.tipoIncidente = tipoIncidente;
    if (estado) where.estado = estado;
    if (prioridad) where.prioridad = prioridad;
    if (fechaDesde && fechaHasta) {
      where.fechaHora = {
        [Op.between]: [new Date(fechaDesde), new Date(fechaHasta)]
      };
    }

    // Si es un usuario normal, solo puede ver sus propias denuncias
    if (req.user.role === 'ROLE_USER') {
      where.userId = req.user.id;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Denuncia.findAndCountAll({
      where,
      include: [
        { model: Evidencia, as: 'evidencias' },
        { model: User, as: 'user', attributes: ['id', 'nombre', 'apellido', 'email'] }
      ],
      order: [['fechaHora', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: {
        denuncias: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener una denuncia específica
const getDenuncia = async (req, res, next) => {
  try {
    const { id } = req.params;

    const where = { id };
    if (req.user.role === 'ROLE_USER') {
      where.userId = req.user.id;
    }

    const denuncia = await Denuncia.findOne({
      where,
      include: [
        { model: Evidencia, as: 'evidencias' },
        { model: User, as: 'user', attributes: ['id', 'nombre', 'apellido', 'email'] }
      ]
    });

    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: 'Denuncia no encontrada'
      });
    }

    res.json({
      success: true,
      data: denuncia
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una denuncia
const updateDenuncia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tipoIncidente,
      fechaHora,
      ubicacion,
      direccion,
      descripcion,
      estado,
      prioridad,
      asignadoA
    } = req.body;

    const where = { id };
    if (req.user.role === 'ROLE_USER') {
      where.userId = req.user.id;
    }

    const denuncia = await Denuncia.findOne({ where });
    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: 'Denuncia no encontrada'
      });
    }

    // Actualizar campos permitidos según el rol
    const updateData = {};
    if (tipoIncidente) updateData.tipoIncidente = tipoIncidente;
    if (fechaHora) updateData.fechaHora = fechaHora;
    if (ubicacion) updateData.ubicacion = ubicacion;
    if (direccion) updateData.direccion = direccion;
    if (descripcion) updateData.descripcion = descripcion;

    // Solo policías y admin pueden actualizar estos campos
    if (['ROLE_POLICIA', 'ROLE_SUPER_ADMIN'].includes(req.user.role)) {
      if (estado) updateData.estado = estado;
      if (prioridad) updateData.prioridad = prioridad;
      if (asignadoA) updateData.asignadoA = asignadoA;
    }

    await denuncia.update(updateData);

    // Obtener la denuncia actualizada con sus relaciones
    const denunciaActualizada = await Denuncia.findByPk(id, {
      include: [
        { model: Evidencia, as: 'evidencias' },
        { model: User, as: 'user', attributes: ['id', 'nombre', 'apellido', 'email'] }
      ]
    });

    res.json({
      success: true,
      data: denunciaActualizada
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una denuncia
const deleteDenuncia = async (req, res, next) => {
  try {
    const { id } = req.params;

    const where = { id };
    if (req.user.role === 'ROLE_USER') {
      where.userId = req.user.id;
    }

    const denuncia = await Denuncia.findOne({ where });
    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: 'Denuncia no encontrada'
      });
    }

    await denuncia.destroy();

    res.json({
      success: true,
      message: 'Denuncia eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener estadísticas de denuncias
const getEstadisticas = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'ROLE_USER') {
      where.userId = req.user.id;
    }

    const totalDenuncias = await Denuncia.count({ where });
    const denunciasPorTipo = await Denuncia.findAll({
      attributes: [
        'tipoIncidente',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where,
      group: ['tipoIncidente']
    });

    const denunciasPorEstado = await Denuncia.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where,
      group: ['estado']
    });

    res.json({
      success: true,
      data: {
        totalDenuncias,
        denunciasPorTipo,
        denunciasPorEstado
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDenuncia,
  getDenuncias,
  getDenuncia,
  updateDenuncia,
  deleteDenuncia,
  getEstadisticas
}; 