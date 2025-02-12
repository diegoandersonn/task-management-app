import { fastify } from "fastify";

const server = fastify();

server.listen({ port: 8080 }, (err, address) => {
  if (err) console.log(err);
  console.log("Servidor rodando na porta 8080");
});
