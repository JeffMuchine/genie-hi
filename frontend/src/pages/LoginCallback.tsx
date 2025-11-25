import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { client } from '../api/client';
import { useAuth } from '../features/auth/AuthContext';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const LoginCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            client.get(`/auth/callback/google?code=${code}`)
                .then((response) => {
                    const { access_token, user } = response.data;
                    login(access_token, user);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Callback failed', error);
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, login, navigate]);

    return (
        <Container>
            <p>Authenticating...</p>
        </Container>
    );
};
