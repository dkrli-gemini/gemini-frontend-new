"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CirclePlus,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  List,
  Map,
  PieChart,
  Settings,
  Settings2,
  SquareTerminal,
  Wifi,
} from "lucide-react";

// import { NavProjects } from "@/components/nav-projects";
// import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { title } from "process";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-dropdown-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const params = useParams();
  const router = useRouter();

  const data = {
    teams: [
      {
        name: "RootProject",
        logo: GalleryVerticalEnd,
        plan: "ACS-HML-VIN2",
      },
    ],
    navMain: [
      {
        title: "Máquinas Virtuais",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Minhas máquinas",
            url: `/${params.projectId}/machines`,
          },
          {
            title: "Nova máquina",
            url: `/${params.projectId}/new-machine`,
          },
        ],
      },
      {
        title: "Redes",
        url: "#",
        icon: Wifi,
        isActive: true,
        items: [
          {
            title: "Minhas redes",
            url: `/${params.projectId}/networks`,
          },
          {
            title: "Nova rede",
            url: `/${params.projectId}/new-network`,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-black">
      <SidebarHeader className=" bg-[#6bc6d651] border-b">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className=" bg-[#6bc6d651]">
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter className=" bg-[#6bc6d651]">
        <div
          className="flex gap-2 justify-center p-2 border-t hover:bg-gray-200"
          onClick={() => router.push("/home")}
        >
          <Home />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
