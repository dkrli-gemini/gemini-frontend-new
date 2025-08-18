"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { filsonPro } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { JobStoreProvider } from "@/stores/job.store";
import { Sidebar } from "@/components/atomic/Sidebar";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { GlobalAlert } from "@/components/atomic/global-alert";
import { Metadata } from "next";
import Head from "next/head";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isRootPage = pathname === "/home" || pathname === "/auth/signin";
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
              {!isRootPage && <Sidebar />}
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
