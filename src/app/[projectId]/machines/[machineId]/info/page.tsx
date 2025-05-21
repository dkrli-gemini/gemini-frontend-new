"use client";

import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { Dot } from "@/components/dot";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CircleFadingArrowUp,
  Computer,
  SquareChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function MachinePageInfo() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col p-3 gap-2 ">
        <div className="border border-black  p-3 grid items-center grid-cols-3 rounded-xl bg-[#0F3759] text-white">
          <div className="flex items-center gap-3 ">
            <Computer size={50} />
            <span className="text-2xl font-medium">VirtualMachine</span>
          </div>
          <div></div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex flex-row items-center gap-1">
              <Dot className="w-2.5 h-2.5" />
              Desligada
            </div>
            <Button className="w-[95%] text-white" variant={"default"}>
              Ligar máquina
            </Button>
          </div>
        </div>
        <Tabs defaultValue="general" className="w-[100%] h-full">
          <TabsList className="w-[100%] bg-[#F07922C0]">
            <TabsTrigger value="general" className="text-black">
              Visão geral
            </TabsTrigger>
            <TabsTrigger value="network" className="text-black">
              Conexão e rede
            </TabsTrigger>
            <TabsTrigger value="console" className="text-black">
              Console e recuperação
            </TabsTrigger>
            <TabsTrigger value="disks" className={cn("text-black")}>
              Discos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="h-full rounded-md border p-3 grid grid-cols-2">
              <div className="flex flex-col space-y-3 border-r border-black h-full p-1 pr-3">
                <span className="text-l font-medium">
                  Nome:{" "}
                  <span className="text-base font-normal">VirtualMachine</span>
                </span>
                <span className="text-l font-medium">
                  IPv4:{" "}
                  <span className="font-normal text-base">10.128.2.7</span>
                </span>
                <span className="text-l font-medium ">
                  Sistema Operacional:{" "}
                  <span className="text-base font-normal">CentOS</span>
                </span>
                <span className="text-l font-medium">
                  Status:{" "}
                  <span className="text-base font-normal">Desligada</span>
                </span>
                <span className="text-l font-medium">
                  Instância:{" "}
                  <span className="text-base font-normal">
                    Instância Pequena
                  </span>
                </span>
                <span className="text-l font-medium">
                  Domínio: <span className="text-base font-normal">Niblo</span>
                </span>
                <span className="text-l font-medium">
                  Projeto:{" "}
                  <span className="text-base font-normal">Niblo (Root)</span>
                </span>
                <span className="text-l font-medium">
                  Zona:{" "}
                  <span className="text-base font-normal">ACS-HML-VIN2</span>
                </span>
                <Separator className="bg-black" />
                <span className="text-l font-medium">
                  CPU:
                  <span className="text-base font-normal">
                    {" "}
                    1x 0.50Ghz
                  </span>{" "}
                </span>
                <span className="text-l font-medium">
                  Memória:
                  <span className="text-base font-normal"> 500MB</span>{" "}
                </span>
                <span className="text-l font-medium">
                  Disco: <span className="text-base font-normal">1x 200GB</span>
                </span>
                <Separator className="bg-black" />
                <span className="text-l font-medium">
                  Criação:{" "}
                  <span className="text-base font-normal">
                    19/05/2025 - 14:44{" "}
                  </span>
                </span>
                <span className="text-l font-medium">
                  Última alteração:
                  <span className="text-base font-normal">
                    19/05/2025 - 14:44
                  </span>{" "}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-3 ">
                <Button className="flex flex-1 flex-col text-3xl">
                  <SquareChevronRight className="!size-15" />
                  Console
                </Button>
                <Button className="flex flex-1 flex-col text-3xl">
                  <CircleFadingArrowUp className="!size-15" />
                  Upgrade
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network">
            <div className="bg-gray-200 h-full rounded-md border p-3 w-fit"></div>
          </TabsContent>
          <TabsContent value="console">
            <div className="bg-gray-200 h-full rounded-md border  p-3 w"></div>
          </TabsContent>
          <TabsContent value="disks">
            <div className="bg-gray-200 h-full rounded-md border  p-3 w"></div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarProvider>
  );
}
