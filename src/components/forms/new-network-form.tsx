"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
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
import { useParams, usePathname, useRouter } from "next/navigation";
import { useVirtualMachineStore } from "@/stores/virtual-machine.store";
import { Computer } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const formSchema = z.object({
  networkName: z
    .string()
    .min(4, {
      message: "O nome da rede deve ter pelo menos 4 caracteres",
    })
    .max(25, { message: "O nome da rede deve ter no máximo 25 caracteres" }),
  networkGateway: z.string(),
  networkNetmask: z.string(),
});

export interface ACLListProps {
  name: string;
  form: UseFormReturn<any>;
}

export function ACLListElement(props: ACLListProps) {
  const [state, setState] = useState<boolean>(false);

  return (
    <div className="flex border-t py-4 gap-2 border-gray-400">
      <Checkbox className="border-black" />
      <Label>{props.name}</Label>
    </div>
  );
}

export default function NetNetworkForm() {
  const [currentNetworkId, setCurrentNetworkId] = useState<string | null>(null);
  const session = useSession();
  const params = useParams();
  const pathname = usePathname();
  const networkStore = useNetworkStore();
  const virtualMachineStore = useVirtualMachineStore();
  const router = useRouter();

  useEffect(() => {
    console.log(params);
    if (session.status == "authenticated") {
      networkStore.fetchNetworks(
        session.data.access_token,
        params.projectId as string
      );
    }
  }),
    [session.status, networkStore.fetchNetworks];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await networkStore.createNetwork(
      session.data?.access_token!,
      params.projectId as string,
      values.networkName,
      values.networkGateway,
      values.networkNetmask,
      "022c64eb-fe8d-11ef-ad17-000c2918dc6d",
      "04dd3cea-4346-4ca3-8d1b-cdb73f28ec6d"
    );
    await networkStore.fetchNetworks(
      session.data?.access_token!,
      params.projectId as string
    );
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];

    if (lastSegment == "new-network") {
      router.push(`/${params.projectId as string}/networks`);
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="networkName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: redeprincipal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="networkGateway"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gateway</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 192.168.0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="networkNetmask"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Netmask</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 192.168.0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <div className="text-sm font-medium">Regras ACL</div>
        <Separator />
        <div className="flex-1 flex justify-center px-10">
          <Button type="button" variant="default" className="flex-1">
            Adicionar regra ACL
          </Button>
        </div>
        <div className="flex flex-col">
          <div className="flex-1 flex flex-col bg-gray-100 p-2 rounded-sm">
            <ACLListElement name="Permitir todos" form={form} />
            <ACLListElement name="Negar todos" form={form} />
          </div>
        </div>
        <Button type="submit" className="mt-5">
          Criar Rede
        </Button>
      </form>
    </Form>
  );
}
