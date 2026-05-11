import { NavLink } from "@/lib/router-compat";
import { Home, LayoutGrid, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/services", label: "Categories", icon: LayoutGrid, end: false },
  { to: "/account", label: "Login", icon: User, end: false },
  { to: "/account/orders", label: "Order", icon: ShoppingBag, end: false },
];

export const MobileBottomNav = () => {
  return (
    <>
      {/* Spacer so content isn't hidden behind the fixed bar */}
      <div className="h-20 md:hidden" aria-hidden />
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur border-t border-border shadow-elegant"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {items.map((it) => (
            <li key={it.to}>
              <NavLink
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
                    isActive
                      ? "text-deep-green"
                      : "text-foreground/70 hover:text-saffron"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "grid place-items-center h-9 w-9 rounded-full transition-all",
                        isActive
                          ? "bg-deep-green/10 text-deep-green scale-105"
                          : "text-foreground/70"
                      )}
                    >
                      <it.icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <span>{it.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
