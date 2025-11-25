import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { TextArea } from '../../components/common/Input';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const SectionCard = styled(Card)`
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const DiffView = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(2)};
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;


const Label = styled.div`
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface ResumeValidatorProps {
    sections: any; // JSON object with sections
    onSave: (updatedSections: any) => void;
}

export const ResumeValidator: React.FC<ResumeValidatorProps> = ({ sections, onSave }) => {
    // For MVP, we'll just show the tailored content and allow editing
    // In a real app, we'd show side-by-side diff with original

    const [editedSections, setEditedSections] = useState(sections || {});

    const handleContentChange = (sectionKey: string, value: string) => {
        setEditedSections({
            ...editedSections,
            [sectionKey]: value
        });
    };

    const handleSave = () => {
        onSave(editedSections);
        alert('Changes saved!');
    };

    if (!sections) return <p>No tailored sections available.</p>;

    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Button onClick={handleSave}>Save All Changes</Button>
            </div>

            {Object.entries(editedSections).map(([key, content]) => (
                <SectionCard key={key}>
                    <SectionHeader>
                        <SectionTitle>{key.replace(/_/g, ' ').toUpperCase()}</SectionTitle>
                    </SectionHeader>

                    <DiffView>
                        {/* Placeholder for Original Content if we had it mapped 
            <div>
              <Label>Original</Label>
              <ContentBox>Original content...</ContentBox>
            </div>
            */}

                        <div style={{ gridColumn: '1 / -1' }}>
                            <Label>Tailored Content (Editable)</Label>
                            <TextArea
                                value={content as string}
                                onChange={(e) => handleContentChange(key, e.target.value)}
                                rows={10}
                                style={{ fontFamily: 'monospace' }}
                            />
                        </div>
                    </DiffView>
                </SectionCard>
            ))}
        </Container>
    );
};
