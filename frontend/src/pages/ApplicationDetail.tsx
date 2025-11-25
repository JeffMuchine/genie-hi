import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { client } from '../api/client';
import { ResumeValidator } from '../features/application/ResumeValidator';
import { CoverLetterStudio } from '../features/application/CoverLetterStudio';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Sidebar = styled(Card)`
  height: fit-content;
`;

const MainView = styled(Card)`
  min-height: 500px;
`;

const TabButton = styled.button<{ active: boolean }>`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1.5)};
  text-align: left;
  background: ${({ active, theme }) => active ? theme.colors.primary + '15' : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text.primary};
  border: none;
  border-left: 3px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const ApplicationDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchApplication();
        }
    }, [id]);

    const fetchApplication = async () => {
        try {
            const response = await client.get(`/applications/${id}`);
            setApplication(response.data);
        } catch (error) {
            console.error('Error fetching application:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeSave = async (updatedSections: any) => {
        try {
            await client.patch(`/applications/${id}`, {
                tailored_resume_sections: updatedSections
            });
            fetchApplication();
        } catch (error) {
            console.error('Error saving resume:', error);
        }
    };

    const handleCoverLetterSave = async (content: string) => {
        try {
            await client.patch(`/applications/${id}`, {
                cover_letter_content: content
            });
            fetchApplication();
        } catch (error) {
            console.error('Error saving cover letter:', error);
        }
    };

    const handleCoverLetterRegenerate = async (params: any) => {
        try {
            await client.post(`/applications/${id}/regenerate_cover_letter`, params);
            fetchApplication();
        } catch (error) {
            console.error('Error regenerating cover letter:', error);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await client.get(`/applications/${id}/download`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `application_${id}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading package:', error);
            alert('Failed to download package.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!application) return <p>Application not found.</p>;

    return (
        <PageContainer>
            <ProgressBar steps={['Job & Resume', 'Generate', 'Review & Download']} currentStep={2} />

            <Header>
                <div>
                    <h1>Application Review</h1>
                    <p>Review and edit your tailored documents</p>
                </div>
                <Button size="large" onClick={handleDownload}>Download Package</Button>
            </Header>

            <ContentArea>
                <Sidebar>
                    <TabButton
                        active={activeTab === 'resume'}
                        onClick={() => setActiveTab('resume')}
                    >
                        Tailored Resume
                    </TabButton>
                    <TabButton
                        active={activeTab === 'cover-letter'}
                        onClick={() => setActiveTab('cover-letter')}
                    >
                        Cover Letter
                    </TabButton>
                </Sidebar>

                <MainView>
                    {activeTab === 'resume' ? (
                        <div>
                            <h2>Resume Validator</h2>
                            <p style={{ marginBottom: '16px' }}>Compare changes and accept/reject edits.</p>
                            <ResumeValidator
                                sections={application.tailored_resume_sections}
                                onSave={handleResumeSave}
                            />
                        </div>
                    ) : (
                        <div>
                            <h2>Cover Letter Studio</h2>
                            <p style={{ marginBottom: '16px' }}>Edit and refine your cover letter.</p>
                            <CoverLetterStudio
                                content={application.cover_letter_content}
                                onSave={handleCoverLetterSave}
                                onRegenerate={handleCoverLetterRegenerate}
                            />
                        </div>
                    )}
                </MainView>
            </ContentArea>
        </PageContainer>
    );
};
