import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string({
    message: 'Title is required',
  }),
  description: z.string({
    message: 'Description is required',
  }),
});

export const updateTaskSchema = z.object({
  id: z.string({
    message: 'Id is required',
  }),
  title: z.string({
    message: 'Title is required',
  }),
  description: z.string({
    message: 'Description is required',
  }),
  done: z.boolean({
    message: 'Done is required',
  }),
});
