import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";

const axis = {
  stroke: "var(--color-border)",
  tick: { fill: "var(--color-muted-foreground)", fontSize: 11 },
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    fontSize: 12,
    boxShadow: "var(--shadow-lift-value)",
    color: "var(--color-popover-foreground)",
  },
  labelStyle: { color: "var(--color-muted-foreground)", fontSize: 11, marginBottom: 4 },
  cursor: { stroke: "var(--color-border-strong)", strokeWidth: 1 },
};

export function RevenueChart({
  data,
  height = 280,
}: {
  data: { month: string; revenue: number; forecast: number; occupancy: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
        <XAxis dataKey="month" {...axis} />
        <YAxis
          {...axis}
          tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          width={48}
        />
        <Tooltip
          {...tooltipStyle}
          formatter={(v: number, name: string) =>
            name === "occupancy" ? [`${v}%`, "Occupancy"] : [`$${v.toLocaleString()}`, name === "revenue" ? "Revenue" : "Forecast"]
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          fill="url(#revFill)"
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="var(--color-chart-3)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function OccupancyChart({
  data,
  height = 220,
}: {
  data: { month: string; occupancy: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="occFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} domain={[60, 100]} width={40} tickFormatter={(v: number) => `${v}%`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, "Occupancy"]} />
        <Area
          type="monotone"
          dataKey="occupancy"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          fill="url(#occFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const donutColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function BreakdownDonut({
  data,
  height = 220,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip {...tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="94%"
          paddingAngle={2}
          stroke="var(--color-card)"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={donutColors[i % donutColors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BarsChart({
  data,
  xKey,
  keys,
  height = 240,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  keys: { key: string; color: string; label: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} width={48} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-surface-2)" }} />
        {keys.map((k) => (
          <Bar key={k.key} dataKey={k.key} name={k.label} fill={k.color} radius={[6, 6, 0, 0]} maxBarSize={34} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ data, color = "var(--color-chart-1)" }: { data: number[]; color?: string }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={color} fillOpacity={0.12} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
