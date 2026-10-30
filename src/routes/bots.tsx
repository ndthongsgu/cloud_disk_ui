import { createFileRoute } from "@tanstack/react-router";
import {
  useBots,
  useCreateBot,
  useDeactivateBot,
  useActivateBot,
  useUpdateBot,
} from "@/hooks/useBots";
import {
  Plus,
  ToggleLeft,
  ToggleRight,
  Key,
  Calendar,
  Bot,
  Search,
  Edit2,
  HardDrive,
  CheckCircle,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { type TelegramBotNode } from "@/services/bot.service";
import { useFileStore } from "@/stores/useFileStore";

export const Route = createFileRoute("/bots")({
  component: BotsComponent,
});

function BotsComponent() {
  const { data: bots = [], isLoading } = useBots();
  const { searchQuery, setSearchQuery, viewMode } = useFileStore();

  const createBotMutation = useCreateBot();
  const deactivateBotMutation = useDeactivateBot();
  const activateBotMutation = useActivateBot();
  const updateBotMutation = useUpdateBot();

  const [visibleTokens, setVisibleTokens] = useState<Record<string, boolean>>(
    {},
  );

  // Search & Filters State
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  // Add Bot Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newToken, setNewToken] = useState("");
  const [newChatId, setNewChatId] = useState("");

  // Edit Bot Dialog State
  const [editingBot, setEditingBot] = useState<TelegramBotNode | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editToken, setEditToken] = useState("");
  const [editChatId, setEditChatId] = useState("");

  const toggleTokenVisibility = (id: string) => {
    setVisibleTokens((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleStatus = (id: string, isDeactivate: boolean) => {
    if (isDeactivate) {
      if (
        confirm(
          "Bạn có chắc chắn muốn ngưng hoạt động Bot lưu trữ này không? Các file đã lưu vẫn tồn tại nhưng sẽ không thể upload file mới lên Node này.",
        )
      ) {
        deactivateBotMutation.mutate(id);
      }
    } else {
      activateBotMutation.mutate(id);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim() || !newToken.trim() || !newChatId.trim()) return;

    let cleanUsername = newUsername.trim();
    if (cleanUsername.startsWith("@")) {
      cleanUsername = cleanUsername.substring(1);
    }

    createBotMutation.mutate(
      {
        name: newName.trim(),
        username: cleanUsername,
        token: newToken.trim(),
        chatId: newChatId.trim(),
      },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          setNewName("");
          setNewUsername("");
          setNewToken("");
          setNewChatId("");
        },
      },
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBot || !editUsername.trim() || !editChatId.trim()) return;

    let cleanUsername = editUsername.trim();
    if (cleanUsername.startsWith("@")) {
      cleanUsername = cleanUsername.substring(1);
    }

    updateBotMutation.mutate(
      {
        id: editingBot.id,
        username: cleanUsername,
        token: editToken.trim() || undefined,
        chatId: editChatId.trim(),
      },
      {
        onSuccess: () => {
          setEditingBot(null);
          setEditUsername("");
          setEditToken("");
          setEditChatId("");
        },
      },
    );
  };

  const startEdit = (bot: TelegramBotNode) => {
    setEditingBot(bot);
    setEditUsername(bot.username);
    setEditToken(""); // keep empty unless changed
    setEditChatId(bot.chatId || "");
  };

  // Filter bots
  const filteredBots = bots.filter((bot) => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && bot.isActive) ||
      (statusFilter === "INACTIVE" && !bot.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 p-8 flex flex-col h-full bg-background text-left relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
            Bot lưu trữ
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1.5">
            Quản lý nhóm các Telegram Bot đóng vai trò làm lưu trữ vật lý để bẻ
            nhỏ và phân tán dữ liệu.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm Bot lưu trữ
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
          <Input
            type="text"
            placeholder="Tìm kiếm bot theo username hoặc tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-card border-border placeholder:text-muted-foreground/75 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-10 rounded-xl pl-4 pr-10 bg-card border-border cursor-pointer"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="INACTIVE">Ngưng hoạt động</option>
        </Select>
      </div>

      {/* Bots Grid / List Layout */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      ) : filteredBots.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 bg-muted/20">
          <Bot className="w-16 h-16 text-muted-foreground/35 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            {bots.length === 0
              ? "Chưa cấu hình Bot lưu trữ nào"
              : "Không tìm thấy Bot nào phù hợp"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 text-center max-w-sm">
            {bots.length === 0
              ? "Thêm ít nhất một Telegram Bot Token để làm phân vùng ổ đĩa vật lý của bạn."
              : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để hiển thị kết quả."}
          </p>
          {bots.length === 0 && (
            <Button
              onClick={() => setIsAddOpen(true)}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Thêm Bot đầu tiên
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBots.map((bot) => (
            <div
              key={bot.id}
              className={`bg-card border rounded-2xl p-6 shadow-sm relative flex flex-col justify-between transition-all hover:shadow-md ${
                bot.isActive
                  ? "border-border/80 hover:border-primary/20"
                  : "border-border/40 opacity-70"
              }`}
            >
              {/* Bot Meta Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${bot.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <Bot className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground m-0">
                      {bot.name}
                    </h3>
                    <p className="text-[12px] text-muted-foreground mt-0.5 font-mono">
                      @{bot.username}
                    </p>
                  </div>
                </div>
                {/* Active Indicator Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    bot.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : bot.status === "RATE_LIMITED"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      bot.status === "ACTIVE"
                        ? "bg-emerald-500 animate-pulse"
                        : bot.status === "RATE_LIMITED"
                          ? "bg-amber-500 animate-pulse"
                          : "bg-destructive"
                    }`}
                  />
                  {bot.statusLabel || bot.status}
                </span>
              </div>

              {/* Bot Credentials Box */}
              <div className="bg-muted/40 border border-border/60 rounded-xl p-3.5 space-y-2 mb-4 text-[12px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium flex-shrink-0">
                    <Key className="w-3.5 h-3.5 text-muted-foreground/80" />{" "}
                    Token
                  </span>
                  <div className="flex items-center gap-2 truncate">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground select-all font-mono">
                      {visibleTokens[bot.id]
                        ? bot.token
                        : "••••••••••••••••••••••••••••"}
                    </code>
                    <button
                      onClick={() => toggleTokenVisibility(bot.id)}
                      className="text-primary hover:underline font-semibold"
                    >
                      {visibleTokens[bot.id] ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <HardDrive className="w-3.5 h-3.5 text-muted-foreground/80" />{" "}
                    Đã lưu
                  </span>
                  <span className="text-foreground font-semibold">
                    {bot.totalFilesHandled} file
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/80" />{" "}
                    Đã kết nối
                  </span>
                  <span className="text-foreground">
                    {new Date(bot.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex justify-between items-center pt-3 border-t border-border/40">
                <button
                  onClick={() => startEdit(bot)}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Sửa cấu hình
                </button>

                {(bot.isCanDeActive || bot.isCanActive) && (
                  <button
                    onClick={() =>
                      handleToggleStatus(bot.id, bot.isCanDeActive || false)
                    }
                    className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${
                      bot.isCanDeActive
                        ? "text-destructive hover:text-destructive/80"
                        : "text-primary hover:text-primary/80"
                    }`}
                  >
                    {bot.isCanDeActive ? (
                      <>
                        <ToggleRight className="w-5.5 h-5.5" />
                        Tắt hoạt động
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5.5 h-5.5" />
                        Kích hoạt
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border/80 rounded-xl overflow-hidden bg-card shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[11px] text-muted-foreground uppercase font-semibold">
                <th className="py-3 px-6">Bot</th>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4 w-40">Đã lưu</th>
                <th className="py-3 px-4 w-40">Đã kết nối</th>
                <th className="py-3 px-4 w-40">Trạng thái</th>
                <th className="py-3 px-6 w-32 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBots.map((bot) => (
                <tr
                  key={bot.id}
                  className={`border-b border-border/60 hover:bg-muted/30 last:border-0 transition-colors group ${
                    !bot.isActive ? "opacity-70" : ""
                  }`}
                >
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${bot.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                      >
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[13px] font-semibold text-foreground block leading-normal">
                          {bot.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground block font-mono">
                          @{bot.username}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 max-w-[240px]">
                      <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] text-foreground select-all font-mono truncate">
                        {visibleTokens[bot.id]
                          ? bot.token
                          : "••••••••••••••••••••••••••••"}
                      </code>
                      <button
                        onClick={() => toggleTokenVisibility(bot.id)}
                        className="text-primary hover:text-primary/80 p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                        title={
                          visibleTokens[bot.id] ? "Ẩn Token" : "Hiện Token"
                        }
                      >
                        {visibleTokens[bot.id] ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[12px] text-muted-foreground">
                    {bot.totalFilesHandled} file
                  </td>
                  <td className="py-3.5 px-4 text-[12px] text-muted-foreground">
                    {new Date(bot.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        bot.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : bot.status === "RATE_LIMITED"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      <span
                        className={`w-1.2 h-1.2 rounded-full ${
                          bot.status === "ACTIVE"
                            ? "bg-emerald-500 animate-pulse"
                            : bot.status === "RATE_LIMITED"
                              ? "bg-amber-500 animate-pulse"
                              : "bg-destructive"
                        }`}
                      />
                      {bot.statusLabel || bot.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(bot)}
                        className="p-1.5 text-muted-foreground/60 hover:text-foreground rounded-md hover:bg-muted transition-colors"
                        title="Sửa cấu hình"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {(bot.isCanDeActive || bot.isCanActive) && (
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              bot.id,
                              bot.isCanDeActive || false,
                            )
                          }
                          className={`p-1.5 rounded-md hover:bg-muted transition-colors ${
                            bot.isCanDeActive
                              ? "text-destructive hover:text-destructive/80"
                              : "text-primary hover:text-primary/80"
                          }`}
                          title={
                            bot.isCanDeActive ? "Tắt hoạt động" : "Kích hoạt"
                          }
                        >
                          {bot.isCanDeActive ? (
                            <ToggleRight className="w-5.5 h-5.5" />
                          ) : (
                            <ToggleLeft className="w-5.5 h-5.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Bot Dialog Modal */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm Bot Telegram Lưu Trữ"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Tên
            </label>
            <Input
              type="text"
              required
              placeholder="Ví dụ: Node Storage A"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary"
              disabled={createBotMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Telegram Bot Username (không chứa @)
            </label>
            <Input
              type="text"
              required
              placeholder="Ví dụ: my_cloud_disk_bot"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary font-mono"
              disabled={createBotMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Telegram Bot Token
            </label>
            <Input
              type="password"
              required
              placeholder="Nhập HTTP API Token nhận được từ @BotFather"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary font-mono"
              disabled={createBotMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Telegram Storage Chat ID / Channel ID
            </label>
            <Input
              type="text"
              required
              placeholder="Ví dụ: -100123456789 hoặc username kênh"
              value={newChatId}
              onChange={(e) => setNewChatId(e.target.value)}
              className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary font-mono"
              disabled={createBotMutation.isPending}
            />
          </div>

          {/* BotFather Instructions Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-[12px] space-y-2">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <HelpCircle className="w-4 h-4" />
              Hướng dẫn thiết lập Bot và lấy Chat ID:
            </div>
            <ol className="list-decimal list-inside text-muted-foreground space-y-1.5 pl-1">
              <li>
                Tìm kiếm và nhắn tin với{" "}
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline font-semibold font-mono"
                >
                  @BotFather
                </a>{" "}
                trên Telegram.
              </li>
              <li>
                Gửi lệnh{" "}
                <code className="bg-primary/10 px-1 py-0.5 rounded text-primary font-semibold font-mono">
                  /newbot
                </code>{" "}
                và làm theo hướng dẫn để lấy **HTTP API Token** và điền vào form phía trên.
              </li>
              <li>
                Chọn **một trong hai** phương án lưu trữ dưới đây:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-muted-foreground/90">
                  <li>
                    <strong className="text-foreground">Lưu trữ cá nhân (Gửi trực tiếp vào Chat của bạn)</strong>: 
                    Nhắn tin cho Bot bạn vừa tạo và click <code className="bg-primary/5 px-1 py-0.5 rounded text-primary font-mono font-semibold">/start</code>. Sau đó nhắn tin cho Bot <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-primary hover:underline font-mono font-semibold">@userinfobot</a> để lấy số **Id** cá nhân của bạn rồi điền vào ô Chat ID ở trên.
                  </li>
                  <li>
                    <strong className="text-foreground">Lưu trữ Kênh/Nhóm (Nhiều người dùng chung)</strong>:
                    Tạo một Kênh hoặc Nhóm Telegram mới, thêm Bot vừa tạo làm **Quản trị viên (Administrator)** với quyền **Đăng tin/Gửi tài liệu (Post Messages)**. Lấy Chat ID của Kênh/Nhóm đó (ví dụ: tên kênh công khai `@my_channel` hoặc ID số kênh riêng tư dạng `-100xxxxxxxxxx`) điền vào ô Chat ID ở trên.
                  </li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              disabled={createBotMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createBotMutation.isPending}
              className="flex items-center gap-2"
            >
              {createBotMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Đang kiểm tra và thêm...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Lưu
                </>
              )}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Bot Dialog Modal */}
      <Dialog
        isOpen={!!editingBot}
        onClose={() => setEditingBot(null)}
        title={
          editingBot
            ? `Sửa cấu hình Bot: ${editingBot.name}`
            : "Sửa cấu hình Bot"
        }
      >
        {editingBot && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Tên
              </label>
              <Input
                type="text"
                disabled
                value={editingBot.name}
                className="h-10 rounded-xl px-3.5 cursor-not-allowed bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Telegram Bot Username (không chứa @)
              </label>
              <Input
                type="text"
                required
                placeholder="Ví dụ: my_cloud_disk_bot"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary font-mono"
                disabled={updateBotMutation.isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Telegram Bot Token mới (Để trống nếu giữ nguyên)
              </label>
              <Input
                type="password"
                placeholder="••••••••••••••••••••••••••••••••"
                value={editToken}
                onChange={(e) => setEditToken(e.target.value)}
                className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary font-mono"
                disabled={updateBotMutation.isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Telegram Storage Chat ID / Channel ID
              </label>
              <Input
                type="text"
                required
                placeholder="Ví dụ: -100123456789"
                value={editChatId}
                onChange={(e) => setEditChatId(e.target.value)}
                className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary font-mono"
                disabled={updateBotMutation.isPending}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingBot(null)}
                disabled={updateBotMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateBotMutation.isPending}
                className="flex items-center gap-2"
              >
                {updateBotMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Đang xác thực và lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
