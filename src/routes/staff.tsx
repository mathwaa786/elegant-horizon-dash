import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Chip, GhostButton, PrimaryButton, statusTone } from "@/components/ui-kit";
import { DataTable, CardRow } from "@/components/data-table";
import { staff, workOrders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff & Tasks — Atlas Property OS" },
      { name: "description", content: "Team rosters, shift coverage and task workload across every property." },
      { property: "og:title", content: "Staff & Tasks — Atlas Property OS" },
      { property: "og:description", content: "Shift coverage and workload balance for your field teams." },
    ],
  }),
  component: StaffPage,
});

function StaffPage() {
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="People"
        title="Staff & Tasks"
        description="18 team members on shift today across 9 properties."
        actions={<PrimaryButton>Invite teammate</PrimaryButton>}
      />

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel title="Roster" subtitle="Today's coverage" bodyClassName="p-0">
          <DataTable
            rows={staff}
            columns={[
              {
                header: "Member",
                cell: (s) => (
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-[11px] font-semibold">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.role}</p>
                    </div>
                  </div>
                ),
              },
              { header: "Property", cell: (s) => <span className="truncate">{s.property}</span> },
              { header: "Shift", cell: (s) => <span className="num text-xs">{s.shift}</span> },
              {
                header: "Load",
                cell: (s) => (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={cn("h-full rounded-full", s.load > 85 ? "bg-destructive" : s.load > 60 ? "bg-warning" : "bg-success")}
                        style={{ width: `${s.load}%` }}
                      />
                    </div>
                    <span className="num text-xs">{s.load}%</span>
                  </div>
                ),
              },
              { header: "Status", align: "right", cell: (s) => <Chip tone={statusTone(s.status)}>{s.status}</Chip> },
            ]}
            mobileCard={(s) => (
              <CardRow
                title={s.name}
                subtitle={`${s.role} · ${s.property}`}
                right={<Chip tone={statusTone(s.status)}>{s.status}</Chip>}
                meta={
                  <>
                    <Chip>{s.shift}</Chip>
                    <Chip>Load {s.load}%</Chip>
                  </>
                }
              />
            )}
          />
        </Panel>

        <Panel title="Task queue" subtitle="Unassigned & due today">
          <ul className="space-y-2.5">
            {workOrders.slice(0, 5).map((w) => (
              <li key={w.id} className="rounded-xl border border-border bg-surface p-3.5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="min-w-0 text-[13px] font-medium">{w.title}</p>
                  <Chip tone={w.priority === "Critical" ? "danger" : "neutral"}>{w.priority}</Chip>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {w.property} · {w.unit}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{w.assignee}</span>
                  <GhostButton className="border border-border">Assign</GhostButton>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </main>
  );
}
