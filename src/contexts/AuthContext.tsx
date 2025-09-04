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
  email: string;
  name?: string;
  [key: string]: string | undefined;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    console.log('AuthProvider useEffect: token=', token, 'userData=', userData);
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('User set from localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing userData:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    } else if (token) {
      // Fallback: Decode token to construct user if userData is missing
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const fallbackUser: User = {
          id: decoded.sub || '',
          email: decoded.email || '',
          fullName: decoded.name || 'User', 
        };
        setUser(fallbackUser);
        localStorage.setItem('userData', JSON.stringify(fallbackUser));
        console.log('User set from token:', fallbackUser);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password, rememberMe });
      console.log('Login response:', response);
      if (response.success && response.token) {
        let userData: User;
        if (response.user) {
          userData = {
            id: response.user.id,
            email: response.user.email,
            fullName: response.user.name
          };
        } else {
          // Fallback: Decode token to construct user
          const decoded: DecodedToken = jwtDecode(response.token);
          userData = {
            id: decoded.sub || '',
            email: decoded.email || email, // Use provided email as fallback
            fullName: decoded.name || 'User', // Use a default name
          };
        }
        // Always use localStorage for persistent login
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        console.log('User set after login:', userData);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (fullName: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.signup({ fullName, email, password, confirmPassword: password });
      console.log('Signup response:', response);
      if (response.success && response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        const mappedUser = {
          id: response.user.id,
          email: response.user.email,
          fullName: response.user.name
        };
        localStorage.setItem('userData', JSON.stringify(mappedUser));
        setUser(mappedUser);
        console.log('User set after signup:', mappedUser);
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setUser(null);
    console.log('User logged out, user set to null');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
