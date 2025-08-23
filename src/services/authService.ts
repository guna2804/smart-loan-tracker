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
    fullName: string;
    email: string;
  };
  token?: string;
}


const API_BASE = "https://localhost:7257/api/Auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
      if (!response.ok) {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }
      const data = await response.json();
      return {
        success: true,
        message: "Login successful",
        user: data.user,
        token: data.token
      };
    } catch {
      return {
        success: false,
        message: "Login failed. Please try again."
      };
    }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.fullName
        })
      });
      if (!response.ok) {
        return {
          success: false,
          message: "Registration failed. Please try again."
        };
      }
      const result = await response.json();
      return {
        success: true,
        message: "Account created successfully",
        user: result.user,
        token: result.token
      };
    } catch {
      return {
        success: false,
        message: "Registration failed. Please try again."
      };
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
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