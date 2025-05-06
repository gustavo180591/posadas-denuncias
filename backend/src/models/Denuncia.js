const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Denuncia extends Model {}

Denuncia.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.ENUM(
      'robo',
      'hurto',
      'vandalismo',
      'acoso',
      'violencia',
      'otro'
    ),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  barrio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM(
      'recibida',
      'en_proceso',
      'resuelta',
      'archivada'
    ),
    defaultValue: 'recibida'
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ultimaActualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Denuncia',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['tipo']
    },
    {
      fields: ['barrio']
    }
  ]
});

module.exports = Denuncia; 