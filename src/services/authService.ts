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

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      if (!response.ok) {
        return { success: false, message: "Invalid email or password" };
      }

      const data = await response.json();
      return {
        success: true,
        message: "Login successful",
        user: data.user,
        token: data.token
      };
    } catch {
      return { success: false, message: "Login failed. Please try again." };
    }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.fullName   // ✅ matches your backend RegisterDto
        })
      });

      if (!response.ok) {
        return { success: false, message: "Registration failed. Please try again." };
      }

      const result = await response.json();
      return {
        success: true,
        message: "Account created successfully",
        user: result.user,
        token: result.token
      };
    } catch {
      return { success: false, message: "Registration failed. Please try again." };
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    sessionStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
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
