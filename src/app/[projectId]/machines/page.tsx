"use client";

import { VirtualMachinesTable } from "@/components/VirtualMachineTable";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { JobStoreProvider } from "@/stores/job.store";
import { useVirtualMachineStore } from "@/stores/virtual-machine.store";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function MachinePage() {
  console.log("MachinePage component is rendering."); // New log
  const session = useSession();
  const params = useParams();
  const projectId = params.projectId;
  const virtualMachineStore = useVirtualMachineStore();

  useEffect(() => {
    console.log("useEffect in MachinePage is running.");
    console.log("Session status:", session.status);
    console.log("Session data:", session.data);
    if (session.status == "authenticated") {
      virtualMachineStore.fetchVirtualMachines(
        session.data?.access_token!,
        projectId as string
      );
    }
  }, [session.status, projectId, session.data?.access_token, virtualMachineStore]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full  flex-col p-3">
        <div className="text-2xl font-bold mt-10">Máquinas virtuais</div>
        <div className="bg-gray-100 rounded-sm mt-5">
          <VirtualMachinesTable />
        </div>
      </div>
    </SidebarProvider>
  );

  // return <div>{session.data?.access_token}</div>;
}
