"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import NewMachineForm from "@/components/forms/new-machine-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import NewNetworPage from "../new-network/page";
import NetNetworkForm from "@/components/forms/new-network-form";

export default function NewMachinePage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <Dialog>
        <div className="flex w-full h-full flex-col p-3 gap-10">
          <div className="text-2xl font-bold mt-10">Nova Máquina</div>
          <NewMachineForm />
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar nova rede</DialogTitle> <NetNetworkForm />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
