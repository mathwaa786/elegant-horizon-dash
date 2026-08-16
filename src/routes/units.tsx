import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHeader, Panel, Chip, GhostButton, PrimaryButton, statusTone, EmptyState } from "@/components/ui-kit";
import { DataTable, CardRow } from "@/components/data-table";
import { units, currency } from "@/lib/mock-data";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export const Route = createFileRoute("/units")({
  head: () => ({
    meta: [
      { title: "Apartments & Units — Atlas Property OS" },
      { name: "description", content: "Unit-level inventory: availability, rent, tenants and maintenance holds." },
      { property: "og:title", content: "Apartments & Units — Atlas Property OS" },
      { property: "og:description", content: "Unit inventory across every property in the portfolio." },
    ],
  }),
  component: UnitsPage,
});

const statuses = ["All", "Occupied", "Vacant", "Reserved", "Maintenance"] as const;

function UnitsPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      units.filter(
        (u) =>
          (status === "All" || u.status === status) &&
          (u.id + u.property + u.type + (u.tenant ?? "")).toLowerCase().includes(q.toLowerCase()),
      ),
    [status, q],
  );

  const counts = statuses.slice(1).map((s) => ({
    label: s,
    value: units.filter((u) => u.status === s).length,
  }));

  const Filters = (
    <div className="flex flex-wrap items-center gap-1">
      {statuses.map((s) => (
        <GhostButton key={s} active={status === s} onClick={() => setStatus(s)}>
          {s}
        </GhostButton>
      ))}
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="Inventory"
        title="Apartments & Units"
        description={`${units.length} units shown from a live inventory of 1,386.`}
        actions={<PrimaryButton>Add unit</PrimaryButton>}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((c) => (
          <div key={c.label} className="panel p-4">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="num mt-1.5 text-2xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search unit, tenant, type…"
            className="focus-ring h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="hidden rounded-lg border border-border bg-card p-0.5 lg:block">{Filters}</div>
        <Drawer>
          <DrawerTrigger className="focus-ring inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium lg:hidden">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filter units</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8">{Filters}</div>
          </DrawerContent>
        </Drawer>
      </div>

      <Panel bodyClassName="p-0">
        {rows.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No units found" body="Adjust your filters or search for another unit number." />
          </div>
        ) : (
          <DataTable
            rows={rows}
            columns={[
              {
                header: "Unit",
                cell: (u) => (
                  <div>
                    <p className="num font-medium">{u.id}</p>
                    <p className="text-xs text-muted-foreground">{u.property}</p>
                  </div>
                ),
              },
              { header: "Type", cell: (u) => u.type },
              { header: "Floor", cell: (u) => <span className="num">{u.floor}</span> },
              { header: "Area", cell: (u) => <span className="num">{u.sqm} m²</span> },
              { header: "Tenant", cell: (u) => u.tenant ?? <span className="text-muted-foreground">—</span> },
              { header: "Status", cell: (u) => <Chip tone={statusTone(u.status)}>{u.status}</Chip> },
              {
                header: "Rent",
                align: "right",
                cell: (u) => <span className="num font-medium">{currency(u.rent)}/mo</span>,
              },
            ]}
            mobileCard={(u) => (
              <CardRow
                title={u.id}
                subtitle={`${u.property} · ${u.type}`}
                right={<span className="num text-sm font-semibold">{currency(u.rent)}</span>}
                meta={
                  <>
                    <Chip tone={statusTone(u.status)}>{u.status}</Chip>
                    <Chip>{u.sqm} m²</Chip>
                    <Chip>Floor {u.floor}</Chip>
                  </>
                }
              />
            )}
          />
        )}
      </Panel>
    </main>
  );
}
