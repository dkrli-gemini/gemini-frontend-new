"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "./globals.css";
import { filsonPro } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { NSidebar } from "@/components/NSidebar";
import { JobStoreProvider } from "@/stores/job.store";
import { Sidebar } from "@/components/atomic/Sidebar";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={cn(filsonPro.variable)}>
        <SessionProvider>
          <JobStoreProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1">{children}</main>
            </div>
          </JobStoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
