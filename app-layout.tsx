import { ReactNode, useState, useEffect } from "react";
import { AppSidebar } from "./sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search, Bell, Sun, Moon, Package, AlertTriangle, TrendingUp, ShoppingCart, Check } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ── Theme toggle ────────────────────────────────────────────────────────────
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="rounded-full hover:bg-muted/50 transition-colors"
    >
      {isDark
        ? <Sun className="h-4 w-4 text-foreground/70" />
        : <Moon className="h-4 w-4 text-foreground/70" />}
    </Button>
  );
}

// ── Notifications ────────────────────────────────────────────────────────────
interface Notification {
  id: number;
  icon: typeof Bell;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    title: "Low stock alert",
    body: "Apple (Groceries) has only 8 units remaining.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    title: "Inventory value up",
    body: "Total inventory value crossed $17M this week.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 3,
    icon: Package,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "New products added",
    body: "12 new SKUs were added to the Furniture category.",
    time: "3 hr ago",
    read: false,
  },
  {
    id: 4,
    icon: ShoppingCart,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    title: "Catalog sync complete",
    body: "All 194 products synced successfully from DummyJSON.",
    time: "Yesterday",
    read: true,
  },
];

function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative hover:bg-muted/50 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-foreground/70" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] p-0 shadow-xl rounded-2xl border border-border/60 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-primary text-primary-foreground rounded-full px-2 py-0.5 leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1 transition-opacity"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <ul className="divide-y divide-border/40 max-h-[340px] overflow-y-auto">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <li
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex gap-3 px-4 py-3.5 cursor-pointer transition-colors",
                  n.read
                    ? "bg-background hover:bg-muted/30"
                    : "bg-primary/[0.03] hover:bg-primary/[0.06]"
                )}
              >
                {/* Icon */}
                <div className={cn("mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center", n.iconBg)}>
                  <Icon className={cn("h-4 w-4", n.iconColor)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-medium leading-snug", n.read ? "text-foreground/70" : "text-foreground")}>
                      {n.title}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary self-start" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border/50 bg-muted/20 text-center">
          <span className="text-xs text-muted-foreground">
            {unreadCount === 0 ? "You're all caught up!" : `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── Layout ───────────────────────────────────────────────────────────────────
export function AppLayout({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?q=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation(`/products`);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/20">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-30 shrink-0 transition-all">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground transition-colors" />

              <form onSubmit={handleSearchSubmit} className="hidden sm:flex max-w-sm w-full relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9 bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all w-full h-9 rounded-full shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            <div className="flex items-center gap-2">
              <NotificationPanel />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
