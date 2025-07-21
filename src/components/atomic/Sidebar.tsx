import NibloIcon from "@/svg/Niblo";

import MemoryIcon from "@mui/icons-material/Memory";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import WifiIcon from "@mui/icons-material/Wifi";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { Wifi } from "lucide-react";
import { signIn } from "next-auth/react";

export const Sidebar = () => {
  return (
    <aside className="h-screen sticky top-0 p-1 pt-2 border border-[#e6e6e6] flex flex-col grid grid-rows-3 shadow-sm">
      <span className="p-3">
        <button
          onClick={() => {
            signIn("keycloak");
          }}
        >
          <NibloIcon />
        </button>
      </span>
      <span className="flex flex-col px-1 gap-2">
        <span className="bg-[#F0F0F0] p-1 rounded-xl flex justify-center items-center aspect-square">
          <MemoryIcon />
        </span>
        <span className=" p-1 rounded-xl flex justify-center items-center aspect-square">
          <WifiIcon />
        </span>
        <span className="p-1 rounded-xl flex justify-center items-center aspect-square">
          <ChecklistIcon />
        </span>

        <span className="p-1 rounded-xl flex justify-center items-center aspect-square">
          <AltRouteIcon />
        </span>
      </span>
      <span className="flex flex-col justify-center ">
        <span className="p-1 rounded-xl flex justify-center items-center aspect-square">
          <ReceiptLongIcon />
        </span>

        <span className="p-1 rounded-xl flex justify-center items-center aspect-square">
          <DataUsageIcon />
        </span>
      </span>
    </aside>
  );
};
