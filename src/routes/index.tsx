import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Sparkles,
  Building2,
  Wallet,
  CalendarCheck,
  CircleDot,
} from "lucide-react";
import {
  PageHeader,
  Panel,
  StatCard,
  Chip,
  Delta,
  ClientOnly,
  ChartSkeleton,
  GhostButton,
  PrimaryButton,
  statusTone,
} from "@/components/ui-kit";
import { RevenueChart, BreakdownDonut, BarsChart } from "@/components/charts";
import {
  kpis,
  revenueSeries,
  revenueBreakdown,
  properties,
  activity,
  aiInsights,
  channelMix,
  currency,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Atlas Property OS" },
      {
        name: "description",
        content:
          "Revenue, occupancy, reservations and payment health across your entire property portfolio in one console.",
      },
      { property: "og:title", content: "Executive Dashboard — Atlas Property OS" },
      {
        property: "og:description",
        content: "Live portfolio performance: revenue, occupancy, reservations and payments.",
      },
    ],
  }),
  component: Dashboard,
});

const ranges = ["7D", "30D", "QTD", "YTD"] as const;

const toneDot: Record<string, string> = {
  revenue: "bg-chart-1",
  ops: "bg-warning",
  guest: "bg-chart-2",
  system: "bg-muted-foreground",
};

function Dashboard() {
  const [range, setRange] = useState<(typeof ranges)[number]>("YTD");
  const [activeKpi, setActiveKpi] = useState(0);
  const totalBreakdown = revenueBreakdown.reduce((s, r) => s + r.value, 0);

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="Monday, 17 August 2026"
        title="Good evening, Rajesh"
        description="Portfolio is pacing 12.4% ahead of plan. Two operational risks need your attention today."
        actions={
          <>
            <div className="hidden items-center rounded-lg border border-border bg-card p-0.5 sm:flex">
              {ranges.map((r) => (
                <GhostButton key={r} active={range === r} onClick={() => setRange(r)}>
                  {r}
                </GhostButton>
              ))}
            </div>
            <PrimaryButton>
              <Sparkles className="h-3.5 w-3.5" /> Ask Atlas
            </PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <StatCard
            key={k.label}
            {...k}
            active={activeKpi === i}
            onClick={() => setActiveKpi(i)}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <Panel
          title="Revenue & forecast"
          subtitle={`${range} · net of channel fees`}
          actions={
            <div className="hidden items-center gap-3 text-[11px] text-muted-foreground sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-chart-1" /> Actual
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-chart-3" /> Forecast
              </span>
            </div>
          }
        >
          <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Net revenue</p>
              <p className="num text-3xl font-semibold">$4.82M</p>
            </div>
            <div className="flex items-center gap-2 pb-1.5">
              <Delta value={12.4} />
              <span className="text-xs text-muted-foreground">vs. plan $4.29M</span>
            </div>
          </div>
          <ClientOnly fallback={<ChartSkeleton height={280} />}>
            <RevenueChart data={revenueSeries} />
          </ClientOnly>
        </Panel>

        <Panel
          title="Revenue breakdown"
          subtitle="Trailing twelve months"
          bodyClassName="p-4 sm:p-5"
        >
          <ClientOnly fallback={<ChartSkeleton height={200} />}>
            <BreakdownDonut data={revenueBreakdown} height={200} />
          </ClientOnly>
          <ul className="mt-4 space-y-2.5">
            {revenueBreakdown.map((r, i) => (
              <li key={r.name} className="flex items-center gap-2.5 text-sm">
                <span
                  className={cn("h-2 w-2 shrink-0 rounded-full", [
                    "bg-chart-1",
                    "bg-chart-2",
                    "bg-chart-3",
                    "bg-chart-4",
                    "bg-chart-5",
                  ][i])}
                />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{r.name}</span>
                <span className="num shrink-0 text-xs font-medium">
                  {((r.value / totalBreakdown) * 100).toFixed(0)}%
                </span>
                <span className="num w-16 shrink-0 text-right text-xs">
                  {currency(r.value, true)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel
          title="Property performance"
          subtitle="Top nine assets by contribution"
          actions={
            <Link to="/properties">
              <GhostButton>
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </GhostButton>
            </Link>
          }
          bodyClassName="p-0"
        >
          {/* Desktop table */}
          <table className="hidden w-full text-sm md:table">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">Property</th>
                <th className="px-3 py-2.5 font-medium">Units</th>
                <th className="px-3 py-2.5 font-medium">Occupancy</th>
                <th className="px-3 py-2.5 font-medium">ADR</th>
                <th className="px-5 py-2.5 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {properties.slice(0, 6).map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.city}, {p.country}
                    </p>
                  </td>
                  <td className="num px-3 py-3 text-muted-foreground">{p.units}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${p.occupancy}%` }}
                        />
                      </div>
                      <span className="num text-xs">{p.occupancy}%</span>
                    </div>
                  </td>
                  <td className="num px-3 py-3">${p.adr}</td>
                  <td className="num px-5 py-3 text-right font-medium">
                    {currency(p.revenue, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Mobile cards */}
          <div className="divide-y divide-border md:hidden">
            {properties.slice(0, 6).map((p) => (
              <div key={p.id} className="px-4 py-3.5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.city} · {p.units} units · ${p.adr} ADR
                    </p>
                  </div>
                  <span className="num shrink-0 text-sm font-semibold">
                    {currency(p.revenue, true)}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${p.occupancy}%` }} />
                  </div>
                  <span className="num text-[11px] text-muted-foreground">{p.occupancy}%</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Atlas insights" subtitle="Generated 8 minutes ago">
          <div className="space-y-3">
            {aiInsights.map((a) => (
              <article
                key={a.id}
                className="rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-primary/40"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <h3 className="min-w-0 text-[13px] font-semibold">{a.title}</h3>
                  <Chip tone="primary">{a.impact}</Chip>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.body}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${a.confidence}%` }} />
                  </div>
                  <span className="num text-[10px] text-muted-foreground">
                    {a.confidence}% confidence
                  </span>
                </div>
              </article>
            ))}
            <Link to="/ai" className="block">
              <GhostButton className="w-full justify-center">
                Open AI assistant <ArrowUpRight className="h-3.5 w-3.5" />
              </GhostButton>
            </Link>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Channel mix" subtitle="Bookings by acquisition source">
          <ClientOnly fallback={<ChartSkeleton height={240} />}>
            <BarsChart
              data={channelMix as unknown as Record<string, string | number>[]}
              xKey="channel"
              keys={[{ key: "revenue", color: "var(--color-chart-1)", label: "Revenue" }]}
            />
          </ClientOnly>
        </Panel>

        <Panel title="Recent activity" subtitle="Across the portfolio" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {activity.map((a) => (
              <li key={a.id} className="flex gap-3 px-4 py-3 sm:px-5">
                <span
                  className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", toneDot[a.tone])}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug">
                    <span className="font-medium">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{a.target}</p>
                </div>
                <span className="num shrink-0 text-[10px] text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Today at a glance" subtitle="Operational readiness" className="lg:col-span-2 xl:col-span-1">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarCheck, label: "Arrivals", value: "38", tone: "Ready 34" },
              { icon: Building2, label: "Departures", value: "27", tone: "Late 2" },
              { icon: Wallet, label: "Collections", value: "$182K", tone: "3 overdue" },
              { icon: CircleDot, label: "Open work orders", value: "14", tone: "1 critical" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-3.5">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <p className="num mt-2.5 text-xl font-semibold">{s.value}</p>
                <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                <Chip className="mt-2" tone={statusTone("pending")}>
                  {s.tone}
                </Chip>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}
