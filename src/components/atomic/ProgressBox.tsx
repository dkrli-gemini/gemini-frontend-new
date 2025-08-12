export interface ProgressBarProps {
  percentage: string;
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 ">
      <div
        className="bg-blue-400 h-3 rounded-full"
        style={{ width: percentage }}
      ></div>
    </div>
  );
}

export interface NamedProgressBarProps {
  name: string;
  used: number;
  limit: number;
  unit: string;
}

export function NamedProgressBar(props: NamedProgressBarProps) {
  let percentage = `${Math.round((props.used / props.limit) * 100)}%`;
  percentage == "NaN%" ? (percentage = "0%") : null;
  return (
    <span>
      <span className="flex flex-row justify-between mb-1">
        <p>{props.name}</p>
        <p>{`${props.used}${props.unit} / ${props.limit}${props.unit} (${percentage})`}</p>
      </span>
      <ProgressBar percentage={percentage} />
    </span>
  );
}

export interface ProgressBoxProps {
  name: string;
  bars: NamedProgressBarProps[];
}

export default function ProgressBox(props: ProgressBoxProps) {
  return (
    <div className="border rounded-xl p-6">
      <span className="border-b text-2xl pb-4 mb-7 font-bold flex">
        <h2>{props.name}</h2>
      </span>
      <div className="flex flex-col gap-6">
        {props.bars.map((b) => (
          <NamedProgressBar
            name={b.name}
            limit={b.limit}
            used={b.used}
            unit={b.unit}
            key={b.name}
          />
        ))}
      </div>
    </div>
  );
}
