import { Power, SquareTerminal, Computer, Settings } from "lucide-react";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

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

  return (
    <div className="bg-white p-5 m-2 grid grid-cols-3 rounded-sm border ">
      <div className="flex gap-3 items-center">
        <Computer size={18} />
        {props.name}
        <p className="text-slate-400 italic">({props.os})</p>
      </div>
      <div className="text-sm items-center flex text-slate-400">{props.ip}</div>
      <div className="flex justify-end  items-center gap-4 w-full h-full bg-clip-content ">
        <div className="flex flex-col justify-center items-center gap-2 mr-5">
          <Power size={18} />
          <Switch checked={active}></Switch>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost">
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
