import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUsers, useDeactivateUser, useActivateUser } from "@/hooks/useUsers";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { ShieldAlert, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type UserSummary } from "@/types";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersComponent,
});

function UserActionsCell({ user }: { user: UserSummary }) {
  const deactivateUserMutation = useDeactivateUser();
  const activateUserMutation = useActivateUser();

  const handleToggleStatus = () => {
    if (user.isCanDeActive) {
      if (
        confirm(
          `Bạn có chắc chắn muốn khóa tài khoản người dùng ${user.username} không?`
        )
      ) {
        deactivateUserMutation.mutate(user.id);
      }
    } else if (user.isCanActive) {
      activateUserMutation.mutate(user.id);
    }
  };

  if (!user.isCanDeActive && !user.isCanActive) {
    return <span className="text-xs text-muted-foreground font-medium">Không có</span>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`font-semibold text-xs py-1 h-7 px-2.5 rounded-lg transition-colors ${
        user.isCanDeActive
          ? "text-destructive hover:text-destructive/80 hover:bg-destructive/5"
          : "text-primary hover:text-primary/80 hover:bg-primary/5"
      }`}
      onClick={handleToggleStatus}
      disabled={deactivateUserMutation.isPending || activateUserMutation.isPending}
    >
      {user.isCanDeActive ? "Khóa" : "Kích hoạt"}
    </Button>
  );
}

const columns: ColumnDef<UserSummary>[] = [
  {
    accessorKey: "username",
    header: "Tên đăng nhập",
    cell: (info) => (
      <span className="font-semibold text-foreground">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Họ tên",
    cell: (info) => <span className="text-foreground">{info.getValue<string>()}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => <span className="text-foreground">{info.getValue<string>()}</span>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: (info) => {
      const user = info.row.original;
      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            user.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {user.statusLabel || user.status}
        </span>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Vai trò",
    cell: (info) => {
      const roles = info.getValue<string[]>() || [];
      return (
        <span className="text-foreground font-medium">
          {roles.join(", ") || "Không có"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: (info) => <UserActionsCell user={info.row.original} />,
  },
];

function AdminUsersComponent() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useUsers({ page: 1, size: 20 });

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate({ to: "/my-files", replace: true });
    }
  }, [user, navigate]);

  const users = data?.items || [];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!user) {
    return null;
  }

  if (!user.isAdmin) {
    return (
      <div className="flex-1 p-8 bg-background text-left">
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">Không có quyền truy cập</h1>
          </div>
          <p className="text-sm text-muted-foreground">
             Menu Quản lý người dùng chỉ dành cho quản trị viên. Vui lòng liên hệ quản trị hệ thống nếu bạn cần quyền truy cập.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 flex flex-col h-full bg-background text-left">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
            Quản lý tài khoản người dùng
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Xem và quản lý danh sách tài khoản người dùng trong hệ thống.
          </p>
        </div>
        <Button onClick={() => refetch()} size="sm" className="inline-flex items-center gap-2">
          <Search className="w-4 h-4" />
          Tải lại
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-destructive">
          Không thể tải danh sách người dùng. Vui lòng thử lại.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-t border-border/70 hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-4 text-foreground text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Không tìm thấy tài khoản người dùng.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
