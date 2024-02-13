import { Router } from 'express';
import { CategoryController } from './category.controller';
import auth from '../../middlewares/auth';

const CategoryRouter = Router();

// GET
CategoryRouter.get('/', auth(), CategoryController.getAllCategories);

// POST
CategoryRouter.post('/', auth(), CategoryController.createCategory);

export default CategoryRouter;
