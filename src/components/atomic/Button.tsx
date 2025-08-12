"use client";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outlined";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, children, type = "button", ...props }, ref) => {
    return (
      <button
        className={cn(
          "cursor-pointer  rounded-[12] inline-flex items-center justify-center py-3 px-5 text-center text-base font-medium disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 h-fit gap-1",
          variant === "primary"
            ? "bg-primary border-primary border text-white hover:bg-brand-800 "
            : "",
          variant === "ghost" ? "text-[#0F3759]" : "",
          variant === "outlined" ? "border" : "",
          className
        )}
        ref={ref}
        type={type}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
