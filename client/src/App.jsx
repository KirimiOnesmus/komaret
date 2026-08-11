import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './shared/context/AuthContext';
import { AppProvider } from './shared/context/AppContext';
import AppRoutes from './AppRoutes';
import Loading from './shared/components/common/Loading';
import './index.css';

function SessionBootstrap({ children }) {
  const { bootstrapSession } = useAuthContext();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapSession().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <Loading label="Loading..." />;
  }
  return children;
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <SessionBootstrap>
            <AppRoutes />
          </SessionBootstrap>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
