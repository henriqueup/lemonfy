import { FunctionComponent } from "react";
import { HexColor, StyledButton } from "./button.style";

type VariantOptions = "primary" | "success" | "error" | "";
export type ButtonProps = {
  variant?: VariantOptions;
  text?: string;
  onClick: () => void;
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

const Button: FunctionComponent<ButtonProps> = ({ variant = "", text = "Button Example", onClick }) => {
  const { color, hoverColor } = variantMapper(variant);
  return (
    <StyledButton color={color} hoverColor={hoverColor} onClick={onClick}>
      {text}
    </StyledButton>
  );
};

Button.displayName = "Button";

export { Button };
