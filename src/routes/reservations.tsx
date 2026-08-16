import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, List, Search } from "lucide-react";
import { PageHeader, Panel, Chip, GhostButton, PrimaryButton, statusTone, EmptyState } from "@/components/ui-kit";
import { DataTable, CardRow } from "@/components/data-table";
import { reservations, currency } from "@/lib/mock-data";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/lib/mock-data";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reservations & Calendar — Atlas Property OS" },
      { name: "description", content: "Arrivals, departures and in-house stays with a live occupancy calendar." },
      { property: "og:title", content: "Reservations & Calendar — Atlas Property OS" },
      { property: "og:description", content: "Manage bookings, arrivals and channel performance." },
    ],
  }),
  component: ReservationsPage,
});

const days = Array.from({ length: 14 }, (_, i) => 14 + i);
const statusFilters = ["All", "Confirmed", "In-house", "Pending", "Cancelled"] as const;

function ReservationsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("All");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<Reservation | null>(null);

  const rows = useMemo(
    () =>
      reservations.filter(
        (r) =>
          (filter === "All" || r.status === filter) &&
          (r.id + r.guest + r.property).toLowerCase().includes(q.toLowerCase()),
      ),
    [filter, q],
  );

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="Bookings"
        title="Reservations"
        description="184 arrivals this week · 38 today · 2 unassigned units."
        actions={<PrimaryButton>New reservation</PrimaryButton>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Arrivals today", "38", "34 ready"],
          ["Departures", "27", "2 late checkout"],
          ["In-house", "412", "96% verified"],
          ["Unassigned", "2", "needs action"],
        ].map(([label, value, hint]) => (
          <div key={label} className="panel p-4">
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            <p className="num mt-1.5 text-2xl font-semibold">{value}</p>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">{hint}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search guest, reservation ID…"
            className="focus-ring h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center overflow-x-auto rounded-lg border border-border bg-card p-0.5 scrollbar-thin">
            {statusFilters.map((f) => (
              <GhostButton key={f} active={filter === f} onClick={() => setFilter(f)} className="whitespace-nowrap">
                {f}
              </GhostButton>
            ))}
          </div>
          <div className="flex shrink-0 items-center rounded-lg border border-border bg-card p-0.5">
            <GhostButton active={view === "list"} onClick={() => setView("list")}>
              <List className="h-3.5 w-3.5" />
            </GhostButton>
            <GhostButton active={view === "calendar"} onClick={() => setView("calendar")}>
              <CalendarDays className="h-3.5 w-3.5" />
            </GhostButton>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <Panel bodyClassName="p-0">
          {rows.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No reservations" body="Nothing matches this filter for the selected period." />
            </div>
          ) : (
            <DataTable
              rows={rows}
              onRowClick={setDetail}
              columns={[
                {
                  header: "Guest",
                  cell: (r) => (
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-[11px] font-semibold">
                        {r.guest.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{r.guest}</p>
                        <p className="num text-xs text-muted-foreground">{r.id}</p>
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Stay",
                  cell: (r) => (
                    <div>
                      <p className="num text-xs">{r.checkIn} → {r.checkOut}</p>
                      <p className="text-xs text-muted-foreground">{r.nights} nights</p>
                    </div>
                  ),
                },
                {
                  header: "Property",
                  cell: (r) => (
                    <div>
                      <p className="truncate">{r.property}</p>
                      <p className="num text-xs text-muted-foreground">Unit {r.unit}</p>
                    </div>
                  ),
                },
                { header: "Channel", cell: (r) => <Chip>{r.channel}</Chip> },
                { header: "Status", cell: (r) => <Chip tone={statusTone(r.status)}>{r.status}</Chip> },
                {
                  header: "Total",
                  align: "right",
                  cell: (r) => <span className="num font-medium">{currency(r.total)}</span>,
                },
              ]}
              mobileCard={(r) => (
                <CardRow
                  title={r.guest}
                  subtitle={`${r.property} · Unit ${r.unit}`}
                  right={<span className="num text-sm font-semibold">{currency(r.total)}</span>}
                  meta={
                    <>
                      <Chip tone={statusTone(r.status)}>{r.status}</Chip>
                      <Chip>{r.nights}n</Chip>
                      <Chip>{r.channel}</Chip>
                    </>
                  }
                />
              )}
            />
          )}
        </Panel>
      ) : (
        <Panel title="Occupancy calendar" subtitle="14-day window · August 2026" bodyClassName="p-3 sm:p-5">
          <div className="overflow-x-auto scrollbar-thin">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[140px_repeat(14,minmax(0,1fr))] gap-1 pb-2">
                <span />
                {days.map((d) => (
                  <span key={d} className="num text-center text-[10px] text-muted-foreground">
                    {d}
                  </span>
                ))}
              </div>
              <div className="space-y-1">
                {reservations.slice(0, 8).map((r, idx) => {
                  const start = Number(r.checkIn.slice(-2)) - 14;
                  const span = Math.min(r.nights, 14 - Math.max(start, 0));
                  return (
                    <div key={r.id} className="grid grid-cols-[140px_repeat(14,minmax(0,1fr))] items-center gap-1">
                      <span className="truncate pr-2 text-xs text-muted-foreground">
                        {r.property.split(" ")[0]} · {r.unit}
                      </span>
                      {Array.from({ length: 14 }).map((_, d) => {
                        const inStay = d >= Math.max(start, 0) && d < Math.max(start, 0) + Math.max(span, 1);
                        const isStart = d === Math.max(start, 0);
                        return (
                          <div key={d} className="h-8 rounded-[4px] bg-surface-2/60">
                            {inStay ? (
                              <button
                                type="button"
                                onClick={() => setDetail(r)}
                                className={cn(
                                  "focus-ring h-full w-full text-[9px] font-medium transition-opacity hover:opacity-80",
                                  r.status === "Cancelled"
                                    ? "bg-destructive/25 text-destructive"
                                    : r.status === "Pending"
                                      ? "bg-warning/30 text-warning"
                                      : "bg-primary/85 text-primary-foreground",
                                  isStart ? "rounded-l-[4px]" : "",
                                  d === Math.max(start, 0) + Math.max(span, 1) - 1 ? "rounded-r-[4px]" : "",
                                )}
                              >
                                {isStart ? (idx + 1) : ""}
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Panel>
      )}

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent side="right" className="w-[min(94vw,26rem)] overflow-y-auto scrollbar-thin">
          {detail ? (
            <>
              <SheetHeader>
                <SheetTitle>{detail.guest}</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-8">
                <div className="flex items-center gap-2">
                  <Chip tone={statusTone(detail.status)}>{detail.status}</Chip>
                  <Chip>{detail.channel}</Chip>
                  <span className="num text-xs text-muted-foreground">{detail.id}</span>
                </div>
                <dl className="space-y-2.5 text-sm">
                  {[
                    ["Property", detail.property],
                    ["Unit", detail.unit],
                    ["Check-in", detail.checkIn],
                    ["Check-out", detail.checkOut],
                    ["Nights", String(detail.nights)],
                    ["Total", currency(detail.total)],
                    ["Nightly rate", currency(Math.round(detail.total / detail.nights))],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3 border-b border-border/60 pb-2.5">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="num truncate font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex gap-2">
                  <PrimaryButton className="flex-1 justify-center">Check in</PrimaryButton>
                  <GhostButton className="flex-1 justify-center border border-border">Modify</GhostButton>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </main>
  );
}
