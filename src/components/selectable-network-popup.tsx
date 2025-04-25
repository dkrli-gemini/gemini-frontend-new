"use client";

import { Settings, TrashIcon, Wifi } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export interface SelectableNetworkProps {
  item: {
    id: string;
    name: string;
    netmask: string;
    gateway: string;
  };
  isSelected: boolean;
  onClickAction: (id: string) => void;
}

export default function SelectableNetworkPopup({
  item,
  isSelected,
  onClickAction,
}: SelectableNetworkProps) {
  const handleClick = () => {
    onClickAction(item.id);
  };

  return (
    <div
      className={cn(
        "border rounded-md grid-span-2 p-3 pt-4 text-sm bg-white w-60",
        isSelected ? "" : "hover:bg-gray-200 hover:border-gray-400",
        isSelected ? "border-black" : "border"
      )}
      onClick={handleClick}
    >
      <div className="flex gap-2 justify-center items-center">
        <Wifi />
        {item.name}
      </div>
      <div className="flex justify-center flex-col items-center mt-5 gap-2">
        <div className="text-center border rounded-md px-4 py-0.8 bg-white">
          Gateway <br />
          {item.gateway}
        </div>
        <div className="text-center border rounded-md px-4 py-0.8 bg-white">
          Netmask <br />
          {item.netmask}
        </div>
      </div>
      <div className="flex gap-1 mt-8 ">
        <Button className="flex-3" variant="outline">
          Ativo
        </Button>
        <Button className="flex-1">
          <Settings />
        </Button>
        <Button className="flex-1">
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}
