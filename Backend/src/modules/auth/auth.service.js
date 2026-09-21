const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../../db/pool');
const { hashPassword, comparePassword } = require('../../utils/hash');
const { httpError } = require('../../utils/httpError');
const env = require('../../config/env');

function toUser(row) {
  return {
    id: row.Id,
    email: row.Email,
    name: row.Name,
  };
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

async function register({ name, email, password }) {
  const pool = await getPool();
  const existing = await pool
    .request()
    .input('email', sql.NVarChar(255), email)
    .query('SELECT Id FROM Users WHERE Email = @email');

  if (existing.recordset.length > 0) {
    throw httpError(409, 'Ya existe una cuenta con ese email', 'email');
  }

  const passwordHash = await hashPassword(password);
  const result = await pool
    .request()
    .input('email', sql.NVarChar(255), email)
    .input('passwordHash', sql.NVarChar(255), passwordHash)
    .input('name', sql.NVarChar(120), name)
    .query(`
      INSERT INTO Users (Email, PasswordHash, Name)
      OUTPUT INSERTED.Id, INSERTED.Email, INSERTED.Name
      VALUES (@email, @passwordHash, @name)
    `);

  const user = toUser(result.recordset[0]);
  return { user, token: createToken(user) };
}

async function login({ email, password }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('email', sql.NVarChar(255), email)
    .query('SELECT Id, Email, Name, PasswordHash FROM Users WHERE Email = @email');

  const row = result.recordset[0];
  if (!row) {
    throw httpError(401, 'Email o contraseña incorrectos', 'password');
  }

  const valid = await comparePassword(password, row.PasswordHash);
  if (!valid) {
    throw httpError(401, 'Email o contraseña incorrectos', 'password');
  }

  const user = toUser(row);
  return { user, token: createToken(user) };
}

module.exports = { register, login };
