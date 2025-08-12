"use client";

import { Button } from "@/components/atomic/Button";
import { PageHeader } from "@/components/atomic/PageHeader";
import { SearchInput } from "@/components/atomic/SearchInput";
import { Header } from "@/components/Header";
import { VirtualMachinesTable } from "@/components/atomic/VirtualMachineTable";
import { Search, Plus } from "lucide-react";
import AddIcon from "@mui/icons-material/Add";
import { Sidebar } from "@/components/atomic/Sidebar";
import Link from "next/link";
import { useVMStore } from "@/stores/vm-store";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAlertStore } from "@/stores/alert.store";

export default function MachinesPage() {
  const vmStore = useVMStore();
  const session = useSession();

  useEffect(() => {
    console.log(session.status);

    if (session.status == "unauthenticated") {
      signIn();
    }
  }, [session]);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader
        title="Máquinas Virtuais"
        el1name="Total de máquinas"
        el1value={String(vmStore.machines.length)}
        el2name="Máquinas ligadas"
        el2value={String(
          vmStore.machines.reduce(
            (acc, cur) =>
              cur.state == "RUNNING" || cur.state == "STARTING" ? ++acc : acc,
            0
          )
        )}
        el3name="Máquinas desligadas"
        el3value={String(
          vmStore.machines.reduce(
            (acc, cur) =>
              cur.state == "STOPPING" || cur.state == "STOPPED" ? ++acc : acc,
            0
          )
        )}
        el4name="Status de erro"
        el4value="0"
      />
      <div className="flex justif-"></div>

      <div className="flex flex-col  -translate-y-10">
        <div className="px-21">
          <div className="flex justify-between mb-8">
            <SearchInput />
            <Button variant="primary" className="">
              <Link href="/machines/new">
                <AddIcon /> Nova máquina
              </Link>
            </Button>
          </div>

          {session.status == "authenticated" && <VirtualMachinesTable />}
        </div>
      </div>
    </div>
  );
}
