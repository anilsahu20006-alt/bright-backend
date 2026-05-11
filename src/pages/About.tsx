import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Users, Award } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="bg-card border-b border-border">
      <div className="container py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-ink">About Digital Service</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Digital Service helps citizens apply for government forms, certificates and admissions online — quickly and reliably.
        </p>
      </div>
    </section>
    <section className="container py-12 grid gap-6 md:grid-cols-3">
      {[
        { i: ShieldCheck, t: "Trusted Platform", d: "Verified service partner with thousands of successful applications." },
        { i: Users, t: "Citizen First", d: "Designed to make government services simple and accessible." },
        { i: Award, t: "Quality Service", d: "On-time delivery and quality assurance on every order." },
      ].map((x) => (
        <div key={x.t} className="rounded-xl bg-card border border-border p-6 shadow-card">
          <div className="h-12 w-12 rounded-full bg-brand-soft text-brand grid place-items-center mb-4">
            <x.i className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-ink">{x.t}</h3>
          <p className="text-sm text-muted-foreground mt-2">{x.d}</p>
        </div>
      ))}
    </section>
    <Footer />
  </div>
);

export default About;
