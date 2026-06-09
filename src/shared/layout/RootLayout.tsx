import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function RootLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-base bg-grid-pattern bg-grid">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
