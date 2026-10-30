import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    // If not authenticated and not on an auth page, redirect to login
    if (!isAuthenticated && !isAuthPage) {
      navigate({ to: "/login", replace: true });
    } 
    // If authenticated and on an auth page, redirect to main dashboard
    else if (isAuthenticated && isAuthPage) {
      navigate({ to: "/my-files", replace: true });
    }
  }, [isAuthenticated, isAuthPage, navigate]);

  return (
    <>
      {isAuthPage ? (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
          <Outlet />
        </div>
      ) : (
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      )}
      <Toaster position="top-right" richColors theme="system" />
    </>
  );
}

