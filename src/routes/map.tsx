import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Layers, ZoomIn, ZoomOut } from "lucide-react";
import { PageHeader, Panel, Chip, GhostButton, statusTone } from "@/components/ui-kit";
import { properties, currency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Housing Map — Atlas Property OS" },
      { name: "description", content: "Interactive housing map with live unit status across every block and floor." },
      { property: "og:title", content: "Housing Map — Atlas Property OS" },
      { property: "og:description", content: "Explore blocks, floors and unit availability visually." },
    ],
  }),
  component: MapPage,
});

type CellStatus = "Occupied" | "Vacant" | "Reserved" | "Maintenance";
const pool: CellStatus[] = [
  "Occupied", "Occupied", "Occupied", "Vacant", "Occupied",
  "Reserved", "Occupied", "Maintenance", "Occupied", "Vacant",
];

const cellTone: Record<CellStatus, string> = {
  Occupied: "bg-primary/85 text-primary-foreground border-primary",
  Vacant: "bg-surface-2 text-muted-foreground border-border",
  Reserved: "bg-warning/25 text-warning border-warning/40",
  Maintenance: "bg-destructive/20 text-destructive border-destructive/35",
};

const floors = 10;
const perFloor = 12;

function MapPage() {
  const [property, setProperty] = useState(properties[0]!.id);
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<{ unit: string; status: CellStatus; floor: number } | null>(null);
  const active = properties.find((p) => p.id === property)!;

  const legend: CellStatus[] = ["Occupied", "Vacant", "Reserved", "Maintenance"];

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      <PageHeader
        eyebrow="Spatial view"
        title="Interactive housing map"
        description="Click any unit to inspect status, tenant and open work orders."
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-lg border border-border bg-card p-0.5 scrollbar-thin">
          {properties.slice(0, 6).map((p) => (
            <GhostButton
              key={p.id}
              active={property === p.id}
              onClick={() => {
                setProperty(p.id);
                setSelected(null);
              }}
              className="whitespace-nowrap"
            >
              {p.name}
            </GhostButton>
          ))}
        </div>
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
          <GhostButton onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </GhostButton>
          <span className="num px-1.5 text-[11px] text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <GhostButton onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </GhostButton>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel
          title={`${active.name} · block A`}
          subtitle={`${active.city} · ${floors} floors · ${floors * perFloor} mapped units`}
          actions={
            <div className="hidden flex-wrap items-center gap-2 sm:flex">
              {legend.map((l) => (
                <span key={l} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className={cn("h-2.5 w-2.5 rounded-[3px] border", cellTone[l])} />
                  {l}
                </span>
              ))}
            </div>
          }
          bodyClassName="p-3 sm:p-5"
        >
          <div className="overflow-x-auto scrollbar-thin">
            <div
              className="grid-paper min-w-[560px] space-y-1.5 rounded-lg p-3"
              style={{ zoom }}
            >
              {Array.from({ length: floors }).map((_, f) => {
                const floor = floors - f;
                return (
                  <div key={floor} className="flex items-center gap-2">
                    <span className="num w-8 shrink-0 text-right text-[10px] text-muted-foreground">
                      L{floor}
                    </span>
                    <div className="grid flex-1 grid-cols-12 gap-1.5">
                      {Array.from({ length: perFloor }).map((__, u) => {
                        const status = pool[(floor * 7 + u * 3) % pool.length]!;
                        const unit = `${floor}${String(u + 1).padStart(2, "0")}`;
                        const isSel = selected?.unit === unit;
                        return (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => setSelected({ unit, status, floor })}
                            className={cn(
                              "focus-ring h-8 rounded-[5px] border text-[9px] font-medium transition-all hover:scale-105",
                              cellTone[status],
                              isSel && "ring-2 ring-ring ring-offset-2 ring-offset-card",
                            )}
                            title={`Unit ${unit} · ${status}`}
                          >
                            {unit}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">
            {legend.map((l) => (
              <span key={l} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-[3px] border", cellTone[l])} />
                {l}
              </span>
            ))}
          </div>
        </Panel>

        <div className="space-y-4 sm:space-y-5">
          <Panel title="Selection">
            {selected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="num text-2xl font-semibold">Unit {selected.unit}</p>
                  <Chip tone={statusTone(selected.status)}>{selected.status}</Chip>
                </div>
                <dl className="space-y-2 text-sm">
                  {[
                    ["Property", active.name],
                    ["Floor", `Level ${selected.floor}`],
                    ["Type", selected.floor > 8 ? "Penthouse" : "2 Bedroom"],
                    ["Rent", `${currency(1450 + selected.floor * 180)}/mo`],
                    ["Open work orders", selected.status === "Maintenance" ? "1 critical" : "None"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="num truncate font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="py-8 text-center">
                <Building2 className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">No unit selected</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick a cell on the map to see its details.
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Block summary" subtitle="Live occupancy signals">
            <ul className="space-y-3 text-sm">
              {[
                ["Occupancy", `${active.occupancy}%`],
                ["Vacant ready", "9 units"],
                ["Reserved arrivals", "6 units"],
                ["Blocked for works", "3 units"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="num font-medium">{v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-xs text-muted-foreground">
              <Layers className="h-4 w-4 shrink-0" />
              Layers: status · rent band · maintenance history
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}
