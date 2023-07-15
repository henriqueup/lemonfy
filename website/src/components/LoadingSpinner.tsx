import { Loader } from "lucide-react";

import { cn } from "@/styles/utils";

interface Props {
  className?: string;
}

export default function LoadingSpinner({ className }: Props) {
  return (
    <div className={cn(className, "flex h-full items-center justify-center")}>
      <Loader className="h-8 w-8 animate-spin" />
    </div>
  );
}
