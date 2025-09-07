// Auth Service for MoneyBoard API
// All API calls migrated to use Axios for consistency with other services
// Uses httpClient instance with interceptors for auth token management

import type { AxiosError } from 'axios';
import httpClient, { setToken, clearToken } from './httpClient';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;   // backend expects "Name"
    email: string;
  };
  token?: string;
}


export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Use httpClient for auth endpoints (interceptors skip token addition for /auth/)
      const response = await httpClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      // Store token using httpClient utility
      if (response.data.token) {
        setToken(response.data.token, credentials.rememberMe);
      }

      return {
        success: true,
        message: "Login successful",
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Login error:', axiosError.response?.data || axiosError.message);

      if (axiosError.response?.status === 401) {
        return { success: false, message: "Invalid email or password" };
      }

      return { success: false, message: "Login failed. Please try again." };
    }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // Use httpClient for auth endpoints (interceptors skip token addition for /auth/)
      const response = await httpClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.fullName   // ✅ matches your backend RegisterDto
      });

      // Store token using httpClient utility
      if (response.data.token) {
        setToken(response.data.token, false); // Default to sessionStorage for signup
      }

      return {
        success: true,
        message: "Account created successfully",
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Signup error:', axiosError.response?.data || axiosError.message);

      if (axiosError.response?.status === 400) {
        return { success: false, message: "Registration failed. Please check your details and try again." };
      }

      return { success: false, message: "Registration failed. Please try again." };
    }
  },

  async logout(): Promise<void> {
    // Use httpClient utility to clear token
    clearToken();
  },

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    return { isValid: true, message: '' };
  },

  validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
};
