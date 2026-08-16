export const currency = (n: number, compact = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(n);

export const pct = (n: number) => `${n.toFixed(1)}%`;

export type Trend = { label: string; value: string; delta: number; hint: string };

export const kpis: Trend[] = [
  { label: "Net revenue", value: "$4.82M", delta: 12.4, hint: "vs. $4.29M last quarter" },
  { label: "Occupancy", value: "92.6%", delta: 3.1, hint: "1,284 of 1,386 units" },
  { label: "Reservations", value: "1,942", delta: -2.2, hint: "184 arriving this week" },
  { label: "Units live", value: "1,386", delta: 5.8, hint: "42 onboarded in August" },
  { label: "Payments cleared", value: "97.3%", delta: 1.4, hint: "$61.2K in arrears" },
];

export const revenueSeries = [
  { month: "Jan", revenue: 328000, forecast: 315000, occupancy: 84 },
  { month: "Feb", revenue: 341000, forecast: 330000, occupancy: 86 },
  { month: "Mar", revenue: 389000, forecast: 362000, occupancy: 88 },
  { month: "Apr", revenue: 402000, forecast: 395000, occupancy: 89 },
  { month: "May", revenue: 437000, forecast: 421000, occupancy: 91 },
  { month: "Jun", revenue: 468000, forecast: 449000, occupancy: 93 },
  { month: "Jul", revenue: 512000, forecast: 480000, occupancy: 95 },
  { month: "Aug", revenue: 498000, forecast: 501000, occupancy: 92 },
  { month: "Sep", revenue: 465000, forecast: 470000, occupancy: 90 },
  { month: "Oct", revenue: 441000, forecast: 452000, occupancy: 89 },
  { month: "Nov", revenue: 470000, forecast: 461000, occupancy: 91 },
  { month: "Dec", revenue: 529000, forecast: 498000, occupancy: 94 },
];

export const revenueBreakdown = [
  { name: "Long-term leases", value: 2380000, tone: "chart-1" },
  { name: "Short stays", value: 1240000, tone: "chart-2" },
  { name: "Parking & storage", value: 486000, tone: "chart-3" },
  { name: "Services & add-ons", value: 412000, tone: "chart-4" },
  { name: "Events", value: 302000, tone: "chart-5" },
];

export const channelMix = [
  { channel: "Direct", bookings: 812, revenue: 1_940_000 },
  { channel: "Corporate", bookings: 431, revenue: 1_120_000 },
  { channel: "Airbnb", bookings: 356, revenue: 742_000 },
  { channel: "Booking.com", bookings: 218, revenue: 512_000 },
  { channel: "Agents", bookings: 125, revenue: 506_000 },
];

export type Property = {
  id: string;
  name: string;
  city: string;
  country: string;
  units: number;
  occupancy: number;
  revenue: number;
  adr: number;
  status: "Live" | "Onboarding" | "Paused";
  rating: number;
};

export const properties: Property[] = [
  { id: "ATL-01", name: "Marina Heights", city: "Dubai", country: "UAE", units: 248, occupancy: 96, revenue: 1_240_000, adr: 312, status: "Live", rating: 4.9 },
  { id: "ATL-02", name: "The Lantern Residences", city: "Lisbon", country: "Portugal", units: 164, occupancy: 91, revenue: 812_000, adr: 214, status: "Live", rating: 4.8 },
  { id: "ATL-03", name: "Copperfield Lofts", city: "Austin", country: "USA", units: 132, occupancy: 88, revenue: 690_000, adr: 189, status: "Live", rating: 4.6 },
  { id: "ATL-04", name: "Harbour Nine", city: "Singapore", country: "Singapore", units: 210, occupancy: 94, revenue: 1_105_000, adr: 341, status: "Live", rating: 4.9 },
  { id: "ATL-05", name: "Nordveien Suites", city: "Oslo", country: "Norway", units: 96, occupancy: 79, revenue: 402_000, adr: 226, status: "Onboarding", rating: 4.4 },
  { id: "ATL-06", name: "Casa Verde", city: "Barcelona", country: "Spain", units: 118, occupancy: 90, revenue: 548_000, adr: 197, status: "Live", rating: 4.7 },
  { id: "ATL-07", name: "Kensington Row", city: "London", country: "UK", units: 154, occupancy: 93, revenue: 962_000, adr: 288, status: "Live", rating: 4.8 },
  { id: "ATL-08", name: "Sakura Court", city: "Tokyo", country: "Japan", units: 142, occupancy: 85, revenue: 604_000, adr: 178, status: "Paused", rating: 4.5 },
  { id: "ATL-09", name: "Grand Meridian", city: "Toronto", country: "Canada", units: 122, occupancy: 87, revenue: 512_000, adr: 165, status: "Live", rating: 4.6 },
];

export type Unit = {
  id: string;
  property: string;
  floor: number;
  type: string;
  beds: number;
  sqm: number;
  rent: number;
  status: "Occupied" | "Vacant" | "Reserved" | "Maintenance";
  tenant?: string;
};

const unitTypes = ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"];
const tenantNames = [
  "Amara Osei", "Lucas Ferreira", "Yuki Tanaka", "Nadia Haddad", "Ethan Brooks",
  "Sofia Rossi", "Omar Farouk", "Ingrid Sørensen", "Priya Nair", "Daniel Kim",
];

export const units: Unit[] = Array.from({ length: 64 }, (_, i) => {
  const statusPool: Unit["status"][] = [
    "Occupied", "Occupied", "Occupied", "Occupied", "Occupied",
    "Vacant", "Reserved", "Maintenance",
  ];
  const status = statusPool[i % statusPool.length]!;
  const property = properties[i % properties.length]!;
  const unit: Unit = {
    id: `${property.id}-${String(101 + i)}`,
    property: property.name,
    floor: (i % 12) + 1,
    type: unitTypes[i % unitTypes.length]!,
    beds: (i % 4) + 1,
    sqm: 42 + (i % 9) * 14,
    rent: 1450 + (i % 11) * 240,
    status,
  };
  if (status === "Occupied") unit.tenant = tenantNames[i % tenantNames.length]!;
  return unit;
});

export type Reservation = {
  id: string;
  guest: string;
  property: string;
  unit: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  channel: string;
  status: "Confirmed" | "In-house" | "Pending" | "Cancelled" | "Checked-out";
};

export const reservations: Reservation[] = [
  { id: "RSV-90412", guest: "Amara Osei", property: "Marina Heights", unit: "1204", checkIn: "2026-08-17", checkOut: "2026-08-24", nights: 7, total: 2184, channel: "Direct", status: "In-house" },
  { id: "RSV-90413", guest: "Lucas Ferreira", property: "The Lantern Residences", unit: "0308", checkIn: "2026-08-18", checkOut: "2026-08-21", nights: 3, total: 642, channel: "Airbnb", status: "Confirmed" },
  { id: "RSV-90414", guest: "Yuki Tanaka", property: "Harbour Nine", unit: "2211", checkIn: "2026-08-19", checkOut: "2026-09-02", nights: 14, total: 4774, channel: "Corporate", status: "Confirmed" },
  { id: "RSV-90415", guest: "Nadia Haddad", property: "Kensington Row", unit: "0705", checkIn: "2026-08-16", checkOut: "2026-08-20", nights: 4, total: 1152, channel: "Booking.com", status: "In-house" },
  { id: "RSV-90416", guest: "Ethan Brooks", property: "Copperfield Lofts", unit: "0402", checkIn: "2026-08-22", checkOut: "2026-08-29", nights: 7, total: 1323, channel: "Direct", status: "Pending" },
  { id: "RSV-90417", guest: "Sofia Rossi", property: "Casa Verde", unit: "0110", checkIn: "2026-08-14", checkOut: "2026-08-17", nights: 3, total: 591, channel: "Agents", status: "Checked-out" },
  { id: "RSV-90418", guest: "Omar Farouk", property: "Marina Heights", unit: "0908", checkIn: "2026-08-25", checkOut: "2026-09-05", nights: 11, total: 3432, channel: "Corporate", status: "Confirmed" },
  { id: "RSV-90419", guest: "Ingrid Sørensen", property: "Nordveien Suites", unit: "0503", checkIn: "2026-08-20", checkOut: "2026-08-23", nights: 3, total: 678, channel: "Direct", status: "Cancelled" },
  { id: "RSV-90420", guest: "Priya Nair", property: "Grand Meridian", unit: "1102", checkIn: "2026-08-21", checkOut: "2026-08-28", nights: 7, total: 1155, channel: "Airbnb", status: "Confirmed" },
  { id: "RSV-90421", guest: "Daniel Kim", property: "Sakura Court", unit: "0604", checkIn: "2026-08-18", checkOut: "2026-08-26", nights: 8, total: 1424, channel: "Direct", status: "In-house" },
];

export type Customer = {
  id: string;
  name: string;
  email: string;
  segment: "Enterprise" | "Resident" | "Traveller" | "Partner";
  lifetime: number;
  stays: number;
  since: string;
  health: number;
  owner: string;
};

export const customers: Customer[] = [
  { id: "CUS-1041", name: "Northwind Capital", email: "stays@northwind.co", segment: "Enterprise", lifetime: 412_000, stays: 186, since: "2021", health: 94, owner: "R. Mensah" },
  { id: "CUS-1042", name: "Amara Osei", email: "amara.osei@mail.com", segment: "Resident", lifetime: 68_400, stays: 24, since: "2022", health: 88, owner: "L. Vogt" },
  { id: "CUS-1043", name: "Helios Travel Group", email: "ops@heliostravel.com", segment: "Partner", lifetime: 298_000, stays: 142, since: "2020", health: 71, owner: "R. Mensah" },
  { id: "CUS-1044", name: "Yuki Tanaka", email: "y.tanaka@zephyr.jp", segment: "Traveller", lifetime: 21_800, stays: 12, since: "2023", health: 82, owner: "M. Ortiz" },
  { id: "CUS-1045", name: "Beacon Health", email: "housing@beaconhealth.io", segment: "Enterprise", lifetime: 376_500, stays: 164, since: "2019", health: 96, owner: "L. Vogt" },
  { id: "CUS-1046", name: "Sofia Rossi", email: "sofia.rossi@mail.it", segment: "Traveller", lifetime: 9_400, stays: 6, since: "2024", health: 64, owner: "M. Ortiz" },
  { id: "CUS-1047", name: "Atlas Aviation", email: "crew@atlasair.com", segment: "Enterprise", lifetime: 512_000, stays: 302, since: "2018", health: 91, owner: "R. Mensah" },
  { id: "CUS-1048", name: "Omar Farouk", email: "omar.f@levant.ae", segment: "Resident", lifetime: 44_200, stays: 18, since: "2022", health: 79, owner: "L. Vogt" },
];

export type Invoice = {
  id: string;
  customer: string;
  issued: string;
  due: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending" | "Overdue" | "Refunded";
};

export const invoices: Invoice[] = [
  { id: "INV-20841", customer: "Northwind Capital", issued: "2026-08-01", due: "2026-08-15", amount: 48_200, method: "Wire", status: "Paid" },
  { id: "INV-20842", customer: "Helios Travel Group", issued: "2026-08-02", due: "2026-08-16", amount: 22_640, method: "Card", status: "Overdue" },
  { id: "INV-20843", customer: "Beacon Health", issued: "2026-08-04", due: "2026-08-18", amount: 61_900, method: "ACH", status: "Paid" },
  { id: "INV-20844", customer: "Atlas Aviation", issued: "2026-08-06", due: "2026-08-20", amount: 94_150, method: "Wire", status: "Pending" },
  { id: "INV-20845", customer: "Amara Osei", issued: "2026-08-08", due: "2026-08-22", amount: 3_120, method: "Card", status: "Paid" },
  { id: "INV-20846", customer: "Omar Farouk", issued: "2026-08-09", due: "2026-08-23", amount: 2_480, method: "Card", status: "Refunded" },
  { id: "INV-20847", customer: "Sofia Rossi", issued: "2026-08-11", due: "2026-08-25", amount: 1_940, method: "Card", status: "Pending" },
  { id: "INV-20848", customer: "Yuki Tanaka", issued: "2026-08-12", due: "2026-08-26", amount: 4_774, method: "Apple Pay", status: "Paid" },
];

export const cashflow = [
  { week: "W28", inflow: 412000, outflow: 268000 },
  { week: "W29", inflow: 438000, outflow: 279000 },
  { week: "W30", inflow: 396000, outflow: 301000 },
  { week: "W31", inflow: 465000, outflow: 288000 },
  { week: "W32", inflow: 502000, outflow: 312000 },
  { week: "W33", inflow: 478000, outflow: 294000 },
];

export type WorkOrder = {
  id: string;
  title: string;
  property: string;
  unit: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In progress" | "Blocked" | "Done";
  assignee: string;
  sla: string;
};

export const workOrders: WorkOrder[] = [
  { id: "WO-4412", title: "HVAC compressor fault", property: "Marina Heights", unit: "1204", priority: "Critical", status: "In progress", assignee: "T. Alvarez", sla: "2h left" },
  { id: "WO-4413", title: "Leak under kitchen sink", property: "Copperfield Lofts", unit: "0402", priority: "High", status: "Open", assignee: "Unassigned", sla: "6h left" },
  { id: "WO-4414", title: "Lobby lighting replacement", property: "Kensington Row", unit: "Common", priority: "Medium", status: "In progress", assignee: "J. Okafor", sla: "1d left" },
  { id: "WO-4415", title: "Elevator inspection", property: "Harbour Nine", unit: "Common", priority: "High", status: "Blocked", assignee: "S. Petrova", sla: "Overdue 4h" },
  { id: "WO-4416", title: "Deep clean before arrival", property: "Casa Verde", unit: "0110", priority: "Medium", status: "Done", assignee: "M. Dias", sla: "Completed" },
  { id: "WO-4417", title: "Smart lock firmware update", property: "The Lantern Residences", unit: "0308", priority: "Low", status: "Open", assignee: "R. Silva", sla: "3d left" },
];

export type Staff = {
  id: string;
  name: string;
  role: string;
  property: string;
  shift: string;
  load: number;
  status: "On shift" | "Off" | "Break";
};

export const staff: Staff[] = [
  { id: "STF-01", name: "Tomas Alvarez", role: "Lead technician", property: "Marina Heights", shift: "07:00 – 15:00", load: 82, status: "On shift" },
  { id: "STF-02", name: "Jenna Okafor", role: "Facilities", property: "Kensington Row", shift: "09:00 – 17:00", load: 64, status: "On shift" },
  { id: "STF-03", name: "Svetlana Petrova", role: "Operations manager", property: "Harbour Nine", shift: "08:00 – 18:00", load: 91, status: "Break" },
  { id: "STF-04", name: "Miguel Dias", role: "Housekeeping lead", property: "Casa Verde", shift: "06:00 – 14:00", load: 48, status: "Off" },
  { id: "STF-05", name: "Rafael Silva", role: "Smart systems", property: "The Lantern Residences", shift: "10:00 – 18:00", load: 37, status: "On shift" },
  { id: "STF-06", name: "Lena Vogt", role: "Guest experience", property: "Grand Meridian", shift: "12:00 – 20:00", load: 72, status: "On shift" },
];

export type Activity = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  tone: "revenue" | "ops" | "guest" | "system";
};

export const activity: Activity[] = [
  { id: "a1", actor: "Atlas Aviation", action: "signed a 12-month corporate block", target: "Harbour Nine · 24 units", time: "6m ago", tone: "revenue" },
  { id: "a2", actor: "T. Alvarez", action: "escalated work order", target: "WO-4412 HVAC compressor", time: "18m ago", tone: "ops" },
  { id: "a3", actor: "Amara Osei", action: "checked in early", target: "Marina Heights · 1204", time: "42m ago", tone: "guest" },
  { id: "a4", actor: "Payments", action: "settled batch #8841", target: "$182,400 across 96 invoices", time: "1h ago", tone: "system" },
  { id: "a5", actor: "Helios Travel Group", action: "invoice moved to overdue", target: "INV-20842 · $22,640", time: "2h ago", tone: "revenue" },
  { id: "a6", actor: "Website Builder", action: "published new landing page", target: "marina-heights.atlas.co", time: "3h ago", tone: "system" },
];

export const aiInsights = [
  {
    id: "ai1",
    title: "Raise weekend ADR at Marina Heights",
    body: "Demand is pacing 18% ahead of last year with 96% occupancy. A $28 weekend uplift adds an estimated $41K this quarter.",
    confidence: 92,
    impact: "+$41K",
  },
  {
    id: "ai2",
    title: "Churn risk on Helios Travel Group",
    body: "Booking volume down 31% over 60 days and one invoice is overdue. Recommend an account review this week.",
    confidence: 78,
    impact: "$298K at risk",
  },
  {
    id: "ai3",
    title: "Consolidate Oslo onboarding",
    body: "Nordveien Suites has 21 units idle past target go-live. Reallocating two technicians shortens ramp by 11 days.",
    confidence: 84,
    impact: "-11 days",
  },
];

export const notifications = [
  { id: "n1", title: "Elevator inspection blocked", body: "Harbour Nine · vendor no-show", time: "12m", unread: true },
  { id: "n2", title: "Payout scheduled", body: "$182,400 arrives Tuesday", time: "1h", unread: true },
  { id: "n3", title: "3 arrivals without ID verification", body: "Kensington Row", time: "2h", unread: true },
  { id: "n4", title: "Monthly board report ready", body: "August performance pack", time: "5h", unread: false },
];

export const reportsCatalog = [
  { id: "r1", name: "Executive performance pack", cadence: "Monthly", owner: "Finance", updated: "2h ago", format: "PDF" },
  { id: "r2", name: "Occupancy & pacing", cadence: "Weekly", owner: "Revenue", updated: "1d ago", format: "XLSX" },
  { id: "r3", name: "Arrears & collections", cadence: "Weekly", owner: "Finance", updated: "3h ago", format: "CSV" },
  { id: "r4", name: "Maintenance SLA compliance", cadence: "Monthly", owner: "Operations", updated: "4d ago", format: "PDF" },
  { id: "r5", name: "Channel profitability", cadence: "Quarterly", owner: "Revenue", updated: "1w ago", format: "XLSX" },
  { id: "r6", name: "Portfolio ESG summary", cadence: "Annual", owner: "Strategy", updated: "3w ago", format: "PDF" },
];

export const sitePages = [
  { id: "p1", name: "Homepage", path: "/", status: "Published", visits: 48210, updated: "3h ago" },
  { id: "p2", name: "Marina Heights", path: "/marina-heights", status: "Published", visits: 18940, updated: "1d ago" },
  { id: "p3", name: "Corporate housing", path: "/corporate", status: "Draft", visits: 0, updated: "2d ago" },
  { id: "p4", name: "Book a viewing", path: "/viewing", status: "Published", visits: 9420, updated: "5d ago" },
  { id: "p5", name: "Journal", path: "/journal", status: "Scheduled", visits: 3120, updated: "1w ago" },
];
