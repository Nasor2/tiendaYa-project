// middlewares/verificarToken.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    req.user = decoded; // Guardamos la información del usuario decodificada en la solicitud
    next();
  });
};

module.exports = verificarToken;
