import { Router } from 'express';
import { CategoryController } from './category.controller';
import auth from '../../middlewares/auth';

const CategoryRouter = Router();

// GET
CategoryRouter.get('/', auth(), CategoryController.getAllCategories);

// POST
CategoryRouter.post('/', auth(), CategoryController.createCategory);

// PATCH
CategoryRouter.patch('/:id', auth(), CategoryController.updateCategory);

export default CategoryRouter;
