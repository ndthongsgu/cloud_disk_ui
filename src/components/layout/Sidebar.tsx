import { Link } from "@tanstack/react-router";
import { Folder, HardDrive, Star, Trash2, Settings, Bot, Users } from "lucide-react";
import { useStorageInfo } from "@/hooks/useFilesQuery";
import { useAuthStore } from "@/stores/useAuthStore";
const logoUrl = "/logo.svg";

export function Sidebar() {
  const { user } = useAuthStore();
  // Use TanStack Query to fetch and reactive cache storage info
  const { data: storage = { total: 1, used: 0 } } = useStorageInfo();

  const usedGB = (storage.used / (1024 * 1024 * 1024)).toFixed(1) || 0;
  const totalGB = (storage.total / (1024 * 1024 * 1024)).toFixed(0) || 0;
  const percentUsed = Math.min(
    100,
    Math.round((storage.used / storage.total) * 100),
  ) || 0;

  const menuItems = [
    { label: "Tệp tin của tôi", icon: Folder, to: "/my-files" },
    { label: "Bot lưu trữ", icon: Bot, to: "/bots" },
    { label: "Đã đánh dấu sao", icon: Star, to: "/starred" },
    { label: "Thùng rác", icon: Trash2, to: "/trash" },
    { label: "Cài đặt", icon: Settings, to: "/settings" },
  ];

  const adminMenuItem = user?.isAdmin
    ? { label: "Quản lý người dùng", icon: Users, to: "/admin/users" }
    : undefined;

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen ">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shadow-sm p-1.5">
          <img src={logoUrl} alt="Cloud Disk Logo" className="w-full h-full logo-img" />
        </div>
        <span className="font-bold text-[15px] tracking-tight text-foreground">
          Cloud Disk
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted [&.active]:text-primary [&.active]:bg-primary/10"
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
        {adminMenuItem ? (
          <>
            <div className="h-px bg-border my-3" />
            <Link
              key={adminMenuItem.to}
              to={adminMenuItem.to}
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted [&.active]:text-primary [&.active]:bg-primary/10"
            >
              <adminMenuItem.icon className="w-4 h-4 flex-shrink-0" />
              {adminMenuItem.label}
            </Link>
          </>
        ) : null}
      </nav>

      {/* Storage Indicator */}
      <div className="p-6 border-t border-border bg-muted/40">
        <div className="flex items-center gap-2 mb-3">
          <HardDrive className="w-4 h-4 text-muted-foreground" />
          <span className="text-[13px] font-medium text-muted-foreground">
            Trạng thái bộ nhớ
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-muted-foreground">
          <span>
            Đã dùng {usedGB} GB trên {totalGB} GB
          </span>
          <span className="font-semibold">{percentUsed}%</span>
        </div>
      </div>
    </aside>
  );
}
