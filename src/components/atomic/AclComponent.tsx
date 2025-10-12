"use client";

import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { SearchInput } from "./SearchInput";
import { Button } from "./Button";
import DataTable from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { SelectableDropdown } from "./SelectableDropdown";
import { AclRule } from "@/stores/acl.store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAlertStore } from "@/stores/alert.store";

export interface AclComponentProps {
  id: string;
  name: string;
  description: string;
  rules: AclRule[];
}

export default function AclComponent(props: AclComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [ip, setIp] = useState("");
  const [startPort, setStartPort] = useState("");
  const [endPort, setEndPort] = useState("");
  const [action, setAction] = useState<string | null>(null);
  const [trafficType, setTrafficType] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<string | null>(null);
  const session = useSession();
  const router = useRouter();
  const { showAlert } = useAlertStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = session.data?.access_token;

    if (ip && startPort && endPort && action && trafficType && protocol) {
      try {
        const response = await fetch("/api/acl/create-rule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            aclId: props.id,
            ip,
            action,
            startPort,
            endPort,
            trafficType,
            protocol,
            description: "",
          }),
        });

        if (response.ok) {
          showAlert(
            `Regra ACL criada com sucesso na lista ${props.name}`,
            "success"
          );
          router.push("/acls");
        } else {
          showAlert(
            `Erro na criação da regra ACL na lista ${props.name}`,
            "error"
          );
        }
        setIsModalOpen(false);
      } catch (e) {
        console.error("Error creating acl rule", e);
      }
    }

    console.log({
      id: props.id,
      ip,
      startPort,
      endPort,
      action,
      trafficType,
      protocol,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="heading"
        aria-controls="body"
        className={`border rounded-lg grid grid-cols-3 p-14 cursor-pointer hover:bg-gray-100 flex-1 ${
          isOpen ? "bg-gray-100" : "bg-white"
        }`}
      >
        <div className="col-span-1 flex  items-center">
          <h2 className="text-2xl font-semibold">{props.name}</h2>
        </div>
        <div className="col-span-2 flex justify-between ">
          <div className="pr-28   ">
            <p>{props.description}</p>
          </div>
          <div
            className={`${
              isOpen ? "rotate-180" : ""
            } transition-transform duration-300`}
          >
            <ChevronDown size={32} />
          </div>
        </div>
      </button>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } border-l border-r border-b rounded-b-lg -translate-y-2 pt-2`}
        id="body"
        aria-labelledby="heading"
      >
        <div className="flex justify-between px-8 p-4 py-6">
          <SearchInput />
          <Button
            variant="primary"
            className="w-38"
            onClick={() => setIsModalOpen(true)}
          >
            Nova Regra
          </Button>
        </div>
        <div className="px-8 mb-8">
          <DataTable
            headers={["IP", "Ação", "Protocolo", "Porta", "Tipo"]}
            rows={props.rules.map((r) => ({
              id: r.id,
              data: [
                r.cidr,
                <StatusBadge status={r.action} key={r.id} />,
                r.protocol,
                `${r.startPort}-${r.endPort}`,
                r.trafficType === "egress" ? "Saída" : "Entrada",
              ],
            }))}
          />
        </div>
      </div>
      {isClient &&
        createPortal(
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            header={<h2 className="text-lg m-1 font-medium  ">Criar Regra</h2>}
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
                  form="new-acl-rule-form"
                >
                  Salvar
                </Button>
              </>
            }
          >
            <form id="new-acl-rule-form" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <span>
                  <p>IP</p>
                  <Input
                    className="mt-1"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                  />
                </span>

                <span className="flex flex-row gap-6 mt-2">
                  <span>
                    <p>Porta inicial</p>
                    <Input
                      value={startPort}
                      onChange={(e) => setStartPort(e.target.value)}
                    />
                  </span>
                  <span>
                    <p>Porta final</p>
                    <Input
                      value={endPort}
                      onChange={(e) => setEndPort(e.target.value)}
                    />
                  </span>
                </span>
                <span className="flex flex-row items-center justify-between gap-5">
                  <span className="f">
                    <p className="mb-1">Ação</p>
                    <SelectableDropdown
                      items={[
                        { id: "deny", name: "Deny" },
                        { id: "allow", name: "Allow" },
                      ]}
                      onSelect={(item) => setAction(item)}
                      placeholder="Selecione..."
                    />
                  </span>
                  <span className="flex flex-col flex-1 mt-2">
                    <p>Tipo</p>
                    <SelectableDropdown
                      items={[
                        { id: "ingress", name: "Entrada" },
                        { id: "egress", name: "Saída" },
                      ]}
                      onSelect={(item) => setTrafficType(item)}
                      placeholder="Selecione..."
                    />
                  </span>
                </span>
                <span className="flex flex-col flex-1 mt-2">
                  <p>Protocolo</p>
                  <SelectableDropdown
                    items={[
                      { id: "UDP", name: "UDP" },
                      { id: "TCP", name: "TCP" },
                      { id: "ALL", name: "ALL" },
                    ]}
                    onSelect={(item) => setProtocol(item)}
                    placeholder="Selecione..."
                  />
                </span>
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </div>
  );
}
