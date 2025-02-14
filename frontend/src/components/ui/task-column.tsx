import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash, Check, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { Task, TasksEnum } from "../../../../shared/types/task";

type Props = {
  status: TasksEnum;
  title: string;
};

enum ModeEnum {
  Edit = "edit",
  Delete = "delete",
  Default = "default",
  Change = "change",
}

export default function TaskColumn({ status, title }: Props) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["get-tasks"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/tasks`);
      return await response.json();
    },
  });

  const queryClient = useQueryClient();
  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-tasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({
      field,
      value,
      task,
    }: {
      field: string;
      value: string;
      task: Task;
    }) => {
      if (!value) {
        alert("O campo " + field + " é obrigatório");
        return;
      }
      const updatedTask = { ...task, [field]: value };
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-tasks"] });
    },
  });

  const changeTaskStatus = useMutation({
    mutationFn: async (task: Task) => {
      if (task.status === TasksEnum.Pending) {
        task.status = TasksEnum.InProgress;
      } else if (task.status === TasksEnum.InProgress) {
        task.status = TasksEnum.Done;
      } else {
        task.status = TasksEnum.Pending;
      }
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const [modeState, setModeState] = useState<ModeEnum>(ModeEnum.Default);
  function toggleMode(mode: ModeEnum) {
    if (mode === modeState) {
      setModeState(ModeEnum.Default);
      setEditingTask(null);
    } else {
      setModeState(mode);
      setEditingTask(null);
    }
  }

  const [editingTask, setEditingTask] = useState<string | null>(null);
  function toggleEdit(taskId: string) {
    if (editingTask) {
      setEditingTask(null);
    } else {
      setEditingTask(taskId);
    }
  }

  function filterTasks(tasks: Task[]) {
    return tasks.filter((task) => task.status === status);
  }

  return (
    <div className="text-zinc-600 font-semibold bg-zinc-300 p-5 rounded-md flex flex-col gap-2 h-[70vh] w-[400px] overflow-y-scroll scrollbar-thumb">
      <div className="text-lg flex p-1 gap-2 justify-between items-center">
        <div className="flex gap-1 items-center">
          <h1>{title}</h1>
          {/* <div className="bg-zinc-400 flex items-center justify-center w-6 h-6 rounded-full text-sm">
            {tasks ? filterTasks(tasks).length : 0}
          </div> */}
        </div>
        <div className="flex gap-1.5">
          <button
            className="cursor-pointer rounded-full bg-zinc-400 flex items-center p-2 hover:text-zinc-100 hover:scale-110 data-[active=true]:text-zinc-100"
            onClick={() => toggleMode(ModeEnum.Change)}
            data-active={modeState === ModeEnum.Change}
          >
            <ArrowRightLeft size={16} />
          </button>
          <button
            className="cursor-pointer rounded-full bg-zinc-400 flex items-center p-2 hover:text-zinc-100 hover:scale-110 data-[active=true]:text-zinc-100"
            onClick={() => toggleMode(ModeEnum.Edit)}
            data-active={modeState === ModeEnum.Edit}
          >
            <Pencil size={16} />
          </button>
          <button
            className="cursor-pointer rounded-full bg-zinc-400 flex items-center p-2 hover:text-zinc-100 hover:scale-110 data-[active=true]:text-zinc-100"
            onClick={() => toggleMode(ModeEnum.Delete)}
            data-active={modeState === ModeEnum.Delete}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {tasks ? (
          filterTasks(tasks).map((task) => (
            <div
              key={task.id}
              className="bg-zinc-100 p-2 rounded-md text-base overflow-hidden break-words flex justify-between items-center gap-2"
            >
              <div className="flex flex-col gap-1 overflow-hidden break-words w-[80%]">
                {editingTask === task.id ? (
                  <>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) =>
                        updateTask.mutate({
                          field: "title",
                          value: e.target.value,
                          task: task,
                        })
                      }
                      className="border-b outline-none"
                    />
                    <input
                      type="text"
                      value={task.description}
                      onChange={(e) =>
                        updateTask.mutate({
                          field: "description",
                          value: e.target.value,
                          task: task,
                        })
                      }
                      className="border-b outline-none text-zinc-500 text-sm"
                    />
                  </>
                ) : (
                  <>
                    <h2>Título: {task.title}</h2>
                    <p className="text-zinc-500 text-sm">
                      Descrição: {task.description}
                    </p>
                  </>
                )}
              </div>
              <div className="flex">
                {modeState === ModeEnum.Delete ? (
                  <Trash
                    size={20}
                    className="cursor-pointer hover:text-zinc-400 hover:scale-110"
                    onClick={() => deleteTask.mutate(task.id)}
                  />
                ) : modeState === ModeEnum.Edit ? (
                  <div>
                    <Pencil
                      size={20}
                      className="cursor-pointer hover:text-zinc-400 hover:scale-120"
                      onClick={() => toggleEdit(task.id)}
                    />
                    <Check
                      size={24}
                      className="cursor-pointer hover:text-zinc-400 hover:scale-120"
                    />
                  </div>
                ) : modeState === ModeEnum.Change ? (
                  <ArrowRightLeft
                    size={20}
                    className="cursor-pointer hover:text-zinc-400 hover:scale-110"
                    onClick={() => changeTaskStatus.mutate(task)}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Carregando tarefas...</p>
        )}
      </div>
    </div>
  );
}
