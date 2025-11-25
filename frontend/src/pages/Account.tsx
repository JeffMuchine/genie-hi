import styled from 'styled-components';
import { Button } from '../components/common/Button';
import { Card, CardTitle, CardContent } from '../components/common/Card';
import { useAuth } from '../features/auth/AuthContext';

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

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const ProfileCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const PlanCard = styled(Card)`
  border: 2px solid ${({ theme }) => theme.colors.primary};
`;

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const Account = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <PageContainer>
            <Header>
                <h1>Account Settings</h1>
                <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
            </Header>

            <Section>
                <h2>Profile</h2>
                <ProfileCard>
                    {user?.picture ? (
                        <Avatar src={user.picture} alt={user.name} />
                    ) : (
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    )}
                    <div>
                        <CardTitle>{user?.name}</CardTitle>
                        <p style={{ color: '#666' }}>{user?.email}</p>
                    </div>
                </ProfileCard>
            </Section>

            <Section>
                <h2>Subscription Plan</h2>
                <PlanCard>
                    <PlanHeader>
                        <CardTitle>Free Plan</CardTitle>
                        <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                    </PlanHeader>
                    <CardContent>
                        <p>You are currently on the Free tier.</p>
                        <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
                            <li>5 AI generations per day</li>
                            <li>Basic resume templates</li>
                            <li>Standard support</li>
                        </ul>
                        <div style={{ marginTop: '24px' }}>
                            <Button>Upgrade to Pro ($19/mo)</Button>
                        </div>
                    </CardContent>
                </PlanCard>
            </Section>

            <Section>
                <h2>Usage</h2>
                <Card>
                    <CardTitle>Generations Used</CardTitle>
                    <CardContent>
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Daily Limit</span>
                                <span>2 / 5</span>
                            </div>
                            <div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '40%', height: '100%', background: '#6F38C5' }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Section>
        </PageContainer>
    );
};
