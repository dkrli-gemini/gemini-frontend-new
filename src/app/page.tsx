"use client";

import Navbar from "@/components/app-navbar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { VirtualMachine } from "@/components/virtual-machine";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  console.log(session?.access_token);

  if (session) {
    return (
      <div>
        <Navbar />
        Signed in as {session.access_token} <br />
        <br />
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => signIn("keycloak")}>Signin</button>;
}
