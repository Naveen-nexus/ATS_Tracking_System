import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api'; // Import the new API instance

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Response structure depends on backend: { _id, name, email, role, token? }
      // Backend sets cookie, so token likely handled there?
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const response = await api.post('/auth/login', userData);
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Logout API failed', error);
    } finally {
        setUser(null);
        localStorage.removeItem('user');
        // Clear cookies? Only possible if httpOnly cookie is used and backend clears it.
    }
  };

  const updateUser = async (data) => {
      // If needed to update user profile
      // await api.put('/users/profile', data);
      setUser(prev => ({ ...prev, ...data }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
