import { cn } from "@/lib/utils";
import React from "react";

export interface ObservableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: number;
}

export const ObservableWrapper: React.FC<ObservableWrapperProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("rounded-lg border p-4 shadow-sm bg-muted/30", className)} {...props}>
      {children}
    </div>
  );
};
