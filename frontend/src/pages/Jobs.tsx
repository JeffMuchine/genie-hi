import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { InputWrapper, Label, TextArea } from '../components/common/Input';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
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

const AddJobForm = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const JobList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const JobCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const JobInfo = styled.div``;

const JobActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

interface Job {
    id: string;
    job_title: string;
    company_name: string;
    description_preview: string;
    source_url?: string;
}

export const Jobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [inputData, setInputData] = useState('');
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await client.get('/jobs/');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleAddJob = async () => {
        if (!inputData.trim()) return;

        setLoading(true);
        try {
            await client.post('/jobs/', { input_data: inputData });
            setInputData('');
            setShowAddForm(false);
            fetchJobs();
        } catch (error) {
            console.error('Error adding job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            await client.delete(`/jobs/${id}`);
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleGenerateApplication = async (jobId: string) => {
        setGenerating(true);
        try {
            // Assuming we use the latest resume for now. 
            // Ideally we'd let user select resume, but for MVP we pick latest.
            // We need to fetch resume ID first or let backend handle "latest".
            // The backend endpoint expects `resume_id`.

            // 1. Fetch latest resume
            const resumeRes = await client.get('/resume/');
            if (!resumeRes.data || !resumeRes.data.id) {
                alert('Please upload a resume first!');
                setGenerating(false);
                navigate('/resumes');
                return;
            }
            const resumeId = resumeRes.data.id;

            // 2. Generate Application
            const response = await client.post('/applications/generate', {
                job_id: jobId,
                resume_id: resumeId
            });

            // 3. Navigate to application detail
            navigate(`/applications/${response.data.id}`);

        } catch (error) {
            console.error('Error generating application:', error);
            alert('Failed to generate application. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <PageContainer>
            <LoadingOverlay isVisible={generating} />
            <Header>
                <h1>My Jobs</h1>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : '+ Add New Job'}
                </Button>
            </Header>

            {showAddForm && (
                <AddJobForm>
                    <CardTitle>Add a Job</CardTitle>
                    <p style={{ marginBottom: '16px', color: '#666' }}>
                        Paste a job URL or the full job description text below.
                    </p>
                    <InputWrapper>
                        <Label>Job URL or Description</Label>
                        <TextArea
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                            placeholder="https://linkedin.com/jobs/... or paste text here"
                            rows={6}
                        />
                    </InputWrapper>
                    <Button onClick={handleAddJob} disabled={loading || !inputData.trim()}>
                        {loading ? 'Analyzing...' : 'Add Job'}
                    </Button>
                </AddJobForm>
            )}

            <JobList>
                {jobs.length === 0 ? (
                    <p>No jobs added yet. Click "+ Add New Job" to get started.</p>
                ) : (
                    jobs.map((job) => (
                        <JobCard key={job.id}>
                            <JobInfo>
                                <CardTitle>{job.job_title}</CardTitle>
                                <p style={{ color: '#666' }}>{job.company_name}</p>
                                {job.source_url && (
                                    <a href={job.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'blue' }}>
                                        View Source
                                    </a>
                                )}
                            </JobInfo>
                            <JobActions>
                                <Button variant="outline" size="small" onClick={() => handleDeleteJob(job.id)}>
                                    Delete
                                </Button>
                                <Button size="small" onClick={() => handleGenerateApplication(job.id)}>
                                    Generate Application
                                </Button>
                            </JobActions>
                        </JobCard>
                    ))
                )}
            </JobList>
        </PageContainer>
    );
};
