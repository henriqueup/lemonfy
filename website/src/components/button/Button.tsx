import { type ButtonHTMLAttributes, type DetailedHTMLProps, type FunctionComponent } from "react";
import { cn } from "../../styles/utils";

type Variant = "primary" | "success" | "error" | "transparent" | "default";
export type ButtonProps = {
  variant?: Variant;
  text?: string;
};

const VARIANT_MAP: Record<Variant, string> = /*tw*/ {
  primary: "bg-blue-600 hover:bg-blue-400",
  success: "bg-green-600 hover:bg-green-400",
  error: "bg-red-600 hover:bg-red-400",
  transparent: "bg-transparent hover:bg-transparent",
  default: "bg-lime-200 hover:bg-lime-50",
};

const Button: FunctionComponent<
  ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ variant = "default", text = "Button Example", ...props }) => {
  return (
    <button
      {...props}
      className={cn(
        "cursor-pointer rounded p-2 text-lg font-bold text-white",
        props.disabled ? "bg-gray-400 hover:bg-gray-400" : VARIANT_MAP[variant],
        props.className,
      )}
    >
      {text}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
