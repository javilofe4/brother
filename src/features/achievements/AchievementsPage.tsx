import { useMemo, useState } from "react";
import { ShieldCheck, Lock, Star, Sparkles, Filter } from "lucide-react";
import { useAchievements } from "./hooks/useAchievements";
import { PageHeader } from "@/shared/components/PageHeader";
import { AchievementCard } from "./components/AchievementCard";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/shared/components/ui";
import { AchievementCategoryLabels, ACHIEVEMENT_CATEGORIES } from "@/shared/config/achievementConfig";
import type { AchievementCategory } from "@/shared/config/achievementConfig";

export function AchievementsPage() {
  const { unlocked, locked, recentUnlocked, total, completed, unlockedDetails, lockedDetails } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | "all">("all");

  const categoryOptions = useMemo(
    () => ["all", ...ACHIEVEMENT_CATEGORIES] as const,
    []
  );

  const visibleUnlocked = useMemo(
    () =>
      selectedCategory === "all"
        ? unlockedDetails
        : unlockedDetails.filter(({ achievement }) => achievement.category === selectedCategory),
    [selectedCategory, unlockedDetails]
  );

  const visibleLocked = useMemo(
    () =>
      selectedCategory === "all"
        ? lockedDetails
        : lockedDetails.filter(({ achievement }) => achievement.category === selectedCategory),
    [selectedCategory, lockedDetails]
  );

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Logros"
        subtitle="Colecciona XP, desbloquea recompensas y avanza en tu duelo."
      />

      <div className="grid gap-3 lg:grid-cols-3 mb-6">
        <Card glow="cyan">
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-5 w-5 text-accent-cyan" />
              <CardTitle>Desbloqueados</CardTitle>
            </div>
            <p className="text-2xl font-display text-text-primary">{completed}/{total}</p>
            <p className="text-sm text-text-muted mt-1">Logros desbloqueados</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-5 w-5 text-accent-amber" />
              <CardTitle>Últimos</CardTitle>
            </div>
            <p className="text-2xl font-display text-text-primary">{recentUnlocked.length}</p>
            <p className="text-sm text-text-muted mt-1">Recientes desbloqueos</p>
          </CardContent>
        </Card>

        <Card glow="emerald">
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-accent-emerald" />
              <CardTitle>Progreso</CardTitle>
            </div>
            <p className="text-2xl font-display text-text-primary">{locked.length}</p>
            <p className="text-sm text-text-muted mt-1">Logros en progreso</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-muted">Filtro</p>
          <h2 className="text-lg font-semibold text-text-primary">Explorar por categoría</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "Todo" : AchievementCategoryLabels[category]}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted">Desbloqueados</p>
              <h2 className="text-lg font-semibold text-text-primary">Tu colección</h2>
            </div>
            <Badge variant="default">{visibleUnlocked.length} / {completed}</Badge>
          </div>

          <div className="grid gap-3">
            {visibleUnlocked.length === 0 ? (
              <Card className="text-center py-10">
                <Lock className="h-10 w-10 text-text-muted mx-auto mb-3" />
                <p className="text-text-muted text-sm">Aún no has desbloqueado logros en esta categoría.</p>
              </Card>
            ) : (
              visibleUnlocked.map(({ achievement, userAchievement }) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  userAchievement={userAchievement}
                />
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted">Bloqueados</p>
              <h2 className="text-lg font-semibold text-text-primary">Próximos</h2>
            </div>
            <Badge variant="muted">{visibleLocked.length}</Badge>
          </div>

          <div className="grid gap-3">
            {visibleLocked.length === 0 ? (
              <Card className="text-center py-10">
                <Lock className="h-10 w-10 text-text-muted mx-auto mb-3" />
                <p className="text-text-muted text-sm">No hay logros bloqueados en esta categoría.</p>
              </Card>
            ) : (
              visibleLocked.map(({ achievement, userAchievement }) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  userAchievement={userAchievement}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
