import { type DiskFile, type StorageInfo } from "@/types";
import { api } from "./api";
import { API_ENDPOINTS } from "./endpoint";

export const fileService = {
  // Get all files (supports parentId filter, isTrashed filter)
  getFiles: async (
    parentId: string | null = null,
    isTrashed = false,
    botId?: string | null,
  ): Promise<DiskFile[]> => {
    const response = await api.get<DiskFile[]>(API_ENDPOINTS.FILES.BASE, {
      params: { parentId, isTrashed, botId },
    });
    return response.data;
  },

  // Get starred/favorite files
  getStarredFiles: async (): Promise<DiskFile[]> => {
    const response = await api.get<DiskFile[]>(API_ENDPOINTS.FILES.STARRED);
    return response.data;
  },

  // Get all trashed files
  getTrashedFiles: async (): Promise<DiskFile[]> => {
    const response = await api.get<DiskFile[]>(API_ENDPOINTS.FILES.TRASH);
    return response.data;
  },

  // Create new folder
  createFolder: async (
    name: string,
    parentId: string | null,
    botId?: string | null,
  ): Promise<DiskFile> => {
    const response = await api.post<DiskFile>(API_ENDPOINTS.FILES.FOLDER, {
      name,
      parentId,
      botId,
    });
    return response.data;
  },

  // Upload file with progress tracking
  uploadFile: async (
    file: File,
    parentId: string | null,
    botId: string | null,
    onProgress: (progress: number) => void,
  ): Promise<DiskFile> => {
    const formData = new FormData();
    formData.append("file", file);
    if (parentId) formData.append("parentId", parentId);
    if (botId) formData.append("botId", botId);

    const response = await api.post<DiskFile>(API_ENDPOINTS.FILES.UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || file.size),
        );
        onProgress(percentCompleted);
      },
    });
    return response.data;
  },

  // Get storage statistics
  getStorageInfo: async (): Promise<StorageInfo> => {
    const response = await api.get<StorageInfo>(API_ENDPOINTS.USERS.STORAGE_INFO);
    return response.data;
  },

  // Soft delete file (move to trash)
  trashFile: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.FILES.TRASH_FILE(id));
  },

  // Restore file from trash
  restoreFile: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.FILES.RESTORE_FILE(id));
  },

  // Hard delete file permanently
  deleteFilePermanently: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.FILES.FILE_ITEM(id));
  },

  // Toggle star/favorite status
  toggleStarFile: async (id: string): Promise<{ isStarred: boolean; message: string }> => {
    const response = await api.post<{ isStarred: boolean; message: string }>(
      API_ENDPOINTS.FILES.STAR_FILE(id)
    );
    return response.data;
  },

  // Rename a file or folder
  renameFile: async (id: string, name: string): Promise<void> => {
    await api.post(API_ENDPOINTS.FILES.RENAME_FILE(id), { name });
  },
};

