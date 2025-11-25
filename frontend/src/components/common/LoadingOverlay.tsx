import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { createPortal } from 'react-dom';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: ${({ theme }) => theme.spacing(3)};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.h3};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  text-align: center;
`;

const SubMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.body1};
  text-align: center;
`;

const MESSAGES = [
    "Analyzing job description...",
    "Identifying key skills...",
    "Tailoring your resume...",
    "Drafting a compelling cover letter...",
    "Polishing the details...",
    "Almost there..."
];

interface LoadingOverlayProps {
    isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) return null;

    return createPortal(
        <Overlay>
            <Spinner />
            <Message>Genie is working magic 🧞‍♂️</Message>
            <SubMessage>{MESSAGES[messageIndex]}</SubMessage>
        </Overlay>,
        document.body
    );
};
