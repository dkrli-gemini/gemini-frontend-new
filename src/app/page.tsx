"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { VirtualMachine } from "@/components/virtual-machine";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
      </>
    );
  }

  return (
    <VirtualMachine />
    // <SidebarProvider>
    //   {/* <AppSidebar />
    //   <div className="flex flex-1"></div> */}
    // </SidebarProvider>
  );
}
