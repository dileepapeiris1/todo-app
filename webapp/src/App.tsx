import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { LoggerProvider }   from '@/providers/LoggerProvider';
import { QueryProvider }    from '@/providers/QueryProvider';
import { SnackbarProvider } from '@/providers/SnackbarProvider';
import { ThemeProvider }    from '@/providers/ThemeProvider';
import LandingPage from '@/pages/LandingPage';
import SignInPage  from '@/pages/SignInPage';
import TodoPage    from '@/pages/TodoPage';

const Root = () => {
  const { token } = useAuth();
  return token ? <TodoPage /> : <LandingPage />;
};

const App = () => (
  <ThemeProvider>
  <LoggerProvider>
    <QueryProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.APP}    element={<Root />} />
            <Route path={ROUTES.HOME}   element={<LandingPage />} />
            <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
            <Route path="*"             element={<Navigate to={ROUTES.APP} replace />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </QueryProvider>
  </LoggerProvider>
  </ThemeProvider>
);

export default App;
