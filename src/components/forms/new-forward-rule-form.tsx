"use client";

import { Button } from "@/components/atomic/Button";
import { Input } from "@/components/atomic/Input";
import { Modal } from "@/components/atomic/Modal";
import { useAlertStore } from "@/stores/alert.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useProjectsStore } from "@/stores/user-project.store";
import { Separator } from "@radix-ui/react-separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SelectableDropdown } from "../atomic/SelectableDropdown";
import { usePublicIpStore } from "@/stores/public-ip-store";
import { useVMStore } from "@/stores/vm-store";

interface NewAclForwardRuleForm {
  isOpen: boolean;
  onClose: () => void;
}

export function NewForwardRuleForm({ isOpen, onClose }: NewAclForwardRuleForm) {
  const [privatePortStart, setPrivatePortStart] = useState("");
  const [privatePortEnd, setPrivatePortEnd] = useState("");
  const [publicPortStart, setPublicPortStart] = useState("");
  const [publicPortEnd, setPublicPortEnd] = useState("");
  const [protocol, setProtocol] = useState("");
  const [ip, setIp] = useState("");
  const [virtualMachine, setVirtualMachine] = useState("");
  const [cidr, setCidr] = useState("");

  const [loading, setLoading] = useState(false);
  const { currentProjectId } = useProjectsStore();
  const session = useSession();
  const { showAlert } = useAlertStore();
  const router = useRouter();
  const { ips, setIps } = usePublicIpStore();
  const { machines } = useVMStore();

  const handleSubmit = async (event: FormEvent) => {
    // event.preventDefault();
    // setLoading(true);
    // const token = session.data?.access_token;
    // if (name) {
    //   try {
    //     const response = await fetch("/api/acl/create", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify({
    //         name: name,
    //         projectId: currentProjectId,
    //         description: description,
    //       }),
    //     });
    //     if (response.ok) {
    //       showAlert(`Lista ${name} criada com sucesso!`, "success");
    //       router.push("/acls");
    //     } else {
    //       console.error("Failed to create ACL list");
    //       showAlert("Erro na criação da lista", "error");
    //     }
    //     onClose();
    //   } catch (error) {
    //     console.error("Error creating machine:", error);
    //   }
    // }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h2 className="text-lg m-1 font-medium  ">Criar Regra</h2>}
      footer={
        <>
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex self-start text-md "
            type="button"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="inline-flex text-md col-start-4 col-span-2"
            type="submit"
            form="new-acl-form"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </>
      }
    >
      <form id="new-acl-form" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <p className=" font-semibold mb-2">Porta Privada</p>
          <div className="flex gap-5">
            <span className="flex-col space-y-1">
              <p>Início</p>
              <Input
                value={privatePortStart}
                onChange={(e) => setPrivatePortStart(e.target.value)}
              />
            </span>
            <span className="flex-col space-y-1">
              <p>Fim</p>
              <Input
                value={privatePortEnd}
                onChange={(e) => setPrivatePortEnd(e.target.value)}
              />
            </span>
          </div>

          <span className=" bg-[#E6E6E6] h-px my-4 mb-5"></span>

          <p className=" font-semibold mb-2">Porta Pública</p>
          <div className="flex gap-5">
            <span className="flex-col space-y-1">
              <p>Início</p>
              <Input
                value={publicPortStart}
                onChange={(e) => setPublicPortStart(e.target.value)}
              />
            </span>
            <span className="flex-col space-y-1">
              <p>Fim</p>
              <Input
                value={publicPortEnd}
                onChange={(e) => setPublicPortEnd(e.target.value)}
              />
            </span>
          </div>

          <span className=" bg-[#E6E6E6] h-px my-4 mb-5"></span>

          <div></div>

          <span className="flex-col gap-1 space-y-1">
            <p>Protocolo</p>
            <SelectableDropdown
              items={[
                { id: "UDP", name: "UDP" },
                { id: "TCP", name: "TCP" },
                { id: "ALL", name: "ALL" },
              ]}
              onSelect={(value) => setProtocol(value)}
              placeholder="Selecione..."
            ></SelectableDropdown>
          </span>
          <div className="flex justify-center items-center gap-5 mt-5">
            <span className="flex-col gap-1 space-y-1 flex-1">
              <p>IP</p>
              <SelectableDropdown
                items={ips.map((ip) => ({
                  id: ip.id,
                  name: ip.address,
                }))}
                onSelect={(value) => setIp(value)}
                placeholder="Selecione..."
              ></SelectableDropdown>
            </span>
            <span className="flex-col gap-1 space-y-1 flex-1">
              <p>Máquina Virtual</p>
              <SelectableDropdown
                items={machines.map((m) => ({
                  id: m.id,
                  name: m.name,
                }))}
                onSelect={(value) => setVirtualMachine(value)}
                placeholder="Selecione..."
              ></SelectableDropdown>
            </span>
          </div>
          <span className="flex-col gap-1 space-y-1 flex-1 mt-5">
            <p>CIDR</p>
            <Input
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              placeholder=""  
            />
          </span>
        </div>
      </form>
    </Modal>
  );
}
