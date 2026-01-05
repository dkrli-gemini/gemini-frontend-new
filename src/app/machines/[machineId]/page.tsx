"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { Header } from "@/components/atomic/Header";
import { Input } from "@/components/atomic/Input";
import { Modal } from "@/components/atomic/Modal";
import { SearchInput } from "@/components/atomic/SearchInput";
import { SelectableDropdown } from "@/components/atomic/SelectableDropdown";
import { StatusBadge } from "@/components/atomic/StatusBadge";
import { TabElement } from "@/components/atomic/TabElement";
import { useAlertStore } from "@/stores/alert.store";
import { useProjectsStore } from "@/stores/user-project.store";
import { useVMStore, VirtualMachine } from "@/stores/vm-store";
import { useVolumeStore } from "@/stores/volume.store";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function MachineInfoPage() {
  const { machines } = useVMStore();
  const params = useParams();
  const machineId = params.machineId as string;
  const [machine, setMachine] = useState<VirtualMachine | null>(null);
  const session = useSession();
  const [selectedTab, setSelectedTab] = useState("info");
  const { showAlert } = useAlertStore();

  const { currentProjectId } = useProjectsStore();
  const { volumes, setVolumes } = useVolumeStore();

  const [volumeModalOpen, setVolumeModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [volumeName, setVolumeName] = useState<string | null>(null);
  const [offerId, setOfferId] = useState<string | null>(null);
  const [volumeSize, setVolumeSize] = useState<string>("");

  useEffect(() => {
    async function fetchVolumes() {
      setLoading(true);
      if (session.data?.access_token) {
        const response = await fetch("/api/machines/list-volumes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data.access_token}`,
          },
          body: JSON.stringify({
            machineId,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setVolumes(result.message.volumes);
        }
      }
    }

    fetchVolumes();
  }, [session, setVolumes, currentProjectId, machineId]);

  useEffect(() => {
    if (machines.length > 0 && machineId) {
      const foundMachine = machines.find((m) => m.id === machineId);
      setMachine(foundMachine || null);
    }
  }, [machineId, machines]);

  const handleCreateDisk = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = session.data?.access_token;

    if (volumeName && offerId && volumeSize) {
      try {
        const response = await fetch("/api/machines/create-volume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            machineId: machineId,
            volumeName,
            offerId,
            sizeInGb: Number(volumeSize),
          }),
        });

        if (response.ok) {
          showAlert(`Disco ${volumeName} criado com sucesso`, "success");
        } else {
          showAlert(`Erro na criação do disco`, "error");
        }
      } catch (error) {
        console.error("Error creating disk", error);
      }
    }

    setVolumeModalOpen(false);
    setVolumeName(null);
    setOfferId(null);
    setVolumeSize("");
  };

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
                <Button
                  variant="primary"
                  className="w-38"
                  onClick={() => setVolumeModalOpen(true)}
                >
                  Novo disco
                </Button>
              </div>
              <DataTable
                headers={["Nome", "Tamanho"]}
                rows={volumes.map((v) => ({
                  id: v.id,
                  data: [v.name, v.capacityString],
                }))}
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

      {createPortal(
        <Modal
          isOpen={volumeModalOpen}
          onClose={() => setVolumeModalOpen(false)}
          header={<h2 className="text-lg m-1 font-medium  ">Criar Disco</h2>}
          footer={
            <>
              <Button
                onClick={() => setVolumeModalOpen(false)}
                variant="ghost"
                className="flex self-start text-md "
                type="button"
              >
                Fechar
              </Button>
              <Button
                variant="primary"
                className="inline-flex text-md col-start-4 col-span-2"
                type="submit"
                form="new-acl-rule-form"
              >
                Salvar
              </Button>
            </>
          }
        >
          <form id="new-acl-rule-form" onSubmit={handleCreateDisk}>
            <div className="flex flex-col gap-7">
              <span>
                <p>Nome</p>
                <Input
                  className="mt-1"
                  value={volumeName ?? ""}
                  onChange={(e) => setVolumeName(e.target.value)}
                />
              </span>
              <span>
                <p>Oferta de disco</p>
                <SelectableDropdown
                  items={[
                    {
                      id: "5f627ada-7d13-467b-b215-2065c78ade76",
                      name: "Padrão",
                    },
                  ]}
                  onSelect={(item) => setOfferId(item)}
                  placeholder="Selecione..."
                />
              </span>
              <span>
                <p>Tamanho (GB)</p>
                <Input
                  className="mt-1"
                  type="number"
                  min="1"
                  value={volumeSize}
                  onChange={(e) => setVolumeSize(e.target.value)}
                />
              </span>
            </div>
          </form>
        </Modal>,
        document.body
      )}
    </div>
  );
}
