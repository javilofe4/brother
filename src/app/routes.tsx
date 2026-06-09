import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/shared/layout/RootLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { AchievementsPage } from "@/features/achievements/AchievementsPage";
import { RegisterPage } from "@/features/register/RegisterPage";
import { DuelPage } from "@/features/duel/DuelPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "achievements", element: <AchievementsPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "duel", element: <DuelPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
