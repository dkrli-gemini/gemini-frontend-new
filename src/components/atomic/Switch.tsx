import { cn } from "@/lib/utils";
import React, { useState } from "react";

export interface SwitchProps {
  color?: "green";
}

const Switch = ({ color = "green" }: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const colors = {
    active: {
      green: "bg-[#00A63E]",
    },
    unactive: {
      green: "bg-[#F2F2F2]",
    },
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={cn(
              "box block h-8 w-14 rounded-full",
              isChecked ? colors.active[color] : colors.unactive[color]
            )}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              isChecked ? "translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
    </>
  );
};

export default Switch;
