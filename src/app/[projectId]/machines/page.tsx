"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { VirtualMachine } from "@/components/virtual-machine";
import { useDomainStore } from "@/stores/domain.store";
import { useVirtualMachineStore } from "@/stores/virtual-machine.store";
import { useSession } from "next-auth/react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect } from "react";

export default function MachinePage() {
  const session = useSession();
  const params = useParams();
  const projectId = params.projectId;
  const domainStore = useDomainStore();
  const virtualMachineStore = useVirtualMachineStore();

  useEffect(() => {
    if (session.status == "authenticated") {
      domainStore.fetchDomains(
        session.data?.access_token!,
        "0fc249b2-9b18-4de2-b53c-1ba1fdb9212c"
      );

      virtualMachineStore.fetchVirtualMachines(
        session.data?.access_token!,
        projectId as string
      );
    }
  }, [session.status, domainStore.fetchDomains]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full h-full flex-col p-3">
        <div className="text-2xl font-bold mt-10">Máquinas virtuais</div>
        <div className="bg-gray-100 rounded-sm mt-5">
          {virtualMachineStore.machines.map((m) => (
            <VirtualMachine
              id={m.id}
              ip={m.ipAddress}
              name={m.name}
              state={m.state == "on" ? true : false}
              key={m.id}
              os={m.os}
            />
          ))}
        </div>
      </div>
    </SidebarProvider>
  );

  // return <div>{session.data?.access_token}</div>;
}
