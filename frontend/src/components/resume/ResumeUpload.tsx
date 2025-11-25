import React, { useState } from 'react';
import styled from 'styled-components';
import { client } from '../../api/client';

const UploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

interface ResumeUploadProps {
    onUploadSuccess: (resume: any) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await client.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadSuccess(response.data);
        } catch (err) {
            console.error('Upload failed', err);
            setError('Failed to upload resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <UploadArea onClick={() => document.getElementById('resume-upload-input')?.click()}>
                <p>Click to upload your resume (PDF, DOCX, TXT)</p>
                <HiddenInput
                    id="resume-upload-input"
                    type="file"
                    accept=".pdf,.docx,.txt,.docs"
                    onChange={handleFileChange}
                />
            </UploadArea>
            {uploading && <p style={{ marginTop: '8px', color: '#666' }}>Uploading...</p>}
            {error && <p style={{ marginTop: '8px', color: 'red' }}>{error}</p>}
        </div>
    );
};
