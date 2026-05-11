import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Users, ChevronRight, FileText, CheckCircle2, Clock } from "lucide-react";
import { getService } from "@/data/services";

const FormDetail = () => {
  const { name } = useParams();
  const title = decodeURIComponent(name || "Application Form");
  const service = getService(title);

  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <div className="container py-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-saffron">Home</Link>
        <ChevronRight className="inline h-3 w-3 mx-1" />
        <Link to="/services" className="hover:text-saffron">Services</Link>
        <ChevronRight className="inline h-3 w-3 mx-1" />
        <span className="text-ink font-medium">{title}</span>
      </div>

      <section className="container pb-12 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden bg-card border border-border shadow-card">
            {service?.image ? (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img src={service.image} alt={title} width={1200} height={600}
                  className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-90">{service.org}</div>
                  <h1 className="text-2xl md:text-3xl font-bold mt-1">{title}</h1>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gradient-flag grid place-items-center text-ink text-center px-6">
                <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-saffron/10 text-saffron font-semibold">
                  <CalendarDays className="h-3 w-3" /> Last date: {service?.date || "—"}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-foreground font-semibold">
                  <Users className="h-3 w-3" /> {service?.apps || "—"} applicants
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Open
                </span>
              </div>

              <h2 className="mt-6 text-lg font-bold text-ink">About this form</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {service?.description || `Apply online for ${title} through Digital Service. We help you fill the application correctly, upload required documents, pay the fees, and submit — all from your mobile or computer.`}
              </p>

              {service?.eligibility?.length ? (
                <>
                  <h3 className="mt-6 font-bold text-ink">Eligibility</h3>
                  <ul className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    {service.eligibility.map((d) => (
                      <li key={d} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-deep-green" /> {d}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              <h3 className="mt-6 font-bold text-ink">Required documents</h3>
              <ul className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {(service?.documents || ["Aadhaar Card", "Passport-size Photo", "Signature", "Educational Certificates"]).map((d) => (
                  <li key={d} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-saffron" /> {d}</li>
                ))}
              </ul>

              <h3 className="mt-6 font-bold text-ink">How it works</h3>
              <ol className="mt-2 space-y-3 text-sm">
                {["Fill the application form online", "Upload your documents", "Pay the application fee", "Receive confirmation by SMS/Email"].map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-saffron text-white grid place-items-center text-xs font-bold">{i + 1}</span>
                    <span className="text-muted-foreground pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Fee</div>
            <div className="text-3xl font-extrabold text-ink mt-1">{service?.fee || "₹250"}</div>
            <p className="text-xs text-muted-foreground mt-1">Inclusive of all charges</p>

            <Link to={`/apply/${encodeURIComponent(title)}`}
              className="mt-4 w-full rounded-md bg-saffron text-white font-semibold py-2.5 hover:opacity-90 inline-flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" /> Apply Now
            </Link>

            <div className="mt-5 pt-5 border-t border-border">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Step-by-step</div>
              <ol className="space-y-2 text-sm">
                {["Verify eligibility", "Keep documents ready", "Fill the application", "Pay & submit"].map((s, i) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="h-5 w-5 shrink-0 rounded-full bg-deep-green text-white grid place-items-center text-[11px] font-bold">{i + 1}</span>
                    <span className="text-foreground/80">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <h4 className="font-bold text-ink">Need help?</h4>
            <p className="text-sm text-muted-foreground mt-1">Our team is available 9am – 9pm to help with your application.</p>
            <Link to="/contact" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-saffron">
              Contact Support <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl bg-card border border-border shadow-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> Estimated processing: 5-10 days
            </div>
          </div>
        </aside>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FormDetail;
