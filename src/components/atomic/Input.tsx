import { cn } from "@/lib/utils";
import { ChangeEvent, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
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
        type={props.type ?? "text"}
        className="outline-none ml-3 h-max w-full placeholder-[#999999]"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        min={props.min}
        max={props.max}
        step={props.step}
        disabled={props.disabled}
        name={props.name}
        autoComplete={props.autoComplete}
      />
    </div>
  );
};
