"use client";

import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import Switch from "./Switch";
import { Button } from "./Button";
import Link from "next/link";

export interface VirtualMachineEntryProps {
  name: string;
  ip: string;
  status: string;
  id: string;
}

export const VirtualMachineEntry = (props: VirtualMachineEntryProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

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
        <Switch />
      </td>
      <td className=" w-100">
        {isHovered && (
          <div className="flex justify-center gap-5 items-center">
            <span className="cursor-pointer">
              <Link href={`/machines/${props.id}`}>Detalhes</Link>
            </span>
            <Button variant="primary" className="w-30">
              Console
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};
