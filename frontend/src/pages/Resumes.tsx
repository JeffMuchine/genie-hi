import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../components/common/Button';
import { Card, CardTitle, CardContent } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { ResumeUpload } from '../components/resume/ResumeUpload';
import { client } from '../api/client';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const InsightsCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.colors.surface};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
`;

interface ResumeData {
    id: string;
    filename?: string;
    uploaded_at: string;
    insights: {
        experience_level: string;
        encouraging_note: string;
    };
}

export const Resumes = () => {
    const [resume, setResume] = useState<ResumeData | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        try {
            const response = await client.get('/resume/');
            setResume(response.data);
        } catch (error) {
            console.error('Error fetching resume:', error);
            // If 404, just means no resume yet
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = (newResume: ResumeData) => {
        setResume(newResume);
        setShowUploadModal(false);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <PageContainer>
            <Header>
                <h1>My Resume</h1>
                <Button onClick={() => setShowUploadModal(true)}>
                    {resume ? 'Update Resume' : 'Upload Resume'}
                </Button>
            </Header>

            {!resume ? (
                <Card>
                    <CardContent>
                        <p>You haven't uploaded a resume yet. Upload one to get started!</p>
                        <Button style={{ marginTop: '16px' }} onClick={() => setShowUploadModal(true)}>
                            Upload Now
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card>
                        <CardTitle>Current Resume</CardTitle>
                        <CardContent>
                            <p><strong>Uploaded:</strong> {new Date(resume.uploaded_at).toLocaleDateString()}</p>
                            {resume.filename && <p><strong>File:</strong> {resume.filename}</p>}
                        </CardContent>
                    </Card>

                    <InsightsCard>
                        <CardTitle>AI Insights 🧠</CardTitle>
                        <CardContent>
                            <div style={{ marginTop: '16px' }}>
                                <p><strong>Experience Level:</strong> {resume.insights.experience_level}</p>
                                <p style={{ marginTop: '8px', fontStyle: 'italic' }}>
                                    "{resume.insights.encouraging_note}"
                                </p>
                            </div>
                        </CardContent>
                    </InsightsCard>
                </>
            )}

            <Modal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                title="Upload Resume"
            >
                <ResumeUpload onUploadSuccess={handleUploadSuccess} />
            </Modal>
        </PageContainer>
    );
};
