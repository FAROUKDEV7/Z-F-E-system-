import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './hooks/useApp';
import AppRoutes from './routes/AppRoutes';
import LoadingScreen from './components/LoadingScreen';
import ToastContainer from './components/ToastContainer';
import './styles/global.css';

function AppInner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      {!loading && <AppRoutes />}
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </BrowserRouter>
  );
}