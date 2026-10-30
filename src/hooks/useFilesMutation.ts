import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileService } from "@/services/file.service";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/services/endpoint";

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      parentId,
      botId,
    }: {
      name: string;
      parentId: string | null;
      botId: string | null;
    }) => fileService.createFolder(name, parentId, botId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.FILES.BASE],
      });
      toast.success("Tạo thư mục thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi tạo thư mục.");
    },
  });
}

export function useTrashFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fileService.trashFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.BASE] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.STARRED] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.TRASH] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS.STORAGE_INFO] });
      toast.success("Đã di chuyển tệp vào Thùng rác.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi di chuyển tệp vào thùng rác.");
    },
  });
}

export function useRestoreFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fileService.restoreFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.BASE] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.STARRED] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.TRASH] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS.STORAGE_INFO] });
      toast.success("Khôi phục tệp tin thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi khôi phục tệp tin.");
    },
  });
}

export function useDeletePermanently() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fileService.deleteFilePermanently(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.TRASH] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS.STORAGE_INFO] });
      toast.success("Đã xóa tệp tin vĩnh viễn.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi xóa tệp tin vĩnh viễn.");
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      parentId,
      botId,
      onProgress,
    }: {
      file: File;
      parentId: string | null;
      botId: string | null;
      onProgress: (progress: number) => void;
    }) => fileService.uploadFile(file, parentId, botId, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.FILES.BASE],
      });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS.STORAGE_INFO] });
      toast.success("Tải tệp tin lên thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi tải tệp tin lên.");
    },
  });
}

export function useToggleStarFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fileService.toggleStarFile(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.BASE] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.STARRED] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi cập nhật trạng thái gắn sao.");
    },
  });
}

export function useRenameFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      fileService.renameFile(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.BASE] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FILES.STARRED] });
      toast.success("Đổi tên thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi đổi tên.");
    },
  });
}
