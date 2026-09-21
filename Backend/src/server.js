const { app } = require('./app');
const env = require('./config/env');
const { getPool } = require('./db/pool');

async function start() {
  await getPool();
  app.listen(env.port, () => {
    console.log(`API lista en http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});
