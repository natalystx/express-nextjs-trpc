import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default class Token {
  static generateToken(
    payload: Record<string, unknown>,
    expiresIn = '1d'
  ): string {
    return Jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn });
  }

  static verifyToken(token: string): Record<string, unknown> {
    const res = Jwt.verify(token, process.env.JWT_SECRET || '') as Record<
      string,
      unknown
    >;

    return res;
  }

  static decodeToken(token: string): Record<string, unknown> {
    return Jwt.decode(token) as Record<string, unknown>;
  }
}
