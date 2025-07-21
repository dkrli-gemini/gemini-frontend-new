import { Button } from "@/components/atomic/Button";
import { PageHeader } from "@/components/atomic/PageHeader";
import { SearchInput } from "@/components/atomic/SearchInput";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { VirtualMachinesTable } from "@/components/VirtualMachineTable";
import { Search, Plus } from "lucide-react";
import AddIcon from "@mui/icons-material/Add";
import { Sidebar } from "@/components/atomic/Sidebar";

export default function MachinesPage() {
  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader />
      <div className="flex justif-"></div>

      <div className="flex flex-col  -translate-y-10">
        <div className="px-21">
          <div className="flex justify-between mb-8">
            <SearchInput />
            <Button variant="primary" className="">
              <AddIcon /> Nova máquina
            </Button>
          </div>

          <VirtualMachinesTable />
        </div>
      </div>
    </div>
  );
}
