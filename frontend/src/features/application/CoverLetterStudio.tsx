import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { TextArea, InputWrapper, Label } from '../../components/common/Input';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(3)};
  
  @media (min-width: 992px) {
    grid-template-columns: 300px 1fr;
  }
`;

const Controls = styled(Card)`
  height: fit-content;
`;

const Editor = styled(Card)`
  min-height: 600px;
  display: flex;
  flex-direction: column;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

interface CoverLetterStudioProps {
    content: string;
    onSave: (content: string) => void;
    onRegenerate: (params: any) => void;
}

export const CoverLetterStudio: React.FC<CoverLetterStudioProps> = ({ content, onSave, onRegenerate }) => {
    const [text, setText] = useState(content || '');
    const [tone, setTone] = useState('formal');
    const [length, setLength] = useState('medium');

    const handleSave = () => {
        onSave(text);
        alert('Cover letter saved!');
    };

    const handleRegenerate = () => {
        onRegenerate({ tone, length });
    };

    return (
        <Container>
            <Controls>
                <h3>Controls</h3>
                <InputWrapper>
                    <Label>Tone</Label>
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="formal">Formal</option>
                        <option value="casual">Casual</option>
                        <option value="enthusiastic">Enthusiastic</option>
                    </select>
                </InputWrapper>

                <InputWrapper>
                    <Label>Length</Label>
                    <select
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                    </select>
                </InputWrapper>

                <Button fullWidth onClick={handleRegenerate} style={{ marginBottom: '16px' }}>
                    Regenerate
                </Button>

                <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    Regenerating will overwrite current edits.
                </p>
            </Controls>

            <Editor>
                <EditorHeader>
                    <h3>Editor</h3>
                    <Button onClick={handleSave} variant="primary">Save Changes</Button>
                </EditorHeader>
                <TextArea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ flex: 1, fontFamily: 'serif', fontSize: '1.1rem', lineHeight: '1.6' }}
                />
            </Editor>
        </Container>
    );
};
