import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Search,
  Bell,
  Plus,
  LifeBuoy,
  Menu,
  Check,
  ChevronDown,
  CirclePlus,
  FileText,
  Wrench,
  UserPlus,
  Command as CommandIcon,
} from "lucide-react";
import { primaryNav, secondaryNav } from "@/components/nav-config";
import { notifications } from "@/lib/mock-data";
import { ThemeToggle } from "@/components/theme";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link to="/" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-lg">
      <span className="relative grid h-8 w-8 place-items-center rounded-[10px] bg-primary text-primary-foreground">
        <span className="text-[13px] font-bold tracking-tight">A</span>
        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-background bg-success" />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="text-[15px] font-semibold tracking-tight">Atlas</span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Property OS
        </span>
      </span>
    </Link>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="focus-ring group relative rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground data-[status=active]:text-foreground"
    >
      {label}
      <span className="pointer-events-none absolute inset-x-2.5 -bottom-[9px] h-[2px] scale-x-0 rounded-full bg-primary transition-transform duration-200 group-data-[status=active]:scale-x-100" />
    </Link>
  );
}

const quickActions = [
  { icon: CirclePlus, label: "New reservation", hint: "⌘N" },
  { icon: UserPlus, label: "Add customer", hint: "" },
  { icon: FileText, label: "Create invoice", hint: "" },
  { icon: Wrench, label: "Log work order", hint: "" },
];

export function TopNav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5 lg:px-8">
        <Logo />

        <nav className="ml-2 hidden min-w-0 flex-1 items-center gap-0.5 xl:flex">
          {primaryNav.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} />
          ))}
          <Popover>
            <PopoverTrigger className="focus-ring inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground">
              More <ChevronDown className="h-3.5 w-3.5" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60 p-1.5">
              {secondaryNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-surface-2"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {pathname === item.to ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                </Link>
              ))}
            </PopoverContent>
          </Popover>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 xl:ml-0">
          <button
            type="button"
            onClick={onOpenPalette}
            className="focus-ring hidden items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground md:flex lg:w-64"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search everything…</span>
            <kbd className="num inline-flex items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">
              <CommandIcon className="h-2.5 w-2.5" />K
            </kbd>
          </button>
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Search"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground md:hidden"
          >
            <Search className="h-4 w-4" />
          </button>

          <Popover>
            <PopoverTrigger
              aria-label="Notifications"
              className="focus-ring relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="num absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {unread}
                </span>
              ) : null}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[min(92vw,22rem)] p-0">
              <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                <p className="text-sm font-semibold">Notifications</p>
                <span className="text-[11px] text-muted-foreground">{unread} unread</span>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-2.5 border-b border-border/60 px-3 py-2.5 last:border-0 hover:bg-surface-2"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        n.unread ? "bg-primary" : "bg-border-strong",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{n.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                    </div>
                    <span className="num shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              aria-label="Quick actions"
              className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 p-1.5">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-surface-2"
                >
                  <a.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-left">{a.label}</span>
                  {a.hint ? (
                    <span className="num text-[10px] text-muted-foreground">{a.hint}</span>
                  ) : null}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Link
            to="/settings"
            aria-label="Help"
            className="focus-ring hidden h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground sm:inline-flex"
          >
            <LifeBuoy className="h-4 w-4" />
          </Link>

          <ThemeToggle className="hidden sm:inline-flex" />

          <Popover>
            <PopoverTrigger className="focus-ring ml-0.5 flex items-center gap-2 rounded-lg border border-border p-0.5 pr-1.5 transition-colors hover:bg-surface-2">
              <span className="grid h-8 w-8 place-items-center rounded-[7px] bg-surface-2 text-xs font-semibold">
                RK
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground lg:block" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1.5">
              <div className="border-b border-border px-2.5 pb-2.5 pt-1.5">
                <p className="text-sm font-semibold">Rajesh Kumar</p>
                <p className="truncate text-xs text-muted-foreground">rajesh@atlas.co · Owner</p>
              </div>
              <div className="pt-1.5">
                {["Profile", "Workspace settings", "Billing", "Sign out"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    className="w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-surface-2"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground xl:hidden"
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(88vw,20rem)] p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
                <Logo />
                <ThemeToggle />
              </div>
              <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto p-3 scrollbar-thin">
                <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Workspace
                </p>
                {primaryNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    className="flex items-center gap-3 rounded-xl px-2.5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </Link>
                ))}
                <p className="px-2 pb-1.5 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  More
                </p>
                {secondaryNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-2.5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 pb-16 pt-5 sm:px-5 sm:pb-20 sm:pt-7 lg:px-8">
      {children}
    </main>
  );
}
