import styled from 'styled-components';
import { Button } from '../components/common/Button';
import { client } from '../api/client';
import { Card } from '../components/common/Card';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const Login = () => {
    const handleGoogleLogin = async () => {
        try {
            const response = await client.get('/auth/login/google');
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <LoginContainer>
            <LoginCard>
                <Title>Genie-Hi 🧞‍♂️</Title>
                <Subtitle>Your AI-powered job application assistant</Subtitle>
                <Button onClick={handleGoogleLogin} fullWidth size="large">
                    Sign in with Google
                </Button>
            </LoginCard>
        </LoginContainer>
    );
};
