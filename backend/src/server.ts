import { fastify } from "fastify";
import { TaskDatabase } from "./db/task-database";
import Routes from "./routes";
import fastifyCors from "@fastify/cors";

export const server = fastify();
const taskDatabase = new TaskDatabase();

server.register(Routes);
server.decorate("taskDatabase", taskDatabase);
server.register(fastifyCors, {
  origin: "http://localhost:5173",
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) console.log(err);
  console.log("Servidor rodando na porta 8080");
});
