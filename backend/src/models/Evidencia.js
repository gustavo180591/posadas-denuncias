const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Evidencia extends Model {}

Evidencia.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  denunciaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Denuncias',
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.ENUM('imagen', 'video'),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombreArchivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tamanio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Tamaño en bytes'
  },
  fechaSubida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Evidencia',
  indexes: [
    {
      fields: ['denunciaId']
    },
    {
      fields: ['tipo']
    }
  ]
});

module.exports = Evidencia; 