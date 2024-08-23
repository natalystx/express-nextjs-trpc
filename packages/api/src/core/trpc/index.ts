/* eslint-disable no-extra-boolean-cast */
import { initTRPC } from '@trpc/server';
import { Request, Response } from 'express';
import Token from '@/utils/Token';
import { bearerSplitter } from '@/utils/bearerSplitter';

const trpc = initTRPC.context<{ req: Request; res: Response }>().create();
export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const privateProcedure = trpc.procedure.use((opts) => {
  const user = Token.verifyToken(
    bearerSplitter(opts.ctx.req.headers.authorization || '')
  );
  if (!user?.id) {
    throw new Error('Unauthorized');
  }
  return opts.next();
});

export type Procedure = typeof publicProcedure;
