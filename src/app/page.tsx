import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { VirtualMachinesTable } from "@/components/VirtualMachineTable";
import { Search, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex flex-col">
        {/* Seção do Cabeçalho do Dashboard */}
        <div className="p-8  bg-gradient-to-r from-[#EC9C1B] via-[#E2C31C] to-[#3AA3F5] text-white shadow-lg mb-8 h-50">
          <h1 className="text-4xl font-bold mb-4">Máquinas Virtuais</h1>
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-md">
              {/* <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              /> */}
            </div>
            <button className="flex items-center gap-2 bg-[#103759] hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <Plus size={20} />
              Nova Máquina
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  self-center px-6 -translate-y-20 bg-white w-91/100  h-23 rounded-xl shadow-sm ">
          <StatCard count={2} label="Total de máquinas" />
          <StatCard count={1} label="Máquinas ligadas" />
          <StatCard count={1} label="Máquinas desligadas" />
          <StatCard
            count={0}
            label="Status de Erro"
            color="text-green-500"
            last={true}
          />
        </div>

        {/* Seção de Estatísticas */}

        <div className="px-15 -translate-y-5">
          {/* Tabela de Máquinas Virtuais */}

          <VirtualMachinesTable />
        </div>
      </div>
    </div>
  );
}
