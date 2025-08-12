"use client";

import { ArrowUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { VirtualMachineEntry } from "./VirtualMachineEntry";
import { useVMStore } from "@/stores/vm-store";

export function VirtualMachinesTable() {
  const [loading, setLoading] = useState(false);
  const { machines, setMachines } = useVMStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchMachines() {
      setLoading(true);
      if (session?.access_token) {
        const response = await fetch(
          "/api/03f1213a-2621-4558-9349-d0767154ac83/machines/list-machines",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setMachines(result.message.machines);
        }
      }
      setLoading(false);
    }

    fetchMachines();
  }, [session, setMachines]);

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
          {loading ? (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                Loading...
              </td>
            </tr>
          ) : (
            machines.map((vm) => (
              <VirtualMachineEntry
                name={vm.name}
                ip={vm.ipAddress}
                status={vm.state}
                key={vm.id}
                id={vm.id}
              />
            ))
          )}
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
