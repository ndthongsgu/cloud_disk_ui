import { Search, Bell, Grid, List, LogOut } from "lucide-react";
import { useFileStore } from "../../stores/useFileStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function Header() {
  const { searchQuery, setSearchQuery, viewMode, setViewMode } = useFileStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công.");
    navigate({ to: "/login", replace: true });
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
          <Search className="w-4.5 h-4.5" />
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm tệp tin, tài liệu, thư mục..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-muted/60 text-[14px] rounded-lg border border-transparent focus:border-primary/30 focus:bg-background outline-none transition-all placeholder:text-muted-foreground/75"
        />
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-5">
        {/* Toggle Layout (Grid/List) */}
        <div className="flex bg-muted p-1 rounded-lg border border-border/40">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Chế độ lưới"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Chế độ danh sách"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Bell */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-[13px] font-semibold text-foreground leading-tight">
              {user?.full_name || "Khách"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {user?.email || "Chưa đăng nhập"}
            </span>
          </div>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.full_name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10 shadow-inner"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-bold ring-2 ring-primary/10">
              {user?.full_name?.charAt(0) || "K"}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-full transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
