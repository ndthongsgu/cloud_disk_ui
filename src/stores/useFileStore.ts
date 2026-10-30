import { create } from "zustand";
import { type DiskFile, type ViewMode, type UploadItem } from "@/types";

interface FileState {
  // Files State
  files: DiskFile[];
  viewMode: ViewMode;
  selectedFileIds: string[];
  currentFolderId: string | null;
  searchQuery: string;

  // Uploads State
  uploads: UploadItem[];

  // Actions
  setFiles: (files: DiskFile[]) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedFileIds: (ids: string[]) => void;
  selectFile: (id: string) => void;
  deselectFile: (id: string) => void;
  clearSelection: () => void;
  setCurrentFolderId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;

  // Upload Actions
  addUpload: (item: UploadItem) => void;
  updateUploadProgress: (id: string, progress: number) => void;
  updateUploadStatus: (
    id: string,
    status: UploadItem["status"],
    error?: string,
  ) => void;
  removeUpload: (id: string) => void;
  clearFinishedUploads: () => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  viewMode: "grid",
  selectedFileIds: [],
  currentFolderId: null,
  searchQuery: "",
  uploads: [],

  setFiles: (files) => set({ files }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedFileIds: (selectedFileIds) => set({ selectedFileIds }),
  selectFile: (id) =>
    set((state) => ({
      selectedFileIds: state.selectedFileIds.includes(id)
        ? state.selectedFileIds
        : [...state.selectedFileIds, id],
    })),
  deselectFile: (id) =>
    set((state) => ({
      selectedFileIds: state.selectedFileIds.filter((fileId) => fileId !== id),
    })),
  clearSelection: () => set({ selectedFileIds: [] }),
  setCurrentFolderId: (currentFolderId) =>
    set({ currentFolderId, selectedFileIds: [] }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  addUpload: (item) =>
    set((state) => ({
      uploads: [...state.uploads, item],
    })),
  updateUploadProgress: (id, progress) =>
    set((state) => ({
      uploads: state.uploads.map((item) =>
        item.id === id ? { ...item, progress } : item,
      ),
    })),
  updateUploadStatus: (id, status, error) =>
    set((state) => ({
      uploads: state.uploads.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              progress: status === "success" ? 100 : item.progress,
              error,
            }
          : item,
      ),
    })),
  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((item) => item.id !== id),
    })),
  clearFinishedUploads: () =>
    set((state) => ({
      uploads: state.uploads.filter(
        (item) => item.status !== "success" && item.status !== "error",
      ),
    })),
}));
