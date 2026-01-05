import { Button } from "@/components/atomic/Button";
import { Header } from "@/components/atomic/Header";
import { PageHeader } from "@/components/atomic/PageHeader";
import { PageHeader0 } from "@/components/atomic/PageHeader0";
import { PageHeader2 } from "@/components/atomic/PageHeader2";

export default function ClientInfoPage() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <PageHeader0 title="Dados cadastrais" />

      <div className="flex flex-col justify-center px-20 mt-16">
        <div className="mt-5 grid grid-cols-3 grid-rows-2 gap-y-12 mt-10">
          <span className="font-semibold text-xl text-[#4C4C4C] flex flex-col gap-1">
            <p className="font-normal text-[0.85em] ">Nome do cliente</p>
            Cliente ABC
          </span>
          <span className="font-semibold text-xl text-[#4C4C4C] flex flex-col gap-1">
            <p className="font-normal text-[0.85em] ">CNPJ</p>
            12.345.678/0001-00
          </span>
          <Button variant="primary">Editar dados</Button>
          <span className="font-semibold text-xl text-[#4C4C4C] flex flex-col gap-1">
            <p className="font-normal text-[0.85em] ">ID da fatura</p>
            01234568
          </span>
          <span className="font-semibold text-xl text-[#4C4C4C] flex flex-col gap-1">
            <p className="font-normal text-[0.85em] ">
              Acesso aos dados como distribuidor
            </p>
            Sim
          </span>
          <span className="font-semibold text-xl text-[#4C4C4C] flex flex-col gap-1">
            <p className="font-normal text-[0.85em] ">Cobrança direta</p>
            Não
          </span>
        </div>
      </div>
    </div>
  );
}
