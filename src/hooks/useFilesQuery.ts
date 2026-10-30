import { useQuery } from "@tanstack/react-query";
import { fileService } from "@/services/file.service";
import { API_ENDPOINTS } from "@/services/endpoint";

export function useFiles(
  parentId: string | null = null,
  isTrashed = false,
  botId?: string | null,
) {
  return useQuery({
    queryKey: [API_ENDPOINTS.FILES.BASE, { parentId, isTrashed, botId }],
    queryFn: () => fileService.getFiles(parentId, isTrashed, botId),
  });
}

export function useStarredFiles() {
  return useQuery({
    queryKey: [API_ENDPOINTS.FILES.STARRED],
    queryFn: () => fileService.getStarredFiles(),
  });
}

export function useTrashedFiles() {
  return useQuery({
    queryKey: [API_ENDPOINTS.FILES.TRASH],
    queryFn: () => fileService.getTrashedFiles(),
  });
}

export function useStorageInfo() {
  return useQuery({
    queryKey: [API_ENDPOINTS.USERS.STORAGE_INFO],
    queryFn: () => fileService.getStorageInfo(),
  });
}
