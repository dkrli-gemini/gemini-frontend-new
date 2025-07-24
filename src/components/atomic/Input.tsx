import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";

export interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputProps) => {
  return (
    <div
      className={cn(
        "flex bg-[#F2F2F2] items-center p-2 rounded-xl h-13",
        props.className
      )}
    >
      <input
        type="text"
        className="outline-none ml-3 h-max w-full placeholder-[#999999]"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
