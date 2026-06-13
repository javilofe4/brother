import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function RootLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-app)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
