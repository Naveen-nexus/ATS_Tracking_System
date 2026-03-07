import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ats_user')) || null; } catch { return null; }
  });

  const login = useCallback((userData, remember = false) => {
    setUser(userData);
    if (remember) localStorage.setItem('ats_user', JSON.stringify(userData));
    else sessionStorage.setItem('ats_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ats_user');
    sessionStorage.removeItem('ats_user');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      const stored = localStorage.getItem('ats_user');
      if (stored) localStorage.setItem('ats_user', JSON.stringify(updated));
      else sessionStorage.setItem('ats_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
