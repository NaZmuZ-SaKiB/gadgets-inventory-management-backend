import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ProductController } from './product.controller';

const ProductRouter = Router();

// GET
ProductRouter.get('/', auth(), ProductController.getAllProducts);
ProductRouter.get('/stock-count', auth(), ProductController.getProductsCount);
ProductRouter.get(
  '/purchase-count',
  auth(),
  ProductController.getProductCountPurchasedThisMonth,
);
ProductRouter.get('/:id', auth(), ProductController.getProductById);

// POST
ProductRouter.post('/', auth(), ProductController.createProduct);

// PATCH
ProductRouter.patch('/:id', auth(), ProductController.updateProduct);

// DELETE
ProductRouter.delete('/', auth(), ProductController.deleteProducts);

export default ProductRouter;
