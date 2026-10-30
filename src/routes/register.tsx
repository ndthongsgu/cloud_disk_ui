import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegisterMutation } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, User, Loader2 } from "lucide-react";
const logoUrl = "/logo.svg";

export const Route = createFileRoute("/register")({
  component: RegisterComponent,
});

const registerSchema = z
  .object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu của bạn"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterComponent() {
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      username: data.username,
      passwordHash: data.password,
      fullName: data.fullName,
      email: data.email,
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
          Tạo tài khoản mới
        </CardTitle>
        <CardDescription className="text-[12px] mt-1">
          <p>Nhận ngay 15 GB dung lượng lưu trữ đám mây</p>
          <p>miễn phí và an toàn</p>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {registerMutation.isError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[12px] rounded-lg p-3 mb-5 font-semibold">
            {registerMutation.error.message || "Đăng ký thất bại. Vui lòng thử lại."}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-[12px] font-medium text-muted-foreground">
              Tên đăng nhập
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <Input
                id="username"
                type="text"
                placeholder="Ví dụ: alexrivera"
                disabled={registerMutation.isPending}
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

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-[12px] font-medium text-muted-foreground">
              Họ và tên
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <Input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                disabled={registerMutation.isPending}
                className="h-10 pl-9"
                aria-invalid={!!errors.fullName}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[12px] font-medium text-muted-foreground">
              Địa chỉ Email
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="alex@aura.io"
                disabled={registerMutation.isPending}
                className="h-10 pl-9"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[12px] font-medium text-muted-foreground">
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
                disabled={registerMutation.isPending}
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-[12px] font-medium text-muted-foreground">
              Xác nhận mật khẩu
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                disabled={registerMutation.isPending}
                className="h-10 pl-9"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-10 text-[13px]"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo tài khoản...
                </span>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </div>
        </form>

        {/* Switch to Sign in */}
        <div className="text-center mt-6 text-[12px] text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-semibold"
          >
            Đăng nhập
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


