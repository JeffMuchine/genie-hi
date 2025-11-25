import { Card, CardTitle, CardContent } from '../components/common/Card';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

export const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening with your job search.</p>

            <Grid>
                <Card>
                    <CardTitle>Active Applications</CardTitle>
                    <CardContent>
                        <h2>12</h2>
                        <p>3 interviews scheduled</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardTitle>Resumes Tailored</CardTitle>
                    <CardContent>
                        <h2>45</h2>
                        <p>Last one 2 hours ago</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardContent>
                        <p>+ Add New Job</p>
                        <p>+ Upload Resume</p>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    );
};
