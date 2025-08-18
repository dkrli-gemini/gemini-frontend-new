"use client";

import { Header } from "@/components/atomic/Header";
import { PageHeader } from "@/components/atomic/PageHeader";
import ProgressBox, {
  NamedProgressBarProps,
  ProgressBarProps,
  ProgressBoxProps,
} from "@/components/atomic/ProgressBox";
import Head from "next/head";

export default function DashboardPage() {
  const barsCompute: NamedProgressBarProps[] = [
    { name: "Memória", limit: 32, used: 8, unit: "GB" },
    { name: "CPU", limit: 40, used: 18, unit: "GHz" },
    { name: "Núcleos de CPU", limit: 32, used: 20, unit: "" },
    { name: "GPU", limit: 0, used: 0, unit: "0" },
  ];

  const barsStorage: NamedProgressBarProps[] = [
    { name: "Armazenamento Primário", limit: 320, used: 100, unit: "GB" },
    { name: "Armazenamento Secundário", limit: 100, used: 20, unit: "GB" },
  ];

  const networkStorage: NamedProgressBarProps[] = [
    { name: "IP's públicos", limit: 20, used: 7, unit: "" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader
        title="Dashboard"
        el1name="Máquinas virtuais"
        el1value="2"
        el2name="Redes"
        el2value="2"
        el3name="ACL's"
        el3value="2"
        el4name="Port Forwards"
        el4value="0"
      />

      <div className="-translate-y-20 grid grid-cols-3 p-21 gap-8">
        <div className="col-span-2 flex flex-col gap-8">
          <ProgressBox name="Compute" bars={barsCompute} />
          <ProgressBox name="Storage" bars={barsStorage} />
          <ProgressBox name="Network" bars={networkStorage} />
        </div>
        <div className="border rounded-xl p-6">
          <span className="text-2xl font-bold  pb-4 border-b flex">
            <h2>Notificações</h2>
          </span>
        </div>
      </div>
    </div>
  );
}
