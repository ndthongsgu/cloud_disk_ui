import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../stores/useAuthStore";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  const { user, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ full_name: fullName, email });
    toast.success("Lưu cấu hình tài khoản thành công!");
  };

  return (
    <div className="flex-1 p-8 flex flex-col h-full bg-background text-left ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
          Cài đặt
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Quản lý thông tin tài khoản, cấu hình đĩa và các tùy chọn cá nhân
        </p>
      </div>

      <div className=" bg-card border border-border/80 rounded-xl p-6 shadow-sm w-full">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Thông tin cá nhân
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-10 px-3.5 bg-muted/40 text-[13px] rounded-lg border border-border focus:border-primary/45 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3.5 bg-muted/40 text-[13px] rounded-lg border border-border focus:border-primary/45 outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" size="sm">
              Lưu thay đổi
            </Button>
          </div>
        </form>

        <div className="w-full h-px bg-border my-6" />

        <h3 className="text-base font-semibold text-foreground mb-3">
          Gói đăng ký
        </h3>
        <div className="bg-muted/40 border border-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-foreground">
              Gói miễn phí (15 GB)
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Nâng cấp để có thêm dung lượng lưu trữ và tốc độ cao hơn
            </p>
          </div>
          <Button variant="outline" size="sm">
            Nâng cấp gói
          </Button>
        </div>
      </div>
    </div>
  );
}
