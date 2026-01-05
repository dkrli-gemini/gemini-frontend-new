"use client";

import { Header } from "@/components/atomic/Header";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import Resource from "@/components/atomic/Resource";
import { ResourceTypeEnum, useLimitStore } from "@/stores/limit.store";
import { useProjectsStore } from "@/stores/user-project.store";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

const typeLabels: Record<ResourceTypeEnum, string> = {
  [ResourceTypeEnum.NETWORK]: "Redes",
  [ResourceTypeEnum.VOLUMES]: "Discos",
  [ResourceTypeEnum.INSTANCES]: "Máquinas Virtuais",
  [ResourceTypeEnum.CPU]: "vCPU",
  [ResourceTypeEnum.MEMORY]: "Memória",
  [ResourceTypeEnum.PUBLICIP]: "IP's Públicos",
  [ResourceTypeEnum.CPUCORES]: "vCPU",
};

export default function ResourcesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const { limits, setLimits } = useLimitStore();
  const projectStore = useProjectsStore();

  useEffect(() => {
    async function fetchResourceLimits() {
      if (!session.data?.access_token || !projectStore.currentProjectId) {
        setLimits([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
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

        if (!response.ok) {
          throw new Error("Falha ao buscar limites de recursos");
        }

        const result = await response.json();
        setLimits(result.message.resources ?? []);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os limites de recursos.");
      } finally {
        setLoading(false);
      }
    }

    fetchResourceLimits();
  }, [session.data?.access_token, projectStore.currentProjectId, setLimits]);

  const aggregates = useMemo(() => {
    if (!limits.length) {
      return { avgUsage: 0, overflow: 0 };
    }

    let totalPercent = 0;
    let counted = 0;
    let overflow = 0;

    limits.forEach((limit) => {
      if (limit.limit > 0) {
        const pct = Math.min(100, (limit.used / limit.limit) * 100);
        totalPercent += pct;
        counted += 1;
        if (limit.used > limit.limit) {
          overflow += 1;
        }
      }
    });

    return {
      avgUsage: counted ? Math.round(totalPercent / counted) : 0,
      overflow,
    };
  }, [limits]);

  const hasProject = Boolean(projectStore.currentProjectId);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader2
        title="Recursos Utilizados"
        el1name="Uso médio de recursos"
        el1value={`${aggregates.avgUsage}%`}
        el2name="Recursos em overflow"
        el2value={aggregates.overflow.toString()}
      />

      <div className="flex flex-col -translate-y-10 px-20 pb-8 gap-6">
        {!hasProject && (
          <p className="text-sm text-gray-500">
            Selecione um projeto em "Home" para visualizar os limites de
            recurso.
          </p>
        )}

        {loading && (
          <p className="text-sm text-gray-500">Carregando limites...</p>
        )}
        {error && !loading && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && hasProject && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {limits.map((limit) => (
              <Resource
                key={limit.id}
                label={typeLabels[limit.type] ?? limit.type}
                type={limit.type}
                used={limit.used}
                limit={limit.limit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
