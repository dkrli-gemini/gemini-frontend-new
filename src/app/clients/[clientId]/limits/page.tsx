"use client";

import { Button } from "@/components/atomic/Button";
import { Header } from "@/components/atomic/Header";
import Resource from "@/components/atomic/Resource";
import { PageHeader0 } from "@/components/atomic/PageHeader0";
import DataTable from "@/components/atomic/DataTable";
import { ResourceTypeEnum } from "@/stores/limit.store";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

interface ClientLimit {
  id: string;
  type: ResourceTypeEnum;
  used: number;
  limit: number;
}

const typeLabels: Record<ResourceTypeEnum, string> = {
  [ResourceTypeEnum.NETWORK]: "Redes",
  [ResourceTypeEnum.VOLUMES]: "Discos",
  [ResourceTypeEnum.INSTANCES]: "Máquinas Virtuais",
  [ResourceTypeEnum.CPU]: "vCPU",
  [ResourceTypeEnum.MEMORY]: "Memória",
  [ResourceTypeEnum.PUBLICIP]: "IP's Públicos",
};

const unitLabels: Record<ResourceTypeEnum, string> = {
  [ResourceTypeEnum.NETWORK]: "unid.",
  [ResourceTypeEnum.VOLUMES]: "GB",
  [ResourceTypeEnum.INSTANCES]: "unid.",
  [ResourceTypeEnum.CPU]: "vCPU",
  [ResourceTypeEnum.MEMORY]: "MB",
  [ResourceTypeEnum.PUBLICIP]: "unid.",
};

const formatUsage = (type: ResourceTypeEnum, used: number) => {
  if (type === ResourceTypeEnum.MEMORY) {
    const gb = used / 1024;
    return `${gb.toFixed(gb >= 10 ? 0 : 1)} GB`;
  }
  if (type === ResourceTypeEnum.VOLUMES) {
    return `${used} GB`;
  }
  if (type === ResourceTypeEnum.CPU) {
    return `${used} vCPU`;
  }
  return used.toLocaleString();
};

export default function PartnerLimitsPage() {
  const params = useParams();
  const domainIdParam = params?.clientId;
  const domainId = Array.isArray(domainIdParam)
    ? domainIdParam[0]
    : domainIdParam;
  const { data: session } = useSession();
  const [limits, setLimits] = useState<ClientLimit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLimitId, setEditingLimitId] = useState<string | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchLimits() {
      if (!session?.access_token || !domainId) {
        setLimits([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/resource-limits?domainId=${domainId}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar limites do cliente");
        }

        const result = await response.json();
        const fetched = result.message.resources ?? [];
        setLimits(fetched);
        setDraftValues(
          fetched.reduce((acc: Record<string, string>, limit: ClientLimit) => {
            acc[limit.id] = String(limit.limit ?? 0);
            return acc;
          }, {})
        );
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os limites do cliente.");
      } finally {
        setLoading(false);
      }
    }

    fetchLimits();
  }, [session?.access_token, domainId]);

  const filteredLimits = useMemo(() => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) {
      return limits;
    }

    return limits.filter((limit) =>
      (typeLabels[limit.type] ?? limit.type).toLowerCase().includes(normalized)
    );
  }, [limits, searchTerm]);

  const handleUpdate = async (limitId: string) => {
    const value = draftValues[limitId];
    const parsed = Number(value);

    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }

    try {
      const response = await fetch("/api/resource-limits", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ limitId, limit: parsed }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar limite");
      }

      setLimits((prev) =>
        prev.map((limit) =>
          limit.id === limitId ? { ...limit, limit: parsed } : limit
        )
      );
      setEditingLimitId(null);
    } catch (err) {
      console.error(err);
      setError("Não foi possível atualizar o limite.");
    }
  };

  const handleCancel = (limitId: string) => {
    const original = limits.find((limit) => limit.id === limitId);
    setDraftValues((prev) => ({
      ...prev,
      [limitId]: original ? String(original.limit ?? 0) : "",
    }));
    setEditingLimitId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <Header />
      <PageHeader0 title="Limites do cliente" height="h-100" />

      <div className="flex flex-col px-20 mt-6 gap-6 -translate-y-75">
        {loading && (
          <p className="text-sm text-gray-500">Carregando limites...</p>
        )}
        {error && !loading && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && limits.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 ">
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

        <div className="mt-6 flex items-center gap-3">
          <div className="flex w-full max-w-md bg-[#F2F2F2] items-center px-3 py-2 rounded-xl">
            <SearchIcon className="text-gray-500" />
            <input
              type="text"
              className="outline-none ml-2 bg-transparent flex-1 text-sm"
              placeholder="Buscar recurso..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="w-full">
          <DataTable
            headers={["Recurso", "Uso Atual", "Limite"]}
            columnAlignments={["left", "left", "right"]}
            rows={filteredLimits.map((limit) => ({
              id: limit.id,
              data: [
                typeLabels[limit.type] ?? limit.type,
                formatUsage(limit.type, limit.used),
                editingLimitId === limit.id ? (
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center bg-[#F2F2F2] rounded-xl px-2 py-1.5 border border-[#E6E6E6] w-36 justify-between">
                      <input
                        type="number"
                        min={0}
                        value={draftValues[limit.id] ?? ""}
                        onChange={(event) =>
                          setDraftValues((prev) => ({
                            ...prev,
                            [limit.id]: event.target.value,
                          }))
                        }
                        className="bg-transparent outline-none w-20 text-right text-sm"
                      />
                      <span className="ml-1 text-xs text-gray-500">
                        {unitLabels[limit.type]}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => handleUpdate(limit.id)}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => handleCancel(limit.id)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center bg-[#F2F2F2] rounded-xl px-3 py-2 border border-[#E6E6E6] w-36 justify-between">
                      <span className="font-semibold text-sm">
                        {limit.limit > 0 ? limit.limit : "Ilimitado"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {unitLabels[limit.type]}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => setEditingLimitId(limit.id)}
                    >
                      Editar
                    </Button>
                  </div>
                ),
              ],
            }))}
          />
        </div>
      </div>
    </div>
  );
}
