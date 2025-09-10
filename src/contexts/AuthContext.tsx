import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { toastService } from '../utils/toastService';

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

        // Show success toast with API's message
        toastService.success("Login Successful", response.message);

        setIsLoading(false);
        return true;
      } else {
        // Handle auth service error responses (like invalid credentials)
        if (response.message) {
          toastService.error("Login Failed", response.message);
        }
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      // Handle unexpected errors from authService
      if (error instanceof Error && 'userMessage' in error) {
        const apiError = error as { userMessage: string };
        toastService.error("Login Failed", apiError.userMessage);
      } else {
        toastService.error("Login Failed", "An unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (fullName: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.signup({ fullName, email, password, confirmPassword: password });
      if (response.success && response.token) {
        const authTokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'authToken';
        localStorage.setItem(authTokenKey, response.token);
        const decoded: DecodedToken = jwtDecode(response.token);
        const mappedUser = {
          id: decoded.userId || decoded.sub || '',
          email: response.email || decoded.sub || '',
          fullName: response.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || fullName
        };
        localStorage.setItem('userData', JSON.stringify(mappedUser));
        setUser(mappedUser);

        // Show success toast with API's message
        toastService.success("Account Created", response.message);

        setIsLoading(false);
        return true;
      } else {
        // Handle auth service error responses
        if (response.message) {
          toastService.error("Signup Failed", response.message);
        }
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      // Handle unexpected errors from authService
      if (error instanceof Error && 'userMessage' in error) {
        const apiError = error as { userMessage: string };
        toastService.error("Signup Failed", apiError.userMessage);
      } else {
        toastService.error("Signup Failed", "An unexpected error occurred. Please try again.");
      }
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
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        toastService.success("Password Reset", result.message);
      }
      return result;
    } catch (error) {
      if (error instanceof Error && 'userMessage' in error) {
        const apiError = error as { userMessage: string };
        toastService.error("Forgot Password Failed", apiError.userMessage);
      }
      return { success: false, message: "Failed to send reset instructions. Please try again." };
    }
  };

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    try {
      const result = await authService.resetPassword(email, token, newPassword);
      if (result.success) {
        toastService.success("Password Reset", result.message);
      }
      return result;
    } catch (error) {
      if (error instanceof Error && 'userMessage' in error) {
        const apiError = error as { userMessage: string };
        toastService.error("Reset Password Failed", apiError.userMessage);
      }
      return { success: false, message: "Failed to reset password. Please try again." };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      if (result.success) {
        toastService.success("Password Changed", result.message);
      }
      return result;
    } catch (error) {
      if (error instanceof Error && 'userMessage' in error) {
        const apiError = error as { userMessage: string };
        toastService.error("Change Password Failed", apiError.userMessage);
      }
      return { success: false, message: "Failed to change password. Please try again." };
    }
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
