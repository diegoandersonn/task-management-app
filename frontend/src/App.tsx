import "./App.css";
import { Plus } from "lucide-react";

function App() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-300">
      <div className="max-w-[1200px] min-h-[80vh] w-full p-6 px-8 bg-white rounded-xl shadow-md shadow-black flex flex-col gap-4 text-zinc-700">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold uppercase ">Tarefas</h1>
          <button className="cursor-pointer flex items-center p-2 hover:text-zinc-400 hover:scale-110">
            <p className="font-bold text-xl">Adicionar</p>
            <Plus size={32} />
          </button>
        </div>
        <div className="flex justify-center gap-12">
          <div className="text-xl font-semibold">Pendente</div>
          <div className="text-xl font-semibold">Em Andamento</div>
          <div className="text-xl font-semibold">Feito</div>
        </div>
      </div>
    </div>
  );
}

export default App;
