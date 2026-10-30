import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative flex items-center w-full sm:w-fit">
      <select
        data-slot="select"
        className={cn(
          "h-8 w-full rounded-lg border border-input bg-card pl-3 pr-10 py-1 text-sm shadow-sm transition-colors outline-none appearance-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

export { Select };
