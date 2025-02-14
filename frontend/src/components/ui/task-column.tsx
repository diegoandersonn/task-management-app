import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
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

  const [modeState, setModeState] = useState<ModeEnum>(ModeEnum.Default);
  function toggleMode(mode: ModeEnum) {
    if (mode === modeState) {
      setModeState(ModeEnum.Default);
    } else {
      setModeState(mode);
    }
  }

  function filterTasks(tasks: Task[]) {
    return tasks.filter((task) => task.status === status);
  }

  return (
    <div className="text-xl text-zinc-600 font-semibold bg-zinc-300 p-5 rounded-md flex flex-col gap-2 min-w-[350px] h-[70vh] overflow-y-scroll scrollbar-thumb">
      <div className="text-2xl flex gap-8 justify-between items-center">
        <div className="flex gap-1 items-center">
          <h1>{title}</h1>
          <div className="bg-zinc-400 flex items-center justify-center w-6 h-6 rounded-full text-sm">
            {tasks ? filterTasks(tasks).length : 0}
          </div>
        </div>
        <div className="flex gap-1.5">
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
              className="bg-zinc-100 p-2 rounded-md text-base overflow-hidden break-words flex justify-between items-center gap-1.5"
            >
              <div className="overflow-hidden">
                <h2>Título: {task.title}</h2>
                <p>Descrição: {task.description}</p>
              </div>
              <div className="flex">
                {modeState === ModeEnum.Delete ? (
                  <>
                    <button
                      className="cursor-pointer hover:text-zinc-400 hover:scale-110"
                      onClick={() => deleteTask.mutate(task.id)}
                    >
                      <Trash size={20} />
                    </button>
                  </>
                ) : modeState === ModeEnum.Edit ? (
                  <>
                    <button className="cursor-pointer hover:text-zinc-400 hover:scale-110">
                      <Pencil size={20} />
                    </button>
                  </>
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
