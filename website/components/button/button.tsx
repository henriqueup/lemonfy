import { ButtonHTMLAttributes, DetailedHTMLProps, FunctionComponent } from "react";
import { HexColor, StyledButton } from "./button.style";

type VariantOptions = "primary" | "success" | "error" | "";
export type ButtonProps = {
  variant?: VariantOptions;
  text?: string;
};

function variantMapper(variant: VariantOptions): {
  color: HexColor;
  hoverColor: HexColor;
} {
  switch (variant) {
    case "primary":
      return {
        color: "#0060DF",
        hoverColor: "#0250BB",
      };
    case "success":
      return {
        color: "#4F772D",
        hoverColor: "#90A955",
      };
    case "error":
      return {
        color: "#92140C",
        hoverColor: "#A5243D",
      };
    default:
      return {
        color: "#EF2D56",
        hoverColor: "#EA526F",
      };
  }
}

const Button: FunctionComponent<
  ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ variant = "", text = "Button Example", ...props }) => {
  const { color, hoverColor } = variantMapper(variant);
  return (
    <StyledButton {...props} color={color} hoverColor={hoverColor}>
      {text}
    </StyledButton>
  );
};

Button.displayName = "Button";

export { Button };
