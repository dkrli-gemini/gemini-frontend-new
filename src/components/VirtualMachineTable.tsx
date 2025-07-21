"use client";

import { ArrowUpDown, SquareTerminal, Terminal } from "lucide-react";
import { useVirtualMachineStore } from "@/stores/virtual-machine.store";
import { useJobStore } from "@/stores/job.store";
import { useSession } from "next-auth/react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { StatusBadge } from "./atomic/StatusBadge";
import { VirtualMachineEntry } from "./atomic/VirtualMachineEntry";
import { stat } from "fs";

export function VirtualMachinesTable() {
  const virtualMachineStore = useVirtualMachineStore();
  const jobStore = useJobStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchMachines() {
      const response = await fetch(
        "/api/2f582214-4ca7-4774-92f5-e215f3b60787/machines/list-machines",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      console.log(await response.json());
    }

    if (status == "authenticated") {
      fetchMachines();
    }
  });

  return (
    <div className=" ">
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
            <th className="p-4 text-sm font-semibold text-gray-500"></th>
          </tr>
        </thead>
        <tbody>
          <VirtualMachineEntry />
          {/* {virtualMachineStore.machines.map((vm) => (
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
          ))} */}
        </tbody>
      </table>
    </div>
  );
}
