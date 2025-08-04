import { cn } from "@/lib/utils";
import React from "react";

export interface SwitchProps {
  color?: "green";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = ({ color = "green", checked, onCheckedChange, disabled }: SwitchProps) => {
  const colors = {
    active: {
      green: "bg-[#00A63E]",
    },
    unactive: {
      green: "bg-[#F2F2F2]",
    },
  };

  return (
    <>
      <label
        className={cn(
          "flex select-none items-center",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onCheckedChange(!checked)}
            className="sr-only"
            disabled={disabled}
          />
          <div
            className={cn(
              "box block h-8 w-14 rounded-full",
              checked ? colors.active[color] : colors.unactive[color]
            )}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${checked ? "translate-x-full" : ""}`}
          ></div>
        </div>
      </label>
    </>
  );
};

export default Switch;
