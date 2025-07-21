import { Button } from "@/components/atomic/Button";
import { StatusBadge } from "@/components/atomic/StatusBadge";
import { TabElement } from "@/components/atomic/TabElement";
import { Header } from "@/components/Header";
import { ChevronLeft } from "lucide-react";

export default function MachineInfoPage() {
  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="bg-[#F2f2f2] w-full flex items-center justify-between px-20 py-9 shadow-sm">
        <span className="flex gap-3 items-center">
          <a href="/machines">
            <ChevronLeft size={30} />
          </a>
          <h2 className="font-bold text-3xl">Máquina XYZ</h2>
        </span>
        <span className="flex gap-2">
          <Button variant="ghost">Alterar senha</Button>
          <Button variant="primary">Acessar console</Button>
        </span>
      </div>
      <div className="flex flex-col justify-center px-20 mt-16">
        <div className="">
          <ul
            role="tablist"
            className="flex gap-9 border-b flex flex-row justify-center font-medium"
          >
            <TabElement name="Informações básicas" selected={true} />
            <TabElement name="Desempenho" selected={false} />
            <TabElement name="Gerenciar discos" selected={false} />
          </ul>
          <div className="mt-5 grid grid-cols-4 grid-rows-3 gap-y-12 mt-10">
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Sistema operacional</p>
              Windows 11
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Status</p>
              <StatusBadge status="Rodando" pclassName="inline-flex w-fit" />
            </span>{" "}
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">IP</p>
              192.168.1.1
            </span>{" "}
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Rede</p>
              Rede XYZ
            </span>{" "}
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Offer</p>
              Small Offer
            </span>{" "}
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Memória</p>8 GB
            </span>{" "}
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">CPU</p>
              1x 3Hz
            </span>{" "}
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Disco</p>
              200 GB
            </span>{" "}
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Criação</p>
              13/12/25 - 00:00:00
            </span>{" "}
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Última modificação</p>
              13/12/25 - 07:12:00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
