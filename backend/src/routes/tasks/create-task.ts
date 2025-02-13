import { FastifyInstance } from "fastify";
import { Task } from "../../../../shared/types/task";

export default async function CreateTask(server: FastifyInstance) {
  server.post<{ Body: Task }>("/tasks", (request, reply) => {
    const task = request.body;
    server.taskDatabase.create(task);
    reply.status(201).send(task);
  });
}
