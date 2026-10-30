import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type UserSearchFilter, type UserSearchResponse } from "@/services/user.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { toast } from "sonner";

export function useUsers(filter: UserSearchFilter = { page: 1, size: 20 }) {
  return useQuery<UserSearchResponse, Error, UserSearchResponse>({
    queryKey: [API_ENDPOINTS.USERS.SEARCH, filter],
    queryFn: () => userService.searchUsers(filter),
    staleTime: 60_000,
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS.SEARCH] });
      toast.success("Đã khóa tài khoản người dùng thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi khóa tài khoản người dùng.");
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS.SEARCH] });
      toast.success("Kích hoạt hoạt động tài khoản thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi kích hoạt tài khoản.");
    },
  });
}
