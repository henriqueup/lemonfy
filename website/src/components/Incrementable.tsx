import { ChevronLeft, ChevronRight } from "lucide-react";
import { type HTMLProps } from "react";

import { cn } from "@/styles/utils";
import { Label, type LabelProps } from "@/components/ui/Label";
import { Button, type ButtonProps } from "@/components/ui/Button";

interface Props {
  label: string;
  value: string;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
  labelProps?: LabelProps;
  incrementButtonProps?: ButtonProps;
  decrementButtonProps?: ButtonProps;
  valueProps?: HTMLProps<HTMLSpanElement>;
}

export default function Incrementable({
  label,
  value,
  onIncrement,
  onDecrement,
  className,
  labelProps,
  incrementButtonProps,
  decrementButtonProps,
  valueProps,
}: Props) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Label {...labelProps}>{label}</Label>
      <div className="flex w-full items-center justify-between">
        <Button
          {...decrementButtonProps}
          className={cn("h-min p-1", decrementButtonProps?.className)}
          variant="outline"
          onClick={onDecrement}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span
          {...valueProps}
          className={cn("px-4 text-center", valueProps?.className)}
        >
          {value}
        </span>
        <Button
          {...incrementButtonProps}
          className={cn("h-min p-1", incrementButtonProps?.className)}
          variant="outline"
          onClick={onIncrement}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
