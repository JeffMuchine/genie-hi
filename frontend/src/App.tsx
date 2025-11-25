import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { LoginCallback } from './pages/LoginCallback';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Jobs } from './pages/Jobs';
import { Resumes } from './pages/Resumes';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { Applications } from './pages/Applications';
import { Account } from './pages/Account';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/api/v1/auth/callback" element={<LoginCallback />} /> {/* Match backend redirect URI if needed, or just /auth/callback */}

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="applications" element={<Applications />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
                <Route path="resumes" element={<Resumes />} />
                <Route path="account" element={<Account />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
