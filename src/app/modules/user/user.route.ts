import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const UserRouter = Router();

// GET
UserRouter.get('/', auth(USER_ROLE.MANAGER), UserController.getAllUsers);
UserRouter.get('/status', auth(), UserController.isUserLoggedIn);

// POST
UserRouter.post('/sign-up', UserController.signup);
UserRouter.post('/sign-in', UserController.signin);
UserRouter.post('/sign-out', UserController.logout);

// PATCH
UserRouter.patch(
  '/assign-manager/:userId',
  auth(USER_ROLE.MANAGER),
  UserController.assignManager,
);
export default UserRouter;
