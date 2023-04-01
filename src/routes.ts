import { Router } from 'express';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import authMiddleware from '../config/auth';
import ProfileController from './controllers/ProfileController';
import FeedBackController from './controllers/FeedBackController';

const routes = Router();

routes.post('/users', UserController.store);
routes.post('/feedback', FeedBackController.store);
routes.get('/profiles', ProfileController.getAll);
routes.get('/profiles/:id', ProfileController.getById);
routes.post('/sessions', SessionController.store);
//routes.use(authMiddleware);
routes.post('/users', UserController.update);
routes.get('/users', UserController.getAll);

export default routes;
