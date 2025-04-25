"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import NewMachineForm from "@/components/forms/new-machine-form";
import NetNetworkForm from "@/components/forms/new-network-form";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function NewNetworPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full h-full flex-col p-3 gap-10">
        <div className="text-2xl font-bold mt-10">Nova Rede</div>
        <NetNetworkForm />
      </div>
    </SidebarProvider>
  );
}
