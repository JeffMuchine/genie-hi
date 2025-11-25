import styled from 'styled-components';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px; // Sidebar width
  padding: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Layout = () => {
    return (
        <LayoutContainer>
            <Sidebar />
            <MainContent>
                <Outlet />
            </MainContent>
        </LayoutContainer>
    );
};
