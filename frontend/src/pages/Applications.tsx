import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
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

const ApplicationList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const ApplicationCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AppInfo = styled.div``;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ status, theme }) => {
        switch (status) {
            case 'DRAFT': return theme.colors.warning + '20';
            case 'SUBMITTED': return theme.colors.success + '20';
            case 'GENERATING': return theme.colors.primary + '20';
            default: return theme.colors.border;
        }
    }};
  color: ${({ status, theme }) => {
        switch (status) {
            case 'DRAFT': return theme.colors.warning;
            case 'SUBMITTED': return theme.colors.success;
            case 'GENERATING': return theme.colors.primary;
            default: return theme.colors.text.secondary;
        }
    }};
`;

export const Applications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appsRes, jobsRes] = await Promise.all([
                client.get('/applications/'),
                client.get('/jobs/')
            ]);
            setApplications(appsRes.data);
            setJobs(jobsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getJobDetails = (jobId: string) => {
        return jobs.find(j => j.id === jobId) || { job_title: 'Unknown Job', company_name: 'Unknown Company' };
    };

    if (loading) return <p>Loading...</p>;

    return (
        <PageContainer>
            <Header>
                <h1>My Applications</h1>
            </Header>

            <ApplicationList>
                {applications.length === 0 ? (
                    <p>No applications yet. Go to Jobs to generate one!</p>
                ) : (
                    applications.map((app) => {
                        const job = getJobDetails(app.job_id);
                        return (
                            <ApplicationCard key={app.id}>
                                <AppInfo>
                                    <CardTitle>{job.job_title}</CardTitle>
                                    <p style={{ color: '#666', marginBottom: '8px' }}>{job.company_name}</p>
                                    <StatusBadge status={app.status}>{app.status}</StatusBadge>
                                </AppInfo>
                                <Button onClick={() => navigate(`/applications/${app.id}`)}>
                                    Review & Edit
                                </Button>
                            </ApplicationCard>
                        );
                    })
                )}
            </ApplicationList>
        </PageContainer>
    );
};
