const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Denuncia extends Model {
    static associate(models) {
      Denuncia.belongsTo(models.User, { foreignKey: 'userId' });
      Denuncia.hasMany(models.Evidencia, { foreignKey: 'denunciaId' });
    }
  }

  Denuncia.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tipoIncidente: {
      type: DataTypes.ENUM(
        'ROBO',
        'VANDALISMO',
        'AGRESION',
        'ACOSO',
        'OTRO'
      ),
      allowNull: false
    },
    fechaHora: {
      type: DataTypes.DATE,
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM(
        'PENDIENTE',
        'EN_PROCESO',
        'RESUELTA',
        'CERRADA'
      ),
      defaultValue: 'PENDIENTE'
    },
    prioridad: {
      type: DataTypes.ENUM(
        'BAJA',
        'MEDIA',
        'ALTA',
        'URGENTE'
      ),
      defaultValue: 'MEDIA'
    },
    asignadoA: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Denuncia'
  });

  return Denuncia;
}; 