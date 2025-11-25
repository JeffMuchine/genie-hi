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
                <Route path="jobs" element={<div><h1>Jobs</h1></div>} />
                <Route path="applications" element={<div><h1>Applications</h1></div>} />
                <Route path="resumes" element={<div><h1>Resumes</h1></div>} />
                <Route path="account" element={<div><h1>Account</h1></div>} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
