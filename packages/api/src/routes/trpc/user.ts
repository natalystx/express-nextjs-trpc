/* eslint-disable @typescript-eslint/no-explicit-any */

import DatabaseConnection from '@/core/db';
import { Procedure } from '@/core/trpc';
import UserRepository from '@/repository/user';
import { bearerSplitter } from '@/utils/bearerSplitter';
import Hash from '@/utils/Hash';
import Token from '@/utils/Token';
import { parseZodError } from '@/utils/zodErrorParse';
import {
  MutationProcedure,
  QueryProcedure,
} from '@trpc/server/unstable-core-do-not-import';
import { z } from 'zod';

const userRepository = new UserRepository(DatabaseConnection.getInstance());

const responseMessage = z.object({
  message: z.string(),
  status: z.number(),
});

type UserDto = {
  name: string;
  email: string;
  id: string;
};

const tokenDto = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

type UserTrpcRouteReturnType = {
  register: MutationProcedure<{
    input: z.infer<typeof userApiSchemas.createUserInputSchema>;
    output: z.infer<typeof responseMessage>;
  }>;

  login: MutationProcedure<{
    input: z.infer<
      typeof userApiSchemas.checkUserByEmailAndPasswordInputSchema
    >;
    output: z.infer<typeof tokenDto>;
  }>;

  me: QueryProcedure<{
    input: void;
    output: UserDto;
  }>;

  delete: MutationProcedure<{
    input: void;
    output: z.infer<typeof responseMessage>;
  }>;
};

const createUserInputSchema = z
  .object({
    name: z.string({
      message: 'Name is required',
    }),
    email: z.string({
      message: 'Email is required',
    }),
    password: z.string({
      message: 'Password is required',
    }),
    confirmPassword: z.string({
      message: 'Confirm password is required',
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password and confirm password must be the same',
        path: ['confirmPassword'],
      });
    }
  });

const checkUserByEmailAndPasswordInputSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export const userApiSchemas = {
  createUserInputSchema,
  checkUserByEmailAndPasswordInputSchema,
};

export const userTrpcRoute = (
  publicProcedure: Procedure,
  privateProcedure: Procedure
): UserTrpcRouteReturnType => {
  return {
    login: publicProcedure
      .input(userApiSchemas.checkUserByEmailAndPasswordInputSchema)
      .output(tokenDto)
      .mutation(async ({ input }): Promise<z.infer<typeof tokenDto>> => {
        try {
          const user = await userRepository.getUserByEmail(input.email);
          if (!user?.id) {
            throw new Error('Invalid password');
          }

          if (!Hash.comparePassword(input.password, user.password!)) {
            throw new Error('Invalid password');
          }

          return {
            accessToken: Token.generateToken(user),
            refreshToken: Token.generateToken(user, '7d'),
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      }),
    register: publicProcedure
      .input(userApiSchemas.createUserInputSchema)
      .output(responseMessage)
      .mutation(async ({ input }) => {
        try {
          await userRepository.createUser(
            input.name,
            input.email,
            Hash.hashPassword(input.password)
          );
          return { message: 'User created successfully', status: 201 };
        } catch (error: any) {
          if (error instanceof z.ZodError) {
            return {
              message: JSON.stringify(parseZodError(error)),
              status: 400,
            };
          }

          return { message: error.message, status: 400 };
        }
      }),

    me: privateProcedure
      .output(
        z.object({
          name: z.string(),
          email: z.string(),
          id: z.string(),
        })
      )
      .query(async ({ ctx }) => {
        const authorization = ctx.req.headers.authorization || '';
        const token = bearerSplitter(authorization);
        const decode = Token.decodeToken(token);
        const user = await userRepository.getUserByEmail(
          decode.email as string
        );

        if (!user) {
          throw new Error('User not found');
        }

        return {
          name: user.name,
          email: user.email,
          id: user.id,
        } as UserDto;
      }),

    delete: privateProcedure
      .output(responseMessage)
      .mutation(async ({ ctx }) => {
        try {
          const authorization = ctx.req.headers.authorization || '';
          const token = bearerSplitter(authorization);

          const decode = Token.decodeToken(token);
          await userRepository.deleteUser(decode.id as string);
          return { message: 'User deleted successfully', status: 200 };
        } catch (error: any) {
          return { message: error.message, status: 400 };
        }
      }),
  };
};
