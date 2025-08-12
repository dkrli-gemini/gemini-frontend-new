"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { Input } from "@/components/atomic/Input";
import { Modal } from "@/components/atomic/Modal";
import { PageHeader } from "@/components/atomic/PageHeader";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import { SearchInput } from "@/components/atomic/SearchInput";
import { SelectableDropdown } from "@/components/atomic/SelectableDropdown";
import { Header } from "@/components/Header";
import { useAclStore } from "@/stores/acl.store";
import { useAlertStore } from "@/stores/alert.store";
import { useNetworkStore } from "@/stores/network.store";
import { useProjectsStore } from "@/stores/user-project.store";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

export default function NetworksPage() {
  const session = useSession();
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { networks, setNetworks } = useNetworkStore();
  const { showAlert } = useAlertStore();
  const { acls } = useAclStore();

  const [networkName, setNetworkName] = useState("");
  const [networkGateway, setNetworkGateway] = useState("");
  const [networkNetmask, setNetworkNetmask] = useState("");
  const [aclId, setAclId] = useState("");
  const { currentProjectId } = useProjectsStore();

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
    const token = session.data?.access_token;
    const projectId = currentProjectId;

    if (networkName && networkGateway && networkNetmask && aclId) {
      try {
        const response = await fetch(`/api/networks/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: networkName,
            projectId: projectId,
            gateway: networkGateway,
            netmask: networkNetmask,
            offerId: "04dd3cea-4346-4ca3-8d1b-cdb73f28ec6d",
            aclId: aclId,
          }),
        });

        if (response.ok) {
          showAlert("Rede criada com sucesso!", "success");
        } else {
          console.error("Failed to create machine");
          showAlert("Erro na criação da rede.", "error");
        }
        setIsModalOpen(false);
      } catch (e) {
        console.error("Error creating machine:", e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader2
        title="Redes"
        el1name="Total de redes"
        el1value={String(networks.length)}
        el2name="Redes em uso"
        el2value={String(networks.length)}
      />

      <div className="flex flex-col  -translate-y-10">
        <div className="px-21">
          <div className="flex justify-between mb-8">
            <SearchInput />
            <Button
              variant="primary"
              className="w-fit"
              onClick={() => setIsModalOpen(true)}
            >
              <AddIcon /> Nova Rede
            </Button>
          </div>

          <DataTable
            headers={["Nome", "Gateway", "Netmask", "ACL"]}
            rows={networks.map((net) => ({
              id: net.id,
              data: [net.name, net.gateway, net.netmask],
            }))}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} id="new-network-form">
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
                type="button"
              >
                Fechar
              </Button>
              <Button
                variant="primary"
                className="inline-flex text-md col-start-4 col-span-2"
                type="submit"
              >
                Salvar
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col ">
              <p>Nome da rede</p>
              <Input
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
                placeholder="Digite aqui..."
                className="mt-2"
              />
            </div>
            <div className="flex flex-col ">
              <p>Gateway</p>
              <Input
                value={networkGateway}
                onChange={(e) => setNetworkGateway(e.target.value)}
                placeholder="Digite aqui..."
                className="mt-2"
              />
            </div>
            <div className="flex flex-col ">
              <p>Netmask</p>
              <Input
                value={networkNetmask}
                onChange={(e) => setNetworkNetmask(e.target.value)}
                placeholder="Digite aqui..."
                className="mt-2"
              />
            </div>
            <div className="flex flex-col ">
              <p className="mb-2">ACL List</p>
              <SelectableDropdown
                items={acls.map((acl) => ({
                  id: acl.id,
                  name: acl.name,
                }))}
                placeholder="Selecione uma ACL..."
                onSelect={(id: string) => setAclId(id)}
              />
            </div>
          </div>
        </Modal>
      </form>
    </div>
  );
}
