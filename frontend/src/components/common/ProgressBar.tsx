import styled from 'styled-components';

interface ProgressBarProps {
    steps: string[];
    currentStep: number; // 0-indexed
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  position: relative;
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const StepCircle = styled.div<{ active: boolean; completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme, active, completed }) =>
        completed ? theme.colors.success :
            active ? theme.colors.primary :
                theme.colors.border};
  color: ${({ theme }) => theme.colors.text.light};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  transition: background-color 0.3s;
`;

const StepLabel = styled.span<{ active: boolean }>`
  font-size: ${({ theme }) => theme.typography.caption};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
`;

const Line = styled.div`
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.border};
  z-index: 0;
`;

const ProgressLine = styled.div<{ progress: number }>`
  position: absolute;
  top: 16px;
  left: 0;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.success};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease-in-out;
  z-index: 0;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
    const progress = (currentStep / (steps.length - 1)) * 100;

    return (
        <Container>
            <Line />
            <ProgressLine progress={progress} />
            {steps.map((step, index) => (
                <StepWrapper key={index}>
                    <StepCircle
                        active={index === currentStep}
                        completed={index < currentStep}
                    >
                        {index < currentStep ? '✓' : index + 1}
                    </StepCircle>
                    <StepLabel active={index === currentStep}>{step}</StepLabel>
                </StepWrapper>
            ))}
        </Container>
    );
};
