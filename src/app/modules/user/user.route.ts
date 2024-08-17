import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const UserRouter = Router();

// GET
UserRouter.get('/', auth(USER_ROLE.ADMIN), UserController.getAllUsers);
UserRouter.get('/status', auth(), UserController.isUserLoggedIn);
UserRouter.get('/chart-data', auth(), UserController.getDashboardChartsData);
UserRouter.get('/:id', auth(), UserController.getUserById);

// POST
UserRouter.post(
  '/sign-up',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  UserController.signup,
);
UserRouter.post('/sign-in', UserController.signin);
UserRouter.post('/sign-out', UserController.logout);

// PATCH
UserRouter.patch('/:id', auth(), UserController.updateUser);
UserRouter.patch(
  '/assign-manager/:userId',
  auth(USER_ROLE.ADMIN),
  UserController.assignManager,
);
export default UserRouter;
