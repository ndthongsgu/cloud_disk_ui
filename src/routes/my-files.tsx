import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useFileStore } from "@/stores/useFileStore";
import { useFiles } from "@/hooks/useFilesQuery";
import { useBots } from "@/hooks/useBots";
import {
  useCreateFolder,
  useTrashFile,
  useUploadFile,
  useToggleStarFile,
  useRenameFile,
} from "@/hooks/useFilesMutation";
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  FileCode,
  FileCheck,
  Star,
  Trash2,
  FolderPlus,
  Upload,
  MoreVertical,
  Edit2,
  Download,
  FolderOpen,
  CheckCircle,
  Bot,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

export const Route = createFileRoute("/my-files")({
  component: MyFilesComponent,
});

function MyFilesComponent() {
  const {
    viewMode,
    searchQuery,
    currentFolderId,
    setCurrentFolderId,
    addUpload,
    updateUploadProgress,
    updateUploadStatus,
  } = useFileStore();

  // Dialog & Dropdown States
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameItemId, setRenameItemId] = useState("");
  const [renameItemName, setRenameItemName] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Fetch Telegram bots
  const { data: bots = [] } = useBots();
  const activeBots = bots.filter((b) => b.isActive);
  const hasActiveBots = activeBots.length > 0;

  // Selected bot node state
  const [selectedBotId, setSelectedBotId] = useState<string>("");

  // Initialize selected bot
  useEffect(() => {
    if (activeBots.length > 0 && !selectedBotId) {
      setSelectedBotId(activeBots[0].id);
    }
  }, [activeBots, selectedBotId]);

  // Close active dropdown menu when clicking anywhere else
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // TanStack Query for files list fetching
  const { data: files = [], isLoading } = useFiles(
    currentFolderId,
    false,
    selectedBotId || null,
  );

  // TanStack Mutations for operations
  const createFolderMutation = useCreateFolder();
  const trashFileMutation = useTrashFile();
  const uploadFileMutation = useUploadFile();
  const toggleStarMutation = useToggleStarFile();
  const renameFileMutation = useRenameFile();

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate(
      {
        name: newFolderName.trim(),
        parentId: currentFolderId,
        botId: selectedBotId || null,
      },
      {
        onSuccess: () => {
          setIsCreateFolderOpen(false);
          setNewFolderName("");
        },
      },
    );
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameItemName.trim()) return;
    renameFileMutation.mutate(
      { id: renameItemId, name: renameItemName.trim() },
      {
        onSuccess: () => {
          setIsRenameOpen(false);
          setRenameItemId("");
          setRenameItemName("");
        },
      },
    );
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleStarredToggle = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    toggleStarMutation.mutate(fileId);
  };

  const handleTrashFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (
      confirm("Bạn có chắc chắn muốn di chuyển tệp này vào Thùng rác không?")
    ) {
      trashFileMutation.mutate(fileId);
    }
  };

  const handleCreateFolder = () => {
    setIsCreateFolderOpen(true);
  };

  const handleUploadFile = () => {
    // Dynamically trigger file selection dialog
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const uploadId = `upload_${Math.random().toString(36).substr(2, 9)}`;
      // Track in Zustand store
      addUpload({
        id: uploadId,
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "pending",
      });

      updateUploadStatus(uploadId, "uploading");

      // Execute upload mutation
      uploadFileMutation.mutate(
        {
          file,
          parentId: currentFolderId,
          botId: selectedBotId || null,
          onProgress: (progress) => {
            updateUploadProgress(uploadId, progress);
          },
        },
        {
          onSuccess: () => {
            updateUploadStatus(uploadId, "success");
          },
          onError: (error) => {
            updateUploadStatus(uploadId, "error", error.message);
          },
        },
      );
    };
    input.click();
  };

  // Filter files by search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return (
          <Folder className="w-10 h-10 text-amber-500 fill-amber-500/20" />
        );
      case "image":
        return <ImageIcon className="w-10 h-10 text-emerald-500" />;
      case "video":
        return <VideoIcon className="w-10 h-10 text-sky-500" />;
      case "pdf":
        return <FileText className="w-10 h-10 text-rose-500" />;
      case "document":
        return <FileCheck className="w-10 h-10 text-indigo-500" />;
      default:
        return <FileCode className="w-10 h-10 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col h-full bg-background">
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
            Tệp tin của tôi
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Quản lý và truy cập các tệp tin đã tải lên của bạn một cách an toàn
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Active Storage Selector */}
          {hasActiveBots && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-primary" />
                Kho lưu trữ:
              </span>
              <select
                value={selectedBotId}
                onChange={(e) => {
                  setSelectedBotId(e.target.value);
                  setCurrentFolderId(null);
                }}
                className="h-8 rounded-lg pl-2 pr-6 bg-card border border-border text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {activeBots.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name} (@{bot.username})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateFolder}
            disabled={!hasActiveBots || createFolderMutation.isPending}
            className="flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            Thư mục mới
          </Button>
          <Button
            size="sm"
            onClick={handleUploadFile}
            disabled={!hasActiveBots || uploadFileMutation.isPending}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Tải tệp lên
          </Button>
        </div>
      </div>

      {/* Warning banner when no active bots are configured */}
      {!hasActiveBots && !isLoading && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-center gap-3">
          <Bot className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Lưu ý quan trọng:</span> Không tìm
            thấy Bot lưu trữ nào đang hoạt động. Vui lòng truy cập trang{" "}
            <a
              href="/bots"
              className="underline font-bold hover:text-destructive/80 transition-colors"
            >
              Bot lưu trữ
            </a>{" "}
            để thiết lập và kích hoạt nhất một Bot trước khi bắt đầu tạo thư mục
            hoặc tải tệp lên.
          </div>
        </div>
      )}

      {/* Breadcrumbs for folder navigation */}
      {currentFolderId && (
        <div className="mb-6 text-sm flex items-center gap-2">
          <button
            onClick={() => setCurrentFolderId(null)}
            className="text-primary hover:underline font-medium"
          >
            Thư mục gốc
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground font-semibold">
            Thư mục hiện tại
          </span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      ) : filteredFiles.length === 0 ? (
        // Empty state
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 bg-muted/20">
          <Folder className="w-16 h-16 text-muted-foreground/45 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            Không tìm thấy tệp tin nào
          </h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
            Thư mục này hiện đang trống hoặc không có kết quả tìm kiếm phù hợp.
            Tải tệp tin lên để bắt đầu.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        // Grid view
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() =>
                file.type === "folder" && handleFolderClick(file.id)
              }
              className={`group bg-card border border-border/80 hover:border-primary/20 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col relative ${
                file.type === "folder" ? "hover:bg-muted/10" : ""
              }`}
            >
              {/* Star toggle icon */}
              <button
                onClick={(e) => handleStarredToggle(e, file.id)}
                className={`absolute top-3 left-3 p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100 ${
                  file.isStarred
                    ? "text-amber-500 opacity-100"
                    : "text-muted-foreground/60 hover:text-foreground"
                }`}
              >
                <Star
                  className={`w-4 h-4 ${file.isStarred ? "fill-amber-500" : ""}`}
                />
              </button>

              {/* Actions dropdown trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(file.id === activeMenuId ? null : file.id);
                }}
                className="absolute top-3 right-3 p-1 text-muted-foreground/60 hover:text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-muted"
                title="Thao tác"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Grid Dropdown Menu */}
              {activeMenuId === file.id && (
                <div
                  className="absolute right-3 top-10 bg-card border border-border shadow-lg rounded-lg w-40 z-20 text-left animate-in fade-in slide-in-from-top-1 duration-100 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {file.type === "folder" && (
                    <button
                      onClick={() => {
                        handleFolderClick(file.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      Mở
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameItemId(file.id);
                      setRenameItemName(file.name);
                      setIsRenameOpen(true);
                      setActiveMenuId(null);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Đổi tên
                  </button>
                  <button
                    onClick={(e) => {
                      handleStarredToggle(e, file.id);
                      setActiveMenuId(null);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                    {file.isStarred ? "Bỏ gắn sao" : "Gắn sao"}
                  </button>
                  {file.type !== "folder" && file.url && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải xuống
                    </a>
                  )}
                  {file.isCanTrash && (
                    <button
                      onClick={(e) => {
                        handleTrashFile(e, file.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 flex items-center gap-2 border-t border-border cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Xóa
                    </button>
                  )}
                </div>
              )}

              {/* Central File Icon */}
              <div className="flex-1 flex items-center justify-center py-6">
                {getFileIcon(file.type)}
              </div>

              {/* File details */}
              <div className="text-left mt-2">
                <p
                  className="text-[13px] font-semibold text-foreground truncate max-w-full"
                  title={file.name}
                >
                  {file.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {file.type === "folder"
                    ? "Thư mục"
                    : `${(file.size / 1024).toFixed(0)} KB`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List view
        <div className="border border-border/80 rounded-xl bg-card shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[11px] text-muted-foreground uppercase font-semibold">
                <th className="py-3 px-6 w-12"></th>
                <th className="py-3 px-4">Tên</th>
                <th className="py-3 px-4 w-40">Ngày sửa đổi</th>
                <th className="py-3 px-4 w-32">Kích thước</th>
                <th className="py-3 px-6 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  onClick={() =>
                    file.type === "folder" && handleFolderClick(file.id)
                  }
                  className="border-b border-border/60 hover:bg-muted/30 last:border-0 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-6">
                    <button
                      onClick={(e) => handleStarredToggle(e, file.id)}
                      className={`p-1 rounded-full ${
                        file.isStarred
                          ? "text-amber-500"
                          : "text-muted-foreground/30 hover:text-foreground group-hover:opacity-100 opacity-0 transition-opacity"
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${file.isStarred ? "fill-amber-500" : ""}`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      {/* Scaled down icon */}
                      {file.type === "folder" ? (
                        <Folder className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                      ) : file.type === "image" ? (
                        <ImageIcon className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-rose-500" />
                      )}
                    </span>
                    <span className="text-[13px] font-semibold text-foreground truncate max-w-md">
                      {file.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[12px] text-muted-foreground">
                    {new Date(file.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-[12px] text-muted-foreground">
                    {file.type === "folder"
                      ? "—"
                      : `${(file.size / 1024).toFixed(0)} KB`}
                  </td>
                  <td className="py-3 px-6 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(
                          file.id === activeMenuId ? null : file.id,
                        );
                      }}
                      className="p-1.5 text-muted-foreground/60 hover:text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer"
                      title="Thao tác"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* List Dropdown Menu */}
                    {activeMenuId === file.id && (
                      <div
                        className="absolute right-6 top-10 bg-card border border-border shadow-lg rounded-lg overflow-hidden w-40 z-20 text-left animate-in fade-in slide-in-from-top-1 duration-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {file.type === "folder" && (
                          <button
                            onClick={() => {
                              handleFolderClick(file.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            Mở
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameItemId(file.id);
                            setRenameItemName(file.name);
                            setIsRenameOpen(true);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Đổi tên
                        </button>
                        <button
                          onClick={(e) => {
                            handleStarredToggle(e, file.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5" />
                          {file.isStarred ? "Bỏ gắn sao" : "Gắn sao"}
                        </button>
                        {file.type !== "folder" && file.url && (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Tải xuống
                          </a>
                        )}
                        {file.isCanTrash && (
                          <button
                            onClick={(e) => {
                              handleTrashFile(e, file.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 flex items-center gap-2 border-t border-border cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Folder Modal */}
      <Dialog
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        title="Tạo thư mục mới"
      >
        <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Tên thư mục
            </label>
            <Input
              type="text"
              required
              placeholder="Ví dụ: Tài liệu học tập"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary"
              disabled={createFolderMutation.isPending}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateFolderOpen(false)}
              disabled={createFolderMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createFolderMutation.isPending}
              className="flex items-center gap-2"
            >
              {createFolderMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Tạo mới
                </>
              )}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Rename Modal */}
      <Dialog
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        title="Đổi tên"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Tên mới
            </label>
            <Input
              type="text"
              required
              placeholder="Nhập tên mới..."
              value={renameItemName}
              onChange={(e) => setRenameItemName(e.target.value)}
              className="h-10 rounded-xl px-3.5 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary"
              disabled={renameFileMutation.isPending}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRenameOpen(false)}
              disabled={renameFileMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={renameFileMutation.isPending}
              className="flex items-center gap-2"
            >
              {renameFileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Cập nhật
                </>
              )}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
