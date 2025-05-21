"use client";

import { Power, SquareTerminal, Computer, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useVirtualMachineStore } from "@/stores/virtual-machine.store";
import { useJobStore } from "@/stores/job.store";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

export interface VirtualMachineInput {
  name: string;
  ip: string;
  state: boolean;
  os?: string;
  url?: string;
  id: string;
}

export function VirtualMachine(props: VirtualMachineInput) {
  const [active, setActive] = useState(props.state);
  const session = useSession();
  const virtualMachineStore = useVirtualMachineStore();
  const jobStore = useJobStore();
  const router = useRouter();

  const handleMachineState = async () => {
    if (active) {
      const jobId = await virtualMachineStore.stopVirtualMachine(
        session.data?.access_token!,
        props.id
      );
      await jobStore.startJob(jobId!, session.data?.access_token!);
      setActive(false);
    } else {
      const jobId = await virtualMachineStore.startVirtualMachine(
        session.data?.access_token!,
        props.id
      );
      await jobStore.startJob(jobId!, session.data?.access_token!);
      setActive(true);
    }
  };

  const handleMachineStart = async () => {
    const jobId = await virtualMachineStore.startVirtualMachine(
      session.data?.access_token!,
      props.id
    );
    console.log(jobId);
  };

  const handleOpenConsole = async (machineId: string) => {
    if (session.status == "authenticated") {
      await virtualMachineStore.fetchConsole(
        session.data?.access_token!,
        machineId
      );
      if (!virtualMachineStore.consoleUrl) return;
      window.open(
        virtualMachineStore.consoleUrl!,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div
      className={cn(
        "bg-white p-5 m-2 grid grid-cols-4 rounded-sm border cursor-pointer",
        jobStore.isPolling ? " border border-amber-600 border-2 " : "",
        "hover:bg-gray-200 transition-all duration-200 ease-in-out"
      )}
      onClick={() => {
        console.log(router.push(`machines/${props.id}/info`));
      }}
    >
      <div className="flex gap-3 items-center col-span-2">
        <Computer size={18} />
        {props.name}
        <p className="text-slate-400 italic bg-300">({props.os})</p>
      </div>
      <div className="text-sm items-center flex text-slate-400">{props.ip}</div>
      <div className="flex justify-end  items-center gap-4 w-full h-full bg-clip-content ">
        <div
          className={cn(
            "flex flex-col justify-center items-center gap-2 mr-5",
            jobStore.isPolling ? "border-black border-sm  p-1" : ""
          )}
        >
          <Power size={18} />
          <Switch
            checked={active}
            disabled={jobStore.isPolling}
            onCheckedChange={() => handleMachineState()}
          ></Switch>
          <div className="flex justify-center items-center gap-2">
            {jobStore.isPolling ? (
              <>
                <Spinner size="small" />
                {active ? "Iniciando..." : "Desligando..."}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" onClick={() => handleOpenConsole(props.id)}>
            <SquareTerminal size={18} />
          </Button>
          <Button variant="ghost">
            <Settings size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
