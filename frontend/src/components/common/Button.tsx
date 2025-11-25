import styled, { css } from 'styled-components';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  /* Sizes */
  ${({ size = 'medium', theme }) => {
        switch (size) {
            case 'small':
                return css`
          padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
          font-size: ${theme.typography.caption};
        `;
            case 'large':
                return css`
          padding: ${theme.spacing(1.5)} ${theme.spacing(3)};
          font-size: ${theme.typography.body1};
        `;
            default: // medium
                return css`
          padding: ${theme.spacing(1)} ${theme.spacing(2)};
          font-size: ${theme.typography.body2};
        `;
        }
    }}

  /* Variants */
  ${({ variant = 'primary', theme }) => {
        switch (variant) {
            case 'secondary':
                return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text.light};
          &:hover {
            background-color: ${theme.colors.primary}; // Darker shade ideally
            opacity: 0.9;
          }
        `;
            case 'outline':
                return css`
          background-color: transparent;
          border: 2px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary}10; // 10% opacity
          }
        `;
            case 'text':
                return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary}10;
          }
        `;
            default: // primary
                return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.light};
          &:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.small};
          }
        `;
        }
    }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
