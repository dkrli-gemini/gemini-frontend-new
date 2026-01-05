"use client";

import { Button } from "@/components/atomic/Button";
import { Input } from "@/components/atomic/Input";
import { Modal } from "@/components/atomic/Modal";
import { useAlertStore } from "@/stores/alert.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useProjectsStore } from "@/stores/user-project.store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface NewAclFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewAclForm({ isOpen, onClose }: NewAclFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentProjectId } = useProjectsStore();
  const session = useSession();
  const { showAlert } = useAlertStore();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const token = session.data?.access_token;

    if (!currentProjectId) {
      showAlert("Selecione um projeto antes de criar uma ACL.", "error");
      setLoading(false);
      return;
    }

    if (name) {
      try {
        const response = await fetch("/api/acl/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name,
            projectId: currentProjectId,
            description: description,
          }),
        });

        if (response.ok) {
          showAlert(`Lista ${name} criada com sucesso!`, "success");
          router.push("/acls");
        } else {
          console.error("Failed to create ACL list");
          showAlert("Erro na criação da lista", "error");
        }
        onClose();
      } catch (error) {
        console.error("Error creating machine:", error);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h2 className="text-lg m-1 font-medium  ">Criar nova ACL</h2>}
      footer={
        <>
          <Button
            onClick={onClose}
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
            form="new-acl-form"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </>
      }
    >
      <form id="new-acl-form" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <span className="flex-col gap-1">
            <p>Nome</p>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </span>
          <span className="flex-col gap-1">
            <p>Descrição</p>
            <Input
              className="h-30"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </span>
        </div>
      </form>
    </Modal>
  );
}
