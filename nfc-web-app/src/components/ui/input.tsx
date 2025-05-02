import React from 'react';
import { Input as InputPrimitive } from "@/components/ui/input"  // Assumed path
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentPropsWithoutRef<typeof InputPrimitive> {}

const Input = React.forwardRef<
  React.ElementRef<typeof InputPrimitive>,
  InputProps
>(({ className, ...props }, ref) => {
  return (
    <InputPrimitive
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus-visible:ring-gray-300",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
export { Input };
