"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "./globals.css";
import { filsonPro } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={cn(filsonPro.variable)}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
