"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { Header } from "@/components/atomic/Header";
import { Input } from "@/components/atomic/Input";
import { Modal } from "@/components/atomic/Modal";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import { SearchInput } from "@/components/atomic/SearchInput";
import { SelectableDropdown } from "@/components/atomic/SelectableDropdown";
import { useAclStore } from "@/stores/acl.store";
import { useAlertStore } from "@/stores/alert.store";
import { useNetworkStore } from "@/stores/network.store";
import { useProjectsStore } from "@/stores/user-project.store";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

const DEFAULT_CIDR = process.env.NEXT_PUBLIC_DEFAULT_CIDR ?? "";

function sanitizeIpv4Input(value: string): string {
  const clean = value.replace(/[^\d.]/g, "");
  const rawParts = clean.split(".");
  const parts: string[] = [];

  for (let i = 0; i < rawParts.length && i < 4; i++) {
    if (rawParts[i].length === 0) {
      parts.push("");
      continue;
    }
    parts.push(rawParts[i].slice(0, 3));
  }

  return parts.join(".");
}

function isValidIpv4(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function ipv4ToInt(value: string): number {
  const parts = value.split(".").map(Number);
  return (
    ((parts[0] << 24) >>> 0) +
    ((parts[1] << 16) >>> 0) +
    ((parts[2] << 8) >>> 0) +
    (parts[3] >>> 0)
  );
}

function parseCidr(cidr: string):
  | { networkInt: number; broadcastInt: number; prefix: number }
  | null {
  const [ip, prefixText] = cidr.split("/");
  const prefix = Number(prefixText);
  if (!ip || Number.isNaN(prefix) || prefix < 0 || prefix > 32) return null;
  if (!isValidIpv4(ip)) return null;

  const ipInt = ipv4ToInt(ip);
  const mask =
    prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0) & 0xffffffff;
  const networkInt = ipInt & mask;
  const broadcastInt = networkInt | (~mask >>> 0);

  return { networkInt, broadcastInt, prefix };
}

function netmaskToPrefix(netmask: string): number | null {
  if (!isValidIpv4(netmask)) return null;
  const value = ipv4ToInt(netmask);
  let foundZero = false;
  let prefix = 0;

  for (let i = 31; i >= 0; i--) {
    const bit = (value >>> i) & 1;
    if (bit === 1 && foundZero) return null;
    if (bit === 1) {
      prefix++;
    } else {
      foundZero = true;
    }
  }

  return prefix;
}

export default function NetworksPage() {
  const session = useSession();
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { networks, setNetworks } = useNetworkStore();
  const { showAlert } = useAlertStore();
  const { acls } = useAclStore();

  const [networkName, setNetworkName] = useState("");
  const [networkGateway, setNetworkGateway] = useState("");
  const [networkNetmask, setNetworkNetmask] = useState("");
  const [aclId, setAclId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const { currentProjectId } = useProjectsStore();
  const zoneOptions = [
    {
      id: process.env.NEXT_PUBLIC_ZONE_VINHEDO_ID ?? "",
      name: "Vinhedo",
    },
    {
      id: process.env.NEXT_PUBLIC_ZONE_FORTALEZA_ID ?? "",
      name: "Fortaleza",
    },
  ].filter((zone) => zone.id);

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
            projectId: currentProjectId,
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
  }, [session, setNetworks, currentProjectId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = session.data?.access_token;
    const projectId = currentProjectId;
    const cidr = parseCidr(DEFAULT_CIDR);

    if (!isValidIpv4(networkGateway)) {
      showAlert("Gateway inválido. Use formato IPv4 (ex: 10.128.10.1).", "error");
      return;
    }

    if (!isValidIpv4(networkNetmask)) {
      showAlert("Netmask inválida. Use formato IPv4 (ex: 255.255.255.0).", "error");
      return;
    }

    const netmaskPrefix = netmaskToPrefix(networkNetmask);
    if (netmaskPrefix === null) {
      showAlert("Netmask inválida. Máscara deve ser contínua.", "error");
      return;
    }

    if (cidr) {
      const gatewayInt = ipv4ToInt(networkGateway);
      const insideCidr =
        gatewayInt > cidr.networkInt && gatewayInt < cidr.broadcastInt;
      if (!insideCidr) {
        showAlert(
          `Gateway fora do CIDR padrão (${DEFAULT_CIDR}).`,
          "error"
        );
        return;
      }

      if (netmaskPrefix < cidr.prefix) {
        showAlert(
          `Netmask inválida para o CIDR padrão (${DEFAULT_CIDR}).`,
          "error"
        );
        return;
      }
    }

    if (networkName && networkGateway && networkNetmask && aclId && zoneId) {
      try {
        const response = await fetch(`/api/networks/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: networkName,
            projectId: projectId,
            gateway: networkGateway,
            netmask: networkNetmask,
            aclId: aclId,
            zoneId,
          }),
        });

        if (response.ok) {
          showAlert("Rede criada com sucesso!", "success");
        } else {
          console.error("Failed to create machine");
          showAlert("Erro na criação da rede.", "error");
        }
        setIsModalOpen(false);
      } catch (e) {
        console.error("Error creating machine:", e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader2
        title="Redes"
        el1name="Total de redes"
        el1value={String(networks.length)}
        el2name="Redes em uso"
        el2value={String(networks.length)}
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
            headers={["Nome", "Gateway", "Netmask", "ACL", "Tipo"]}
            rows={networks.map((net) => ({
              id: net.id,
              data: [
                net.name,
                net.gateway || "-",
                net.netmask || "-",
                net.aclName || "-",
                net.isL2 ? (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    L2
                  </span>
                ) : (
                  "-"
                ),
              ],
            }))}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} id="new-network-form">
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
                type="button"
              >
                Fechar
              </Button>
              <Button
                variant="primary"
                className="inline-flex text-md col-start-4 col-span-2"
                type="submit"
              >
                Salvar
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col ">
              <p>Nome da rede</p>
              <Input
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
                placeholder="Digite aqui..."
                className="mt-2"
              />
            </div>
            <div className="flex flex-col ">
              <p>Gateway</p>
              <Input
                value={networkGateway}
                onChange={(e) =>
                  setNetworkGateway(sanitizeIpv4Input(e.target.value))
                }
                placeholder={
                  DEFAULT_CIDR
                    ? `IPv4 dentro de ${DEFAULT_CIDR}`
                    : "Ex: 10.128.10.1"
                }
                className="mt-2"
              />
            </div>
            <div className="flex flex-col ">
              <p>Netmask</p>
              <Input
                value={networkNetmask}
                onChange={(e) =>
                  setNetworkNetmask(sanitizeIpv4Input(e.target.value))
                }
                placeholder="Ex: 255.255.255.0"
                className="mt-2"
              />
            </div>
            <div className="flex flex-col ">
              <p className="mb-2">Zona</p>
              <div className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white">
                {zoneOptions.map((zone, index) => (
                  <label
                    key={zone.id}
                    className={`flex cursor-pointer items-center justify-between px-3 py-3 text-sm text-[#2E2E2E] ${
                      index > 0 ? "border-t border-[#E5E7EB]" : ""
                    }`}
                  >
                    <span>{zone.name}</span>
                    <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#9AA4B2] bg-white">
                      <input
                        type="checkbox"
                        checked={zoneId === zone.id}
                        onChange={() =>
                          setZoneId((current) =>
                            current === zone.id ? "" : zone.id
                          )
                        }
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      {zoneId === zone.id ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1F4D78]" />
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col ">
              <p className="mb-2">ACL List</p>
              <SelectableDropdown
                items={acls.map((acl) => ({
                  id: acl.id,
                  name: acl.name,
                }))}
                placeholder="Selecione uma ACL..."
                onSelect={(id: string) => setAclId(id)}
              />
            </div>
          </div>
        </Modal>
      </form>
    </div>
  );
}
