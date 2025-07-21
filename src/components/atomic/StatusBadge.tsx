type Status = string;

interface StatusBadgeProps {
  status: Status;
  pclassName?: string;
}

export function StatusBadge({ status, pclassName }: StatusBadgeProps) {
  const statusStyles: Record<Status, string> = {
    Running: "bg-green-100 text-green-700",
    Error: "bg-red-100 text-red-700",
    Stopped: "bg-gray-100 text-gray-600",
    Starting: "bg-yellow-100 text-yellow-700",
    Stopping: "bg-yellow-100 text-yellow-700",
    Rodando: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      } ${pclassName}`}
    >
      {status}
    </span>
  );
}
