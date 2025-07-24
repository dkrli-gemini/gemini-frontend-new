import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export interface ButtonProps {
  children: any;
  variant: "primary" | "ghost";
  className?: string;
  form?: string;
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      form={props.form}
      type={props.type}
      onClick={props.onClick}
      className={cn(
        "cursor-pointer  rounded-[12] inline-flex items-center justify-center py-3 px-5 text-center text-base font-medium disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 h-fit gap-1",
        props.variant == "primary"
          ? "bg-primary border-primary border text-white hover:bg-brand-800 "
          : "",
        props.variant == "ghost" ? "text-[#0F3759]" : "",
        props.className
      )}
    >
      {props.children}
    </button>
  );
};
