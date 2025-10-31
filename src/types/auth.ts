export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  phone?: string;
  birthday?: string;
  bio?: string;
  provider: 'email' | 'google';
  favorites: string[];
  // 統計情報
  totalVisits?: number;        // 総来店回数
  totalRewards?: number;       // 総獲得報酬（円）
  thisMonthVisits?: number;    // 今月の来店回数
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
  isNewUser: boolean; // 新規登録直後かどうか
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}