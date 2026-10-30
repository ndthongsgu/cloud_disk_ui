export type FileType = "folder" | "document" | "image" | "video" | "audio" | "pdf" | "archive" | "other";

export interface DiskFile {
  id: string;
  name: string;
  type: FileType;
  size: number; // in bytes
  path: string;
  parentId: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  isTrashed: boolean;
  isCanTrash?: boolean;
  isCanRestore?: boolean;
  isCanDelete?: boolean;
  url?: string; // download url if any
  botId?: string | null;
}

export interface StorageInfo {
  total: number; // in bytes
  used: number; // in bytes
}

export type ViewMode = "grid" | "list";

export interface UploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}
