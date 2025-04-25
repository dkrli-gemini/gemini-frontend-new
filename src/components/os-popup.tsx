import { cn } from "@/lib/utils";
import { Computer } from "lucide-react";

export interface OSPopupProps {
  name: string;
  icon: any;
}

export default function OSPopup(props: OSPopupProps) {
  return (
    <div
      className={cn(
        "border p-6 flex flex-col items-center justify-center gap-5 w-45 h-50 rounded-md"
      )}
    >
      {props.icon}
      <div>{props.name}</div>
    </div>
  );
}
