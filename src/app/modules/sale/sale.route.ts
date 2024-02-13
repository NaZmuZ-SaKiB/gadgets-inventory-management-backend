import { Router } from 'express';
import auth from '../../middlewares/auth';
import { SaleController } from './sale.controller';

const SaleRouter = Router();

// GET
SaleRouter.get('/', auth, SaleController.getAllSales);

// POST
SaleRouter.post('/', auth, SaleController.createSale);

export default SaleRouter;
