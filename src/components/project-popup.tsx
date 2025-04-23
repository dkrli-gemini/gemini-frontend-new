"use client";

import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export interface ProjectPopup {
  projectId: string;
  projectName: string;
  projectDomain: string;
}

export default function ProjectPopup(props: ProjectPopup) {
  const router = useRouter();

  return (
    <div className="bg-gray-100 p-6 w-140 h-75 rounded-lg flex flex-col shadow border border-1 border-black">
      <div className="flex-1 ">
        <div className="font-medium text-2xl leading-10">
          {props.projectName}
        </div>
        <div className="text-xl">{props.projectDomain}</div>
      </div>
      <div className="flex flex-1 justify-end items-end gap-3 pr-5">
        <Button>
          <Settings />
        </Button>
        <Button
          className="w-25"
          onClick={() => router.push(`/${props.projectId}/machines`)}
        >
          Abrir
        </Button>
      </div>
    </div>
  );
}
