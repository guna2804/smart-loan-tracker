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

const MOCK_DELAY = 800;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(MOCK_DELAY);
    
    try {
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const user = mockUsers.find((u: { email: string; password: string; id: string; fullName: string }) => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        const token = `mock-token-${Date.now()}`;
        const userData = {
          id: user.id,
          fullName: user.fullName,
          email: user.email
        };
        
        return {
          success: true,
          message: 'Login successful',
          user: userData,
          token
        };
      }
      
      return {
        success: false,
        message: 'Invalid email or password'
      };
    } catch {
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    await delay(MOCK_DELAY);
    
    try {
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      if (mockUsers.find((u: { email: string }) => u.email === data.email)) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        password: data.password
      };
      
      mockUsers.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      
      const token = `mock-token-${Date.now()}`;
      const userData = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email
      };
      
      return {
        success: true,
        message: 'Account created successfully',
        user: userData,
        token
      };
    } catch {
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  },

  async logout(): Promise<void> {
    await delay(300);
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