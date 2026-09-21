const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Solo se permiten imágenes JPG, PNG o WEBP');
      error.status = 400;
      error.field = 'image';
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = { upload, uploadsDir };
