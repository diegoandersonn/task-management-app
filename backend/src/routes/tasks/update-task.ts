import { FastifyInstance } from "fastify";
import { Task } from "../../../../shared/types/task";

export default async function UpdateTask(server: FastifyInstance) {
  server.put<{ Params: { id: string }; Body: Task }>(
    "/tasks/:id",
    (request, reply) => {
      const task = request.body;
      const id = request.params.id;
      server.taskDatabase.update(id, task);
      reply.status(204).send();
    }
  );
}
