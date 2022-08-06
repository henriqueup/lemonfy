import styled from '@emotion/styled';
export type HexColor = `#${string}`;

export const StyledButton = styled.button<{
    color?: HexColor;
    hoverColor?: HexColor;
}>`
    & {
        padding: 32px;
        background-color: ${props => props?.color || 'transparent'};
        font-size: 24px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        &:hover {
            background-color: ${props => props?.hoverColor || 'transparent'};
        }
    }
`;
