import CreateTask from "./routes/tasks/create-task";
import DeleteTask from "./routes/tasks/delete-task";
import ListTasks from "./routes/tasks/list-tasks";
import UpdateTask from "./routes/tasks/update-task";
import { server } from "./server";

export default async function Routes() {
  server.register(CreateTask);
  server.register(ListTasks);
  server.register(DeleteTask);
  server.register(UpdateTask);
}
