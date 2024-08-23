import { Router } from 'express';
import UserController from '@/controller/user';
import DatabaseConnection from '@/core/db';
import UserRepository from '@/repository/user';
import { authGuard } from '@/middleware/auth.guard';

export const userRoutes = () => {
  const repository = new UserRepository(DatabaseConnection.getInstance());
  const controller = new UserController(repository);

  const router = Router();

  router.post('/register', controller.createUser);

  router.post('/login', controller.checkUserByEmailAndPassword);

  router.get('/me', authGuard, controller.getUserByEmail);

  router.delete('/delete', authGuard, controller.deleteUser);

  return router;
};
