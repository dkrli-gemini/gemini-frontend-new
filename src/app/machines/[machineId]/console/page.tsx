"use client";

import { Header } from "@/components/atomic/Header";
import { Button } from "@/components/atomic/Button";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MachineConsolePage() {
  const params = useParams();
  const machineId = params.machineId as string;
  const { data: session } = useSession();
  const [consoleUrl, setConsoleUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConsoleUrl() {
      if (!session?.access_token || !machineId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/machines/fetch-console", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ machineId }),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result?.message?.consoleUrl) {
          throw new Error("Não foi possível obter o console da máquina.");
        }

        setConsoleUrl(result.message.consoleUrl);
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar console. Verifique se a máquina está ligada.");
      } finally {
        setLoading(false);
      }
    }

    fetchConsoleUrl();
  }, [machineId, session?.access_token]);

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex items-center justify-between border-b border-[#E6E6E6] bg-white px-8 py-4">
        <div className="flex items-center gap-3">
          <Link href={`/machines/${machineId}`}>
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold">Console da máquina</h1>
        </div>
        {consoleUrl && (
          <Button
            variant="ghost"
            onClick={() => window.open(consoleUrl, "_blank", "noopener,noreferrer")}
          >
            Abrir em nova aba
          </Button>
        )}
      </div>

      <div className="flex-1 bg-[#0f1115] p-4">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm text-white/80">
            Carregando console...
          </div>
        )}

        {!loading && error && (
          <div className="flex h-full items-center justify-center text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && consoleUrl && (
          <iframe
            title="Cloud Console"
            src={consoleUrl}
            className="h-full w-full rounded-md border border-white/20 bg-black"
            allow="clipboard-read; clipboard-write"
          />
        )}
      </div>
    </div>
  );
}

