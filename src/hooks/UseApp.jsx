import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('zfe_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('zfe_theme') || 'dark');
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zfe_theme', theme);
  }, [theme]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('zfe_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zfe_user');
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <AppContext.Provider value={{ user, login, logout, theme, toggleTheme, notifications, setNotifications, toasts, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);