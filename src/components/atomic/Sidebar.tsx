"use client";

import NibloIcon from "@/svg/Niblo";
import MemoryIcon from "@mui/icons-material/Memory";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import WifiIcon from "@mui/icons-material/Wifi";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import Link from "next/link";

export const Sidebar = () => {
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  const handleSidebarMouseEnter = () => {
    setSidebarHovered(true);
  };

  const handleSidebarMouseLeave = () => {
    setSidebarHovered(false);
    setHoveredItem(null);
  };

  const handleItemMouseEnter = (item: any) => {
    if (isSidebarHovered) {
      setHoveredItem(item);
    }
  };

  const handleItemMouseLeave = () => {
    if (isSidebarHovered) {
      setHoveredItem(null);
    }
  };

  const isItemActive = (item: string) => {
    if (!pathname) {
      return false;
    }

    switch (item) {
      case "vms":
        return pathname.startsWith("/machines");
      case "networks":
        return pathname.startsWith("/networks");
      case "tasks":
        return pathname.startsWith("/acls");
      case "routes":
        return pathname.startsWith("/forwarding");
      case "billing":
        return pathname.startsWith("/billing");
      case "usage":
        return pathname.startsWith("/resources");
      default:
        return false;
    }
  };

  const getItemClassName = (item: any) => {
    const isActive = isItemActive(item);
    return cn(
      "p-3 rounded-xl flex items-center h-12 cursor-pointer",
      !isSidebarHovered && "justify-center",
      isSidebarHovered
        ? hoveredItem === item
          ? "bg-[#F0F0F0]"
          : "bg-white"
        : isActive
        ? "bg-[#F0F0F0]"
        : "bg-white"
    );
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 p-1 pt-2 border border-[#e6e6e6] flex flex-col grid grid-rows-3 shadow-sm transition-all duration-300",
        isSidebarHovered ? "w-60" : "w-16"
      )}
      onMouseEnter={handleSidebarMouseEnter}
      onMouseLeave={handleSidebarMouseLeave}
    >
      <span className="p-3">
        <Link href={"/home"}>
          <div className="flex">
            <NibloIcon />
            {/* {isSidebarHovered && (
                <span className="ml-2 whitespace-nowrap">Niblo Cloud</span>
              )} */}
          </div>
        </Link>
      </span>
      <span className="flex flex-col px-1 gap-2 items mr-2 flex-1">
        <Link href="machines">
          <span
            onMouseEnter={() => handleItemMouseEnter("vms")}
            onMouseLeave={handleItemMouseLeave}
            className={getItemClassName("vms")}
          >
            <MemoryIcon />
            {isSidebarHovered && (
              <span className="ml-2 whitespace-nowrap">Máquinas Virtuais</span>
            )}
          </span>
        </Link>
        <Link href="/networks">
          <span
            onMouseEnter={() => handleItemMouseEnter("networks")}
            onMouseLeave={handleItemMouseLeave}
            className={getItemClassName("networks")}
          >
            <WifiIcon />
            {isSidebarHovered && (
              <span className="ml-2 whitespace-nowrap">Redes</span>
            )}
          </span>
        </Link>

        <Link href="/acls">
          <span
            onMouseEnter={() => handleItemMouseEnter("tasks")}
            onMouseLeave={handleItemMouseLeave}
            className={getItemClassName("tasks")}
          >
            <ChecklistIcon />
            {isSidebarHovered && (
              <span className="ml-2 whitespace-nowrap">Firewall</span>
            )}
          </span>
        </Link>
        <Link href="/forwarding">
          <span
            onMouseEnter={() => handleItemMouseEnter("routes")}
            onMouseLeave={handleItemMouseLeave}
            className={getItemClassName("routes")}
          >
            <AltRouteIcon />
            {isSidebarHovered && (
              <span className="ml-2 whitespace-nowrap">Port Forwarding</span>
            )}
          </span>
        </Link>
        <Link href="/billing">
          <span
            onMouseEnter={() => handleItemMouseEnter("billing")}
            onMouseLeave={handleItemMouseLeave}
            className={getItemClassName("billing")}
          >
            <ReceiptLongIcon />
            {isSidebarHovered && (
              <span className="ml-2 whitespace-nowrap">Fatura</span>
            )}
          </span>
        </Link>
        <Link href="/resources">
          <span
            onMouseEnter={() => handleItemMouseEnter("usage")}
            onMouseLeave={handleItemMouseLeave}
            className={getItemClassName("usage")}
          >
            <DataUsageIcon />
            {isSidebarHovered && (
              <span className="ml-2 whitespace-nowrap">Recursos e limites</span>
            )}
          </span>
        </Link>
      </span>
    </aside>
  );
};
