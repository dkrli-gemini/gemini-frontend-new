"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import NetworkPopup from "@/components/network-popup";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNetworkStore } from "@/stores/network.store";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function NetworkPage() {
  const session = useSession();
  const params = useParams();
  const networkStore = useNetworkStore();

  useEffect(() => {
    if (session.status == "authenticated") {
      networkStore.fetchNetworks(
        session.data?.access_token!,
        params.projectId as string
      );
    }
  }, [session, networkStore.fetchNetworks]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full h-full flex-col p-3">
        <div className="text-2xl font-bold mt-10">Redes</div>
        <div className="grid grid-cols-4 bg-gray-100 rounded-sm gap-2 p-2 mt-2">
          {networkStore.networks.map((n) => (
            <NetworkPopup
              name={n.name}
              key={n.id}
              gateway={n.gateway}
              netmask={n.netmask}
              id={n.id}
            />
          ))}
        </div>
      </div>
    </SidebarProvider>
  );
}
