import React from 'react';
import { Textarea as TextareaPrimitive } from "@/components/ui/textarea" // Assumed path
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentPropsWithoutRef<typeof TextareaPrimitive> {}

const Textarea = React.forwardRef<
  React.ElementRef<typeof TextareaPrimitive>,
  TextareaProps
>(({ className, ...props }, ref) => {
  return (
    <TextareaPrimitive
      ref={ref}
      className={cn(
        "min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus-visible:ring-gray-300",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
export { Textarea };