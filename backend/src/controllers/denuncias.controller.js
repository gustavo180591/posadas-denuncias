const Denuncia = require('../models/Denuncia');
const Evidencia = require('../models/Evidencia');
const { Op } = require('sequelize');
const path = require('path');

// Crear denuncia
exports.createDenuncia = async (req, res) => {
  try {
    const { tipo, descripcion, ubicacion, direccion, barrio } = req.body;

    const denuncia = await Denuncia.create({
      userId: req.user.id,
      tipo,
      descripcion,
      ubicacion,
      direccion,
      barrio,
      estado: 'recibida'
    });

    res.status(201).json({
      success: true,
      message: 'Denuncia creada exitosamente',
      data: { denuncia }
    });
  } catch (error) {
    console.error('Error al crear denuncia:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al crear la denuncia'
      }
    });
  }
};

// Obtener denuncias del usuario
exports.getUserDenuncias = async (req, res) => {
  try {
    const denuncias = await Denuncia.findAll({
      where: { userId: req.user.id },
      order: [['fecha', 'DESC']],
      include: [{
        model: Evidencia,
        attributes: ['id', 'tipo', 'url']
      }]
    });

    res.json({
      success: true,
      data: { denuncias }
    });
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener las denuncias'
      }
    });
  }
};

// Obtener denuncia por ID
exports.getDenunciaById = async (req, res) => {
  try {
    const denuncia = await Denuncia.findByPk(req.params.id, {
      include: [{
        model: Evidencia,
        attributes: ['id', 'tipo', 'url', 'nombreArchivo']
      }]
    });

    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Denuncia no encontrada'
        }
      });
    }

    // Verificar permisos
    if (denuncia.userId !== req.user.id && !['operador911', 'admin'].includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tiene permisos para ver esta denuncia'
        }
      });
    }

    res.json({
      success: true,
      data: { denuncia }
    });
  } catch (error) {
    console.error('Error al obtener denuncia:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener la denuncia'
      }
    });
  }
};

// Obtener todas las denuncias
exports.getAllDenuncias = async (req, res) => {
  try {
    const { estado, tipo, barrio, fechaInicio, fechaFin } = req.query;
    
    const where = {};
    
    if (estado) where.estado = estado;
    if (tipo) where.tipo = tipo;
    if (barrio) where.barrio = barrio;
    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }

    const denuncias = await Denuncia.findAll({
      where,
      order: [['fecha', 'DESC']],
      include: [{
        model: Evidencia,
        attributes: ['id', 'tipo', 'url']
      }]
    });

    res.json({
      success: true,
      data: { denuncias }
    });
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener las denuncias'
      }
    });
  }
};

// Actualizar estado de denuncia
exports.updateDenunciaEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const denuncia = await Denuncia.findByPk(req.params.id);

    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Denuncia no encontrada'
        }
      });
    }

    denuncia.estado = estado;
    denuncia.ultimaActualizacion = new Date();
    await denuncia.save();

    res.json({
      success: true,
      message: 'Estado de denuncia actualizado',
      data: { denuncia }
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al actualizar el estado de la denuncia'
      }
    });
  }
};

// Subir evidencia
exports.uploadEvidencia = async (req, res) => {
  try {
    const denuncia = await Denuncia.findByPk(req.params.id);

    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Denuncia no encontrada'
        }
      });
    }

    // Verificar permisos
    if (denuncia.userId !== req.user.id && !['operador911', 'admin'].includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tiene permisos para subir evidencias a esta denuncia'
        }
      });
    }

    const evidencias = req.files.map(file => ({
      denunciaId: denuncia.id,
      tipo: file.mimetype.startsWith('image/') ? 'imagen' : 'video',
      url: `/uploads/${file.filename}`,
      nombreArchivo: file.originalname,
      mimeType: file.mimetype,
      tamanio: file.size
    }));

    await Evidencia.bulkCreate(evidencias);

    res.status(201).json({
      success: true,
      message: 'Evidencias subidas exitosamente',
      data: { evidencias }
    });
  } catch (error) {
    console.error('Error al subir evidencias:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al subir las evidencias'
      }
    });
  }
};

// Obtener evidencias de una denuncia
exports.getDenunciaEvidencias = async (req, res) => {
  try {
    const denuncia = await Denuncia.findByPk(req.params.id);

    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Denuncia no encontrada'
        }
      });
    }

    // Verificar permisos
    if (denuncia.userId !== req.user.id && !['operador911', 'admin'].includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'No tiene permisos para ver las evidencias de esta denuncia'
        }
      });
    }

    const evidencias = await Evidencia.findAll({
      where: { denunciaId: denuncia.id }
    });

    res.json({
      success: true,
      data: { evidencias }
    });
  } catch (error) {
    console.error('Error al obtener evidencias:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener las evidencias'
      }
    });
  }
};

// Obtener estadísticas globales
exports.getStats = async (req, res) => {
  try {
    const stats = await Denuncia.findAll({
      attributes: [
        'tipo',
        'estado',
        'barrio',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      group: ['tipo', 'estado', 'barrio']
    });

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener las estadísticas'
      }
    });
  }
};

// Obtener denuncias por barrio
exports.getDenunciasByBarrio = async (req, res) => {
  try {
    const { barrio } = req.params;
    const denuncias = await Denuncia.findAll({
      where: { barrio },
      order: [['fecha', 'DESC']],
      include: [{
        model: Evidencia,
        attributes: ['id', 'tipo', 'url']
      }]
    });

    res.json({
      success: true,
      data: { denuncias }
    });
  } catch (error) {
    console.error('Error al obtener denuncias por barrio:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error al obtener las denuncias del barrio'
      }
    });
  }
}; 