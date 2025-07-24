"use client";

import { Button } from "@/components/atomic/Button";
import { Input } from "@/components/atomic/Input";
import { SearchInput } from "@/components/atomic/SearchInput";
import SelectableDataTable, {
  DataTableRow,
} from "@/components/atomic/SelectableDataTable";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/stores/alert.store";

export function NewMachineForm() {
  const session = useSession();
  const [machineName, setMachineName] = useState("");
  const [machinePassword, setMachinePassword] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<DataTableRow | null>(
    null
  );
  const [selectedOs, setSelectedOs] = useState<DataTableRow | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<DataTableRow | null>(null);
  const [showNewNetworkForm, setShowNewNetworkForm] = useState(false);
  const [newNetworkName, setNewNetworkName] = useState("");
  const [newNetworkGateway, setNewNetworkGateway] = useState("");
  const [newNetworkNetmask, setNewNetworkNetmask] = useState("");

  const router = useRouter();
  const { showAlert } = useAlertStore();

  const handleCreateNetwork = async () => {
    const token = "your-auth-token"; // Replace with actual token retrieval
    const projectId = "your-project-id"; // Replace with actual project ID
    const aclId = "your-acl-id"; // Replace with actual ACL ID
    const offerId = "your-offer-id"; // Replace with actual offer ID

    try {
      const response = await fetch("/api/networks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newNetworkName,
          projectId,
          gateway: newNetworkGateway,
          netmask: newNetworkNetmask,
          aclId,
          offerId,
        }),
      });

      if (response.ok) {
        console.log("Network created successfully");
        setShowNewNetworkForm(false); // Close the form on success
        setNewNetworkName("");
        setNewNetworkGateway("");
        setNewNetworkNetmask("");
      } else {
        console.error("Failed to create network");
      }
    } catch (error) {
      console.error("Error creating network:", error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = session.data?.access_token; // Replace with actual token retrieval
    const projectId = "2f582214-4ca7-4774-92f5-e215f3b60787"; // Replace with actual project ID

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
            networkId: "852daacd-682f-47c3-9dd7-d63afcb4f13c", //selectedNetwork.id,
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
          <Button variant="primary" onClick={() => setShowNewNetworkForm(true)}>
            Criar nova rede
          </Button>
        </span>
      </div>
      {showNewNetworkForm && (
        <div className="flex flex-col gap-4 mt-4">
          <Input
            placeholder="Nome da rede"
            value={newNetworkName}
            onChange={(e) => setNewNetworkName(e.target.value)}
          />
          <Input
            placeholder="Gateway"
            value={newNetworkGateway}
            onChange={(e) => setNewNetworkGateway(e.target.value)}
          />
          <Input
            placeholder="Netmask"
            value={newNetworkNetmask}
            onChange={(e) => setNewNetworkNetmask(e.target.value)}
          />
          <Button variant="primary" onClick={handleCreateNetwork}>
            Salvar
          </Button>
        </div>
      )}

      <SelectableDataTable
        name="networks"
        headers={["Nome", "Gateway", "Netmask"]}
        rows={[
          {
            id: "asdasd",
            data: ["TestNetwork", "10.128.3.0", "255.255.255.0"],
          },
        ]}
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
    </form>
  );
}
