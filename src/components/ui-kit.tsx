import { useEffect, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Inbox, TriangleAlert, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 truncate text-2xl font-semibold sm:text-[28px]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel overflow-hidden", className)}>
      {(title || actions) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            {title ? <h2 className="truncate text-sm font-semibold">{title}</h2> : null}
            {subtitle ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
        </div>
      )}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
        up ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive",
      )}
    >
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  active,
  onClick,
}: {
  label: string;
  value: string;
  delta: number;
  hint: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring group relative overflow-hidden rounded-xl border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        active ? "border-primary/60 shadow-card" : "border-border shadow-card",
      )}
    >
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-px transition-opacity",
          active ? "bg-primary opacity-100" : "bg-primary opacity-0 group-hover:opacity-60",
        )}
      />
      <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
      <p className="num mt-2 text-2xl font-semibold">{value}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <Delta value={delta} />
        <span className="truncate text-[11px] text-muted-foreground">{hint}</span>
      </div>
    </button>
  );
}

const chipTones = {
  neutral: "bg-surface-2 text-muted-foreground border-border",
  success: "bg-success/12 text-success border-success/20",
  warning: "bg-warning/15 text-warning border-warning/25",
  danger: "bg-destructive/12 text-destructive border-destructive/20",
  info: "bg-info/12 text-info border-info/20",
  primary: "bg-primary/12 text-primary border-primary/20",
} as const;

export type ChipTone = keyof typeof chipTones;

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        chipTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const statusTone = (status: string): ChipTone => {
  const s = status.toLowerCase();
  if (["live", "paid", "confirmed", "done", "occupied", "published", "on shift"].includes(s))
    return "success";
  if (["pending", "onboarding", "reserved", "in progress", "scheduled", "break"].includes(s))
    return "warning";
  if (["overdue", "blocked", "cancelled", "critical", "maintenance"].includes(s)) return "danger";
  if (["in-house", "open", "draft", "high"].includes(s)) return "info";
  return "neutral";
};

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-muted-foreground">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/25 bg-destructive/5 px-6 py-10 text-center">
      <TriangleAlert className="h-5 w-5 text-destructive" />
      <p className="mt-3 text-sm font-semibold">We couldn't load this panel</p>
      <p className="mt-1 text-xs text-muted-foreground">
        The data service timed out. Nothing was lost — try again.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-surface-2"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      ) : null}
    </div>
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-surface-2" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Defers children to after hydration — used for charts and to show skeletons. */
export function ClientOnly({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);
  return <>{ready ? children : fallback}</>;
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="animate-pulse rounded-lg bg-surface-2/70" style={{ height }} />
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-card">
      {children}
    </div>
  );
}

export function GhostButton({
  children,
  onClick,
  active,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SectionGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:gap-5", className)}>{children}</div>;
}
