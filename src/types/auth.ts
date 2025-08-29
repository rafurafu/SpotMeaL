export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  provider: 'email' | 'google';
  favorites: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}