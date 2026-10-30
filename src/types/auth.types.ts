export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  isAdmin: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  username: string;
  full_name: string;
  email: string;
  status: string;
  statusLabel?: string;
  isCanDeActive?: boolean;
  isCanActive?: boolean;
  roles: string[];
}

export interface AuthSession {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}
