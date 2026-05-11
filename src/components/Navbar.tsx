import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, User, X, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) navigate(`/services?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
      <div className="container flex h-14 md:h-16 items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-saffron via-white to-deep-green text-deep-green grid place-items-center font-black text-lg md:text-xl shadow-card border border-border">DS</div>
          <span className="leading-tight">
            <span className="block text-base md:text-xl font-extrabold tracking-tight text-saffron">Digital</span>
            <span className="block -mt-1 text-base md:text-xl font-extrabold tracking-tight text-deep-green">Service</span>
          </span>
        </Link>

        <form onSubmit={submitSearch} className="flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Search services..."
              className="w-full h-9 pl-8 pr-3 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 border border-border"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-[15px] font-medium transition-colors relative py-2",
                  isActive ? "text-brand" : "text-foreground/80 hover:text-brand"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/account"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-brand text-white px-5 py-2 text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            <User className="h-4 w-4" /> Log in
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-3 flex flex-col">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-2 py-3 font-medium border-b border-border last:border-0",
                    isActive ? "text-brand" : "text-foreground"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="mt-3 mb-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand text-white px-5 py-2.5 font-semibold"
            >
              <User className="h-4 w-4" /> Log in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
