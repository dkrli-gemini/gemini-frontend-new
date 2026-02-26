"use client";

import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import Switch from "./Switch";
import { Button } from "./Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAlertStore } from "@/stores/alert.store";

export interface VirtualMachineEntryProps {
  name: string;
  ip: string;
  status: string;
  id: string;
}

export const VirtualMachineEntry = (props: VirtualMachineEntryProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { showAlert } = useAlertStore();

  const waitForJob = async (
    jobId: string,
    token: string
  ): Promise<{ status: string; error?: string }> => {
    const maxAttempts = 30;
    const delayMs = 2000;

    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`/api/jobs/status/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      const status = result?.message?.status;
      const error = result?.message?.error;

      if (status === "DONE" || status === "FAILED") {
        return { status, error };
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return { status: "TIMEOUT", error: "Timeout aguardando execução do job." };
  };

  const handleMachineState = async (
    machineId: string,
    currentState: string
  ) => {
    if (!session?.access_token || isLoading) return;

    setIsLoading(true);

    const endpoint =
      currentState === "RUNNING" ? "/api/machines/stop" : "/api/machines/start";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ machineId }),
      });

      if (response.ok) {
        const payload = await response.json();
        const jobId = payload?.message?.jobId;

        if (!jobId) {
          showAlert("Ação enviada, mas sem jobId para acompanhar.", "info");
          window.location.reload();
          return;
        }

        const jobResult = await waitForJob(jobId, session.access_token);
        if (jobResult.status === "FAILED") {
          showAlert(
            jobResult.error || "Falha ao executar ação da máquina.",
            "error"
          );
          window.location.reload();
          return;
        }
        if (jobResult.status === "TIMEOUT") {
          showAlert(jobResult.error || "Timeout ao aguardar o job.", "error");
          window.location.reload();
          return;
        }

        window.location.reload();
      } else {
        const errorPayload = await response.json().catch(() => null);
        const errorMessage =
          errorPayload?.message ||
          errorPayload?.error?.message ||
          errorPayload?.error ||
          "Falha ao alterar estado da máquina.";
        showAlert(errorMessage, "error");
      }
    } catch (error: any) {
      showAlert(error?.message || "Erro ao alterar estado da máquina.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsole = async () => {
    if (props.status != "RUNNING") {
      showAlert("A máquina deve estar ligada para acessar o console.", "info");
      return;
    }
    router.push(`/machines/${props.id}/console`);
  };

  return (
    <tr
      className="border-b border-gray-100 last:border-b-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="p-4 font-medium text-gray-800 ">{props.name}</td>
      <td className="p-4 text-gray-600">{props.ip}</td>
      <td className="p-4 whitespace-nowrap">
        <StatusBadge status={props.status} pclassName="w-fit" />
      </td>
      <td className="p-4 py-4 w-50">
        <Switch
          checked={props.status == "STARTING" || props.status == "RUNNING"}
          disabled={props.status == "STARTING" || props.status == "STOPPING"}
          onCheckedChange={() => handleMachineState(props.id, props.status)}
        />
      </td>
      <td className=" w-100">
        {isHovered && (
          <div className="flex justify-center gap-5 items-center">
            <span className="cursor-pointer">
              <Link href={`/machines/${props.id}`}>Detalhes</Link>
            </span>
            <Button
              variant="primary"
              className="w-30"
              onClick={() => handleConsole()}
            >
              Console
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};
