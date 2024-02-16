import { Router } from 'express';
import auth from '../../middlewares/auth';
import { SaleController } from './sale.controller';

const SaleRouter = Router();

// GET
SaleRouter.get('/', auth(), SaleController.getAllSales);
SaleRouter.get('/count', auth(), SaleController.getSalesCount);

// POST
SaleRouter.post('/', auth(), SaleController.createSale);

export default SaleRouter;
