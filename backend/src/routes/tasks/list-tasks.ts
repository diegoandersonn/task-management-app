import { FastifyInstance } from "fastify";

export default async function ListTasks(server: FastifyInstance) {
  server.get("/tasks", (request, reply) => {
    const tasks = server.taskDatabase.list();
    return tasks;
  });
}
