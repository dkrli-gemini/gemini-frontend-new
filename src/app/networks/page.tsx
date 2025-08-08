"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { Input } from "@/components/atomic/Input";
import { Modal } from "@/components/atomic/Modal";
import { PageHeader } from "@/components/atomic/PageHeader";
import { SearchInput } from "@/components/atomic/SearchInput";
import { Header } from "@/components/Header";
import { useNetworkStore } from "@/stores/network.store";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function NetworksPage() {
  const session = useSession();
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { networks, setNetworks } = useNetworkStore();

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
            projectId: "2f582214-4ca7-4774-92f5-e215f3b60787",
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
  }, [session, setNetworks]);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader
        title="Redes"
        el1name="Total de redes"
        el1value={String(networks.length)}
        el2name="Redes online"
        el2value={String(networks.length)}
        el3name="Redes em uso"
        el3value={String(networks.length)}
        el4name="Erros"
        el4value="0"
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
            headers={["Nome", "Gateway", "Netmask"]}
            rows={networks.map((net) => ({
              id: net.id,
              data: [net.name, net.gateway, net.netmask],
            }))}
          />
        </div>
      </div>
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
              onClick={() => setIsModalOpen(false)}
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
    </div>
  );
}
