"use client";

import { ArrowUpDown, SquareTerminal, Terminal } from "lucide-react";
import { useVirtualMachineStore } from "@/stores/virtual-machine.store";
import { useJobStore } from "@/stores/job.store";
import { useSession } from "next-auth/react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Status = string;

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<Status, string> = {
    Running: "bg-green-100 text-green-700",
    Error: "bg-red-100 text-red-700",
    Stopped: "bg-gray-100 text-gray-600",
    Starting: "bg-yellow-100 text-yellow-700",
    Stopping: "bg-yellow-100 text-yellow-700",
    Rodando: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export function VirtualMachinesTable() {
  const virtualMachineStore = useVirtualMachineStore();
  const jobStore = useJobStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status == "authenticated") {
      virtualMachineStore.fetchVirtualMachines(
        session?.access_token as string,
        "2f582214-4ca7-4774-92f5-e215f3b60787"
      );
    }
  }, [session, status]);

  const handleMachineState = async (
    machineId: string,
    currentState: string
  ) => {
    if (currentState === "RUNNING") {
      const jobId = await virtualMachineStore.stopVirtualMachine(
        session?.access_token!,
        machineId
      );
      await jobStore.startJob(jobId!, session?.access_token!);
    } else {
      const jobId = await virtualMachineStore.startVirtualMachine(
        session?.access_token!,
        machineId
      );
      await jobStore.startJob(jobId!, session?.access_token!);
    }
  };

  const handleOpenConsole = async (machineId: string) => {
    if (session?.access_token) {
      await virtualMachineStore.fetchConsole(session.access_token, machineId);
      if (!virtualMachineStore.consoleUrl) return;
      window.open(
        virtualMachineStore.consoleUrl!,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div className="px-6 ">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200" key={0}>
            <th className="p-4 text-sm font-semibold text-gray-500">
              <div className="flex items-center gap-1">
                Nome <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-4 text-sm font-semibold text-gray-500">
              <div className="flex items-center gap-1">
                IP <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-4 text-sm font-semibold text-gray-500">Status</th>
            <th className="p-4 text-sm font-semibold text-gray-500">
              <div className="flex items-center gap-1">
                Liga/Desliga <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-4 text-sm font-semibold text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100 last:border-b-0">
            <td className="p-4 font-medium text-gray-800">Máquina teste</td>
            <td className="p-4 text-gray-600">10.168.2.5</td>
            <td className="p-4">
              <StatusBadge status="Rodando" />
            </td>
            <td className="p-4">
              <Switch
                checked={true}
                disabled={false}
                onCheckedChange={() => {
                  // handleMachineState(vm.id, vm.state);
                }}
              />
            </td>
            <td className="p-4">
              <Button variant="ghost" onClick={() => handleOpenConsole(vm.id)}>
                <SquareTerminal size={18} />
              </Button>
            </td>
          </tr>
          <tr className="border-b border-gray-100 last:border-b-0">
            <td className="p-4 font-medium text-gray-800">Máquina teste 2</td>
            <td className="p-4 text-gray-600">10.168.2.10</td>
            <td className="p-4">
              <StatusBadge status="Desligada" />
            </td>
            <td className="p-4">
              <Switch
                checked={false}
                disabled={false}
                onCheckedChange={() => {
                  // handleMachineState(vm.id, vm.state);
                }}
              />
            </td>
            <td className="p-4">
              <Button variant="ghost" onClick={() => handleOpenConsole(vm.id)}>
                <SquareTerminal size={18} />
              </Button>
            </td>
          </tr>
          {virtualMachineStore.machines.map((vm) => (
            <tr
              key={vm.id}
              className="border-b border-gray-100 last:border-b-0"
            >
              <td className="p-4 font-medium text-gray-800">{vm.name}</td>
              <td className="p-4 text-gray-600">{vm.ipAddress}</td>
              <td className="p-4">
                <StatusBadge status={vm.state as any} />
              </td>
              <td className="p-4">
                <Switch
                  checked={vm.state === "RUNNING"}
                  disabled={jobStore.isPolling}
                  onCheckedChange={() => {
                    handleMachineState(vm.id, vm.state);
                  }}
                />
              </td>
              <td className="p-4">
                <Button
                  variant="ghost"
                  onClick={() => handleOpenConsole(vm.id)}
                >
                  <SquareTerminal size={18} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
