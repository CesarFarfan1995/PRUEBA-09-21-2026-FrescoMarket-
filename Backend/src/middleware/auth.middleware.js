const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = { authMiddleware };
