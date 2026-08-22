import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'globetrotter_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setUser(null);
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    });
    return response;
  };

  const signup = async (data) => authService.signup(data);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser(token);
        setUser(currentUser);
      } catch (_error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      login,
      signup,
      logout,
      setUser,
    }),
    [token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}
