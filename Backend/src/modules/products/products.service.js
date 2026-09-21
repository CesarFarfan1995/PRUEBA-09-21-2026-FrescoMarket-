const fs = require('fs');
const path = require('path');
const { getPool, sql } = require('../../db/pool');
const { httpError } = require('../../utils/httpError');
const { uploadsDir } = require('../../middleware/upload.middleware');

const STATUSES = ['disponible', 'agotado', 'descontinuado'];

function toProduct(row) {
  return {
    id: row.Id,
    userId: row.UserId,
    name: row.Name,
    image: row.ImagePath,
    price: Number(row.Price),
    status: row.Status,
    expirationDate: row.ExpirationDate,
    description: row.Description,
    createdAt: row.CreatedAt,
    updatedAt: row.UpdatedAt,
  };
}

function deleteImageFile(imagePath) {
  if (!imagePath) return;
  const filename = path.basename(imagePath);
  const fullPath = path.join(uploadsDir, filename);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

async function list(userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT Id, UserId, Name, ImagePath, Price, Status, ExpirationDate, Description, CreatedAt, UpdatedAt
      FROM Products
      WHERE UserId = @userId
      ORDER BY CreatedAt DESC
    `);

  return result.recordset.map(toProduct);
}

async function create(userId, data) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('userId', sql.Int, userId)
    .input('name', sql.NVarChar(150), data.name)
    .input('imagePath', sql.NVarChar(255), data.imagePath)
    .input('price', sql.Decimal(10, 2), data.price)
    .input('status', sql.NVarChar(30), data.status)
    .input('expirationDate', sql.Date, data.expirationDate)
    .input('description', sql.NVarChar(500), data.description)
    .query(`
      INSERT INTO Products (UserId, Name, ImagePath, Price, Status, ExpirationDate, Description)
      OUTPUT INSERTED.Id, INSERTED.UserId, INSERTED.Name, INSERTED.ImagePath, INSERTED.Price,
             INSERTED.Status, INSERTED.ExpirationDate, INSERTED.Description, INSERTED.CreatedAt, INSERTED.UpdatedAt
      VALUES (@userId, @name, @imagePath, @price, @status, @expirationDate, @description)
    `);

  return toProduct(result.recordset[0]);
}

async function getOwned(id, userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('userId', sql.Int, userId)
    .query(`
      SELECT Id, UserId, Name, ImagePath, Price, Status, ExpirationDate, Description, CreatedAt, UpdatedAt
      FROM Products
      WHERE Id = @id AND UserId = @userId
    `);

  const row = result.recordset[0];
  if (!row) {
    throw httpError(404, 'Producto no encontrado');
  }

  return toProduct(row);
}

async function update(id, userId, data) {
  const current = await getOwned(id, userId);
  const imagePath = data.imagePath || current.image;

  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('userId', sql.Int, userId)
    .input('name', sql.NVarChar(150), data.name)
    .input('imagePath', sql.NVarChar(255), imagePath)
    .input('price', sql.Decimal(10, 2), data.price)
    .input('status', sql.NVarChar(30), data.status)
    .input('expirationDate', sql.Date, data.expirationDate)
    .input('description', sql.NVarChar(500), data.description)
    .query(`
      UPDATE Products
      SET Name = @name,
          ImagePath = @imagePath,
          Price = @price,
          Status = @status,
          ExpirationDate = @expirationDate,
          Description = @description,
          UpdatedAt = SYSUTCDATETIME()
      OUTPUT INSERTED.Id, INSERTED.UserId, INSERTED.Name, INSERTED.ImagePath, INSERTED.Price,
             INSERTED.Status, INSERTED.ExpirationDate, INSERTED.Description, INSERTED.CreatedAt, INSERTED.UpdatedAt
      WHERE Id = @id AND UserId = @userId
    `);

  if (data.imagePath && current.image !== data.imagePath) {
    deleteImageFile(current.image);
  }

  return toProduct(result.recordset[0]);
}

async function remove(id, userId) {
  const current = await getOwned(id, userId);
  const pool = await getPool();
  await pool
    .request()
    .input('id', sql.Int, id)
    .input('userId', sql.Int, userId)
    .query('DELETE FROM Products WHERE Id = @id AND UserId = @userId');

  deleteImageFile(current.image);
}

module.exports = { list, create, update, remove, STATUSES };
