import { createFileRoute } from "@tanstack/react-router";
import { useTrashedFiles } from "@/hooks/useFilesQuery";
import { useRestoreFile, useDeletePermanently } from "@/hooks/useFilesMutation";
import { 
  Trash2, 
  RotateCcw, 
  XCircle, 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileCode, 
  FileCheck 
} from "lucide-react";
import { useFileStore } from "@/stores/useFileStore";

export const Route = createFileRoute("/trash")({
  component: TrashComponent,
});

function TrashComponent() {
  const { viewMode, searchQuery } = useFileStore();
  const { data: files = [], isLoading } = useTrashedFiles();

  const restoreFileMutation = useRestoreFile();
  const deletePermanentlyMutation = useDeletePermanently();

  const handleRestore = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    restoreFileMutation.mutate(fileId);
  };

  const handleDeletePermanently = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn tệp này không? Hành động này không thể hoàn tác.")) {
      deletePermanentlyMutation.mutate(fileId);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="w-10 h-10 text-muted-foreground/40 fill-muted-foreground/10" />;
      case "image":
        return <ImageIcon className="w-10 h-10 text-muted-foreground/45" />;
      case "video":
        return <VideoIcon className="w-10 h-10 text-muted-foreground/45" />;
      case "pdf":
        return <FileText className="w-10 h-10 text-muted-foreground/45" />;
      case "document":
        return <FileCheck className="w-10 h-10 text-muted-foreground/45" />;
      default:
        return <FileCode className="w-10 h-10 text-muted-foreground/45" />;
    }
  };

  const getFileIconSmall = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="w-5 h-5 text-muted-foreground/40 fill-muted-foreground/10" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-muted-foreground/45" />;
      case "video":
        return <VideoIcon className="w-5 h-5 text-muted-foreground/45" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-muted-foreground/45" />;
      case "document":
        return <FileCheck className="w-5 h-5 text-muted-foreground/45" />;
      default:
        return <FileCode className="w-5 h-5 text-muted-foreground/45" />;
    }
  };

  // Filter files by search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 flex flex-col h-full bg-background text-left">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">Thùng rác</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Các mục đã xóa sẽ được lưu trữ tại đây. Bạn có thể khôi phục hoặc xóa chúng vĩnh viễn.</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 bg-muted/20">
          <Trash2 className="w-16 h-16 text-muted-foreground/35 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            {files.length === 0 ? "Thùng rác trống" : "Không tìm thấy mục nào phù hợp"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
            {files.length === 0 
              ? "Các mục được chuyển vào thùng rác sẽ xuất hiện ở đây để xem xét."
              : "Không tìm thấy kết quả phù hợp với từ khóa."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-card border border-border/80 rounded-xl p-4 transition-all duration-200 shadow-sm flex flex-col relative group hover:border-destructive/20 hover:shadow-md"
            >
              {/* Actions panel */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {file.isCanRestore && (
                  <button
                    onClick={(e) => handleRestore(e, file.id)}
                    className="p-1 text-muted-foreground/60 hover:text-primary rounded-full hover:bg-muted"
                    title="Khôi phục tệp"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                {file.isCanDelete && (
                  <button
                    onClick={(e) => handleDeletePermanently(e, file.id)}
                    className="p-1 text-muted-foreground/60 hover:text-destructive rounded-full hover:bg-muted"
                    title="Xóa vĩnh viễn"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>

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
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground/40" />
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
                  <td className="py-3 px-6 text-right flex gap-1.5 justify-end">
                    {file.isCanRestore && (
                      <button
                        onClick={(e) => handleRestore(e, file.id)}
                        className="p-1.5 text-muted-foreground/40 hover:text-primary rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Khôi phục tệp"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    {file.isCanDelete && (
                      <button
                        onClick={(e) => handleDeletePermanently(e, file.id)}
                        className="p-1.5 text-muted-foreground/40 hover:text-destructive rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa vĩnh viễn"
                      >
                        <XCircle className="w-4 h-4" />
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
