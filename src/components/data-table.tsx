import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  className?: string;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  mobileCard,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  mobileCard: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}) {
  return (
    <>
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => (
                <th
                  key={c.header}
                  className={cn(
                    "px-3 py-2.5 font-medium first:pl-5 last:pr-5",
                    c.align === "right" && "text-right",
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.header}
                    className={cn(
                      "px-3 py-3 first:pl-5 last:pr-5",
                      c.align === "right" && "text-right",
                      c.className,
                    )}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-border md:hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            onClick={() => onRowClick?.(row)}
            className={cn("px-4 py-3.5", onRowClick && "cursor-pointer active:bg-surface-2")}
          >
            {mobileCard(row)}
          </div>
        ))}
      </div>
    </>
  );
}

export function CardRow({
  title,
  subtitle,
  right,
  meta,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div className="shrink-0 text-right">{right}</div>
      </div>
      {meta ? <div className="mt-2.5 flex flex-wrap items-center gap-2">{meta}</div> : null}
    </>
  );
}
