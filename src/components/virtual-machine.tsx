"use client";

import { Power, SquareTerminal, Computer, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useVirtualMachineStore } from "@/stores/virtual-machine.store";

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

  useEffect(() => {});

  const handleOpenConsole = (machineId: string) => {
    if (session.status == "authenticated") {
      virtualMachineStore.fetchConsole(session.data?.access_token!, machineId);
      window.open(
        virtualMachineStore.consoleUrl!,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div className="bg-white p-5 m-2 grid grid-cols-4 rounded-sm border ">
      <div className="flex gap-3 items-center col-span-2">
        <Computer size={18} />
        {props.name}
        <p className="text-slate-400 italic bg-300">({props.os})</p>
      </div>
      <div className="text-sm items-center flex text-slate-400">{props.ip}</div>
      <div className="flex justify-end  items-center gap-4 w-full h-full bg-clip-content ">
        <div className="flex flex-col justify-center items-center gap-2 mr-5">
          <Power size={18} />
          <Switch checked={active}></Switch>
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
