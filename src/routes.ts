import { Router } from 'express';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import authMiddleware from '../config/auth';
import ProfileController from './controllers/ProfileController';
import FeedBackController from './controllers/FeedBackController';
import PlanController from './controllers/PlanController';

const routes = Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/feedback', FeedBackController.store);
routes.post('/plan', PlanController.store);
routes.get('/plan', PlanController.getAll);
routes.get('/feedback', FeedBackController.getAll);
routes.get('/profiles', ProfileController.getAll);
routes.get('/profiles/:id', ProfileController.getById);
//routes.use(authMiddleware);
routes.post('/users', UserController.update);
routes.get('/users', UserController.getAll);

export default routes;
