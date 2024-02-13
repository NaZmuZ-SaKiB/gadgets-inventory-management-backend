import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';

const UserRouter = Router();

// GET
UserRouter.get('/status', auth, UserController.isUserLoggedIn);

// POST
UserRouter.post('/sign-up', UserController.signup);
UserRouter.post('/sign-in', UserController.signin);
UserRouter.post('/sign-out', UserController.logout);

export default UserRouter;
