/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import TaskRepository from '@/repository/task';
import { bearerSplitter } from '@/utils/bearerSplitter';
import Token from '@/utils/Token';
import { parseZodError } from '@/utils/zodErrorParse';
import DatabaseConnection from '@/core/db';
import { Procedure } from '@/core/trpc';

import {
  MutationProcedure,
  QueryProcedure,
} from '@trpc/server/unstable-core-do-not-import';

const taskRepository = new TaskRepository(DatabaseConnection.getInstance());

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

type TaskDto = {
  title: string | null;
  description: string | null;
  id: string;
  done: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string | null;
};

type TaskTrpcRouteReturnType = {
  getTasks: QueryProcedure<{
    input: void;
    output: TaskDto[];
  }>;

  createTask: MutationProcedure<{
    input: z.infer<typeof createTaskSchema>;
    output: { success: boolean };
  }>;

  deleteTask: MutationProcedure<{
    input: { id: string };
    output: { message: string };
  }>;

  updateTask: MutationProcedure<{
    input: z.infer<typeof updateTaskSchema>;
    output: { message: string };
  }>;
};

export const taskTrpcRoute = (
  procedure: Procedure
): TaskTrpcRouteReturnType => {
  return {
    getTasks: procedure.query(async ({ ctx }) => {
      const token = bearerSplitter(ctx.req.headers.authorization || '');
      const payload = Token.decodeToken(token);

      try {
        const tasks = await taskRepository.getTasks(payload.id as string);
        return tasks;
      } catch (error) {
        return [];
      }
    }),

    createTask: procedure
      .input(createTaskSchema)
      .mutation(async ({ input, ctx }) => {
        const token = bearerSplitter(ctx.req.headers.authorization || '');
        const payload = Token.decodeToken(token);

        try {
          await taskRepository.createTask({
            userId: payload.id as string,
            title: input.title,
            description: input.description,
          });
          return { success: true };
        } catch (error: any) {
          if (error instanceof z.ZodError) {
            throw new Error(JSON.stringify(parseZodError(error)));
          }
          throw new Error(error.message);
        }
      }),

    deleteTask: procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          await taskRepository.deleteTask(input.id);
          return { message: 'Task deleted successfully' };
        } catch (error: any) {
          throw new Error(error.message);
        }
      }),

    updateTask: procedure
      .input(updateTaskSchema)
      .mutation(async ({ input }) => {
        try {
          await taskRepository.updateTask({
            id: input.id,
            title: input.title,
            description: input.description,
            done: input.done,
          });
          return { message: 'Task updated successfully' };
        } catch (error: any) {
          if (error instanceof z.ZodError) {
            throw new Error(JSON.stringify(parseZodError(error)));
          }
          throw new Error(error.message);
        }
      }),
  };
};
