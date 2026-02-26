"use client";

import { Button } from "@/components/atomic/Button";
import { Header } from "@/components/atomic/Header";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useChildrenProjectsStore } from "@/stores/children-project.store";

interface BillingEntry {
  id: string;
  description: string;
  resourceType: string;
  unitPriceInCents: number;
  quantity: number;
  totalInCents: number;
  originalUnitPriceInCents?: number;
  originalTotalInCents?: number;
  createdAt: string;
  virtualMachineId?: string;
  metadata?: Record<string, unknown>;
}

interface MachineBillingGroup {
  machineId: string;
  machineName: string;
  offerName?: string;
  totalInCents: number;
  originalTotalInCents?: number;
  createdAt: string;
  specs?: MachineSpecs;
  resources: BillingEntry[];
}

interface MachineSpecs {
  cpuNumber?: number;
  memoryInMb?: number;
  rootDiskSizeInGb?: number;
}

type ResourcePricingMap = Record<string, number>;
type ResourcePricingDraftMap = Record<string, string>;
type BillingMode = "POOL" | "PAYG";

interface BillingPolicy {
  domainId: string;
  billingType: BillingMode;
  effectiveBillingType: BillingMode;
  parentDomainId?: string;
  parentEffectiveBillingType?: BillingMode;
  canEditBillingType: boolean;
}

interface ClientLimit {
  id: string;
  type: string;
  used: number;
  limit: number;
}

const resourceTypeLabels: Record<string, string> = {
  INSTANCES: "Máquinas Virtuais",
  CPU: "CPU",
  CPUCORES: "CPU",
  MEMORY: "Memória",
  VOLUMES: "Volumes",
  PUBLICIP: "IP Público",
  NETWORK: "Rede",
};

const resourceUnitLabels: Record<string, string> = {
  INSTANCES: "unid.",
  CPU: "vCPU",
  CPUCORES: "vCPU",
  MEMORY: "MB",
  VOLUMES: "GB",
  PUBLICIP: "unid.",
  NETWORK: "unid.",
};

const validPricingResourceTypes = new Set([
  "INSTANCES",
  "CPU",
  "MEMORY",
  "VOLUMES",
  "PUBLICIP",
  "NETWORK",
]);

const normalizePricingResourceType = (resourceType: string): string => {
  const normalized = resourceType.toUpperCase();
  if (normalized === "CPUCORES") {
    return "CPU";
  }
  return normalized;
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

const formatUsage = (resourceType: string, value: number): string => {
  if (resourceType === "MEMORY") {
    const gb = value / 1024;
    return `${gb.toFixed(gb >= 10 ? 0 : 1)} GB`;
  }

  if (resourceType === "VOLUMES") {
    return `${value} GB`;
  }

  if (resourceType === "CPU" || resourceType === "CPUCORES") {
    return `${value} vCPU`;
  }

  return value.toLocaleString("pt-BR");
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

const parseCurrencyToCents = (raw: string): number | null => {
  const normalized = raw.replace(",", ".").trim();
  if (!normalized) {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  return Math.round(value * 100);
};

function SpecBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2">
      <p className="text-[11px] uppercase text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function PartnerBillingPage() {
  const params = useParams();
  const domainIdParam = params?.clientId;
  const domainId = Array.isArray(domainIdParam)
    ? domainIdParam[0]
    : domainIdParam;
  const { data: session } = useSession();
  const { childrenProjects } = useChildrenProjectsStore();
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
  const [clientName, setClientName] = useState("Cliente");
  const [exportError, setExportError] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [resourcePricing, setResourcePricing] = useState<ResourcePricingMap>({});
  const [resourcePricingDraft, setResourcePricingDraft] =
    useState<ResourcePricingDraftMap>({});
  const [basePricing, setBasePricing] = useState<ResourcePricingMap>({});
  const [effectivePricing, setEffectivePricing] = useState<ResourcePricingMap>({});
  const [billingPolicy, setBillingPolicy] = useState<BillingPolicy | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [limits, setLimits] = useState<ClientLimit[]>([]);
  const [limitsLoading, setLimitsLoading] = useState(false);
  const [limitsError, setLimitsError] = useState<string | null>(null);
  const [editingLimitId, setEditingLimitId] = useState<string | null>(null);
  const [limitDraftValues, setLimitDraftValues] = useState<Record<string, string>>(
    {}
  );
  const [limitSearchTerm, setLimitSearchTerm] = useState("");
  const toggleMachineDetails = (machineId: string) => {
    setExpandedMachineId((current) =>
      current === machineId ? null : machineId
    );
  };

  const queryParam = useMemo(() => {
    if (domainId) {
      return `domainId=${domainId}`;
    }
    return null;
  }, [domainId]);

  useEffect(() => {
    if (!domainId) {
      return;
    }

    const found = childrenProjects.find((child) => child.domainId === domainId);

    if (found?.domainName) {
      setClientName(found.domainName);
    } else if (!found && domainId) {
      setClientName(`Cliente ${domainId.slice(0, 6)}`);
    }
    setExportError(null);
  }, [childrenProjects, domainId]);

  const fetchEntries = useCallback(async () => {
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
      setMachineEntries(result.message?.machines ?? []);
      setOtherEntries(result.message?.otherEntries ?? []);
      setExpandedMachineId(null);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as faturas.");
    } finally {
      setLoading(false);
    }
  }, [queryParam, session?.access_token]);

  const fetchPricing = useCallback(async () => {
    if (!session?.access_token || !domainId) {
      setResourcePricing({});
      return;
    }

    setPricingLoading(true);
    setPricingError(null);
    try {
      const response = await fetch(`/api/billing/pricing?domainId=${domainId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar precificação.");
      }

      const result = await response.json();
      const customPrices = Array.isArray(result?.message?.customPrices)
        ? result.message.customPrices
        : [];
      const basePrices = Array.isArray(result?.message?.basePrices)
        ? result.message.basePrices
        : [];
      const effectivePrices = Array.isArray(result?.message?.effectivePrices)
        ? result.message.effectivePrices
        : [];
      const nextPolicy = result?.message?.policy ?? null;

      const toMap = (
        list: Array<{ resourceType?: string; unitPriceInCents?: number }>
      ): ResourcePricingMap => {
        const map: ResourcePricingMap = {};
        list.forEach((item) => {
          if (
            item?.resourceType &&
            Number.isFinite(item?.unitPriceInCents) &&
            (item?.unitPriceInCents ?? 0) >= 0
          ) {
            map[item.resourceType] = Math.round(item.unitPriceInCents ?? 0);
          }
        });
        return map;
      };

      const nextCustomMap = toMap(customPrices);
      setResourcePricing(nextCustomMap);
      setBasePricing(toMap(basePrices));
      setEffectivePricing(toMap(effectivePrices));
      setBillingPolicy(nextPolicy);
      setResourcePricingDraft(
        Object.entries(nextCustomMap).reduce(
          (acc: ResourcePricingDraftMap, [resourceType, cents]) => {
            acc[resourceType] = (cents / 100).toString();
            return acc;
          },
          {}
        )
      );
    } catch (err) {
      console.error(err);
      setPricingError("Não foi possível carregar os custos do distribuidor.");
    } finally {
      setPricingLoading(false);
    }
  }, [domainId, session?.access_token]);

  const fetchLimits = useCallback(async () => {
    if (!session?.access_token || !domainId) {
      setLimits([]);
      return;
    }

    setLimitsLoading(true);
    setLimitsError(null);
    try {
      const response = await fetch(`/api/resource-limits?domainId=${domainId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar limites do cliente.");
      }

      const result = await response.json();
      const fetched = result.message?.resources ?? [];
      setLimits(fetched);
      setLimitDraftValues(
        fetched.reduce((acc: Record<string, string>, item: ClientLimit) => {
          acc[item.id] = String(item.limit ?? 0);
          return acc;
        }, {})
      );
    } catch (err) {
      console.error(err);
      setLimitsError("Não foi possível carregar os limites do cliente.");
    } finally {
      setLimitsLoading(false);
    }
  }, [domainId, session?.access_token]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  useEffect(() => {
    if (billingPolicy?.effectiveBillingType !== "POOL") {
      return;
    }
    fetchLimits();
  }, [billingPolicy?.effectiveBillingType, fetchLimits]);

  const savePricing = useCallback(
    async (nextPricingDraft: ResourcePricingDraftMap) => {
      if (!session?.access_token || !domainId) {
        return;
      }

      const parsedPricing: ResourcePricingMap = {};
      for (const [resourceType, rawValue] of Object.entries(nextPricingDraft)) {
        const cents = parseCurrencyToCents(rawValue);
        if (cents === null) {
          continue;
        }
        const normalizedType = normalizePricingResourceType(resourceType);
        if (!validPricingResourceTypes.has(normalizedType)) {
          continue;
        }
        parsedPricing[normalizedType] = cents;
      }

      setPricingSaving(true);
      setPricingError(null);
      try {
        const response = await fetch("/api/billing/pricing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            domainId,
            prices: Object.entries(parsedPricing).map(
              ([resourceType, unitPriceInCents]) => ({
                resourceType,
                unitPriceInCents,
              })
            ),
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao salvar precificação.");
        }

        await Promise.all([fetchPricing(), fetchEntries()]);
      } catch (err) {
        console.error(err);
        setPricingError("Não foi possível salvar os custos do distribuidor.");
      } finally {
        setPricingSaving(false);
      }
    },
    [domainId, fetchEntries, fetchPricing, session?.access_token]
  );

  const updateBillingPolicy = useCallback(
    async (billingType: BillingMode) => {
      if (!session?.access_token || !domainId) {
        return;
      }

      setPricingSaving(true);
      setPricingError(null);
      try {
        const response = await fetch("/api/billing/policy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            domainId,
            billingType,
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar política de cobrança.");
        }

        await Promise.all([fetchPricing(), fetchEntries()]);
      } catch (err) {
        console.error(err);
        setPricingError("Não foi possível atualizar a política de cobrança.");
      } finally {
        setPricingSaving(false);
      }
    },
    [domainId, fetchEntries, fetchPricing, session?.access_token]
  );

  const handleGenerateInvoice = useCallback(async () => {
    if (!queryParam) {
      setExportError("Selecione um cliente para gerar a fatura.");
      return;
    }

    setExportError(null);
    setDownloadingInvoice(true);

    try {
      const now = new Date();
      const formattedMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;
      const safeName = slugify(clientName || "cliente");
      const downloadFilename = `fatura-${safeName}-${formattedMonth}.pdf`;
      const params = new URLSearchParams(queryParam);
      params.set("filename", downloadFilename);
      const invoiceUrl = `/api/billing/generate?${params.toString()}`;

      const openedWindow = window.open(invoiceUrl, "_blank", "noopener,noreferrer");
      if (!openedWindow) {
        setExportError(
          "O navegador bloqueou o pop-up. Permita pop-ups para baixar a fatura."
        );
      }
    } catch (err) {
      console.error(err);
      setExportError("Falha ao gerar a fatura em PDF.");
    } finally {
      setDownloadingInvoice(false);
    }
  }, [queryParam, clientName]);

  const filteredLimits = useMemo(() => {
    const normalized = limitSearchTerm.toLowerCase().trim();
    if (!normalized) {
      return limits;
    }

    return limits.filter((limit) =>
      (resourceTypeLabels[limit.type] ?? limit.type)
        .toLowerCase()
        .includes(normalized)
    );
  }, [limitSearchTerm, limits]);

  const handleUpdateLimit = useCallback(
    async (limitId: string) => {
      if (!session?.access_token) {
        return;
      }

      const parsed = Number(limitDraftValues[limitId]);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setLimitsError("Informe um limite válido (0 ou maior).");
        return;
      }

      try {
        const response = await fetch("/api/resource-limits", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ limitId, limit: parsed }),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar limite.");
        }

        setLimits((prev) =>
          prev.map((limit) =>
            limit.id === limitId ? { ...limit, limit: parsed } : limit
          )
        );
        setEditingLimitId(null);
      } catch (err) {
        console.error(err);
        setLimitsError("Não foi possível atualizar o limite.");
      }
    },
    [limitDraftValues, session?.access_token]
  );

  const handleCancelLimitEdit = useCallback(
    (limitId: string) => {
      const original = limits.find((limit) => limit.id === limitId);
      setLimitDraftValues((prev) => ({
        ...prev,
        [limitId]: original ? String(original.limit ?? 0) : "",
      }));
      setEditingLimitId(null);
    },
    [limits]
  );

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

  const allResourceTypes = useMemo(() => {
    const fromOtherEntries = otherEntries.map((entry) => entry.resourceType);
    const fromMachineResources = machineEntries.flatMap((machine) =>
      machine.resources.map((resource) => resource.resourceType)
    );
    const fromPricing = Object.keys(resourcePricing);
    const fromBasePricing = Object.keys(basePricing);
    const fromEffectivePricing = Object.keys(effectivePricing);
    const defaults = Object.keys(resourceTypeLabels);
    return Array.from(
      new Set([
        ...defaults,
        ...fromOtherEntries,
        ...fromMachineResources,
        ...fromPricing,
        ...fromBasePricing,
        ...fromEffectivePricing,
      ])
    )
      .map((resourceType) => normalizePricingResourceType(resourceType))
      .filter((resourceType) => validPricingResourceTypes.has(resourceType))
      .sort();
  }, [basePricing, effectivePricing, machineEntries, otherEntries, resourcePricing]);

  const totals = useMemo(() => {
    const distributorMachinesTotal = machineEntries.reduce(
      (acc, machine) => acc + (machine.totalInCents ?? 0),
      0
    );
    const distributorOthersTotal = otherEntries.reduce(
      (acc, entry) => acc + (entry.totalInCents ?? 0),
      0
    );
    const originalMachinesTotal = machineEntries.reduce(
      (acc, machine) =>
        acc + (machine.originalTotalInCents ?? machine.totalInCents ?? 0),
      0
    );
    const originalOthersTotal = otherEntries.reduce(
      (acc, entry) =>
        acc + (entry.originalTotalInCents ?? entry.totalInCents ?? 0),
      0
    );
    const eventsCount =
      machineEntries.reduce(
        (acc, machine) => acc + machine.resources.length,
        0
      ) + otherEntries.length;

    return {
      distributorTotalInCents:
        distributorMachinesTotal + distributorOthersTotal,
      originalTotalInCents: originalMachinesTotal + originalOthersTotal,
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

  const effectiveBillingType = billingPolicy?.effectiveBillingType;
  const canEditBillingType = billingPolicy?.canEditBillingType ?? false;
  const isPoolMode = effectiveBillingType === "POOL";

  return (
    <div className="flex flex-col h-full">
      <Header />
      <PageHeader2
        title={`Fatura - ${clientName}`}
        el1name="Total do distribuidor (mensal)"
        el1value={formatCurrency(totals.distributorTotalInCents)}
        el2name="Eventos registrados"
        el2value={totals.events.toString()}
      />
      <div className="flex flex-col px-20 -translate-y-10 gap-6">
        <div className="rounded-2xl border border-tools-table-outline bg-white px-6 py-5 shadow-sm">
          <h3 className="text-base font-semibold">Política de cobrança do cliente</h3>
          <p className="text-sm text-gray-500 mt-1">
            O distribuidor acima define as regras base. Se ele for limitado (POOL),
            este cliente também será limitado.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant={billingPolicy?.billingType === "POOL" ? "primary" : "ghost"}
              className="rounded-xl px-4 py-2"
              disabled={
                pricingSaving || pricingLoading || !canEditBillingType || !billingPolicy
              }
              onClick={() => updateBillingPolicy("POOL")}
            >
              Limitado pelos recursos
            </Button>
            <Button
              variant={billingPolicy?.billingType === "PAYG" ? "primary" : "ghost"}
              className="rounded-xl px-4 py-2"
              disabled={
                pricingSaving || pricingLoading || !canEditBillingType || !billingPolicy
              }
              onClick={() => updateBillingPolicy("PAYG")}
            >
              Pagar por cada recurso
            </Button>
            {billingPolicy && (
              <span className="text-sm text-gray-600">
                Modo efetivo atual:{" "}
                <strong>
                  {billingPolicy.effectiveBillingType === "POOL"
                    ? "Limitado pelos recursos"
                    : "Pagar por cada recurso"}
                </strong>
              </span>
            )}
          </div>
          {billingPolicy?.parentEffectiveBillingType === "POOL" &&
            !canEditBillingType && (
            <p className="text-xs text-amber-700 mt-2">
              O distribuidor acima está em modo limitado. Por isso este cliente não
              pode ser PAYG.
            </p>
            )}
        </div>

        {isPoolMode && (
          <div className="rounded-2xl border border-tools-table-outline bg-white px-6 py-6 shadow-sm">
            <h3 className="text-base font-semibold">Cliente em modo limitado</h3>
            <p className="text-sm text-gray-600 mt-2">
              Neste modo, você gerencia limites de recursos nesta própria aba.
            </p>
            <div className="mt-4 flex w-full max-w-md bg-[#F2F2F2] items-center p-2 rounded-xl h-11">
              <input
                type="text"
                className="outline-none ml-1 h-max placeholder-[#999999] bg-transparent flex-1 text-sm"
                placeholder="Buscar recurso..."
                value={limitSearchTerm}
                onChange={(event) => setLimitSearchTerm(event.target.value)}
              />
            </div>
            {limitsLoading && (
              <p className="text-sm text-gray-500 mt-4">Carregando limites...</p>
            )}
            {limitsError && (
              <p className="text-sm text-red-500 mt-4">{limitsError}</p>
            )}
            {!limitsLoading && !limitsError && (
              <div className="mt-4 overflow-hidden rounded-xl border border-tools-table-outline">
                <table className="w-full">
                  <thead className="bg-[#FAFAFA] text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Recurso</th>
                      <th className="px-4 py-3 text-left">Uso atual</th>
                      <th className="px-4 py-3 text-right">Limite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLimits.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          Nenhum limite encontrado.
                        </td>
                      </tr>
                    )}
                    {filteredLimits.map((limit) => (
                      <tr
                        key={limit.id}
                        className="border-t border-tools-table-outline bg-white"
                      >
                        <td className="px-4 py-4">
                          {resourceTypeLabels[limit.type] ?? limit.type}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatUsage(limit.type, limit.used)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          {editingLimitId === limit.id ? (
                            <div className="inline-flex items-center justify-end gap-2">
                              <input
                                type="number"
                                min={0}
                                className="h-9 w-24 rounded border border-[#DCDCDC] px-2 text-right outline-none"
                                value={limitDraftValues[limit.id] ?? ""}
                                onChange={(event) =>
                                  setLimitDraftValues((prev) => ({
                                    ...prev,
                                    [limit.id]: event.target.value,
                                  }))
                                }
                              />
                              <span className="text-xs text-gray-500">
                                {resourceUnitLabels[limit.type] ?? "unid."}
                              </span>
                              <Button
                                variant="primary"
                                className="rounded-lg px-3 py-1.5 text-xs"
                                onClick={() => handleUpdateLimit(limit.id)}
                              >
                                Salvar
                              </Button>
                              <Button
                                variant="ghost"
                                className="rounded-lg px-3 py-1.5 text-xs"
                                onClick={() => handleCancelLimitEdit(limit.id)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-end gap-2">
                              <span className="font-semibold text-sm">
                                {limit.limit > 0 ? limit.limit : "Ilimitado"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {resourceUnitLabels[limit.type] ?? "unid."}
                              </span>
                              <Button
                                variant="ghost"
                                className="rounded-lg px-3 py-1.5 text-xs"
                                onClick={() => setEditingLimitId(limit.id)}
                              >
                                Editar
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!isPoolMode && (
          <>
        <div className="rounded-2xl border border-tools-table-outline bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">
                Custos por tipo de recurso (distribuidor)
              </h3>
              <p className="text-sm text-gray-500">
                Defina o valor por unidade para este cliente.
              </p>
            </div>
            <button
              type="button"
              className="text-sm text-[#0f3759] underline underline-offset-2"
              disabled={pricingSaving || pricingLoading}
              onClick={async () => {
                setResourcePricing({});
                setResourcePricingDraft({});
                await savePricing({});
              }}
            >
              Limpar customizações
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {allResourceTypes.map((resourceType) => {
              const customValue = resourcePricing[resourceType];
              const baseValue = basePricing[resourceType] ?? 0;
              const effectiveValue = effectivePricing[resourceType] ?? 0;
              return (
                <label
                  key={resourceType}
                  className="rounded-xl border border-[#E6E6E6] px-3 py-3"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {resourceTypeLabels[resourceType] ?? resourceType}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Base herdada: {formatCurrency(baseValue)} por unidade
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-600">R$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={resourcePricingDraft[resourceType] ?? ""}
                      onChange={(event) => {
                        setResourcePricingDraft((prev) => ({
                          ...prev,
                          [resourceType]: event.target.value,
                        }));
                      }}
                      className="h-10 w-full rounded-lg border border-[#DCDCDC] px-3 outline-none"
                      placeholder={customValue !== undefined ? "" : "Herdar base"}
                      disabled={pricingSaving || pricingLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Custo efetivo: {formatCurrency(effectiveValue)} por unidade
                  </p>
                </label>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              className="rounded-xl px-5 py-2"
              disabled={pricingSaving || pricingLoading || !domainId}
              onClick={() => savePricing(resourcePricingDraft)}
            >
              {pricingSaving ? "Salvando..." : "Salvar custos do distribuidor"}
            </Button>
            {pricingLoading && (
              <span className="text-sm text-gray-500">
                Carregando custos atuais...
              </span>
            )}
            {pricingError && (
              <span className="text-sm text-red-500">{pricingError}</span>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span>Total original: {formatCurrency(totals.originalTotalInCents)}</span>
            {" • "}
            <span>
              Total com custos do distribuidor:{" "}
              {formatCurrency(totals.distributorTotalInCents)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-tools-table-outline bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div></div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Button
              variant="primary"
              className="rounded-xl px-6 py-3"
              disabled={downloadingInvoice || !queryParam}
              onClick={handleGenerateInvoice}
            >
              {downloadingInvoice ? "Gerando PDF..." : "Gerar fatura (PDF)"}
            </Button>
            {exportError && (
              <p className="text-xs text-red-500">{exportError}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="flex w-full max-w-lg bg-[#F2F2F2] items-center p-2 rounded-xl h-13">
            <input
              type="text"
              className="outline-none ml-1 h-max placeholder-[#999999] bg-transparent flex-1"
              placeholder="Pesquisar máquina, recurso ou tipo..."
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
                  <th className="px-4 py-3 text-left">Descrição</th>
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
                      Nenhum evento de faturamento encontrado para este cliente.
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
                            {(machine.originalTotalInCents ?? machine.totalInCents) !==
                              (machine.totalInCents ?? 0) && (
                              <p className="text-xs font-normal text-gray-500">
                                Original:{" "}
                                {formatCurrency(
                                  machine.originalTotalInCents ??
                                    machine.totalInCents ??
                                    0
                                )}
                              </p>
                            )}
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
                                              {(resource.originalTotalInCents ??
                                                resource.totalInCents) !==
                                                (resource.totalInCents ?? 0) && (
                                                <p className="text-xs font-normal text-gray-500">
                                                  Original:{" "}
                                                  {formatCurrency(
                                                    resource.originalTotalInCents ??
                                                      resource.totalInCents ??
                                                      0
                                                  )}
                                                </p>
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
                        {(entry.originalTotalInCents ?? entry.totalInCents) !==
                          (entry.totalInCents ?? 0) && (
                          <p className="text-xs font-normal text-gray-500">
                            Original:{" "}
                            {formatCurrency(
                              entry.originalTotalInCents ?? entry.totalInCents ?? 0
                            )}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
