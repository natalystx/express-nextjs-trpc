/* eslint-disable @typescript-eslint/no-explicit-any */
import TaskRepository from '@/repository/task';
import { bearerSplitter } from '@/utils/bearerSplitter';
import Token from '@/utils/Token';
import { parseZodError } from '@/utils/zodErrorParse';
import { Request, Response } from 'express';
import { z } from 'zod';
import { createTaskSchema, updateTaskSchema } from './task.schema';

export default class TaskController {
  private _taskRepository: TaskRepository;
  constructor(taskRepository: TaskRepository) {
    this._taskRepository = taskRepository;
    this.createTask = this.createTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.getTasks = this.getTasks.bind(this);
  }

  async getTasks(req: Request, res: Response) {
    const token = bearerSplitter(req.headers.authorization || '');
    const payload = Token.decodeToken(token);
    try {
      const tasks = await this._taskRepository.getTasks(payload.id as string);

      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(200).json([]);
    }
  }

  async createTask(req: Request, res: Response) {
    const token = bearerSplitter(req.headers.authorization || '');
    const payload = Token.decodeToken(token);

    try {
      const data = createTaskSchema.parse(req.body);
      await this._taskRepository.createTask({
        userId: payload.id as string,
        title: data.title,
        description: data.description,
      });
      return res.status(201).json({ success: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(parseZodError(error));
      }

      return res.status(403).json({ message: error.message });
    }
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await this._taskRepository.deleteTask(id);
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      return res.status(403).json({ message: error.message });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const data = updateTaskSchema.parse(req.body);
      await this._taskRepository.updateTask({
        id: data.id,
        title: data.title,
        description: data.description,
        done: data.done,
      });
      return res.status(200).json({ message: 'Task updated successfully' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(parseZodError(error));
      }

      return res.status(403).json({ message: error.message });
    }
  }
}
