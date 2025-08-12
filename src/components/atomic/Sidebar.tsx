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
import { cn } from "@/lib/utils";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import Link from "next/link";

export const Sidebar = () => {
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [selected, setSelected] = useState("dashboard");
  const [hoveredItem, setHoveredItem] = useState(null);

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

  const getItemClassName = (item: any) => {
    return cn(
      "p-3 rounded-xl flex items-center h-12 cursor-pointer",
      !isSidebarHovered && "justify-center",
      isSidebarHovered
        ? hoveredItem === item
          ? "bg-[#F0F0F0]"
          : "bg-white"
        : selected === item
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
        <button
          onClick={() => {
            signIn("keycloak");
          }}
        >
          <NibloIcon />
        </button>
      </span>
      <span className="flex flex-col px-1 gap-2 items mr-2 ">
        <span
          onClick={() => setSelected("dashboard")}
          onMouseEnter={() => handleItemMouseEnter("dashboard")}
          onMouseLeave={handleItemMouseLeave}
          className={getItemClassName("dashboard")}
        >
          <WindowOutlinedIcon />
          {isSidebarHovered && (
            <span className="ml-2 whitespace-nowrap">Dashboard</span>
          )}
        </span>
        <Link href="machines">
          <span
            onClick={() => setSelected("vms")}
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
            onClick={() => setSelected("networks")}
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
            onClick={() => setSelected("tasks")}
            onMouseEnter={() => handleItemMouseEnter("tasks")}
            onMouseLeave={handleItemMouseLeave}
            className={getItemClassName("tasks")}
          >
            <ChecklistIcon />
            {isSidebarHovered && (
              <span className="ml-2 whitespace-nowrap">ACL&apos;s</span>
            )}
          </span>
        </Link>
        <span
          onClick={() => setSelected("routes")}
          onMouseEnter={() => handleItemMouseEnter("routes")}
          onMouseLeave={handleItemMouseLeave}
          className={getItemClassName("routes")}
        >
          <AltRouteIcon />
          {isSidebarHovered && (
            <span className="ml-2 whitespace-nowrap">Port Forwarding</span>
          )}
        </span>
      </span>
      <span className="flex flex-col justify-end items-start">
        <span
          onClick={() => setSelected("billing")}
          onMouseEnter={() => handleItemMouseEnter("billing")}
          onMouseLeave={handleItemMouseLeave}
          className={getItemClassName("billing")}
        >
          <ReceiptLongIcon />
          {isSidebarHovered && (
            <span className="ml-2 whitespace-nowrap">Billing</span>
          )}
        </span>
        <Link href="/resources">
          {" "}
          <span
            onClick={() => setSelected("usage")}
            onMouseEnter={() => handleItemMouseEnter("usage")}
            onMouseLeave={handleItemMouseLeave}
            className={getItemClassName("usage")}
          >
            <DataUsageIcon />
            {isSidebarHovered && (
              <span className="ml-2 whitespace-nowrap">Usage</span>
            )}
          </span>
        </Link>
      </span>
    </aside>
  );
};
