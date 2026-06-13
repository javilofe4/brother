import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

// ── Card ──────────────────────────────────────────────────────
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] shadow-card transition-shadow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 pt-4 pb-2", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 pb-4", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// ── Progress ──────────────────────────────────────────────────
export interface ProgressProps {
  value: number; // 0-100
  color?: string;
  className?: string;
  thin?: boolean;
}
export function Progress({ value, color = "var(--accent)", className, thin }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]",
        thin ? "h-1" : "h-1.5",
        className
      )}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────
type BadgeVariant = "default" | "gold" | "emerald" | "rose" | "violet" | "muted";
const BADGE_STYLES: Record<BadgeVariant, string> = {
  default: "bg-[var(--accent-light)] text-[var(--accent)]",
  gold:    "bg-[var(--gold-light)] text-[var(--gold)]",
  emerald: "bg-[var(--emerald-light)] text-[var(--emerald)]",
  rose:    "bg-[var(--rose-light)] text-[var(--rose)]",
  violet:  "bg-[var(--violet-light)] text-[var(--violet)]",
  muted:   "bg-[var(--bg-elevated)] text-[var(--text-muted)]",
};
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}
export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        BADGE_STYLES[variant],
        className
      )}
      {...props}
    />
  );
}

// ── Button ────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";
const BTN_VARIANTS: Record<ButtonVariant, string> = {
  primary:   "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm",
  secondary: "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--bg-border)] hover:bg-[var(--bg-app)]",
  ghost:     "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
  danger:    "bg-[var(--rose-light)] text-[var(--rose)] hover:bg-[var(--rose)] hover:text-white",
};
const BTN_SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-sm gap-2",
};
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1",
        "active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed",
        BTN_VARIANTS[variant],
        BTN_SIZES[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

// ── Input ─────────────────────────────────────────────────────
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)]",
        "px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0 focus:border-[var(--accent)]",
        "transition-colors duration-150 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

// ── Label ─────────────────────────────────────────────────────
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-xs font-medium text-[var(--text-secondary)] mb-1.5", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

// ── Select ────────────────────────────────────────────────────
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)]",
        "px-3 py-2 text-sm text-[var(--text-primary)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
        "transition-colors duration-150 cursor-pointer disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Select.displayName = "Select";

// ── Textarea ──────────────────────────────────────────────────
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)]",
        "px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
        "transition-colors duration-150 resize-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// ── Tabs ──────────────────────────────────────────────────────
interface TabsContextValue { active: string; setActive: (v: string) => void; }
const TabsContext = React.createContext<TabsContextValue>({ active: "", setActive: () => {} });

export function Tabs({ defaultValue, value, onValueChange, children, className, ...props }:
  { defaultValue: string; value?: string; onValueChange?: (v: string) => void } & React.HTMLAttributes<HTMLDivElement>) {
  const [internal, setInternal] = React.useState(defaultValue);
  const active = value ?? internal;
  const setActive = onValueChange ?? setInternal;
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("", className)} {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex gap-1 rounded-xl bg-[var(--bg-elevated)] p-1 border border-[var(--bg-border)]", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ value, children, className, ...props }: { value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { active, setActive } = React.useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, ...props }: { value: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return <div className={cn("animate-fade-in", className)} {...props} />;
}
