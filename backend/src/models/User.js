const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class User extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^\d{7,8}$/
    }
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\d{10}$/
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fotoRostro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fotoDniFrente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fotoDniDorso: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'validado', 'rechazado'),
    defaultValue: 'pendiente'
  },
  rol: {
    type: DataTypes.ENUM('ciudadano', 'operador911', 'admin'),
    defaultValue: 'ciudadano'
  },
  ultimoAcceso: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User; 