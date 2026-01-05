"use client";

import "@/lib/local-storage-polyfill";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { filsonPro } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { JobStoreProvider } from "@/stores/job.store";
import { Sidebar } from "@/components/atomic/Sidebar";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { GlobalAlert } from "@/components/atomic/global-alert";
import Head from "next/head";
import { SidebarPartner } from "@/components/atomic/SidebarPartner";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isRootPage =
    pathname === "/home" ||
    pathname === "/auth/signin" ||
    pathname === "/clients";
  const isPartnerArea = pathname.startsWith("/clients");
  const clientMatch = pathname.match(/^\/clients\/([^/]+)/);
  const currentClientId = clientMatch ? clientMatch[1] : null;
  useEffect(() => {
    document.title = "Niblo Cloud";
  }, []);

  return (
    <html lang="en">
      <body className={cn(filsonPro.variable)}>
        <SessionProvider>
          <JobStoreProvider>
            <GlobalAlert />
            <div className="flex min-h-screen">
              {!isRootPage && !isPartnerArea && <Sidebar />}
              {!isRootPage && isPartnerArea && (
                <SidebarPartner clientId={currentClientId} />
              )}
              <Head>
                <link rel="icon" href="/favicon.ico" />
              </Head>
              <main className="flex-1">{children}</main>
            </div>
          </JobStoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
