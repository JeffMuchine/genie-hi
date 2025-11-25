import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(3)};
  position: fixed;
  left: 0;
  top: 0;
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.h4};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary}15; // 15% opacity
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Sidebar = () => {
    return (
        <SidebarContainer>
            <Logo>Genie-Hi 🧞‍♂️</Logo>
            <NavList>
                <StyledNavLink to="/" end>
                    Dashboard
                </StyledNavLink>
                <StyledNavLink to="/jobs">
                    Jobs
                </StyledNavLink>
                <StyledNavLink to="/applications">
                    Applications
                </StyledNavLink>
                <StyledNavLink to="/resumes">
                    Resumes
                </StyledNavLink>
                <StyledNavLink to="/account">
                    Account
                </StyledNavLink>
            </NavList>
        </SidebarContainer>
    );
};
