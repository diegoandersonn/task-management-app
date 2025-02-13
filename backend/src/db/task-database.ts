import { Task } from "../../../shared/types/task";

export class TaskDatabase {
  #tasks: Map<string, Task> = new Map();

  create(task: Task) {
    this.#tasks.set(task.id, task);
  }

  list() {
    return Array.from(this.#tasks.entries()).map(([id, task]) => {
      return { ...task };
    });
  }

  delete(taskId: string) {
    this.#tasks.delete(taskId);
  }

  update(taskId: string, task: Task) {
    this.#tasks.set(taskId, task);
  }
}
