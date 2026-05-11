import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JobBanner } from "@/components/JobBanner";

import { Link } from "@/lib/router-compat";
import {
  ArrowRight, ChevronRight, GraduationCap, BookOpen, Upload, Clock, FileType, Award,
  CalendarDays, Users, Star, HelpCircle, MessageCircle,
} from "lucide-react";

const topPicks = [
  { name: "LL (Learner's Licence)", tag: "New", img: "🛵" },
  { name: "PAN", tag: "New", img: "💳" },
  { name: "Aadhaar Update", tag: "Hot", img: "🆔" },
  { name: "Passport", tag: "New", img: "📘" },
];

const generalServices = [
  { name: "Income Certificate", img: "📄" },
  { name: "Caste Certificate", img: "📜" },
  { name: "Resident Certificate", img: "🏠" },
  { name: "Birth Certificate", img: "👶" },
  { name: "Ration Card", img: "🍚" },
  { name: "Voter ID", img: "🗳️" },
];

const latestForms = [
  { title: "Agniveer (GD, Tradesman, Clerk & Other Posts)", org: "Indian Army", date: "May 10, 2026", apps: "25,000", color: "from-orange-500 to-red-600" },
  { title: "RI AMIN", org: "RI ODISHA", date: "Jan 30, 2026", apps: "3,250", color: "from-red-600 to-rose-700" },
  { title: "NDA 2026", org: "UPSC", date: "Dec 29, 2025", apps: "394", color: "from-slate-700 to-slate-900" },
  { title: "SSC GD Constable 2026", org: "SSC", date: "Dec 30, 2025", apps: "25,487", color: "from-red-500 to-amber-600" },
  { title: "CTET", org: "CBSE", date: "Dec 11, 2025", apps: "12,000", color: "from-emerald-500 to-emerald-700" },
];

const features = [
  { i: Upload, t: "Easy Upload", d: "Upload your documents from anywhere, anytime." },
  { i: Clock, t: "Save Time", d: "Skip the line and have your prints ready when you arrive." },
  { i: FileType, t: "Multiple Formats", d: "We support all common document and image formats." },
  { i: Award, t: "Quality Prints", d: "Professional quality printing services for all your needs." },
];

const testimonials = [
  { name: "Harapriya Das", text: "Trusted, easy to use platform. Applied online from home without visiting a cyber cafe. Fast and affordable — highly satisfied!" },
  { name: "Lipun Dhinda", text: "I applied for Caste, Residence, and Income Certificates and received all documents on time while sitting at home." },
  { name: "Bidura Gouda", text: "Applied for RRB NTPC and OPGC easily and on time from home. Simple, fast, and reliable." },
  { name: "Subhendu Behera", text: "Smooth and convenient process. All documents delivered on time without any issues." },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Auto-sliding hero banner */}
      <section className="container pt-4 pb-2">
        <JobBanner />
      </section>

      {/* Top Picks */}
      <section className="container py-8">
        <h3 className="text-xl font-bold text-ink mb-4">Top Picks</h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {topPicks.map((p) => (
            <Link to={`/apply/${encodeURIComponent(p.name)}`} key={p.name} className="group rounded-xl bg-card border border-border p-4 shadow-card hover:shadow-soft transition relative">
              <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-saffron text-white">{p.tag}</span>
              <div className="aspect-[4/3] rounded-lg bg-muted grid place-items-center text-5xl mb-3">{p.img}</div>
              <h4 className="font-semibold text-sm text-ink line-clamp-1">{p.name}</h4>
              <span className="mt-2 inline-block text-xs font-bold text-white bg-saffron rounded-md px-2 py-1">Apply Now</span>
            </Link>
          ))}
        </div>
      </section>

      {/* General Services - compact */}
      <section className="container py-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base md:text-lg font-bold text-ink">General Services</h3>
          <Link to="/services" className="rounded-full bg-deep-green text-white text-[11px] font-semibold px-3 py-1 hover:opacity-90">View All</Link>
        </div>
        <div className="grid gap-2.5 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {generalServices.map((s) => (
            <Link to={`/apply/${encodeURIComponent(s.name)}`} key={s.name} className="rounded-lg bg-card border border-border p-2 shadow-card hover:shadow-soft transition text-center">
              <div className="aspect-square rounded-md bg-muted grid place-items-center text-2xl mb-1">{s.img}</div>
              <p className="text-[11px] font-semibold text-ink line-clamp-1">{s.name}</p>
              <p className="mt-1 text-[10px] font-bold text-white bg-saffron rounded px-1 py-0.5">Apply</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="container py-4">
        <div className="rounded-xl bg-card border border-border p-6 flex items-center justify-between shadow-card">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-ink">Recommended for You</h3>
            <p className="text-sm text-muted-foreground mt-1">Personalized govt. services curated for you.</p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-brand inline-flex items-center gap-1 whitespace-nowrap">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Latest Forms */}
      <section className="container py-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-ink">Latest Forms</h3>
          <Link to="/services" className="rounded-full bg-brand text-white text-xs font-semibold px-4 py-1.5 inline-flex items-center gap-1 hover:bg-brand-dark">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {latestForms.map((f) => (
            <div key={f.title} className="rounded-xl overflow-hidden bg-card border border-border shadow-card hover:shadow-soft transition group flex flex-col">
              <Link to={`/form/${encodeURIComponent(f.title)}`} className={`h-32 bg-gradient-to-br ${f.color} relative grid place-items-center text-white`}>
                <div className="text-center px-3">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-90">{f.org}</div>
                  <div className="text-sm font-bold mt-1 line-clamp-2">{f.title}</div>
                </div>
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-bold text-sm text-ink leading-snug line-clamp-2">{f.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{f.org}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {f.date}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {f.apps}</span>
                </div>
                <Link to={`/apply/${encodeURIComponent(f.title)}`} className="mt-3 block text-center text-xs font-bold text-white bg-saffron rounded-md py-2 hover:opacity-90">
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="container py-12">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-ink">Why Choose Our Service?</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            We offer convenient, high-quality printing services with a quick turnaround time.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.t} className="rounded-xl bg-card border border-border p-6 text-center shadow-card">
              <div className="mx-auto h-14 w-14 rounded-full bg-brand-soft text-brand grid place-items-center mb-4">
                <f.i className="h-7 w-7" />
              </div>
              <h4 className="font-bold text-ink">{f.t}</h4>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-12">
        <h3 className="text-2xl md:text-3xl font-bold text-ink text-center mb-8">What our users say</h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl bg-card border border-border p-5 shadow-card">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">{t.text}</p>
              <p className="mt-4 font-bold text-ink text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Need Help */}
      <section className="container py-12">
        <div className="rounded-2xl bg-gradient-warm p-8 md:p-12 text-white text-center shadow-soft">
          <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-90" />
          <h3 className="text-2xl md:text-3xl font-bold">Need Help Finding a Service?</h3>
          <p className="mt-2 opacity-95 max-w-2xl mx-auto text-sm md:text-base">
            Can't find what you're looking for? Our support team is here to help you navigate government services.
          </p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-brand font-semibold px-6 py-2.5 hover:bg-white/90">
            <MessageCircle className="h-4 w-4" /> Contact Support
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default HomePage;
