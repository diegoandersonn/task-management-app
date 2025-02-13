import { FastifyInstance } from "fastify";

export default async function DeleteTask(server: FastifyInstance) {
  server.delete<{ Params: { id: string } }>("/tasks/:id", (request, reply) => {
    const id = request.params.id;
    server.taskDatabase.delete(id);
    reply.status(204).send();
  });
}
