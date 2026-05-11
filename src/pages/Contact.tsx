import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { if (i.path[0]) fe[i.path[0] as string] = i.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    setSending(true);
    // Open default mail client with prefilled message — works without backend
    const subject = encodeURIComponent(`New enquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:anilsahukalia8@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message ready to send", description: "Your email app has opened with your message." });
      setForm({ name: "", email: "", message: "" });
    }, 800);
  };

  const contacts = [
    { i: Mail, t: "Email", d: "anilsahukalia8@gmail.com", href: "mailto:anilsahukalia8@gmail.com" },
    { i: Phone, t: "Phone", d: "+91 90780 14777", href: "tel:+919078014777" },
    { i: MessageCircle, t: "WhatsApp", d: "Chat with us instantly", href: "https://wa.me/919078014777" },
    { i: MapPin, t: "Address", d: "Bhubaneswar, Odisha, India" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-flag border-b border-border">
        <div className="container py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-ink">Contact Us</h1>
          <p className="mt-3 text-muted-foreground">We reply within 1 hour on working days.</p>
        </div>
      </section>
      <section className="container py-12 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {contacts.map((c) => {
            const Inner = (
              <div className="rounded-xl bg-card border border-border p-5 shadow-card flex items-start gap-4 hover:border-saffron transition-colors">
                <div className="h-11 w-11 rounded-full bg-saffron/10 text-saffron grid place-items-center"><c.i className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{c.t}</div>
                  <div className="font-semibold text-ink break-all">{c.d}</div>
                </div>
              </div>
            );
            return c.href ? (
              <a key={c.t} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">{Inner}</a>
            ) : <div key={c.t}>{Inner}</div>;
          })}
        </div>
        <form className="rounded-xl bg-card border border-border p-6 shadow-card space-y-4" onSubmit={submit}>
          <div>
            <label className="text-sm font-semibold text-ink">Name</label>
            <Input className="mt-1" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">Email</label>
            <Input className="mt-1" type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">Message</label>
            <Textarea className="mt-1 min-h-32" maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
            {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
          </div>
          <button disabled={sending} className="w-full rounded-md bg-deep-green text-white font-semibold py-2.5 hover:opacity-90 inline-flex items-center justify-center gap-2 disabled:opacity-60">
            {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send Message</>}
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
