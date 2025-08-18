"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { Header } from "@/components/atomic/Header";
import { PageHeader } from "@/components/atomic/PageHeader";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import { SearchInput } from "@/components/atomic/SearchInput";
import { TabElement } from "@/components/atomic/TabElement";
import { ResourceTypeEnum, useLimitStore } from "@/stores/limit.store";
import { useProjectsStore } from "@/stores/user-project.store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function formatLimitString(
  type: ResourceTypeEnum,
  used: number,
  limit: number
): any[] {
  const typeMap: Record<ResourceTypeEnum, string> = {
    [ResourceTypeEnum.NETWORK]: "Redes",
    [ResourceTypeEnum.VOLUMES]: "Discos",
    [ResourceTypeEnum.INSTANCES]: "Máquinas Virtuais",
    [ResourceTypeEnum.CPU]: "CPU",
    [ResourceTypeEnum.MEMORY]: "Memória",
    [ResourceTypeEnum.PUBLICIP]: "IP's Públicos",
    [ResourceTypeEnum.CPUCORES]: "Núcleos de CPU",
  };

  const unitMap: Record<ResourceTypeEnum, string> = {
    [ResourceTypeEnum.NETWORK]: "",
    [ResourceTypeEnum.VOLUMES]: "",
    [ResourceTypeEnum.INSTANCES]: "",
    [ResourceTypeEnum.CPU]: "MHz",
    [ResourceTypeEnum.MEMORY]: "GB",
    [ResourceTypeEnum.PUBLICIP]: "",
    [ResourceTypeEnum.CPUCORES]: "",
  };

  const usedString = `${used} ${unitMap[type]}`;
  const limitString = `${used} ${unitMap[type]}`;

  return [typeMap[type], usedString, limitString];
}

export default function ResourcesPage() {
  const [tabSelected, setTabSelected] = useState("limits");
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const { limits, setLimits } = useLimitStore();

  const projectStore = useProjectsStore();

  useEffect(() => {
    async function fetchResourceLimits() {
      setLoading(true);
      console.log(projectStore.currentProjectId);
      if (session.data?.access_token) {
        const response = await fetch(`/api/resource-limits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data.access_token}`,
          },
          body: JSON.stringify({
            projectId: projectStore.currentProjectId,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setLimits(result.message.resources);
          console.log(result);
        }
      }

      setLoading(false);
    }

    fetchResourceLimits();
  }, [session, setLimits]);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader2
        title="Recursos Utilizados"
        el1name="Uso médio de recursos"
        el1value={"0%"}
        el2name="Recursos em overflow"
        el2value={"0"}
      />

      <div className="flex flex-col -translate-y-10 px-21">
        <ul
          role="tablist"
          className="mt-10 flex gap-9 border-b flex flex-row justify-center font-medium"
        >
          <TabElement
            name="Recursos"
            selected={tabSelected == "limits"}
            setSelected={() => setTabSelected("limits")}
          />
          <TabElement
            name="Performance"
            selected={tabSelected == "resources"}
            setSelected={() => setTabSelected("resources")}
          />
        </ul>
        <div className="flex justify-start mt-4 mb-3    ">
          <SearchInput />
        </div>
        {tabSelected == "limits" && (
          <DataTable
            headers={["Recurso", "Uso atual", "Limite"]}
            rows={limits.map((l) => ({
              id: l.id,
              data: formatLimitString(l.type, l.used, l.limit),
            }))}
          />
        )}
      </div>
    </div>
  );
}
