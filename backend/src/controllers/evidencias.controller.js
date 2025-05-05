const { Evidencia, Denuncia } = require('../models');
const path = require('path');
const fs = require('fs');

// Agregar evidencia a una denuncia
const addEvidencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionó ningún archivo'
      });
    }

    // Verificar que la denuncia existe y pertenece al usuario
    const denuncia = await Denuncia.findOne({
      where: {
        id,
        userId: req.user.role === 'ROLE_USER' ? req.user.id : undefined
      }
    });

    if (!denuncia) {
      // Eliminar el archivo si la denuncia no existe
      fs.unlinkSync(file.path);
      return res.status(404).json({
        success: false,
        error: 'Denuncia no encontrada'
      });
    }

    // Crear registro de evidencia
    const evidencia = await Evidencia.create({
      tipo: getTipoEvidencia(file.mimetype),
      url: `/uploads/${file.filename}`,
      nombreArchivo: file.originalname,
      tamano: file.size,
      formato: path.extname(file.originalname).substring(1),
      denunciaId: id
    });

    res.status(201).json({
      success: true,
      data: evidencia
    });
  } catch (error) {
    // Eliminar el archivo si hay error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Eliminar evidencia
const deleteEvidencia = async (req, res, next) => {
  try {
    const { id, evidenciaId } = req.params;

    // Verificar que la denuncia existe y pertenece al usuario
    const denuncia = await Denuncia.findOne({
      where: {
        id,
        userId: req.user.role === 'ROLE_USER' ? req.user.id : undefined
      }
    });

    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: 'Denuncia no encontrada'
      });
    }

    // Buscar y eliminar la evidencia
    const evidencia = await Evidencia.findOne({
      where: {
        id: evidenciaId,
        denunciaId: id
      }
    });

    if (!evidencia) {
      return res.status(404).json({
        success: false,
        error: 'Evidencia no encontrada'
      });
    }

    // Eliminar archivo físico
    const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', path.basename(evidencia.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar registro de la base de datos
    await evidencia.destroy();

    res.json({
      success: true,
      message: 'Evidencia eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las evidencias de una denuncia
const getEvidencias = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que la denuncia existe y pertenece al usuario
    const denuncia = await Denuncia.findOne({
      where: {
        id,
        userId: req.user.role === 'ROLE_USER' ? req.user.id : undefined
      }
    });

    if (!denuncia) {
      return res.status(404).json({
        success: false,
        error: 'Denuncia no encontrada'
      });
    }

    const evidencias = await Evidencia.findAll({
      where: { denunciaId: id }
    });

    res.json({
      success: true,
      data: evidencias
    });
  } catch (error) {
    next(error);
  }
};

// Función auxiliar para determinar el tipo de evidencia
const getTipoEvidencia = (mimeType) => {
  const tipos = {
    'image/jpeg': 'IMAGEN',
    'image/png': 'IMAGEN',
    'image/gif': 'IMAGEN',
    'video/mp4': 'VIDEO',
    'audio/mpeg': 'AUDIO',
    'audio/wav': 'AUDIO'
  };
  return tipos[mimeType] || 'OTRO';
};

module.exports = {
  addEvidencia,
  deleteEvidencia,
  getEvidencias
}; 