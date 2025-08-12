type Status = string;

interface StatusBadgeProps {
  status: Status;
  pclassName?: string;
}

export function StatusBadge({ status, pclassName }: StatusBadgeProps) {
  const statusStyles: Record<Status, string> = {
    RUNNING: "bg-green-100 text-green-700",
    Error: "bg-red-100 text-red-700",
    STOPPED: "bg-gray-100 text-gray-600",
    STARTING: "bg-yellow-100 text-yellow-700",
    STOPPING: "bg-yellow-100 text-yellow-700",
    Rodando: "bg-green-100 text-green-700",
    ALLOW: "bg-green-100 text-green-700",
  };

  const statusTexts: Record<Status, string> = {
    RUNNING: "Em execução",
    STOPPED: "Parada",
    STARTING: "Iniciando...",
    STOPPING: "Desligando...",
    ALLOW: "Allow",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      } ${pclassName}`}
    >
      {statusTexts[status]}
    </span>
  );
}
