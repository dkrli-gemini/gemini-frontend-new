"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { Header } from "@/components/atomic/Header";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import { SearchInput } from "@/components/atomic/SearchInput";
import { TabElement } from "@/components/atomic/TabElement";
import { NewForwardRuleForm } from "@/components/forms/new-forward-rule-form";
import { usePublicIpStore } from "@/stores/public-ip-store";
import { useProjectsStore } from "@/stores/user-project.store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ForwardingPage() {
  const [tabSelected, setTabSelected] = useState("ips");

  const [isClient, setIsClient] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { ips, setIps } = usePublicIpStore();
  const session = useSession();
  const { currentProjectId } = useProjectsStore();

  useEffect(() => {
    async function fetchIps() {
      if (session.data?.access_token) {
        const response = await fetch("/api/networks/list-public-ips", {
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
          setIps(result.message.ips);
        }
      }
    }

    fetchIps();
  }, [setIps, session, currentProjectId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader2
        title="Port Forwarding"
        el1name="IP's adquiridos"
        el1value="2"
        el2name="Regras Criadas"
        el2value="0"
      />
      <div className="flex flex-col -translate-y-10 px-21">
        <ul
          role="tablist"
          className="mt-10 flex gap-9 border-b flex flex-row justify-center font-medium"
        >
          <TabElement
            name="IPs"
            selected={tabSelected == "ips"}
            setSelected={() => setTabSelected("ips")}
          />
          <TabElement
            name="Regras"
            selected={tabSelected == "rules"}
            setSelected={() => setTabSelected("rules")}
          />
        </ul>

        {tabSelected == "ips" && (
          <div>
            <div className="flex justify-between mt-4 mb-4 ">
              <SearchInput />
              <Button variant="primary">Adquirir novo IP</Button>
            </div>
            <DataTable
              headers={["IP", "Regras utilizando"]}
              rows={ips.map((ip) => ({ id: ip.id, data: [ip.address, 0] }))}
            />
          </div>
        )}

        {tabSelected == "rules" && (
          <div>
            <div className="flex justify-between mt-4 mb-4 ">
              <SearchInput />
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Criar nova regra
              </Button>
            </div>
            <DataTable
              headers={[
                "IP",
                "Porta privada",
                "Porta pública",
                "Protocolo",
                "Máquina associada",
              ]}
              rows={[]}
            />
          </div>
        )}
      </div>

      {isClient &&
        createPortal(
          <NewForwardRuleForm
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />,
          document.body
        )}
    </div>
  );
}
