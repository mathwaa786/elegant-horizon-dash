import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle2, Plus } from "lucide-react";
import { PageHeader, Panel, Chip, GhostButton, PrimaryButton, statusTone, EmptyState } from "@/components/ui-kit";
import { workOrders, type WorkOrder } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/operations")({
  head: () => ({
    meta: [
      { title: "Maintenance & Operations — Atlas Property OS" },
      { name: "description", content: "Work orders, SLA compliance and field team dispatch across the portfolio." },
      { property: "og:title", content: "Maintenance & Operations — Atlas Property OS" },
      { property: "og:description", content: "Track work orders and SLA performance in real time." },
    ],
  }),
  component: OperationsPage,
});

const columns: WorkOrder["status"][] = ["Open", "In progress", "Blocked", "Done"];

const priorityTone = (p: WorkOrder["priority"]) =>
  p === "Critical" ? "danger" : p === "High" ? "warning" : p === "Medium" ? "info" : "neutral";

function OperationsPage() {
  const [view, setView] = useState<"board" | "list">("board");

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="Field operations"
        title="Maintenance & Operations"
        description="14 open work orders · 1 critical breach · median resolution 6h 12m."
        actions={
          <>
            <div className="hidden items-center rounded-lg border border-border bg-card p-0.5 sm:flex">
              <GhostButton active={view === "board"} onClick={() => setView("board")}>Board</GhostButton>
              <GhostButton active={view === "list"} onClick={() => setView("list")}>List</GhostButton>
            </div>
            <PrimaryButton>
              <Plus className="h-3.5 w-3.5" /> Work order
            </PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [AlertTriangle, "Critical open", "1", "SLA 2h left"],
          [Clock, "Avg. response", "38m", "target 45m"],
          [CheckCircle2, "SLA compliance", "94.2%", "+1.8% MoM"],
          [CheckCircle2, "Closed this week", "63", "12 preventive"],
        ].map(([Icon, label, value, hint]) => {
          const I = Icon as typeof AlertTriangle;
          return (
            <div key={label as string} className="panel p-4">
              <I className="h-4 w-4 text-muted-foreground" />
              <p className="num mt-2.5 text-xl font-semibold sm:text-2xl">{value as string}</p>
              <p className="truncate text-xs text-muted-foreground">{label as string}</p>
              <p className="mt-1 truncate text-[11px] text-muted-foreground">{hint as string}</p>
            </div>
          );
        })}
      </div>

      {view === "board" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const items = workOrders.filter((w) => w.status === col);
            return (
              <section key={col} className="panel flex flex-col">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h2 className="text-sm font-semibold">{col}</h2>
                  <span className="num rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="flex-1 space-y-2.5 p-3">
                  {items.length === 0 ? (
                    <EmptyState title="Nothing here" body="No work orders in this column." />
                  ) : (
                    items.map((w) => (
                      <article
                        key={w.id}
                        className="cursor-pointer rounded-xl border border-border bg-surface p-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
                      >
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                          <p className="min-w-0 text-[13px] font-medium leading-snug">{w.title}</p>
                          <Chip tone={priorityTone(w.priority)}>{w.priority}</Chip>
                        </div>
                        <p className="mt-1.5 truncate text-xs text-muted-foreground">
                          {w.property} · {w.unit}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2.5">
                          <span className="truncate text-[11px] text-muted-foreground">{w.assignee}</span>
                          <span
                            className={cn(
                              "num shrink-0 text-[10px]",
                              w.sla.includes("Overdue") ? "text-destructive" : "text-muted-foreground",
                            )}
                          >
                            {w.sla}
                          </span>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <Panel bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {workOrders.map((w) => (
              <li key={w.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{w.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {w.id} · {w.property} · {w.unit} · {w.assignee}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Chip tone={priorityTone(w.priority)}>{w.priority}</Chip>
                  <Chip tone={statusTone(w.status)}>{w.status}</Chip>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </main>
  );
}
