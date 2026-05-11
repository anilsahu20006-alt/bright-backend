import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search, CalendarDays, Users, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { SERVICES } from "@/data/services";
import { listServices, type SvcRow } from "@/lib/firebase";

const categories = [
  { id: "all", name: "All Forms" },
  { id: "admission", name: "Admission" },
  { id: "recruitment", name: "Recruitment" },
  { id: "certificate", name: "Certificate" },
  { id: "identity", name: "Identity" },
];

const ServicesPage = () => {
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");
  const [custom, setCustom] = useState<SvcRow[]>([]);

  useEffect(() => {
    listServices().then(setCustom).catch(() => {});
  }, []);

  // Merge: custom (Firestore) services first, then built-in
  const all = [
    ...custom.map((c) => ({
      name: c.name, cat: c.cat, org: c.org, date: c.date, apps: c.apps,
      fee: c.fee, image: c.imageUrl,
    })),
    ...SERVICES,
  ];

  const filtered = all.filter(
    (s) =>
      (active === "all" || s.cat === active) &&
      s.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-card border-b border-border">
        <div className="container py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-ink">All Services</h1>
          <p className="mt-2 text-muted-foreground">Browse and apply for government forms in one place.</p>
          <div className="mt-6 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search forms, certificates, admissions..."
              className="h-12 pl-11 rounded-full border-border bg-background" />
          </div>
        </div>
      </section>

      <section className="container py-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border",
                  isActive ? "bg-saffron text-white border-saffron"
                    : "bg-card text-foreground border-border hover:border-saffron hover:text-saffron"
                )}>
                {c.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="container pb-16">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((f) => (
            <Link to={`/form/${encodeURIComponent(f.name)}`} key={f.name}
              className="rounded-xl overflow-hidden bg-card border border-border shadow-card hover:shadow-soft transition group">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={f.image} alt={f.name} loading="lazy" width={800} height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-saffron">{f.org}</div>
                <h4 className="font-bold text-sm text-ink leading-snug line-clamp-2 mt-0.5">{f.name}</h4>
                <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {f.date}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {f.apps}</span>
                </div>
                <span className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md bg-saffron text-white text-xs font-semibold py-1.5 hover:opacity-90">
                  Apply Now <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No services match your search.</div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
