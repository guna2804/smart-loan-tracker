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
  refreshToken?: string;
  email?: string;
  name?: string;
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
        token: response.data.token,
        email: response.data.email,
        name: response.data.name
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

  validateEmail(email: string): { isValid: boolean; message: string } {
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }

    if (email.length > 255) {
      return { isValid: false, message: 'Email must not exceed 255 characters' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Invalid email format' };
    }

    return { isValid: true, message: '' };
  },

  validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword(password: string): { isValid: boolean; message: string } {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/\d/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: '' };
  },

  validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  },

  validateName(name: string): { isValid: boolean; message: string } {
    if (!name.trim()) {
      return { isValid: false, message: 'Name is required' };
    }

    if (name.trim().length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters long' };
    }

    if (name.length > 100) {
      return { isValid: false, message: 'Name must not exceed 100 characters' };
    }

    return { isValid: true, message: '' };
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Use httpClient for auth endpoints - token will be added via interceptor
      await httpClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Change password error:', axiosError.response?.data || axiosError.message);

      if (axiosError.response?.status === 400) {
        return { success: false, message: "Invalid current password or new password does not meet requirements" };
      }

      if (axiosError.response?.status === 401) {
        return { success: false, message: "Unauthorized. Please log in again." };
      }

      return { success: false, message: "Failed to change password. Please try again." };
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await httpClient.post('/auth/forgot-password', { email });
      return { success: true, message: "Password reset instructions sent to your email" };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Forgot password error:', axiosError.response?.data || axiosError.message);

      if (axiosError.response?.status === 400) {
        return { success: false, message: "Invalid email address" };
      }

      return { success: false, message: "Failed to send reset instructions. Please try again." };
    }
  },

  async resetPassword(email: string, token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      await httpClient.post('/auth/reset-password', {
        email,
        token,
        newPassword
      });
      return { success: true, message: "Password reset successfully" };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Reset password error:', axiosError.response?.data || axiosError.message);

      if (axiosError.response?.status === 400) {
        return { success: false, message: "Invalid token or password does not meet requirements" };
      }

      return { success: false, message: "Failed to reset password. Please try again." };
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await httpClient.post('/auth/refresh', { refreshToken });

      // Store new token
      if (response.data.token) {
        setToken(response.data.token, true); // Assume remember me for refresh
      }

      return {
        success: true,
        message: "Token refreshed successfully",
        token: response.data.token,
        refreshToken: response.data.refreshToken
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Refresh token error:', axiosError.response?.data || axiosError.message);

      if (axiosError.response?.status === 401) {
        clearToken();
        return { success: false, message: "Refresh token expired. Please log in again." };
      }

      return { success: false, message: "Failed to refresh token. Please try again." };
    }
  }
};
