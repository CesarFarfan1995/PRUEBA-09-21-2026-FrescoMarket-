const productsService = require('./products.service');
const { httpError } = require('../../utils/httpError');

function parseProductBody(body, { imageRequired }) {
  const name = String(body.name || '').trim();
  const price = Number(body.price);
  const status = String(body.status || '').trim();
  const description = String(body.description || '').trim() || null;
  const hasExpiration = body.hasExpiration === 'true' || body.hasExpiration === true;
  const expirationDate = hasExpiration && body.expirationDate ? body.expirationDate : null;

  if (!name) throw httpError(400, 'El nombre es obligatorio', 'name');
  if (name.length < 2) throw httpError(400, 'El nombre debe tener al menos 2 caracteres', 'name');
  if (body.price === undefined || body.price === '') {
    throw httpError(400, 'El precio es obligatorio', 'price');
  }
  if (Number.isNaN(price) || price <= 0) throw httpError(400, 'El precio debe ser mayor a 0', 'price');
  if (!status) throw httpError(400, 'El estado es obligatorio', 'status');
  if (!productsService.STATUSES.includes(status)) {
    throw httpError(400, 'Estado inválido', 'status');
  }
  if (hasExpiration && !expirationDate) {
    throw httpError(400, 'Indica la fecha de vencimiento', 'expirationDate');
  }
  if (imageRequired && !body.imagePath) {
    throw httpError(400, 'La imagen del producto es requerida', 'image');
  }

  return { name, price, status, description, expirationDate, imagePath: body.imagePath || null };
}

async function list(req, res, next) {
  try {
    const products = await productsService.list(req.user.id);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const data = parseProductBody({ ...req.body, imagePath }, { imageRequired: true });
    const product = await productsService.create(req.user.id, data);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const data = parseProductBody({ ...req.body, imagePath }, { imageRequired: false });
    const product = await productsService.update(Number(req.params.id), req.user.id, data);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await productsService.remove(Number(req.params.id), req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, update, remove };
