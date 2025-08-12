"use client";

import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import Switch from "./Switch";
import { Button } from "./Button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAlertStore } from "@/stores/alert.store";

export interface VirtualMachineEntryProps {
  name: string;
  ip: string;
  status: string;
  id: string;
}

export const VirtualMachineEntry = (props: VirtualMachineEntryProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { showAlert } = useAlertStore();

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
        window.location.reload();
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsole = async () => {
    if (props.status != "RUNNING") {
      showAlert("A máquina deve estar ligada para acessar o console.", "info");
      return;
    }
    if (session?.access_token) {
      const response = await fetch("/api/machines/fetch-console", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          machineId: props.id,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.message && result.message.consoleUrl) {
          window.open(result.message.consoleUrl, "_blank");
        }
      }
    }
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
