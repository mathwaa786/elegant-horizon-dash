import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Mail, Phone, Filter } from "lucide-react";
import { PageHeader, Panel, Chip, GhostButton, PrimaryButton, EmptyState } from "@/components/ui-kit";
import { DataTable, CardRow } from "@/components/data-table";
import { customers, currency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers & CRM — Atlas Property OS" },
      { name: "description", content: "Accounts, residents and partners with lifetime value and health scoring." },
      { property: "og:title", content: "Customers & CRM — Atlas Property OS" },
      { property: "og:description", content: "Relationship health, lifetime value and account ownership." },
    ],
  }),
  component: CustomersPage,
});

const segments = ["All", "Enterprise", "Resident", "Traveller", "Partner"] as const;

function healthTone(h: number) {
  if (h >= 85) return "bg-success";
  if (h >= 70) return "bg-warning";
  return "bg-destructive";
}

function CustomersPage() {
  const [segment, setSegment] = useState<(typeof segments)[number]>("All");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      customers.filter(
        (c) =>
          (segment === "All" || c.segment === segment) &&
          (c.name + c.email + c.owner).toLowerCase().includes(q.toLowerCase()),
      ),
    [segment, q],
  );

  const totalLtv = customers.reduce((s, c) => s + c.lifetime, 0);

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="Relationships"
        title="Customers"
        description="Corporate accounts, long-term residents and travel partners in one book of business."
        actions={<PrimaryButton>Add customer</PrimaryButton>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total lifetime value", currency(totalLtv, true)],
          ["Active accounts", String(customers.length)],
          ["Avg. health score", "83"],
          ["At risk", "2 accounts"],
        ].map(([label, value]) => (
          <div key={label} className="panel p-4">
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            <p className="num mt-1.5 text-xl font-semibold sm:text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search accounts, owners, emails…"
            className="focus-ring h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex min-w-0 items-center overflow-x-auto rounded-lg border border-border bg-card p-0.5 scrollbar-thin">
          <Filter className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {segments.map((s) => (
            <GhostButton key={s} active={segment === s} onClick={() => setSegment(s)} className="whitespace-nowrap">
              {s}
            </GhostButton>
          ))}
        </div>
      </div>

      <Panel bodyClassName="p-0">
        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No accounts found" body="Try a different segment or search term." />
          </div>
        ) : (
          <DataTable
            rows={rows}
            columns={[
              {
                header: "Account",
                cell: (c) => (
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-[11px] font-semibold">
                      {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                ),
              },
              { header: "Segment", cell: (c) => <Chip tone="info">{c.segment}</Chip> },
              { header: "Stays", cell: (c) => <span className="num">{c.stays}</span> },
              { header: "Since", cell: (c) => <span className="num text-muted-foreground">{c.since}</span> },
              { header: "Owner", cell: (c) => c.owner },
              {
                header: "Health",
                cell: (c) => (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-surface-2">
                      <div className={cn("h-full rounded-full", healthTone(c.health))} style={{ width: `${c.health}%` }} />
                    </div>
                    <span className="num text-xs">{c.health}</span>
                  </div>
                ),
              },
              {
                header: "Lifetime",
                align: "right",
                cell: (c) => <span className="num font-medium">{currency(c.lifetime)}</span>,
              },
            ]}
            mobileCard={(c) => (
              <CardRow
                title={c.name}
                subtitle={c.email}
                right={<span className="num text-sm font-semibold">{currency(c.lifetime, true)}</span>}
                meta={
                  <>
                    <Chip tone="info">{c.segment}</Chip>
                    <Chip>{c.stays} stays</Chip>
                    <Chip>Health {c.health}</Chip>
                  </>
                }
              />
            )}
          />
        )}
      </Panel>

      <Panel title="Follow-ups this week" subtitle="Assigned to your team">
        <ul className="space-y-3">
          {[
            ["Helios Travel Group", "Renewal call · booking volume down 31%", "Tue 10:00"],
            ["Atlas Aviation", "Quarterly business review", "Wed 14:30"],
            ["Beacon Health", "Contract expansion — 40 units", "Thu 09:15"],
          ].map(([name, note, when]) => (
            <li key={name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface p-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{note}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="num hidden text-xs text-muted-foreground sm:block">{when}</span>
                <GhostButton className="border border-border">
                  <Mail className="h-3.5 w-3.5" />
                </GhostButton>
                <GhostButton className="border border-border">
                  <Phone className="h-3.5 w-3.5" />
                </GhostButton>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </main>
  );
}
