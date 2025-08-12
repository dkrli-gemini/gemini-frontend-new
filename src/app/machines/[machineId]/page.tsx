"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { SearchInput } from "@/components/atomic/SearchInput";
import { StatusBadge } from "@/components/atomic/StatusBadge";
import { TabElement } from "@/components/atomic/TabElement";
import { Header } from "@/components/Header";
import { useAlertStore } from "@/stores/alert.store";
import { useVMStore, VirtualMachine } from "@/stores/vm-store";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MachineInfoPage() {
  const { machines } = useVMStore();
  const params = useParams();
  const machineId = params.machineId as string;
  const [machine, setMachine] = useState<VirtualMachine | null>(null);
  const session = useSession();
  const [selectedTab, setSelectedTab] = useState("info");
  const { showAlert } = useAlertStore();

  useEffect(() => {
    if (machines.length > 0 && machineId) {
      const foundMachine = machines.find((m) => m.id === machineId);
      setMachine(foundMachine || null);
    }
  }, [machineId, machines]);

  const handleConsole = async () => {
    if (machine?.state != "RUNNING") {
      showAlert("A máquina deve estar ligada para acessar o console.");
    }

    if (session.data?.access_token) {
      const response = await fetch("/api/machines/fetch-console", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.access_token}`,
        },
        body: JSON.stringify({
          machineId: machine?.id,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.message && result.message.consoleUrl) {
          window.open(result.message.consoleUrl, "_blank");
        }
      }
    }
  };

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
          <Button variant="primary" onClick={() => handleConsole()}>
            Acessar console
          </Button>
        </span>
      </div>
      <div className="flex flex-col justify-center px-20 mt-16">
        <div className="">
          <ul
            role="tablist"
            className="flex gap-9 border-b flex flex-row justify-center font-medium"
          >
            <TabElement
              name="Informações básicas"
              selected={selectedTab === "info"}
              setSelected={() => {
                setSelectedTab("info");
              }}
            />
            <TabElement
              name="Desempenho"
              selected={selectedTab === "desemp"}
              setSelected={() => {
                setSelectedTab("desemp");
              }}
            />
            <TabElement
              name="Gerenciar discos"
              selected={selectedTab === "volumes"}
              setSelected={() => {
                setSelectedTab("volumes");
              }}
            />
          </ul>
          {selectedTab === "volumes" && (
            <div className="mt-6">
              <div className="flex flex-row justify-between mb-5">
                <SearchInput />
                <Button variant="primary" className="w-38">
                  Novo disco
                </Button>
              </div>
              <DataTable
                headers={["Nome", "Tamanho"]}
                rows={[{ id: "2", data: ["Disco Extra", "200 GB"] }]}
              />
            </div>
          )}
          {selectedTab == "info" && (
            <div className="mt-5 grid grid-cols-4 grid-rows-3 gap-y-12 mt-10">
              <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
                <p className="font-normal text-sm ">Sistema operacional</p>
                {machine.template.name}
              </span>
              <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1 ">
                <p className="font-normal text-sm ">Status</p>
                <StatusBadge
                  status={machine.state}
                  pclassName="inline-flex w-50 h-7 flex justify-center items-center"
                />
              </span>
              <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
                <p className="font-normal text-sm ">IP</p>
                {machine.ipAddress}
              </span>
              <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
                <p className="font-normal text-sm ">Rede</p>
                {/* {machine.networkName} */}
              </span>
              <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
                <p className="font-normal text-sm ">Offer</p>
                {machine.instance.name}
              </span>
              <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
                <p className="font-normal text-sm ">Memória</p>
                {machine.instance.memory} MB
              </span>
              <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
                <p className="font-normal text-sm ">CPU</p>
                {machine.instance.cpu} Hz
              </span>
              <span className="font-semibold text-lg text-[#4C4C4C] flex flex-col gap-1">
                <p className="font-normal text-sm ">Disco</p>
                {machine.instance.disk} GB
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
