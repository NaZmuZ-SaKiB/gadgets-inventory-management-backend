import { Router } from 'express';
import UserRouter from '../modules/user/user.route';
import BrandRouter from '../modules/brand/brand.route';
import CategoryRouter from '../modules/category/category.route';
import ProductRouter from '../modules/product/product.routes';
import SaleRouter from '../modules/sale/sale.route';

const MainRouter = Router();

type TRoute = {
  path: string;
  router: Router;
};

const routes: TRoute[] = [
  {
    path: '/users',
    router: UserRouter,
  },
  {
    path: '/brands',
    router: BrandRouter,
  },
  {
    path: '/categories',
    router: CategoryRouter,
  },
  {
    path: '/products',
    router: ProductRouter,
  },
  {
    path: '/sales',
    router: SaleRouter,
  },
];

routes.map((route) => MainRouter.use(route.path, route.router));

export default MainRouter;
