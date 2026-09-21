const authService = require('./auth.service');
const { httpError } = require('../../utils/httpError');

function validateRegister(body) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!name) throw httpError(400, 'El nombre es obligatorio', 'name');
  if (name.length < 2) throw httpError(400, 'El nombre debe tener al menos 2 caracteres', 'name');
  if (!email) throw httpError(400, 'El email es obligatorio', 'email');
  if (!email.includes('@')) throw httpError(400, 'Email inválido', 'email');
  if (!password) throw httpError(400, 'La contraseña es obligatoria', 'password');
  if (password.length < 6) throw httpError(400, 'La contraseña debe tener al menos 6 caracteres', 'password');

  return { name, email, password };
}

function validateLogin(body) {
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email) throw httpError(400, 'El email es obligatorio', 'email');
  if (!password) throw httpError(400, 'La contraseña es obligatoria', 'password');

  return { email, password };
}

async function register(req, res, next) {
  try {
    const data = validateRegister(req.body);
    const result = await authService.register(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = validateLogin(req.body);
    const result = await authService.login(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
