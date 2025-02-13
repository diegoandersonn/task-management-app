export enum TasksEnum {
  Pending = "pending",
  InProgress = "in-progress",
  Done = "done",
}

export type Task = {
  title: string;
  description: string;
  status: TasksEnum;
  id: string;
};
