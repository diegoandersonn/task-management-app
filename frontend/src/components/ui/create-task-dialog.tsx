import { Task, TasksEnum } from "../../../../shared/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { forwardRef } from "react";
import { X } from "lucide-react";
import z from "zod";
import { useMutation } from "@tanstack/react-query";

const taskSchema = z.object({
  title: z.string().nonempty("É obrigatório a tarefa ter um titulo!"),
  description: z.string().nonempty("É obrigatório a tarefa ter uma descrição!"),
  status: z.string().nonempty("É obrigatório a tarefa ter um status!"),
  id: z.string().optional(),
});

type TaskSchema = z.infer<typeof taskSchema>;

const CreateTaskDialog = forwardRef<HTMLDialogElement>((_, ref) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const createTask = useMutation({
    mutationFn: async (task: Task) => {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        console.log("criado");
        reset();
      }
    },
  });
  function toggleDialog() {
    if (ref && typeof ref !== "function" && ref.current) {
      ref.current.close();
    }
  }
  function handleTask(data: TaskSchema) {
    const newTask: Task = {
      ...data,
      id: uuidv4(),
      status: data.status as TasksEnum,
    };
    createTask.mutate(newTask);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
  });
  return (
    <dialog
      ref={ref}
      className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] rounded-md gap-6 p-6 text-zinc-700"
    >
      <div className="flex flex-col gap-6">
        <div className="flex gap-6 items-center justify-between">
          <h1 className="font-bold text-xl uppercase">Criar Tarefa</h1>
          <button
            className="cursor-pointer flex items-center p-2 hover:text-zinc-400 hover:scale-110"
            onClick={toggleDialog}
          >
            <p className="font-bold">Fechar</p>
            <X size={24} />
          </button>
        </div>
        <form
          action="POST"
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(handleTask)}
        >
          <input
            type="text"
            placeholder="Título"
            className="p-1 border border-zinc-400 rounded-md outline-none hover:scale-110 hover:border-zinc-600"
            {...register("title")}
          />
          <p>{errors.title?.message}</p>
          <input
            type="text"
            placeholder="Descrição"
            className="p-1 border border-zinc-400 rounded-md outline-none hover:scale-110 hover:border-zinc-600"
            {...register("description")}
          />
          <p>{errors.description?.message}</p>
          <select
            className="p-1 border border-zinc-400 rounded-md outline-none hover:scale-110 hover:border-zinc-600"
            {...register("status")}
          >
            <option value="">Status</option>
            <option value="pending">Pendente</option>
            <option value="in-progress">Em Andamento</option>
            <option value="done">Feito</option>
          </select>
          <p>{errors.status?.message}</p>
          <button
            type="submit"
            className="p-1 border border-zinc-400 rounded-md outline-none cursor-pointer hover:scale-110 hover:border-zinc-600"
          >
            Enviar
          </button>
        </form>
      </div>
    </dialog>
  );
});

export default CreateTaskDialog;
