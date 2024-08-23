import { Router } from 'express';
import DatabaseConnection from '@/core/db';
import { authGuard } from '@/middleware/auth.guard';
import TaskRepository from '@/repository/task';
import TaskController from '@/controller/task';

export const taskRoutes = () => {
  const repository = new TaskRepository(DatabaseConnection.getInstance());
  const controller = new TaskController(repository);

  const router = Router();

  router.post('/', authGuard, controller.createTask);

  router.patch('/', authGuard, controller.updateTask);

  router.get('/', authGuard, controller.getTasks);

  router.delete('/:id', authGuard, controller.deleteTask);

  return router;
};
