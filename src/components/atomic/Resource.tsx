import { ResourceTypeEnum } from "@/stores/limit.store";

export interface ResourceProps {
  label: string;
  type: ResourceTypeEnum;
  used: number;
  limit: number;
}

export default function Resource(props: ResourceProps) {
  const formattedUsed = formatValue(props.type, props.used);
  const formattedLimit =
    props.limit && props.limit > 0
      ? formatValue(props.type, props.limit)
      : "Ilimitado";

  const percent =
    props.limit > 0 ? Math.min(100, (props.used / props.limit) * 100) : 100;
  const overflow = props.limit > 0 && props.used > props.limit;

  return (
    <div
      className={`rounded-2xl border px-6 py-5 shadow-sm transition-all duration-300 hover:shadow-xl ${
        overflow ? "border-red-200 bg-[#FFF5F5]" : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{props.label}</h3>
        {overflow && (
          <span className="text-xs font-semibold uppercase text-red-500">
            Overflow
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Uso atual</span>
          <span className="font-semibold text-gray-900">{formattedUsed}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${
              overflow ? "bg-red-500" : "bg-[#4296d2]"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          Limite:{" "}
          <span className="font-semibold text-gray-800">{formattedLimit}</span>
        </p>
      </div>
    </div>
  );
}

const formatValue = (type: ResourceTypeEnum, value: number) => {
  if (value === undefined || value === null) return "0";

  switch (type) {
    case ResourceTypeEnum.MEMORY: {
      const gb = value / 1024;
      return `${gb.toFixed(gb >= 10 ? 0 : 1)} GB`;
    }
    case ResourceTypeEnum.CPU:
      return `${value} vCPU`;
    case ResourceTypeEnum.VOLUMES:
      return `${value} GB`;
    default:
      return value.toLocaleString();
  }
};
