"use client";

import { Button } from "@/components/atomic/Button";
import { StatusBadge } from "@/components/atomic/StatusBadge";
import { TabElement } from "@/components/atomic/TabElement";
import { Header } from "@/components/Header";
import { useVMStore, VirtualMachine } from "@/stores/vm-store";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MachineInfoPage() {
  const { machines } = useVMStore();
  const params = useParams();
  const machineId = params.machineId as string;
  const [machine, setMachine] = useState<VirtualMachine | null>(null);

  useEffect(() => {
    if (machines.length > 0 && machineId) {
      const foundMachine = machines.find((m) => m.id === machineId);
      setMachine(foundMachine || null);
    }
  }, [machineId, machines]);

  if (!machine) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex items-center justify-center h-full">
          <p>Machine not found or still loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="bg-[#F2f2f2] w-full flex items-center justify-between px-20 py-9 shadow-sm">
        <span className="flex gap-3 items-center">
          <Link href="/machines">
            <ChevronLeft size={30} />
          </Link>
          <h2 className="font-bold text-3xl">{machine.name}</h2>
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
              {machine.os}
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Status</p>
              <StatusBadge
                status={machine.state}
                pclassName="inline-flex w-fit"
              />
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">IP</p>
              {machine.ipAddress}
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Rede</p>
              Rede XYZ
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Offer</p>
              {machine.instance.name}
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Memória</p>
              {machine.instance.memory}
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">CPU</p>
              {machine.instance.cpu}
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Disco</p>
              {machine.instance.disk}
            </span>
            <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
              <p className="font-normal text-sm ">Criação</p>
              13/12/25 - 00:00:00
            </span>
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
