import { type ElementType, useMemo, useState } from "react";
import { PlusCircle, TrendingUp, TrendingDown, PiggyBank, Wallet, Target, ShieldCheck, Sparkles, BarChart } from "lucide-react";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppStore } from "@/app/store";
import {
  FinanceTypeEnum,
  FINANCE_TYPE_LABELS,
  CATEGORY_LABELS,
  type FinanceType,
  type FinanceCategory,
} from "@/domain/finances/finance.types";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  SAVING_ALLOCATION_CATEGORIES,
} from "@/shared/config/financeConfig";
import {
  calculateMonthlySummary,
  getTotalsByCategory,
  getActiveFinancialGoal,
  calculateGoalProgress,
  calculateEmergencyFundProgress,
  getSavingAllocationTotals,
  getInvestmentOpportunitiesByUser,
} from "@/domain/finances/finance.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
  Select,
  Textarea,
  Badge,
  Progress,
} from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";

function FinanceForm({ onClose }: { onClose: () => void }) {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const addFinance = useAppStore((s) => s.addFinance);

  const [form, setForm] = useState({
    type: "expense" as FinanceType,
    amount: "",
    category: "housing" as FinanceCategory,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const categoryOptions = useMemo(() => {
    if (form.type === "income") return INCOME_CATEGORIES;
    if (form.type === "saving") return SAVING_ALLOCATION_CATEGORIES;
    return EXPENSE_CATEGORIES;
  }, [form.type]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return;

    addFinance({
      id: uuid(),
      userId: activeUserId,
      type: form.type,
      amount,
      category: form.category,
      date: form.date,
      notes: form.notes || undefined,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Card className="border-accent-emerald/30 animate-slide-in">
      <CardHeader>
        <CardTitle>Nuevo movimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tipo *</Label>
            <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
              {FinanceTypeEnum.options.map((t) => (
                <option key={t} value={t}>{FINANCE_TYPE_LABELS[t]}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Cantidad (€) *</Label>
            <Input
              type="number"
              placeholder="0.00"
              step="0.01"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
          </div>

          <div>
            <Label>Categoría</Label>
            <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Notas</Label>
            <Textarea
              placeholder="Descripción opcional..."
              rows={2}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleSubmit}
            variant={form.type === "income" ? "default" : form.type === "saving" ? "violet" : "secondary"}
            className="flex-1"
          >
            <PlusCircle className="h-4 w-4" /> Registrar
          </Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancesPage() {
  const [showForm, setShowForm] = useState(false);
  const activeUserId = useAppStore((s) => s.activeUserId);
  const finances = useAppStore((s) =>
    s.finances.filter((f) => f.userId === activeUserId && !f.deletedAt)
  );
  const goals = useAppStore((s) => s.financialGoals.filter((goal) => goal.userId === activeUserId));
  const emergencyFund = useAppStore((s) =>
    s.emergencyFunds.find((fund) => fund.userId === activeUserId)
  );
  const allocations = useAppStore((s) =>
    s.savingAllocations.filter((allocation) => allocation.userId === activeUserId)
  );
  const investments = useAppStore((s) =>
    getInvestmentOpportunitiesByUser(s.investmentOpportunities, activeUserId)
  );

  const summary = useMemo(() => calculateMonthlySummary(finances), [finances]);
  const expenseTotals = useMemo(
    () => getTotalsByCategory(finances.filter((item) => item.type === "expense")),
    [finances]
  );
  const allocationTotals = useMemo(() => getSavingAllocationTotals(allocations), [allocations]);
  const activeGoal = useMemo(() => getActiveFinancialGoal(goals), [goals]);
  const goalProgress = useMemo(() => (activeGoal ? calculateGoalProgress(activeGoal) : 0), [activeGoal]);
  const emergencyProgress = useMemo(() => calculateEmergencyFundProgress(emergencyFund), [emergencyFund]);

  const typeColors: Record<FinanceType, { icon: ElementType; color: string; bg: string }> = {
    income: { icon: TrendingUp, color: "text-accent-emerald", bg: "#10b98115" },
    expense: { icon: TrendingDown, color: "text-accent-rose", bg: "#f43f5e15" },
    saving: { icon: PiggyBank, color: "text-accent-violet", bg: "#7c3aed15" },
  };

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Finanzas"
        subtitle="Resumen mensual y objetivos"
        action={
          !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="h-4 w-4" /> Nuevo
            </Button>
          )
        }
      />

      <div className="grid gap-3 mb-6 md:grid-cols-3">
        <Card glow="emerald">
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-accent-emerald" />
              <CardTitle>Ingresos netos</CardTitle>
            </div>
            <p className="font-display text-3xl text-accent-emerald">+{summary.income.toFixed(0)}€</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-4 w-4 text-accent-rose" />
              <CardTitle>Gastos</CardTitle>
            </div>
            <p className="font-display text-3xl text-accent-rose">-{summary.expenses.toFixed(0)}€</p>
          </CardContent>
        </Card>

        <Card glow="violet">
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="h-4 w-4 text-accent-violet" />
              <CardTitle>Ahorro disponible</CardTitle>
            </div>
            <p className="font-display text-3xl text-accent-violet">{summary.savings.toFixed(0)}€</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 mb-6 md:grid-cols-3">
        <Card glow="cyan">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent-cyan" />
              <CardTitle>Objetivo activo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {activeGoal ? (
              <>
                <p className="text-sm text-text-secondary">{activeGoal.title}</p>
                <p className="text-2xl font-semibold text-text-primary">{activeGoal.currentAmount}€ / {activeGoal.targetAmount}€</p>
                <Progress value={goalProgress} color="#00e5ff" showLabel />
              </>
            ) : (
              <p className="text-sm text-text-muted">No hay objetivo financiero activo.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-emerald" />
              <CardTitle>Fondo de emergencia</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {emergencyFund ? (
              <>
                <p className="text-sm text-text-secondary">{emergencyFund.currentAmount}€ / {emergencyFund.targetAmount}€</p>
                <Progress value={emergencyProgress} color="#10b981" showLabel />
              </>
            ) : (
              <p className="text-sm text-text-muted">Ningún fondo registrado.</p>
            )}
          </CardContent>
        </Card>

        <Card glow="violet">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-accent-amber" />
              <CardTitle>Inversiones</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-display text-text-primary">{investments.length}</p>
            <p className="text-sm text-text-muted">Oportunidades registradas</p>
          </CardContent>
        </Card>
      </div>

      {showForm && <FinanceForm onClose={() => setShowForm(false)} />}

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted">Resumen</p>
              <h2 className="text-lg font-semibold text-text-primary">Ingresos y gastos</h2>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por categoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(getTotalsByCategory(finances.filter((item) => item.type === "income"))).map(([category, value]) => (
                  <div key={category} className="flex items-center justify-between text-sm text-text-secondary">
                    <span>{CATEGORY_LABELS[category as FinanceCategory]}</span>
                    <span className="font-medium">{value.toFixed(0)}€</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gastos por tipo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(expenseTotals).map(([category, value]) => (
                  <div key={category} className="flex items-center justify-between text-sm text-text-secondary">
                    <span>{CATEGORY_LABELS[category as FinanceCategory]}</span>
                    <span className="font-medium">-{value.toFixed(0)}€</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución del ahorro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(allocationTotals).map(([category, value]) => (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span>{CATEGORY_LABELS[category as FinanceCategory]}</span>
                    <span className="font-medium">{value.toFixed(0)}€</span>
                  </div>
                  <Progress value={(value / Math.max(summary.savings, 1)) * 100} color="#7c3aed" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oportunidades de inversión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {investments.length === 0 ? (
                <p className="text-sm text-text-muted">No hay oportunidades registradas.</p>
              ) : (
                investments.map((investment) => (
                  <div key={investment.id} className="rounded-xl border border-bg-border bg-bg-elevated p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-text-primary">{investment.name}</p>
                      <Badge variant="default">{investment.amount}€</Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-1">{investment.notes}</p>
                    <p className="text-xs text-text-muted mt-1">Tipo: {investment.type}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meta activa</CardTitle>
            </CardHeader>
            <CardContent>
              {activeGoal ? (
                <>
                  <p className="text-sm text-text-secondary">{activeGoal.title}</p>
                  <p className="text-xs text-text-muted">{activeGoal.description}</p>
                  <Progress value={goalProgress} color="#00e5ff" showLabel />
                </>
              ) : (
                <p className="text-sm text-text-muted">Sin objetivo activo.</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
