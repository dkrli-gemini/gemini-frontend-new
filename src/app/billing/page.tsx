"use client";

import { Button } from "@/components/atomic/Button";
import { Header } from "@/components/atomic/Header";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useProjectsStore } from "@/stores/user-project.store";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useMemo, useState } from "react";

interface BillingEntry {
  id: string;
  description: string;
  resourceType: string;
  unitPriceInCents: number;
  quantity: number;
  totalInCents: number;
  createdAt: string;
  virtualMachineId?: string;
  metadata?: Record<string, unknown>;
}

interface MachineSpecs {
  cpuNumber?: number;
  cpuSpeedMhz?: number;
  memoryInMb?: number;
  rootDiskSizeInGb?: number;
}

interface MachineBillingGroup {
  machineId: string;
  machineName: string;
  totalInCents: number;
  createdAt: string;
  offerName?: string;
  specs?: MachineSpecs;
  resources: BillingEntry[];
}

const resourceTypeLabels: Record<string, string> = {
  INSTANCES: "Máquinas Virtuais",
  CPU: "CPU",
  MEMORY: "Memória",
  VOLUMES: "Volumes",
  PUBLICIP: "IP Público",
  NETWORK: "Rede",
};

const formatCurrency = (valueInCents: number) =>
  (valueInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const matchesSearchTerm = (entry: BillingEntry, normalized: string) => {
  const typeLabel =
    resourceTypeLabels[entry.resourceType] ?? entry.resourceType;
  return (
    entry.description.toLowerCase().includes(normalized) ||
    typeLabel.toLowerCase().includes(normalized)
  );
};

const getMetadataNumber = (
  metadata: Record<string, unknown> | undefined,
  key: string
): number | undefined => {
  if (!metadata) {
    return undefined;
  }
  const value = metadata[key];
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const formatCpuValue = (value?: number): string =>
  value !== undefined ? `${value} vCPU` : "Não informado";

const formatMemoryValue = (value?: number): string => {
  if (value === undefined) {
    return "Não informado";
  }

  const gb = value / 1024;
  return `${gb.toFixed(gb >= 10 ? 0 : 1)} GB`;
};

const formatDiskValue = (value?: number): string =>
  value !== undefined ? `${value} GB` : "Não informado";

function SpecBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2">
      <p className="text-[11px] uppercase text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function BillingPage() {
  const { currentProjectId, currentDomainId } = useProjectsStore();
  const { data: session } = useSession();
  const [machineEntries, setMachineEntries] = useState<MachineBillingGroup[]>(
    []
  );
  const [otherEntries, setOtherEntries] = useState<BillingEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMachineId, setExpandedMachineId] = useState<string | null>(
    null
  );
  const toggleMachineDetails = (machineId: string) => {
    setExpandedMachineId((current) =>
      current === machineId ? null : machineId
    );
  };

  const queryParam = useMemo(() => {
    if (currentProjectId) {
      return `projectId=${currentProjectId}`;
    }

    if (currentDomainId) {
      return `domainId=${currentDomainId}`;
    }

    return null;
  }, [currentProjectId, currentDomainId]);

  useEffect(() => {
    async function fetchEntries() {
      if (!session?.access_token || !queryParam) {
        setMachineEntries([]);
        setOtherEntries([]);
        setExpandedMachineId(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/billing/entries?${queryParam}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar faturas");
        }

        const result = await response.json();
        setMachineEntries(result.message.machines ?? []);
        setOtherEntries(result.message.otherEntries ?? []);
        setExpandedMachineId(null);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar as faturas.");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [session?.access_token, queryParam]);

  const { filteredMachines, filteredOtherEntries } = useMemo(() => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) {
      return {
        filteredMachines: machineEntries,
        filteredOtherEntries: otherEntries,
      };
    }

    return {
      filteredMachines: machineEntries.filter(
        (machine) =>
          machine.machineName.toLowerCase().includes(normalized) ||
          machine.resources.some((resource) =>
            matchesSearchTerm(resource, normalized)
          )
      ),
      filteredOtherEntries: otherEntries.filter((entry) =>
        matchesSearchTerm(entry, normalized)
      ),
    };
  }, [machineEntries, otherEntries, searchTerm]);

  const totals = useMemo(() => {
    const machinesTotal = machineEntries.reduce(
      (acc, machine) => acc + (machine.totalInCents ?? 0),
      0
    );
    const othersTotal = otherEntries.reduce(
      (acc, entry) => acc + (entry.totalInCents ?? 0),
      0
    );
    const eventsCount =
      machineEntries.reduce(
        (acc, machine) => acc + machine.resources.length,
        0
      ) + otherEntries.length;

    return {
      totalInCents: machinesTotal + othersTotal,
      events: eventsCount,
    };
  }, [machineEntries, otherEntries]);

  const combinedRows = useMemo(() => {
    type CombinedRow =
      | {
          kind: "machine";
          id: string;
          date: string;
          machine: MachineBillingGroup;
        }
      | { kind: "entry"; id: string; date: string; entry: BillingEntry };

    const rows: CombinedRow[] = [
      ...filteredMachines.map((machine) => ({
        kind: "machine" as const,
        id: machine.machineId,
        date: machine.createdAt,
        machine,
      })),
      ...filteredOtherEntries.map((entry) => ({
        kind: "entry" as const,
        id: entry.id,
        date: entry.createdAt,
        entry,
      })),
    ];

    return rows.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredMachines, filteredOtherEntries]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      <PageHeader2
        title="Fatura"
        el1name="Total Gasto (mês)"
        el1value={formatCurrency(totals.totalInCents)}
        el2name="Eventos registrados"
        el2value={totals.events.toString()}
      />
      <div className="flex flex-col px-20 -translate-y-10 gap-6">
        {!queryParam && (
          <p className="text-sm text-gray-500">
            Selecione um projeto em &quot Home &quot para visualizar as faturas.
          </p>
        )}
        <div className="flex items-center gap-4 w-full">
          <div className="flex w-full max-w-lg bg-[#F2F2F2] items-center p-2 rounded-xl h-13">
            <SearchIcon className="ml-2" />
            <input
              type="text"
              className="outline-none ml-3 h-max placeholder-[#999999] bg-transparent flex-1"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
        {loading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && !loading && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-tools-table-outline">
            <table className="w-full">
              <thead className="bg-[#FAFAFA] text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Recurso</th>

                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-left">Data</th>

                  <th className="px-4 py-3 text-right">Quantidade</th>
                  <th className="px-4 py-3 text-right">Valor no mês</th>
                </tr>
              </thead>
              <tbody>
                {combinedRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      Nenhum evento de faturamento encontrado.
                    </td>
                  </tr>
                )}
                {combinedRows.map((row) => {
                  if (row.kind === "machine") {
                    const machine = row.machine;
                    const isExpanded = expandedMachineId === machine.machineId;
                    return (
                      <Fragment key={machine.machineId}>
                        <tr
                          key={`${machine.machineId}-row`}
                          className={`border-t border-tools-table-outline ${
                            isExpanded ? "bg-[#FDFDFD]" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              aria-label={`Ver detalhes da máquina ${machine.machineName}`}
                              className="inline-flex items-center gap-2 font-semibold text-left"
                              onClick={() =>
                                toggleMachineDetails(machine.machineId)
                              }
                            >
                              <span
                                className={`rounded-full border border-gray-300 p-1 text-gray-500 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              >
                                <KeyboardArrowDownIcon fontSize="small" />
                              </span>
                              {machine.machineName}
                              {machine.offerName && (
                                <span className="text-sm font-normal text-gray-500">
                                  {" "}
                                  ({machine.offerName})
                                </span>
                              )}
                            </button>
                            {machine.specs && (
                              <p className="text-xs text-gray-500 mt-1">
                                {formatCpuValue(machine.specs?.cpuNumber)} •{" "}
                                {formatMemoryValue(machine.specs?.memoryInMb)}{" "}
                                RAM • Disco raiz{" "}
                                {formatDiskValue(
                                  machine.specs?.rootDiskSizeInGb
                                )}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            Máquina virtual
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {formatDateTime(machine.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-gray-500">
                            —
                          </td>
                          <td className="px-4 py-4 text-right font-semibold">
                            {formatCurrency(machine.totalInCents ?? 0)}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr
                            key={`${machine.machineId}-details`}
                            className="bg-[#F8F8F8] border-t border-tools-table-outline"
                          >
                            <td colSpan={5} className="px-8 py-5">
                              <div className="space-y-5">
                                <div>
                                  <p className="text-xs font-semibold uppercase text-gray-500">
                                    Especificações
                                  </p>
                                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <SpecBadge
                                      label="vCPU"
                                      value={formatCpuValue(
                                        machine.specs?.cpuNumber
                                      )}
                                    />
                                    <SpecBadge
                                      label="Memória (GB)"
                                      value={formatMemoryValue(
                                        machine.specs?.memoryInMb
                                      )}
                                    />
                                    <SpecBadge
                                      label="Disco raiz (GB)"
                                      value={formatDiskValue(
                                        machine.specs?.rootDiskSizeInGb
                                      )}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold uppercase text-gray-500">
                                    Volumes adicionais (
                                    {machine.resources.length})
                                  </p>
                                  {machine.resources.length === 0 ? (
                                    <p className="text-sm text-gray-500 mt-2">
                                      Nenhum volume adicional faturado.
                                    </p>
                                  ) : (
                                    <table className="mt-3 w-full text-sm">
                                      <thead className="text-xs uppercase tracking-wide text-gray-500">
                                        <tr>
                                          <th className="py-2 text-left">
                                            Volume
                                          </th>
                                          <th className="py-2 text-left">
                                            Tamanho
                                          </th>
                                          <th className="py-2 text-left">
                                            Data
                                          </th>
                                          <th className="py-2 text-right">
                                            Quantidade
                                          </th>
                                          <th className="py-2 text-right">
                                            Valor
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {machine.resources.map((resource) => (
                                          <tr
                                            key={`${machine.machineId}-${resource.id}`}
                                            className="border-t border-[#E6E6E6]"
                                          >
                                            <td className="py-2 pr-4">
                                              {resource.description}
                                            </td>
                                            <td className="py-2 pr-4 text-sm text-gray-600">
                                              {(() => {
                                                const size = getMetadataNumber(
                                                  resource.metadata,
                                                  "sizeInGb"
                                                );
                                                return size !== undefined
                                                  ? `${size} GB`
                                                  : "—";
                                              })()}
                                            </td>
                                            <td className="py-2 pr-4 text-sm">
                                              {formatDateTime(
                                                resource.createdAt
                                              )}
                                            </td>
                                            <td className="py-2 pr-4 text-right">
                                              {resource.quantity}
                                            </td>
                                            <td className="py-2 pl-4 text-right font-semibold">
                                              {formatCurrency(
                                                resource.totalInCents ?? 0
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  }

                  const entry = row.entry;
                  return (
                    <tr
                      key={entry.id}
                      className="border-t border-tools-table-outline bg-white"
                    >
                      <td className="px-4 py-4">{entry.description}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {resourceTypeLabels[entry.resourceType] ??
                          entry.resourceType}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {formatDateTime(entry.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">{entry.quantity}</td>
                      <td className="px-4 py-4 text-right font-semibold">
                        {formatCurrency(entry.totalInCents ?? 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
