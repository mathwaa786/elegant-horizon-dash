import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, LayoutGrid, Rows3, Star, MapPin, Download } from "lucide-react";
import { PageHeader, Panel, Chip, GhostButton, PrimaryButton, statusTone, EmptyState } from "@/components/ui-kit";
import { DataTable, CardRow } from "@/components/data-table";
import { properties, currency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Properties — Atlas Property OS" },
      { name: "description", content: "Every asset in the portfolio with occupancy, ADR and revenue contribution." },
      { property: "og:title", content: "Properties — Atlas Property OS" },
      { property: "og:description", content: "Portfolio-wide property performance and status." },
    ],
  }),
  component: PropertiesPage,
});

const filters = ["All", "Live", "Onboarding", "Paused"] as const;

function PropertiesPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      properties.filter(
        (p) =>
          (filter === "All" || p.status === filter) &&
          (p.name + p.city + p.country).toLowerCase().includes(q.toLowerCase()),
      ),
    [filter, q],
  );

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="Portfolio"
        title="Properties"
        description="9 assets across 9 cities · 1,386 units under management."
        actions={
          <>
            <GhostButton className="hidden sm:inline-flex">
              <Download className="h-3.5 w-3.5" /> Export
            </GhostButton>
            <PrimaryButton>Add property</PrimaryButton>
          </>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search properties, cities…"
            className="focus-ring h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center overflow-x-auto rounded-lg border border-border bg-card p-0.5 scrollbar-thin">
            {filters.map((f) => (
              <GhostButton key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </GhostButton>
            ))}
          </div>
          <div className="hidden items-center rounded-lg border border-border bg-card p-0.5 sm:flex">
            <GhostButton active={view === "grid"} onClick={() => setView("grid")}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </GhostButton>
            <GhostButton active={view === "table"} onClick={() => setView("table")}>
              <Rows3 className="h-3.5 w-3.5" />
            </GhostButton>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <Panel>
          <EmptyState
            title="No properties match"
            body="Try clearing the status filter or searching a different city."
            action={
              <GhostButton onClick={() => { setQ(""); setFilter("All"); }}>Clear filters</GhostButton>
            }
          />
        </Panel>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <article
              key={p.id}
              className="panel group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="grid-paper relative h-24 bg-surface-2">
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute right-3 top-3">
                  <Chip tone={statusTone(p.status)}>{p.status}</Chip>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-semibold">{p.name}</h2>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {p.city}, {p.country}
                    </p>
                  </div>
                  <span className="num inline-flex shrink-0 items-center gap-1 text-xs font-medium">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    {p.rating}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3.5">
                  {[
                    ["Units", String(p.units)],
                    ["ADR", `$${p.adr}`],
                    ["Revenue", currency(p.revenue, true)],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                      <dd className="num mt-0.5 text-sm font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={cn("h-full rounded-full", p.occupancy > 90 ? "bg-success" : "bg-primary")}
                      style={{ width: `${p.occupancy}%` }}
                    />
                  </div>
                  <span className="num text-[11px] text-muted-foreground">{p.occupancy}% occupied</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Panel bodyClassName="p-0">
          <DataTable
            rows={rows}
            columns={[
              {
                header: "Property",
                cell: (p) => (
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.city}, {p.country}</p>
                  </div>
                ),
              },
              { header: "Status", cell: (p) => <Chip tone={statusTone(p.status)}>{p.status}</Chip> },
              { header: "Units", cell: (p) => <span className="num">{p.units}</span> },
              { header: "Occupancy", cell: (p) => <span className="num">{p.occupancy}%</span> },
              { header: "ADR", cell: (p) => <span className="num">${p.adr}</span> },
              { header: "Rating", cell: (p) => <span className="num">{p.rating}</span> },
              {
                header: "Revenue",
                align: "right",
                cell: (p) => <span className="num font-medium">{currency(p.revenue)}</span>,
              },
            ]}
            mobileCard={(p) => (
              <CardRow
                title={p.name}
                subtitle={`${p.city} · ${p.units} units`}
                right={<span className="num text-sm font-semibold">{currency(p.revenue, true)}</span>}
                meta={
                  <>
                    <Chip tone={statusTone(p.status)}>{p.status}</Chip>
                    <Chip>{p.occupancy}% occupied</Chip>
                    <Chip>${p.adr} ADR</Chip>
                  </>
                }
              />
            )}
          />
        </Panel>
      )}
    </main>
  );
}
