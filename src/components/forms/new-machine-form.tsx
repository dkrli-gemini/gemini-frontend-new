"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { SelectableHorizontalList } from "../selectable-horizontal-scroller";
import { useEffect, useState } from "react";
import OSPopup from "../os-popup";
import TemplatePopup from "../template-popup";
import { useSession } from "next-auth/react";
import { useNetworkStore } from "@/stores/network.store";
import { useParams, useRouter } from "next/navigation";
import { useVirtualMachineStore } from "@/stores/virtual-machine.store";
import { Computer } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";

const formSchema = z.object({
  machineName: z
    .string()
    .min(4, {
      message: "O nome da máquina deve ter pelo menos 4 caracteres",
    })
    .max(25, { message: "O nome da máquina deve ter no máximo 25 caracteres" }),
  machinePassword: z.string(),
});

export default function NewMachineForm() {
  const [currentNetworkId, setCurrentNetworkId] = useState<string | null>(null);
  const session = useSession();
  const params = useParams();
  const networkStore = useNetworkStore();
  const virtualMachineStore = useVirtualMachineStore();
  const router = useRouter();

  useEffect(() => {
    if (session.status == "authenticated") {
      networkStore.fetchNetworks(
        session.data.access_token,
        params.projectId as string
      );
    }
  }),
    [session.status];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await virtualMachineStore.createVirtualMachine(
      session.data?.access_token!,
      values.machineName,
      params.projectId as string,
      "a3490a4c-2213-4636-86f1-c021e7da9bea",
      "625fdb7e-fe8c-11ef-ad17-000c2918dc6d",
      currentNetworkId!
    );
    // await virtualMachineStore.fetchVirtualMachines(
    //   session.data?.access_token!,
    //   params.projectId as string
    // );
    router.push(`/${params.projectId as string}/machines`);
  }

  const handleNetworkSelection = (id: string | null) => {
    console.log("Item selected in page:", id);
    setCurrentNetworkId(id);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="machineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: maquinaprincipal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="machinePassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha do primeiro acesso</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <div className="flex flex-col">
          <div className="font-medium text-sm gap-2 mb-1 flex justify-between items-center">
            Rede{" "}
            <DialogTrigger asChild>
              <Button variant={"outline"} type="button">
                Nova rede
              </Button>
            </DialogTrigger>
          </div>
          <Separator />
          <SelectableHorizontalList
            items={networkStore.networks.map((network) => ({
              id: network.id,
              gateway: network.gateway,
              name: network.name,
              netmask: network.netmask,
            }))}
            onSelectChange={handleNetworkSelection}
          />
          <Separator />
        </div>
        <div>
          <div className="font-medium text-sm gap-2 mb-1 flex justify-between items-center">
            Sistema Operacional
            <Button variant={"outline"} type="button">
              Carregar ISO
            </Button>
          </div>
          <Separator />

          <div className="flex gap-2 justify-center p-3">
            <OSPopup name="Ubuntu" icon={<Computer />} active={true} />
            <OSPopup name="Windows" icon={<Computer />} active={false} />
            <OSPopup name="CentOS" icon={<Computer />} active={false} />
          </div>
        </div>
        <div>
          <div className="font-medium text-sm gap-2 mb-1 flex justify-between items-center">
            Template
          </div>
          <Separator />
          <div className="flex gap-2 justify-center p-3">
            <TemplatePopup
              memory="200mb"
              disk="200gb"
              cpu="1x0.50Hz"
              name="Instância Pequena"
              active={false}
            />
            <TemplatePopup
              memory="2gb"
              disk="500gb"
              cpu="1x1.00Hz"
              name="Instância Média"
              active={true}
            />
            <TemplatePopup
              memory="8gb"
              disk="1tb"
              cpu="1x2.00Hz"
              name="Instância Grande"
              active={false}
            />
          </div>
        </div>
        <Button type="submit">
          {virtualMachineStore.loading ? "Carregando" : "Criar Máquina"}
        </Button>
      </form>
    </Form>
  );
}
