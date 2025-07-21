import { cn } from "@/lib/utils";

export interface TabElementProps {
  name: string;
  selected: boolean;
}

export const TabElement = (props: TabElementProps) => {
  return (
    <li>
      <button
        role="tab"
        className={cn(
          "relative py-2 focus:outline-none text-xl",
          props.selected ? "text-[#0F3759]" : "text-[#737373]  cursor-pointer"
        )}
      >
        {props.name}
        {props.selected && (
          <span className="absolute bottom-0 left-1/2 w-1/4 h-1 bg-[#0F3759] rounded-t  -translate-x-1/2"></span>
        )}
      </button>
    </li>
  );
};
