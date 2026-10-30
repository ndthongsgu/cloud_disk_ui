import { createFileRoute } from "@tanstack/react-router";
import { useStarredFiles } from "@/hooks/useFilesQuery";
import { 
  Star, 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileCode, 
  FileCheck,
  Trash2 
} from "lucide-react";
import { useFileStore } from "@/stores/useFileStore";
import { useTrashFile, useToggleStarFile } from "@/hooks/useFilesMutation";

export const Route = createFileRoute("/starred")({
  component: StarredComponent,
});

function StarredComponent() {
  const { viewMode, searchQuery } = useFileStore();
  const { data: files = [], isLoading } = useStarredFiles();
  const trashFileMutation = useTrashFile();
  const toggleStarMutation = useToggleStarFile();

  const handleStarredToggle = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    toggleStarMutation.mutate(fileId);
  };

  const handleTrashFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn di chuyển tệp này vào Thùng rác không?")) {
      trashFileMutation.mutate(fileId);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="w-10 h-10 text-amber-500 fill-amber-500/20" />;
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

  const getFileIconSmall = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="w-5 h-5 text-amber-500 fill-amber-500/10" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case "video":
        return <VideoIcon className="w-5 h-5 text-sky-500" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-rose-500" />;
      case "document":
        return <FileCheck className="w-5 h-5 text-indigo-500" />;
      default:
        return <FileCode className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // Filter files by search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 flex flex-col h-full bg-background text-left">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">Tệp tin đã đánh dấu sao</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Truy cập nhanh các tệp tin và thư mục bạn đã đánh dấu là quan trọng</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 bg-muted/20">
          <Star className="w-16 h-16 text-muted-foreground/35 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Không tìm thấy mục nào</h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
            {files.length === 0 
              ? "Đánh dấu sao các tệp tin và thư mục quan trọng để xem chúng ngay lập tức tại đây."
              : "Không có kết quả tìm kiếm phù hợp."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-card border border-border/80 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm flex flex-col relative group hover:border-primary/20 hover:shadow-md"
            >
              <button
                onClick={(e) => handleStarredToggle(e, file.id)}
                className="absolute top-3 left-3 p-1 rounded-full text-amber-500 hover:text-muted-foreground/60 transition-colors"
                title="Bỏ đánh dấu sao"
              >
                <Star className="w-4 h-4 fill-amber-500" />
              </button>

              {/* Trash button */}
              {file.isCanTrash && (
                <button
                  onClick={(e) => handleTrashFile(e, file.id)}
                  className="absolute top-3 right-3 p-1 text-muted-foreground/60 hover:text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="flex-1 flex items-center justify-center py-6">
                {getFileIcon(file.type)}
              </div>

              <div className="text-left mt-2">
                <p className="text-[13px] font-semibold text-foreground truncate" title={file.name}>{file.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {file.type === "folder" ? "Thư mục" : `${(file.size / 1024).toFixed(0)} KB`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border/80 rounded-xl overflow-hidden bg-card shadow-sm">
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
                  className="border-b border-border/60 hover:bg-muted/30 last:border-0 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-6">
                    <button
                      onClick={(e) => handleStarredToggle(e, file.id)}
                      className="p-1 rounded-full text-amber-500 hover:text-muted-foreground/30 transition-colors"
                      title="Bỏ đánh dấu sao"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                    </button>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      {getFileIconSmall(file.type)}
                    </span>
                    <span className="text-[13px] font-semibold text-foreground truncate max-w-md">{file.name}</span>
                  </td>
                  <td className="py-3 px-4 text-[12px] text-muted-foreground">
                    {new Date(file.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-[12px] text-muted-foreground">
                    {file.type === "folder" ? "—" : `${(file.size / 1024).toFixed(0)} KB`}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {file.isCanTrash && (
                      <button
                        onClick={(e) => handleTrashFile(e, file.id)}
                        className="p-1.5 text-muted-foreground/40 hover:text-destructive rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
