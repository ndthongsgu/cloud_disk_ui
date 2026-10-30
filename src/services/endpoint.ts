export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
  },
  TELEGRAM_BOTS: {
    BASE: "/telegram-bots",
    DEACTIVATE: (id: string) => `/telegram-bots/${id}/deactivate`,
    ACTIVATE: (id: string) => `/telegram-bots/${id}/activate`,
  },
  USERS: {
    SEARCH: "/users/search",
    STORAGE_INFO: "/users/storage/info",
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
  },
  FILES: {
    BASE: "/files",
    STARRED: "/files/starred",
    TRASH: "/files/trash",
    FOLDER: "/files/folder",
    UPLOAD: "/files/upload",
    TRASH_FILE: (id: string) => `/files/${id}/trash`,
    RESTORE_FILE: (id: string) => `/files/${id}/restore`,
    FILE_ITEM: (id: string) => `/files/${id}`,
    STAR_FILE: (id: string) => `/files/${id}/star`,
    RENAME_FILE: (id: string) => `/files/${id}/rename`,
  },
} as const;
