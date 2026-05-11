import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Briefcase, ArrowRight } from "lucide-react";

const slides = [
  {
    title: "Indian Army Agniveer 2026",
    org: "Ministry of Defence",
    deadline: "May 10, 2026",
    posts: "25,000+ Posts",
    img: "https://images.unsplash.com/photo-1569437061241-a848be43cc82?w=1200&q=70&auto=format&fit=crop",
    gradient: "from-orange-600/85 via-orange-700/70 to-green-800/85",
  },
  {
    title: "SSC GD Constable 2026",
    org: "Staff Selection Commission",
    deadline: "Dec 30, 2025",
    posts: "25,487 Vacancies",
    img: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1200&q=70&auto=format&fit=crop",
    gradient: "from-green-700/85 via-emerald-700/70 to-orange-600/85",
  },
  {
    title: "RRB NTPC Recruitment",
    org: "Railway Recruitment Board",
    deadline: "Jan 15, 2026",
    posts: "11,500+ Posts",
    img: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=70&auto=format&fit=crop",
    gradient: "from-orange-700/85 via-amber-700/70 to-green-800/85",
  },
  {
    title: "UPSC NDA 2026",
    org: "Union Public Service Commission",
    deadline: "Dec 29, 2025",
    posts: "Officer Cadre",
    img: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&q=70&auto=format&fit=crop",
    gradient: "from-green-800/85 via-teal-700/70 to-orange-700/85",
  },
];

export const JobBanner = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-soft h-44 md:h-64">
      {slides.map((s, idx) => (
        <Link
          to={`/apply/${encodeURIComponent(s.title)}`}
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
          <div className="relative h-full flex flex-col justify-between p-4 md:p-6 text-white">
            <div className="inline-flex items-center gap-1.5 self-start bg-white/20 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <Briefcase className="h-3 w-3" /> New Job Alert
            </div>
            <div>
              <p className="text-[11px] md:text-xs font-semibold opacity-90 uppercase tracking-wider">{s.org}</p>
              <h3 className="text-lg md:text-2xl font-extrabold leading-tight mt-1 line-clamp-2">{s.title}</h3>
              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-wrap gap-3 text-[11px] md:text-xs">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {s.deadline}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {s.posts}</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-white text-orange-600 font-bold text-xs px-3 py-1.5 rounded-full">
                  Apply <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};
