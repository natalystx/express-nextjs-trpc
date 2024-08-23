import DatabaseConnection from '@/core/db';
import { users } from '@/schema';
import { eq } from 'drizzle-orm';

export default class UserRepository {
  private _db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this._db = db;
  }

  async createUser(name: string, email: string, password: string) {
    await this._db.getDb().insert(users).values({
      name,
      email,
      password,
    });

    return users;
  }

  async getUserByEmail(email: string) {
    return this._db.getDb().query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async deleteUser(id: string) {
    return this._db.getDb().delete(users).where(eq(users.id, id));
  }
}
