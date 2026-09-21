require('dotenv').config();

function env(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

const trustedConnection = env('DB_TRUSTED_CONNECTION', 'true') === 'true';

const db = {
  server: env('DB_SERVER', 'localhost'),
  database: env('DB_DATABASE', 'Supermarket'),
  options: {
    trustedConnection,
    encrypt: env('DB_ENCRYPT', 'false') === 'true',
    trustServerCertificate: env('DB_TRUST_CERT', 'true') !== 'false',
  },
};

if (!trustedConnection) {
  db.user = env('DB_USER', 'sa');
  db.password = env('DB_PASSWORD');
  db.port = Number(env('DB_PORT', '1433'));
}

module.exports = {
  port: Number(env('PORT', '4000')),
  jwtSecret: env('JWT_SECRET'),
  jwtExpiresIn: env('JWT_EXPIRES_IN', '8h'),
  db,
};
