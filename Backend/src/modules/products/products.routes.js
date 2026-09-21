const { Router } = require('express');
const productsController = require('./products.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', productsController.list);
router.post('/', upload.single('image'), productsController.create);
router.put('/:id', upload.single('image'), productsController.update);
router.delete('/:id', productsController.remove);

module.exports = router;
