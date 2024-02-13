import { Router } from 'express';
import { BrandController } from './brand.controller';
import auth from '../../middlewares/auth';

const BrandRouter = Router();

// GET
BrandRouter.get('/', auth(), BrandController.getAllBrands);

// POST
BrandRouter.post('/', auth(), BrandController.createBrand);

export default BrandRouter;
