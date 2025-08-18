"use client";

import { Button } from "@/components/atomic/Button";
import DataTable from "@/components/atomic/DataTable";
import { Input } from "@/components/atomic/Input";
import { SearchInput } from "@/components/atomic/SearchInput";
import SelectableDataTable from "@/components/atomic/SelectableDataTable";
import { ChevronLeft } from "lucide-react";
0;
import Link from "next/link";
import { NewMachineForm } from "@/components/forms/new-machine-form";
import { Header } from "@/components/atomic/Header";

export default function CreateMachinePage() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="bg-[#F2f2f2] w-full flex items-center justify-between px-20 py-9 shadow-sm">
        <span className="flex gap-3 items-center">
          <Link href="/machines">
            <ChevronLeft size={30} />
          </Link>
          <h2 className="font-bold text-3xl">Criar máquina</h2>
        </span>
        <span className="flex gap-2">
          <Button
            variant="primary"
            className="px-6"
            form="new-machine-form"
            type="submit"
          >
            Salvar
          </Button>
        </span>
      </div>

      <NewMachineForm />
    </div>
  );
}
