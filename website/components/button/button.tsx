import React, { FunctionComponent } from "react";
import { css } from "@emotion/css";
import { StyledButton } from "./button.style";

type ButtonProps = {};
const Button: FunctionComponent<ButtonProps> = () => {
    return <StyledButton>Button Example</StyledButton>;
};

Button.displayName = "Button";

export { Button };
