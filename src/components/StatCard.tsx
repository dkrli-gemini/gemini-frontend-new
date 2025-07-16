import { cn } from "@/lib/utils";

interface StatCardProps {
  count: number;
  label: string;
  color?: string;
  last?: boolean;
}

export function StatCard({
  count,
  label,
  color = "text-blue-600",
  last = false,
}: StatCardProps) {
  return (
    <div
      className={cn("bg-white p-3 flex flex-col h-23", last ? "" : "border-r")}
    >
      <p className={`text-4xl font-bold ${color}`}>{count}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
