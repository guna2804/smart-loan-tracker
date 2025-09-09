import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  fullName: string;
  email: string;
}

interface DecodedToken {
  sub: string;
  email?: string;
  name?: string;
  userId?: string;
  [key: string]: string | undefined;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authTokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'authToken';
    let token = localStorage.getItem(authTokenKey);

    // Migration: If new key is empty but old 'authToken' exists, migrate it
    if (!token && authTokenKey !== 'authToken') {
      const oldToken = localStorage.getItem('authToken');
      if (oldToken) {
        localStorage.setItem(authTokenKey, oldToken);
        localStorage.removeItem('authToken'); // Clean up old key
        token = oldToken;
      }
    }

    const userData = localStorage.getItem('userData');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem(authTokenKey);
        localStorage.removeItem('userData');
      }
    } else if (token) {
      // Fallback: Decode token to construct user if userData is missing
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const fallbackUser: User = {
          id: decoded.userId || decoded.sub || '',
          email: decoded.sub || '',
          fullName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || 'User',
        };
        setUser(fallbackUser);
        localStorage.setItem('userData', JSON.stringify(fallbackUser));
      } catch {
        localStorage.removeItem(authTokenKey);
      }
    }
    setIsLoading(false);

    // Listen for unauthorized events from httpClient
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password, rememberMe });
      if (response.success && response.token) {
        const decoded: DecodedToken = jwtDecode(response.token);
        // Use response data if available, otherwise fallback to token
        const userData: User = {
          id: decoded.userId || decoded.sub || '',
          email: response.email || decoded.sub || email,
          fullName: response.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || 'User'
        };
        // Always use localStorage for persistent login
        const authTokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'authToken';
        localStorage.setItem(authTokenKey, response.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (fullName: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.signup({ fullName, email, password, confirmPassword: password });
      if (response.success && response.token && response.user) {
        const authTokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'authToken';
        localStorage.setItem(authTokenKey, response.token);
        const mappedUser = {
          id: response.user.id,
          email: response.user.email,
          fullName: response.user.name
        };
        localStorage.setItem('userData', JSON.stringify(mappedUser));
        setUser(mappedUser);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    const authTokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'authToken';
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem('userData');
    sessionStorage.removeItem(authTokenKey);
    sessionStorage.removeItem('userData');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    return await authService.resetPassword(email, token, newPassword);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    return await authService.changePassword(currentPassword, newPassword);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
