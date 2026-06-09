import { Trophy } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Progress } from "@/shared/components/ui";
import { AchievementCategoryLabels, AchievementRarityLabels } from "@/shared/config/achievementConfig";
import type { Achievement, UserAchievement } from "@/domain/achievements/achievement.types";

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement: UserAchievement;
}

export function AchievementCard({ achievement, userAchievement }: AchievementCardProps) {
  return (
    <Card className="border-l-2 border-accent-cyan/30">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>{achievement.title}</CardTitle>
            <p className="text-xs text-text-muted">{AchievementCategoryLabels[achievement.category]}</p>
          </div>
          <Badge variant={userAchievement.status === "unlocked" ? "emerald" : "muted"}>
            {userAchievement.status === "unlocked" ? "Desbloqueado" : "Bloqueado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary mb-3">{achievement.description}</p>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="muted">{AchievementRarityLabels[achievement.rarity]}</Badge>
          <Badge variant={userAchievement.status === "unlocked" ? "emerald" : "muted"}>
            {achievement.xpReward} XP
          </Badge>
        </div>
        <Progress value={userAchievement.progress} color={achievement.category === "finance" ? "#10b981" : achievement.category === "challenge" ? "#9333ea" : "#00e5ff"} showLabel />
        {userAchievement.unlockedAt && (
          <p className="mt-3 text-xs text-text-muted">Desbloqueado: {new Date(userAchievement.unlockedAt).toLocaleDateString("es-ES")}</p>
        )}
      </CardContent>
    </Card>
  );
}
