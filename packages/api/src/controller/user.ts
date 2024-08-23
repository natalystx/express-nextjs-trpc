/* eslint-disable @typescript-eslint/no-explicit-any */
import UserRepository from '@/repository/user';
import { bearerSplitter } from '@/utils/bearerSplitter';
import Hash from '@/utils/Hash';
import Token from '@/utils/Token';
import { parseZodError } from '@/utils/zodErrorParse';
import { Request, Response } from 'express';
import { z } from 'zod';
import { userApiSchemas } from './user.schema';

export default class UserController {
  private _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
    this.createUser = this.createUser.bind(this);
    this.checkUserByEmailAndPassword =
      this.checkUserByEmailAndPassword.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async createUser(req: Request, res: Response) {
    try {
      const data = userApiSchemas.createUserInputSchema.parse(req.body);
      await this._userRepository.createUser(
        data.name,
        data.email,
        Hash.hashPassword(data.password)
      );

      res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errorObj = parseZodError(error);
        res.status(400).json(errorObj);
      } else {
        res.status(403).json({ message: error.message });
      }
    }
  }

  async checkUserByEmailAndPassword(req: Request, res: Response) {
    try {
      const data = userApiSchemas.checkUserByEmailAndPasswordInputSchema.parse(
        req.body
      );
      const user = await this._userRepository.getUserByEmail(data.email);
      if (!user) {
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }

      if (!Hash.comparePassword(data.password, user.password!)) {
        throw new Error('Invalid password');
      }

      res.status(200).json({
        accessToken: Token.generateToken(user),
        refreshToken: Token.generateToken(user, '7d'),
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errorObj = parseZodError(error);
        res.status(400).json(errorObj);
      } else {
        res.status(403).json({ message: error.message });
      }
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    const token = bearerSplitter(req.headers.authorization || '');

    const decode = Token.decodeToken(token);
    const user = await this._userRepository.getUserByEmail(
      decode.email as string
    );

    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      id: user.id,
    });
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const token = bearerSplitter(req.headers.authorization || '');

      const decode = Token.decodeToken(token);
      await this._userRepository.deleteUser(decode.id as string);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  }
}
