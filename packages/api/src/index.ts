import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import express from 'express';
import { userRoutes } from './routes/user';
import { taskRoutes } from './routes/task';
import { router, publicProcedure, privateProcedure } from './core/trpc';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { userTrpcRoute } from './routes/trpc/user';
import { taskTrpcRoute } from './routes/trpc/task';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

export const appRouter = router({
  ...userTrpcRoute(publicProcedure, privateProcedure),
  ...taskTrpcRoute(privateProcedure),
});

app.use('/user', userRoutes());
app.use('/tasks', taskRoutes());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ req, res }),
  })
);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});

export type AppRouter = typeof appRouter;
