"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { PageHeader } from "@/components/atomic/PageHeader";
import { SearchInput } from "@/components/atomic/SearchInput";
import { Header } from "@/components/Header";
import { useNetworkStore } from "@/stores/network.store";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NetworksPage() {
  const session = useSession();
  const [loadingNetworks, setLoadingNetworks] = useState(false);
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
        el1value={"4"}
        el2name="Redes online"
        el2value="0"
        el3name="Redes em uso"
        el3value={"0"}
        el4name="Erros"
        el4value="0"
      />

      <div className="flex flex-col  -translate-y-10">
        <div className="px-21">
          <div className="flex justify-between mb-8">
            <SearchInput />
            <Button variant="primary" className="w-fit">
              <Link href="/networks/new">
                <AddIcon /> Nova Rede
              </Link>
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
    </div>
  );
}
