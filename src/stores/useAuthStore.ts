import { create } from "zustand";
import { type AuthSession, type UserProfile } from "@/types";

// Cookie helper utilities for storing sensitive data securely
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  return null;
};

const setCookie = (name: string, value: string, days?: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax; Secure`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure`;
};

interface AuthState extends AuthSession {
  refreshToken: string | null;
  login: (user: UserProfile, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
  setTokens: (token: string, refreshToken: string) => void;
}

const getStoredAuth = () => {
  try {
    const userStr = localStorage.getItem("auth_user");
    const token = getCookie("auth_token");
    const refreshToken = getCookie("auth_refresh_token");

    if (userStr && token && refreshToken) {
      const storedUser = JSON.parse(userStr) as Partial<UserProfile>;
      return {
        user: {
          ...storedUser,
          isAdmin: storedUser.isAdmin ?? false,
        } as UserProfile,
        token,
        refreshToken,
        isAuthenticated: true,
      };
    }
  } catch (e) {
    console.error("Failed to parse stored auth", e);
  }
  return {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  };
};

const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthState>((set) => ({
  ...initialAuth,
  refreshToken: initialAuth.refreshToken,

  login: (user, token, refreshToken) => {
    localStorage.setItem("auth_user", JSON.stringify(user));
    setCookie("auth_token", token, 1); // access token valid for 24h
    setCookie("auth_refresh_token", refreshToken, 7); // refresh token valid for 7 days
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("auth_user");
    removeCookie("auth_token");
    removeCookie("auth_refresh_token");
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  updateUser: (updatedFields) =>
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updatedFields } : null;
      if (newUser) {
        localStorage.setItem("auth_user", JSON.stringify(newUser));
      }
      return { user: newUser };
    }),

  setTokens: (token, refreshToken) => {
    setCookie("auth_token", token, 1);
    setCookie("auth_refresh_token", refreshToken, 7);
    set({ token, refreshToken });
  },
}));

