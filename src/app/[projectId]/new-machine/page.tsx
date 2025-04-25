"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import NewMachineForm from "@/components/forms/new-machine-form";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function NewMachinePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full h-full flex-col p-3 gap-10">
        <div className="text-2xl font-bold mt-10">Nova Máquina</div>
        <NewMachineForm />
      </div>
    </SidebarProvider>
  );
}
