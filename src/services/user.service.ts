import { api } from "./api";
import { type UserSummary } from "@/types";
import { API_ENDPOINTS } from "./endpoint";

export interface UserSearchFilter {
  page?: number;
  size?: number;
  username?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  department_name?: string;
  status?: string;
}

export interface UserSearchResponse {
  items: UserSummary[];
  total: number;
  page: number;
  size: number;
}

export const userService = {
  searchUsers: async (filter: UserSearchFilter): Promise<UserSearchResponse> => {
    const response = await api.post<UserSearchResponse>(API_ENDPOINTS.USERS.SEARCH, filter);
    return response.data;
  },

  deactivateUser: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.USERS.DEACTIVATE(id));
  },

  activateUser: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.USERS.ACTIVATE(id));
  },
};
