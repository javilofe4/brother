import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/shared/layout/RootLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { RegisterPage } from "@/features/register/RegisterPage";
import { AchievementsPage } from "@/features/achievements/AchievementsPage";
import { AchievementDetailPage } from "@/features/achievements/AchievementDetailPage";
import { ChallengesPage } from "@/features/challenges/ChallengesPage";
import { DuelPage } from "@/features/duel/DuelPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "achievements", element: <AchievementsPage /> },
      { path: "achievements/:id", element: <AchievementDetailPage /> },
      { path: "challenges", element: <ChallengesPage /> },
      { path: "duel", element: <DuelPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
