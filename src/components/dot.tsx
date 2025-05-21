import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have shadcn's cn utility

interface DotProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string; // Optional prop to customize color
}

const Dot = React.forwardRef<HTMLDivElement, DotProps>(
  ({ className, color = "bg-red-500", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "h-2 w-2 rounded-full", // Base styles: small circle
          color, // Apply the color class (default red)
          className // Allow additional Tailwind classes to be passed in
        )}
        {...props}
      />
    );
  }
);

Dot.displayName = "Dot";

export { Dot };
