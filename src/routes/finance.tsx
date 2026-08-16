import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import {
  PageHeader,
  Panel,
  Chip,
  GhostButton,
  PrimaryButton,
  statusTone,
  ClientOnly,
  ChartSkeleton,
  Delta,
} from "@/components/ui-kit";
import { DataTable, CardRow } from "@/components/data-table";
import { BarsChart, BreakdownDonut } from "@/components/charts";
import { invoices, cashflow, revenueBreakdown, currency } from "@/lib/mock-data";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance & Payments — Atlas Property OS" },
      { name: "description", content: "Cash flow, collections, invoices and payout health across the portfolio." },
      { property: "og:title", content: "Finance & Payments — Atlas Property OS" },
      { property: "og:description", content: "Invoices, collections and cash flow in one finance console." },
    ],
  }),
  component: FinancePage,
});

const tabs = ["All", "Paid", "Pending", "Overdue", "Refunded"] as const;

function FinancePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      invoices.filter(
        (i) =>
          (tab === "All" || i.status === tab) &&
          (i.id + i.customer).toLowerCase().includes(q.toLowerCase()),
      ),
    [tab, q],
  );

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="Money"
        title="Finance & Payments"
        description="Collections are at 97.3% with $61.2K in arrears across three accounts."
        actions={
          <>
            <GhostButton className="hidden border border-border sm:inline-flex">
              <Download className="h-3.5 w-3.5" /> Statement
            </GhostButton>
            <PrimaryButton>New invoice</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Cash in (MTD)", "$1.84M", 8.2],
          ["Cash out (MTD)", "$1.02M", -3.4],
          ["Net position", "$820K", 14.1],
          ["Arrears", "$61.2K", -22.6],
        ].map(([label, value, delta]) => (
          <div key={label as string} className="panel p-4">
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            <p className="num mt-1.5 text-xl font-semibold sm:text-2xl">{value}</p>
            <div className="mt-2">
              <Delta value={delta as number} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel title="Weekly cash flow" subtitle="Inflow vs. outflow, last 6 weeks">
          <ClientOnly fallback={<ChartSkeleton height={260} />}>
            <BarsChart
              data={cashflow as unknown as Record<string, string | number>[]}
              xKey="week"
              height={260}
              keys={[
                { key: "inflow", color: "var(--color-chart-1)", label: "Inflow" },
                { key: "outflow", color: "var(--color-chart-3)", label: "Outflow" },
              ]}
            />
          </ClientOnly>
        </Panel>
        <Panel title="Revenue mix" subtitle="Where cash is generated">
          <ClientOnly fallback={<ChartSkeleton height={200} />}>
            <BreakdownDonut data={revenueBreakdown} height={200} />
          </ClientOnly>
          <ul className="mt-4 space-y-2 text-sm">
            {revenueBreakdown.slice(0, 3).map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-muted-foreground">{r.name}</span>
                <span className="num shrink-0 font-medium">{currency(r.value, true)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search invoices…"
            className="focus-ring h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex min-w-0 items-center overflow-x-auto rounded-lg border border-border bg-card p-0.5 scrollbar-thin">
          {tabs.map((t) => (
            <GhostButton key={t} active={tab === t} onClick={() => setTab(t)} className="whitespace-nowrap">
              {t}
            </GhostButton>
          ))}
        </div>
      </div>

      <Panel bodyClassName="p-0">
        <DataTable
          rows={rows}
          columns={[
            { header: "Invoice", cell: (i) => <span className="num font-medium">{i.id}</span> },
            { header: "Customer", cell: (i) => i.customer },
            { header: "Issued", cell: (i) => <span className="num text-xs text-muted-foreground">{i.issued}</span> },
            { header: "Due", cell: (i) => <span className="num text-xs text-muted-foreground">{i.due}</span> },
            { header: "Method", cell: (i) => <Chip>{i.method}</Chip> },
            { header: "Status", cell: (i) => <Chip tone={statusTone(i.status)}>{i.status}</Chip> },
            {
              header: "Amount",
              align: "right",
              cell: (i) => <span className="num font-medium">{currency(i.amount)}</span>,
            },
          ]}
          mobileCard={(i) => (
            <CardRow
              title={i.id}
              subtitle={i.customer}
              right={<span className="num text-sm font-semibold">{currency(i.amount)}</span>}
              meta={
                <>
                  <Chip tone={statusTone(i.status)}>{i.status}</Chip>
                  <Chip>{i.method}</Chip>
                  <Chip>Due {i.due.slice(5)}</Chip>
                </>
              }
            />
          )}
        />
      </Panel>
    </main>
  );
}
