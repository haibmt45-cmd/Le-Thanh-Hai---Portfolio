import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    const lastActive = parseInt(sessionStorage.getItem('admin_last_active') || '0', 10);
    
    if (isAuth && lastActive > 0 && Date.now() - lastActive > SESSION_TIMEOUT) {
      sessionStorage.removeItem('admin_authenticated');
      sessionStorage.removeItem('admin_last_active');
      return false;
    }
    return isAuth;
  });

  useEffect(() => {
    if (isAuthenticated && !location.pathname.startsWith('/admin')) {
      logout();
    }
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const updateActivity = () => {
      if (isAuthenticated) {
        sessionStorage.setItem('admin_last_active', Date.now().toString());
      }
    };

    const checkTimeout = () => {
      if (isAuthenticated) {
        const lastActive = parseInt(sessionStorage.getItem('admin_last_active') || '0', 10);
        if (lastActive > 0 && Date.now() - lastActive > SESSION_TIMEOUT) {
          logout();
        }
      }
    };

    if (isAuthenticated) {
      updateActivity();
      
      // Update activity on user interaction
      window.addEventListener('mousemove', updateActivity);
      window.addEventListener('keydown', updateActivity);
      window.addEventListener('scroll', updateActivity);
      window.addEventListener('click', updateActivity);

      // Check timeout periodically
      interval = setInterval(checkTimeout, 10000);
    }

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('click', updateActivity);
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated]);

  const login = (user: string, pass: string) => {
    if (user.trim().toLowerCase() === 'admin' && pass === '211002') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_last_active', Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_last_active');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
