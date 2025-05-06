const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

module.exports = {
  verifyToken
}; 