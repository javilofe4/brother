import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/shared/layout/RootLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { AchievementsPage } from "@/features/achievements/AchievementsPage";
import { AchievementDetailPage } from "@/features/achievements/AchievementDetailPage";
import { RegisterPage } from "@/features/register/RegisterPage";
import { DuelPage } from "@/features/duel/DuelPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "achievements", element: <AchievementsPage /> },
      { path: "achievements/:id", element: <AchievementDetailPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "duel", element: <DuelPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
