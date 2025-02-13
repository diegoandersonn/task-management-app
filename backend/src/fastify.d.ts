import { TaskDatabase } from "./db/task-database";

declare module "fastify" {
  interface FastifyInstance {
    taskDatabase: TaskDatabase;
  }
}
