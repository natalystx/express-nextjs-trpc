import { z } from 'zod';

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
