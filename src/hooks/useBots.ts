import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { botService } from "@/services/bot.service";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/services/endpoint";

export function useBots() {
  return useQuery({
    queryKey: [API_ENDPOINTS.TELEGRAM_BOTS.BASE],
    queryFn: () => botService.getBots(),
  });
}

export function useCreateBot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, username, token, chatId }: { name: string; username: string; token: string; chatId: string }) =>
      botService.createBot(name, username, token, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.TELEGRAM_BOTS.BASE] });
      toast.success("Thêm Bot lưu trữ Telegram thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi thêm Bot lưu trữ Telegram.");
    },
  });
}

export function useDeactivateBot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => botService.deactivateBot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.TELEGRAM_BOTS.BASE] });
      toast.success("Đã dừng hoạt động của Bot lưu trữ.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi dừng hoạt động Bot lưu trữ.");
    },
  });
}

export function useActivateBot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => botService.activateBot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.TELEGRAM_BOTS.BASE] });
      toast.success("Kích hoạt hoạt động lại Bot lưu trữ thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi kích hoạt lại Bot lưu trữ.");
    },
  });
}

export function useUpdateBot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, username, token, chatId }: { id: string; username: string; token?: string; chatId?: string }) =>
      botService.updateBot(id, username, token, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.TELEGRAM_BOTS.BASE] });
      toast.success("Cập nhật cấu hình Bot Telegram thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi cập nhật cấu hình Bot Telegram.");
    },
  });
}
