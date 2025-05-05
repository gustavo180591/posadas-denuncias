const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Denuncia = sequelize.define('Denuncia', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tipoIncidente: {
      type: DataTypes.ENUM('ROBO', 'VANDALISMO', 'AGRESION', 'ACOSO', 'OTRO'),
      allowNull: false
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('ubicacion');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('ubicacion', JSON.stringify(value));
      }
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
      type: DataTypes.ENUM('PENDIENTE', 'EN_PROCESO', 'RESUELTA', 'CERRADA'),
      defaultValue: 'PENDIENTE'
    },
    prioridad: {
      type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE'),
      defaultValue: 'MEDIA'
    },
    comisariasCercanas: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('comisariasCercanas');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('comisariasCercanas', JSON.stringify(value));
      }
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
    timestamps: true,
    paranoid: true
  });

  Denuncia.associate = (models) => {
    Denuncia.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Denuncia.hasMany(models.Evidencia, {
      foreignKey: 'denunciaId',
      as: 'evidencias'
    });
  };

  return Denuncia;
}; 