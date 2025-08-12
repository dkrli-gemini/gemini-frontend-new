"use client";

import { Button } from "@/components/atomic/Button";
import { Input } from "@/components/atomic/Input";
import { SearchInput } from "@/components/atomic/SearchInput";
import SelectableDataTable, {
  DataTableRow,
} from "@/components/atomic/SelectableDataTable";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/stores/alert.store";
import { useNetworkStore } from "@/stores/network.store";
import { Modal } from "../atomic/Modal";
import { useProjectsStore } from "@/stores/user-project.store";

export function NewMachineForm() {
  const session = useSession();
  const [machineName, setMachineName] = useState("");
  const [machinePassword, setMachinePassword] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<DataTableRow | null>(
    null
  );
  const [selectedOs, setSelectedOs] = useState<DataTableRow | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<DataTableRow | null>(null);
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { networks, setNetworks } = useNetworkStore();

  const { currentProjectId } = useProjectsStore();

  const router = useRouter();
  const { showAlert } = useAlertStore();

  useEffect(() => {
    async function fetchNetworks() {
      setLoadingNetworks(true);
      if (session.data?.access_token) {
        const response = await fetch("/api/networks/list-networks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data.access_token}`,
          },
          method: "POST",
          body: JSON.stringify({
            projectId: currentProjectId,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setNetworks(result.message.networks);
        }
        setLoadingNetworks(false);
      }
    }

    fetchNetworks();
  }, [session, setNetworks, currentProjectId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = session.data?.access_token; // Replace with actual token retrieval
    const projectId = currentProjectId; // Replace with actual project ID

    if (selectedNetwork && selectedOs && selectedOffer) {
      try {
        const response = await fetch("/api/machines/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: machineName,
            projectId,
            offerId: "a3490a4c-2213-4636-86f1-c021e7da9bea", // selectedOffer.id,
            templateId: "49bbcba0-29ae-46b4-a59b-5c10ebd2b888", // selectedOs.id,
            networkId: selectedNetwork.id, //selectedNetwork.id,
          }),
        });

        if (response.ok) {
          showAlert("Máquina criada com sucesso!", "success");
          router.push("/machines");
        } else {
          console.error("Failed to create machine");
          showAlert("Erro na criação da máquina.", "error");
        }
      } catch (error) {
        console.error("Error creating machine:", error);
      }
    }
  };

  return (
    <form
      id="new-machine-form"
      onSubmit={handleSubmit}
      className="flex flex-col w-full px-18 mt-12"
    >
      <div className="flex flex-col gap-10">
        <h2 className="text-2xl font-bold">Dados Gerais</h2>
        <div className="flex flex-row gap-20">
          <span className="flex flex-1 flex-col">
            <p className="text-lg ">Nome da máquina</p>
            <Input
              className="mt-2"
              placeholder="Digite aqui..."
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
            />
          </span>
          <span className="flex flex-1 flex-col">
            <p className="text-lg">Senha da máquina</p>
            <Input
              className="mt-2"
              placeholder="Digite aqui..."
              value={machinePassword}
              onChange={(e) => setMachinePassword(e.target.value)}
            />
          </span>
        </div>
      </div>

      <div className="flex justify-between items-end mt-16 mb-2">
        <h2 className="text-3xl font-bold">Redes disponíveis</h2>
        <span className="flex items-center gap-3">
          <SearchInput />
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Criar nova rede
          </Button>
        </span>
      </div>

      <SelectableDataTable
        name="networks"
        headers={["Nome", "Gateway", "Netmask"]}
        rows={networks.map((net) => ({
          id: net.id,
          data: [net.name, net.gateway, net.netmask],
        }))}
        onRowSelected={setSelectedNetwork}
      />
      <div className="flex justify-between n items-end mt-16 mb-2">
        <h2 className="text-3xl font-bold">Sistemas Operacionais</h2>
        <SearchInput />
      </div>
      <SelectableDataTable
        name="os"
        headers={["Nome", "Tamanho"]}
        rows={[{ id: "asdasd", data: ["Ubuntu", "1 GB"] }]}
        onRowSelected={setSelectedOs}
      />
      <div className="flex justify-between items-end mt-16 mb-2">
        <h2 className="text-3xl font-bold">Offers</h2>
        <SearchInput />
      </div>
      <SelectableDataTable
        name="offers"
        headers={["Nome", "CPU", "Memória", "Disco"]}
        rows={[
          {
            id: "asdasd",
            data: ["Instância Pequena", "1x 0.50 Hz", "400 MB", "200 GB"],
          },
        ]}
        onRowSelected={setSelectedOffer}
      />
      <div className="mb-14"></div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={<h2 className="text-lg m-1 font-medium  ">Criar Rede</h2>}
        footer={
          <>
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="ghost"
              className="flex self-start text-md "
            >
              Fechar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="inline-flex text-md col-start-4 col-span-2"
            >
              Salvar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col ">
            <p>Nome da rede</p>
            <Input placeholder="Digite aqui..." className="mt-2" />
          </div>
          <div className="flex flex-col ">
            <p>Gateway</p>
            <Input placeholder="Digite aqui..." className="mt-2" />
          </div>
          <div className="flex flex-col ">
            <p>Netmask</p>
            <Input placeholder="Digite aqui..." className="mt-2 " />
          </div>
        </div>
      </Modal>
    </form>
  );
}
