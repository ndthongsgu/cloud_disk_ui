import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function useLoginMutation() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      username,
      passwordHash,
    }: {
      username: string;
      passwordHash: string;
    }) => authService.login(username, passwordHash),
    onSuccess: (data) => {
      // Construct user profile
      const userProfile = {
        id: data.user_id,
        email: data.email, // fallback email if not returned by login
        full_name: data.full_name,
        isAdmin: data.is_admin ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Save credentials in state and localStorage
      login(userProfile, data.token, data.refresh_token);
      toast.success("Đăng nhập thành công.");
      // Redirect
      navigate({ to: "/my-files", replace: true });
    },
    onError: (error: any) => {
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    },
  });
}

export function useRegisterMutation() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      username,
      passwordHash,
      fullName,
      email,
    }: {
      username: string;
      passwordHash: string;
      fullName: string;
      email: string;
    }) => authService.register(username, passwordHash, fullName, email),
    onSuccess: (data, variables) => {
      const userProfile = {
        id: data.user_id,
        email: variables.email,
        full_name: variables.fullName,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      login(userProfile, data.token, data.refresh_token);
      toast.success("Đăng ký tài khoản thành công.");
      navigate({ to: "/my-files", replace: true });
    },
    onError: (error: any) => {
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    },
  });
}
