import React from 'react';
import { Button as ButtonPrimitive } from "@/components/ui/button" // Assumed path, adjust if needed
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof ButtonPrimitive> {}

const Button = React.forwardRef<
  React.ElementRef<typeof ButtonPrimitive>,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <ButtonPrimitive
      ref={ref}
      className={cn("rounded-md", className)} // Added rounded-md
      {...props}
    />
  );
});
Button.displayName = "Button";
export { Button };