"use client";

import NibloIcon from "@/svg/Niblo";
import MemoryIcon from "@mui/icons-material/Memory";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import WifiIcon from "@mui/icons-material/Wifi";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import Link from "next/link";
import AnalyticsIcon from "@mui/icons-material/AnalyticsOutlined";
import Money from "@mui/icons-material/RequestQuoteOutlined";
import { usePathname } from "next/navigation";

interface SidebarPartnerProps {
  clientId?: string | null;
}

export const SidebarPartner = ({ clientId }: SidebarPartnerProps) => {
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const pathname = usePathname();
  const activeSection = useMemo(() => {
    if (!pathname) {
      return null;
    }
    const segments = pathname.split("/").filter(Boolean);
    return segments.length >= 3 ? segments[segments.length - 1] : null;
  }, [pathname]);

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
    const isActive = activeSection === item;
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

  const basePath = clientId ? `/clients/${clientId}` : "/clients";

  const menuItems = [
    {
      key: "info",
      label: "Info",
      icon: <DataUsageIcon />,
      href: `${basePath}/info`,
    },
    {
      key: "limits",
      label: "Limites",
      icon: <AnalyticsIcon />,
      href: `${basePath}/limits`,
    },
    {
      key: "billing",
      label: "Fatura",
      icon: <Money />,
      href: `${basePath}/billing`,
    },
  ];

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
      <span className="flex flex-col px-1 gap-2 items mr-2">
        {menuItems.map((item) => (
          <Link key={item.key} href={item.href}>
            <span
              onMouseEnter={() => handleItemMouseEnter(item.key)}
              onMouseLeave={handleItemMouseLeave}
              className={getItemClassName(item.key)}
            >
              {item.icon}
              {isSidebarHovered && (
                <span className="ml-2 whitespace-nowrap">{item.label}</span>
              )}
            </span>
          </Link>
        ))}
      </span>
    </aside>
  );
};
