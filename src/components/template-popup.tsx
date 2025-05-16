import { cn } from "@/lib/utils";
import { Computer, Cpu, Database, HardDrive, MemoryStick } from "lucide-react";

export interface TemplateProps {
  name: string;
  memory: string;
  cpu: string;
  disk: string;
  active: boolean;
}

export default function TemplatePopup(props: TemplateProps) {
  return (
    <div
      className={cn(
        "border p-6 flex flex-col items-center justify-center gap-5 rounded-md",
        "hover:bg-gray-200 hover:border-gray-600",
        props.active ? "border-black" : ""
      )}
    >
      <div>{props.name}</div>
      <div className="flex gap-2">
        <div className="border flex flex-col justify-center items-center gap-2 p-2 rounded-md">
          <MemoryStick />
          {props.memory}
        </div>
        <div className="border flex flex-col justify-center items-center gap-2 p-2 rounded-md">
          <Cpu />
          {props.cpu}
        </div>
        <div className="border flex flex-col justify-center items-center gap-2 p-2 rounded-md">
          <Database />
          {props.disk}
        </div>
      </div>
    </div>
  );
}
