import { api } from "./api";
import { API_ENDPOINTS } from "./endpoint";

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  is_admin?: boolean;
}

export const authService = {
  login: async (username: string, passwordHash: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password: passwordHash,
    });
    return response.data;
  },

  register: async (
    username: string,
    passwordHash: string,
    fullName: string,
    email: string
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      username,
      password: passwordHash,
      full_name: fullName,
      email,
    });
    return response.data;
  },
};

