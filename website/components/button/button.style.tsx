import styled from "@emotion/styled";
export type HexColor = `#${string}`;

export const StyledButton = styled.button<{
  color?: HexColor;
  hoverColor?: HexColor;
  disabled?: boolean;
}>`
  & {
    padding: 8px;
    background-color: ${props => (props.disabled ? "lightgray" : props?.color || "transparent")};
    font-size: 24px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    cursor: ${props => !props.disabled && "pointer"};
    &:hover {
      background-color: ${props => (props.disabled ? "lightgray" : props?.hoverColor || "transparent")};
    }
  }
`;
