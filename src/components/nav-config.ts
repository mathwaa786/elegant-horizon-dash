import {
  LayoutDashboard,
  Building2,
  CalendarRange,
  Users,
  Wallet,
  Wrench,
  BarChart3,
  Sparkles,
  Globe,
  Map,
  DoorOpen,
  UsersRound,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; to: string; icon: LucideIcon; hint: string };

export const primaryNav: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, hint: "Executive overview" },
  { label: "Properties", to: "/properties", icon: Building2, hint: "Portfolio" },
  { label: "Reservations", to: "/reservations", icon: CalendarRange, hint: "Bookings & calendar" },
  { label: "Customers", to: "/customers", icon: Users, hint: "CRM" },
  { label: "Finance", to: "/finance", icon: Wallet, hint: "Payments & invoices" },
  { label: "Operations", to: "/operations", icon: Wrench, hint: "Maintenance" },
  { label: "Reports", to: "/reports", icon: BarChart3, hint: "Analytics library" },
  { label: "AI", to: "/ai", icon: Sparkles, hint: "Atlas assistant" },
  { label: "Website Builder", to: "/website-builder", icon: Globe, hint: "Public site" },
];

export const secondaryNav: NavItem[] = [
  { label: "Apartments & Units", to: "/units", icon: DoorOpen, hint: "Unit inventory" },
  { label: "Housing Map", to: "/map", icon: Map, hint: "Interactive site map" },
  { label: "Staff & Tasks", to: "/staff", icon: UsersRound, hint: "Team workload" },
  { label: "Settings", to: "/settings", icon: Settings, hint: "Workspace" },
];

export const allNav = [...primaryNav, ...secondaryNav];
