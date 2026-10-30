import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, User, Loader2 } from "lucide-react";
const logoUrl = "/logo.svg";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginComponent() {
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      username: data.username,
      passwordHash: data.password,
    });
  };

  return (
    <Card className="w-full max-w-[400px] border border-border/85 shadow-lg text-left p-6">
      {/* Brand Logo Header */}
      <CardHeader className="flex flex-col items-center text-center pb-2">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shadow-md mb-3 p-2.5">
          <img src={logoUrl} alt="Cloud Disk Logo" className="w-full h-full logo-img" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">
          Đăng nhập vào Cloud Disk
        </CardTitle>
        <CardDescription className="text-[12px] mt-1">
          <p>Nhập tài khoản của bạn</p>
          <p>để truy cập ổ đĩa lưu trữ an toàn</p>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {loginMutation.isError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[12px] rounded-lg p-3 mb-5 font-semibold">
            {loginMutation.error.message ||
              "Đăng nhập thất bại. Vui lòng thử lại."}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <Label
              htmlFor="username"
              className="text-[12px] font-medium text-muted-foreground"
            >
              Tên đăng nhập
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập của bạn"
                disabled={loginMutation.isPending}
                className="h-10 pl-9"
                aria-invalid={!!errors.username}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-[12px] font-medium text-muted-foreground"
            >
              Mật khẩu
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={loginMutation.isPending}
                className="h-10 pl-9"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-10 text-[13px]"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </div>
        </form>

        {/* Switch to Sign up */}
        <div className="text-center mt-6 text-[12px] text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-semibold"
          >
            Đăng ký
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
