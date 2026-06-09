import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

export function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

// ── Button ────────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-body font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-base disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-accent-cyan text-bg-base hover:brightness-110 focus:ring-accent-cyan shadow-glow",
        secondary:
          "bg-bg-card border border-bg-border text-text-primary hover:border-accent-cyan hover:text-accent-cyan",
        ghost:
          "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-card",
        danger:
          "bg-accent-rose text-white hover:brightness-110 focus:ring-accent-rose",
        violet:
          "bg-accent-violet text-white hover:brightness-110 focus:ring-accent-violet shadow-glow-violet",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

// ── Card ──────────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "violet" | "emerald" | "none";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = "none", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-bg-border bg-bg-card p-4 transition-all duration-200",
        glow === "cyan" && "hover:border-accent-cyan/50 hover:shadow-glow",
        glow === "violet" &&
          "hover:border-accent-violet/50 hover:shadow-glow-violet",
        glow === "emerald" &&
          "hover:border-accent-emerald/50 hover:shadow-glow-emerald",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-3", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-sm font-medium text-text-secondary uppercase tracking-wider", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ── Badge ─────────────────────────────────────────────────────────────────────

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-accent-cyan/15 text-accent-cyan",
        violet: "bg-accent-violet/15 text-accent-violet",
        emerald: "bg-accent-emerald/15 text-accent-emerald",
        amber: "bg-accent-amber/15 text-accent-amber",
        rose: "bg-accent-rose/15 text-accent-rose",
        muted: "bg-bg-border text-text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, className }))} {...props} />
);

// ── Progress ──────────────────────────────────────────────────────────────────

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  color?: string;
  showLabel?: boolean;
}

export const Progress = ({
  value,
  color = "#00e5ff",
  showLabel = false,
  className,
  ...props
}: ProgressProps) => {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-bg-border", className)} {...props}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
      {showLabel && (
        <span className="absolute right-0 top-3 text-xs text-text-secondary">
          {pct}%
        </span>
      )}
    </div>
  );
};

// ── Input ─────────────────────────────────────────────────────────────────────

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-bg-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted",
      "focus:outline-none focus:ring-1 focus:ring-accent-cyan focus:border-accent-cyan",
      "transition-colors duration-200",
      "disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

// ── Label ─────────────────────────────────────────────────────────────────────

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("block text-xs font-medium text-text-secondary uppercase tracking-wide mb-1.5", className)}
    {...props}
  />
));
Label.displayName = "Label";

// ── Select ────────────────────────────────────────────────────────────────────

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-bg-border bg-bg-elevated px-3 py-2 text-sm text-text-primary",
      "focus:outline-none focus:ring-1 focus:ring-accent-cyan focus:border-accent-cyan",
      "transition-colors duration-200 cursor-pointer",
      "disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

// ── Textarea ──────────────────────────────────────────────────────────────────

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-bg-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted",
      "focus:outline-none focus:ring-1 focus:ring-accent-cyan focus:border-accent-cyan",
      "transition-colors duration-200 resize-none",
      "disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// ── Tabs ──────────────────────────────────────────────────────────────────────

interface TabsContextValue {
  active: string;
  setActive: (v: string) => void;
}
const TabsContext = React.createContext<TabsContextValue>({
  active: "",
  setActive: () => {},
});

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
}

export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const active = value ?? internal;
  const setActive = onValueChange ?? setInternal;
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex gap-1 rounded-lg bg-bg-elevated border border-bg-border p-1",
      className
    )}
    {...props}
  />
);

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = ({ value, className, children, ...props }: TabsTriggerProps) => {
  const { active, setActive } = React.useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-accent-cyan text-bg-base shadow-sm"
          : "text-text-secondary hover:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = ({
  value,
  className,
  ...props
}: TabsContentProps) => {
  const { active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return <div className={cn("animate-fade-in", className)} {...props} />;
};
