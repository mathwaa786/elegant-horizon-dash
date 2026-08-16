import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { allNav } from "@/components/nav-config";
import { properties, reservations, customers } from "@/lib/mock-data";
import { useTheme } from "@/components/theme";
import { CirclePlus, FileText, Moon, Sun, LifeBuoy } from "lucide-react";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const go = (to: string) => {
    onOpenChange(false);
    void navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, properties, reservations, people…" />
      <CommandList className="scrollbar-thin">
        <CommandEmpty>No matches. Try a property name or reservation ID.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {allNav.map((item) => (
            <CommandItem key={item.to} value={`${item.label} ${item.hint}`} onSelect={() => go(item.to)}>
              <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
              <CommandShortcut>{item.hint}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/reservations")}>
            <CirclePlus className="mr-2 h-4 w-4 text-muted-foreground" /> New reservation
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/finance")}>
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" /> Create invoice
          </CommandItem>
          <CommandItem
            onSelect={() => {
              toggle();
              onOpenChange(false);
            }}
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")}>
            <LifeBuoy className="mr-2 h-4 w-4 text-muted-foreground" /> Contact support
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Properties">
          {properties.slice(0, 5).map((p) => (
            <CommandItem key={p.id} value={`${p.name} ${p.city}`} onSelect={() => go("/properties")}>
              <span>{p.name}</span>
              <CommandShortcut>
                {p.city} · {p.units} units
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Reservations">
          {reservations.slice(0, 4).map((r) => (
            <CommandItem key={r.id} value={`${r.id} ${r.guest}`} onSelect={() => go("/reservations")}>
              <span>
                {r.id} · {r.guest}
              </span>
              <CommandShortcut>{r.property}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Customers">
          {customers.slice(0, 4).map((c) => (
            <CommandItem key={c.id} value={`${c.name} ${c.email}`} onSelect={() => go("/customers")}>
              <span>{c.name}</span>
              <CommandShortcut>{c.segment}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
