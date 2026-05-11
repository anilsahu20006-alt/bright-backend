import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NavLink } from "react-router-dom";
import { User, FileText, Wallet, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const items = [
  { to: "/account/profile", label: "Profile", icon: User },
  { to: "/account/applications", label: "My Applications", icon: FileText },
  { to: "/account/wallet", label: "Wallet", icon: Wallet },
  { to: "/account/orders", label: "Orders", icon: ShoppingBag },
];

export const AccountLayout = ({ children, title }: { children: ReactNode; title: string }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container py-8 grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-xl bg-card border border-border shadow-card p-4 h-fit">
        <div className="flex items-center gap-3 px-2 pb-4 border-b border-border">
          <div className="h-11 w-11 rounded-full bg-brand text-white grid place-items-center font-bold">RA</div>
          <div>
            <div className="font-semibold text-ink text-sm">Rahul Agarwal</div>
            <div className="text-xs text-muted-foreground">+91 90000 00000</div>
          </div>
        </div>
        <nav className="mt-3 flex flex-col gap-1">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                  isActive ? "bg-brand-soft text-brand" : "text-foreground hover:bg-muted"
                )
              }
            >
              <i.icon className="h-4 w-4" /> {i.label}
            </NavLink>
          ))}
          <button className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </aside>
      <main>
        <h1 className="text-2xl font-bold text-ink mb-4">{title}</h1>
        {children}
      </main>
    </div>
    <Footer />
  </div>
);
