"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import { SearchInput } from "@/components/atomic/SearchInput";
import { TabElement } from "@/components/atomic/TabElement";
import { Header } from "@/components/Header";
import { useState } from "react";

export default function ForwardingPage() {
  const [tabSelected, setTabSelected] = useState("ips");

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
            <DataTable headers={["IP", "Regras utilizando"]} rows={[]} />
          </div>
        )}
        {tabSelected == "rules" && (
          <div>
            <div className="flex justify-between mt-4 mb-4 ">
              <SearchInput />
              <Button variant="primary">Criar nova regra</Button>
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
    </div>
  );
}
