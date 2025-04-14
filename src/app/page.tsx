"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    <div className="bg-red-500 text-white p-4 rounded-md">Tailwind Test</div>
    // <SidebarProvider>
    //   {/* <AppSidebar />
    //   <div className="flex flex-1"></div> */}
    // </SidebarProvider>
  );
}
