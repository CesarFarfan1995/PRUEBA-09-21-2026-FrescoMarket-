function errorMiddleware(err, _req, res, _next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'La imagen no puede superar 5 MB',
      field: 'image',
    });
  }

  const status = err.status || 500;
  const message = err.status ? err.message : 'Error interno del servidor';

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    message,
    field: err.field || null,
  });
}

module.exports = { errorMiddleware };
