"use client";

import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export interface ClientPopup {
  clientId: string;
  clientName: string;
}

export default function ClientPopup(props: ClientPopup) {
  const router = useRouter();

  return (
    <div className="bg-gray-100 p-6 w-140 h-75 rounded-lg flex flex-col shadow border border-1 border-black">
      <div className="flex-1 ">
        <div className="font-medium text-2xl leading-10">
          {props.clientName == "root" ? "RootClient" : props.clientName}
        </div>
      </div>
      <div className="flex flex-1 justify-end items-end gap-3 pr-5">
        {props.clientId != "g" ? (
          <>
            <Button
              className="w-25 flex-1"
              onClick={() => router.push(`/${props.clientId}/machines`)}
            >
              Gerenciar
            </Button>
          </>
        ) : (
          <Button className="flex-1">Gerenciar</Button>
        )}
      </div>
    </div>
  );
}
