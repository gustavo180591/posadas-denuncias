const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Evidencia extends Model {
    static associate(models) {
      Evidencia.belongsTo(models.Denuncia, { foreignKey: 'denunciaId' });
    }
  }

  Evidencia.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tipo: {
      type: DataTypes.ENUM('IMAGEN', 'VIDEO', 'AUDIO'),
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
    tamano: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    formato: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Evidencia'
  });

  return Evidencia;
}; 