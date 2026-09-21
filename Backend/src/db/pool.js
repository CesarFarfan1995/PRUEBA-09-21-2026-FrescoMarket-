const sql = require('mssql/msnodesqlv8');
const env = require('../config/env');

let pool;

function buildConfig() {
  if (env.db.options.trustedConnection) {
    return {
      connectionString: [
        'Driver={ODBC Driver 18 for SQL Server}',
        `Server=${env.db.server}`,
        `Database=${env.db.database}`,
        'Trusted_Connection=Yes',
        'TrustServerCertificate=Yes',
      ].join(';'),
    };
  }

  return {
    server: env.db.server,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    driver: 'msnodesqlv8',
    options: env.db.options,
  };
}

async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(buildConfig());
  return pool;
}

module.exports = { getPool, sql };
