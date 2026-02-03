"use client";

import { Button } from "@/components/atomic/Button";
import { Input } from "@/components/atomic/Input";
import { SearchInput } from "@/components/atomic/SearchInput";
import SelectableDataTable, {
  DataTableRow,
} from "@/components/atomic/SelectableDataTable";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/stores/alert.store";
import { useNetworkStore } from "@/stores/network.store";
import { Modal } from "../atomic/Modal";
import { useProjectsStore } from "@/stores/user-project.store";
import { SelectableDropdown } from "@/components/atomic/SelectableDropdown";
import {
  InstanceOffer,
  useInstanceOfferStore,
} from "@/stores/instance-offer.store";
import {
  Template,
  useTemplateStore,
} from "@/stores/template.store";

const DEFAULT_PROFILE_LABEL = "Outros";

export function NewMachineForm() {
  const session = useSession();
  const [machineName, setMachineName] = useState("");
  const [machinePassword, setMachinePassword] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<DataTableRow | null>(
    null
  );
  const [selectedOs, setSelectedOs] = useState<Template | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<InstanceOffer | null>(
    null
  );
  const [zoneId, setZoneId] = useState("");
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { networks, setNetworks } = useNetworkStore();
  const { offers, setOffers } = useInstanceOfferStore();
  const { templates, setTemplates } = useTemplateStore();
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

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

  const router = useRouter();
  const { showAlert } = useAlertStore();

  const toggleProfile = (profile: string) => {
    setExpandedProfile((prev) => (prev === profile ? null : profile));
  };

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

  useEffect(() => {
    async function fetchOffersAndTemplates() {
      if (session.data?.access_token) {
        const offersResponse = await fetch("/api/machines", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data.access_token}`,
          },
        });

        if (offersResponse.ok) {
          const result = await offersResponse.json();
          setOffers(result.message.offers);
        }

        const templateResponse = await fetch("/api/machines?resource=templates", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data.access_token}`,
          },
        });

        if (templateResponse.ok) {
          const result = await templateResponse.json();
          setTemplates(result.message.templates);
        }
      }
    }

    fetchOffersAndTemplates();
  }, [session, setOffers, setTemplates]);

  const offersByProfile = useMemo(() => {
    return offers.reduce<Record<string, InstanceOffer[]>>((acc, offer) => {
      const profileKey = offer.profile ?? DEFAULT_PROFILE_LABEL;
      if (!acc[profileKey]) {
        acc[profileKey] = [];
      }
      acc[profileKey].push(offer);
      return acc;
    }, {});
  }, [offers]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = session.data?.access_token; // Replace with actual token retrieval
    const projectId = currentProjectId; // Replace with actual project ID

    if (selectedNetwork && selectedOs && selectedOffer && zoneId) {
      try {
        const response = await fetch("/api/machines/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: machineName,
            projectId,
            offerId: selectedOffer.id,
            templateId: selectedOs.id,
            networkId: selectedNetwork.id,
            zoneId,
          }),
        });

        if (response.ok) {
          showAlert("Máquina criada com sucesso!", "success");
          router.push("/machines");
        } else {
          console.error("Failed to create machine");
          showAlert("Erro na criação da máquina.", "error");
        }
      } catch (error) {
        console.error("Error creating machine:", error);
      }
    }
  };

  return (
    <form
      id="new-machine-form"
      onSubmit={handleSubmit}
      className="flex flex-col w-full px-18 mt-12"
    >
      <div className="flex flex-col gap-10">
        <h2 className="text-2xl font-bold">Dados Gerais</h2>
        <div className="flex flex-row gap-20">
          <span className="flex flex-1 flex-col">
            <p className="text-lg ">Nome da máquina</p>
            <Input
              className="mt-2"
              placeholder="Digite aqui..."
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
            />
          </span>
          <span className="flex flex-1 flex-col">
            <p className="text-lg">Senha da máquina</p>
            <Input
              className="mt-2"
              placeholder="Digite aqui..."
              value={machinePassword}
              onChange={(e) => setMachinePassword(e.target.value)}
            />
          </span>
        </div>
        <div className="flex flex-col">
          <p className="mb-2 text-lg">Zona</p>
          <SelectableDropdown
            items={zoneOptions}
            placeholder="Selecione a zona..."
            onSelect={(id: string) => setZoneId(id)}
          />
        </div>
      </div>

      <div className="flex justify-between items-end mt-16 mb-2">
        <h2 className="text-3xl font-bold">Redes disponíveis</h2>
        <span className="flex items-center gap-3">
          <SearchInput />
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Criar nova rede
          </Button>
        </span>
      </div>

      <SelectableDataTable
        name="networks"
        headers={["Nome", "Gateway", "Netmask"]}
        rows={networks.map((net) => ({
          id: net.id,
          data: [net.name, net.gateway, net.netmask],
        }))}
        onRowSelected={setSelectedNetwork}
      />
      <div className="flex justify-between n items-end mt-16 mb-2">
        <h2 className="text-3xl font-bold">Sistemas Operacionais</h2>
        <SearchInput />
      </div>
      {templates.length === 0 ? (
        <p className="text-sm text-gray-600">
          Nenhum template disponível. Verifique com um administrador.
        </p>
      ) : (
        <SelectableDataTable
          name="os"
          headers={["Nome", "Descrição"]}
          rows={templates.map((template) => ({
            id: template.id,
            data: [template.name, template.url ?? "-"],
          }))}
          onRowSelected={(row) => {
            const template = templates.find((t) => t.id === row.id);
            if (template) {
              setSelectedOs(template);
            }
          }}
        />
      )}
      <div className="flex flex-col gap-6 mt-16">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-bold">Ofertas</h2>
        </div>
        {Object.keys(offersByProfile).length === 0 && (
          <p className="text-sm text-gray-600">
            Nenhuma oferta disponível. Verifique com um administrador.
          </p>
        )}
        {Object.entries(offersByProfile).map(([profile, profileOffers]) => {
          const selectedProfileKey = selectedOffer
            ? selectedOffer.profile ?? DEFAULT_PROFILE_LABEL
            : null;
          const isSelectedProfile = selectedProfileKey === profile;
          const isOpen = expandedProfile
            ? expandedProfile === profile
            : isSelectedProfile;

          return (
            <div key={profile} className="flex flex-col gap-2 border rounded-xl">
              <button
                type="button"
                className={`flex items-center justify-between px-4 py-3 text-left ${
                  isSelectedProfile
                    ? "bg-[#F0F8FF] border-l-4 border-[#0F3759]"
                    : "bg-[#FAFAFA]"
                }`}
                onClick={() => toggleProfile(profile)}
              >
                <span className="font-semibold text-lg text-[#2D2D2D]">
                  {profile}
                </span>
                <span className="text-sm text-[#666]">
                  {isOpen ? "Recolher" : "Expandir"}
                </span>
              </button>
              {isOpen && (
                <div className="overflow-hidden border-t border-tools-table-outline">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAFAFA]">
                      <tr>
                        <th className="w-10"></th>
                        <th className="p-3 text-sm font-semibold text-gray-600">
                          Nome
                        </th>
                        <th className="p-3 text-sm font-semibold text-gray-600">
                          vCPU
                        </th>
                        <th className="p-3 text-sm font-semibold text-gray-600">
                          RAM
                        </th>
                        <th className="p-3 text-sm font-semibold text-gray-600">
                          Disco padrão
                        </th>
                        <th className="p-3 text-sm font-semibold text-gray-600">
                          Tier
                        </th>
                        <th className="p-3 text-sm font-semibold text-gray-600">
                          SKU
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {profileOffers.map((offer) => (
                        <tr
                          key={offer.id}
                          className={`border-t transition-colors ${
                            selectedOffer?.id === offer.id
                              ? "bg-[#E8F2FF]"
                              : "bg-white"
                          }`}
                        >
                          <td className="p-3">
                            <input
                              type="radio"
                              name="compute-offer"
                              className="h-5 w-5 accent-[#0F3759]"
                              checked={selectedOffer?.id === offer.id}
                              onChange={() => {
                                setSelectedOffer(offer);
                                setExpandedProfile(profile);
                              }}
                            />
                          </td>
                          <td className="p-3 font-medium text-gray-800">
                            {offer.name}
                          </td>
                          <td className="p-3 text-gray-700">
                            {offer.cpuNumber} vCPU
                          </td>
                          <td className="p-3 text-gray-700">
                            {Math.round(offer.memoryInMb / 1024)} GB
                          </td>
                          <td className="p-3 text-gray-700">
                            {offer.rootDiskSizeInGb} GB
                          </td>
                          <td className="p-3 text-gray-700">
                            {offer.diskTier ?? "-"}
                          </td>
                          <td className="p-3 text-gray-700">
                            {offer.sku ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {selectedOffer && (
          <div className="border border-[#0F3759] bg-[#E8F2FF] rounded-xl p-4 text-sm text-gray-700 shadow-sm">
            <p className="font-semibold text-base mb-2 flex items-center gap-2 text-[#0F3759]">
              Oferta selecionada
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <span className="flex flex-col">
                <p className="text-xs text-gray-500">Nome</p>
                <p className="font-medium text-[#0F3759]">
                  {selectedOffer.name}
                </p>
              </span>
              <span className="flex flex-col">
                <p className="text-xs text-gray-500">vCPU</p>
                <p className="font-medium text-[#0F3759]">
                  {selectedOffer.cpuNumber}
                </p>
              </span>
              <span className="flex flex-col">
                <p className="text-xs text-gray-500">RAM</p>
                <p className="font-medium text-[#0F3759]">
                  {Math.round(selectedOffer.memoryInMb / 1024)} GB
                </p>
              </span>
              <span className="flex flex-col">
                <p className="text-xs text-gray-500">Disco padrão</p>
                <p className="font-medium text-[#0F3759]">
                  {selectedOffer.rootDiskSizeInGb} GB{" "}
                  {selectedOffer.diskTier ?? ""}
                </p>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="mb-14"></div>
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
            >
              Fechar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="inline-flex text-md col-start-4 col-span-2"
            >
              Salvar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col ">
            <p>Nome da rede</p>
            <Input placeholder="Digite aqui..." className="mt-2" />
          </div>
          <div className="flex flex-col ">
            <p>Gateway</p>
            <Input placeholder="Digite aqui..." className="mt-2" />
          </div>
          <div className="flex flex-col ">
            <p>Netmask</p>
            <Input placeholder="Digite aqui..." className="mt-2 " />
          </div>
        </div>
      </Modal>
    </form>
  );
}
