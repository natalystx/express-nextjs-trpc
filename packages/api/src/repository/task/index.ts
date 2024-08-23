import DatabaseConnection from '@/core/db';
import { tasks } from '@/schema';
import { eq } from 'drizzle-orm';

export type TaskInput = {
  userId: string;
  title: string;
  description: string;
};

export type TaskUpdateInput = {
  id: string;
  title: string;
  description: string;
  done: boolean;
};

export default class TaskRepository {
  private _db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this._db = db;
  }

  async getTasks(userId: string) {
    return this._db.getDb().query.tasks.findMany({
      where: eq(tasks.userId, userId),
    });
  }

  async createTask({ title, description, userId }: TaskInput) {
    await this._db.getDb().insert(tasks).values({
      userId,
      title,
      description,
    });

    return tasks;
  }

  async deleteTask(id: string) {
    return this._db.getDb().delete(tasks).where(eq(tasks.id, id));
  }

  async updateTask({ description, done, title, id }: TaskUpdateInput) {
    return this._db
      .getDb()
      .update(tasks)
      .set({
        title,
        description,
        done,
      })
      .where(eq(tasks.id, id));
  }
}
