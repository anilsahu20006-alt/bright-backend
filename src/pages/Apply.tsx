import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Upload, CheckCircle2, FileText, User, IdCard, Image as ImageIcon, GraduationCap, Receipt, FileSignature, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { createApplication, uploadDocFile, updateApplicationDocs, compressImage, type AppDoc } from "@/lib/firebase";

const REQUIRED_DOCS = [
  { key: "aadhaar", label: "Aadhaar Card", icon: IdCard, hint: "Front & back, PDF or JPG", required: true },
  { key: "photo", label: "Passport-size Photograph", icon: ImageIcon, hint: "Recent color photo, JPG/PNG", required: true },
  { key: "signature", label: "Signature", icon: FileSignature, hint: "Scanned signature on white paper", required: true },
  { key: "education", label: "Educational Certificate", icon: GraduationCap, hint: "10th / 12th / Degree marksheet", required: false },
  { key: "income", label: "Income / Caste Certificate", icon: Receipt, hint: "If applicable", required: false },
  { key: "id", label: "Additional ID Proof", icon: FileText, hint: "Voter ID / PAN / Driving Licence", required: false },
];

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const applicantSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email address").max(255),
});

const Apply = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const title = decodeURIComponent(name || "Application Form");
  const [files, setFiles] = useState<Record<string, File>>({});
  const [form, setForm] = useState({ fullName: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleUpload = (key: string, file?: File) => {
    if (!file) return;
    if (file.size > MAX_SIZE) {
      toast({ title: "File too large", description: `${file.name} exceeds 5 MB limit.`, variant: "destructive" });
      return;
    }
    const ok = ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type);
    if (!ok) {
      toast({ title: "Invalid file type", description: "Only PDF, JPG, PNG allowed.", variant: "destructive" });
      return;
    }
    setFiles((p) => ({ ...p, [key]: file }));
    toast({ title: "File attached", description: `${file.name} ready to upload.` });
  };

  const completed = Object.keys(files).length;
  const progress = Math.round((completed / REQUIRED_DOCS.length) * 100);

  const handleSubmit = async () => {
    const parsed = applicantSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      toast({ title: "Please fix the errors", description: "Some fields are invalid.", variant: "destructive" });
      return;
    }
    setErrors({});

    const missing = REQUIRED_DOCS.filter((d) => d.required && !files[d.key]);
    if (missing.length) {
      toast({
        title: "Missing required documents",
        description: missing.map((m) => m.label).join(", "),
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const appId = `DS-${Date.now().toString().slice(-8)}`;
    const submittedAt = new Date().toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    // 1) Create the application record IMMEDIATELY (no file upload yet) so the user
    //    is not blocked. Documents are uploaded in the background and patched in.
    let docRefId: string | null = null;
    try {
      docRefId = await createApplication({
        appId, service: title, fullName: form.fullName, phone: form.phone,
        email: form.email, status: "Processing", submittedAt, docs: [],
      });
    } catch (err: any) {
      setSubmitting(false);
      toast({ title: "Submission failed", description: err?.message || "Please try again.", variant: "destructive" });
      return;
    }

    // local cache for "My Applications"
    try {
      const prev = JSON.parse(localStorage.getItem("ds_applications") || "[]");
      prev.unshift({
        appId, service: title, fullName: form.fullName, phone: form.phone,
        email: form.email, status: "Processing", submittedAt,
      });
      localStorage.setItem("ds_applications", JSON.stringify(prev.slice(0, 50)));
    } catch {}

    // 2) Kick off uploads in the background — compress images first, upload in parallel.
    const fileEntries = Object.entries(files);
    const id = docRefId;
    (async () => {
      try {
        const uploaded = await Promise.allSettled(
          fileEntries.map(async ([key, file]) => {
            const meta = REQUIRED_DOCS.find((x) => x.key === key);
            const optimized = await compressImage(file);
            const up = await uploadDocFile(appId, key, optimized);
            return { ...up, label: meta?.label || key };
          })
        );
        const docs: AppDoc[] = uploaded.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
        if (id) await updateApplicationDocs(id, docs);

        if (docs.length < fileEntries.length) {
          toast({
            title: "Some files need smaller size",
            description: "Images are saved for admin preview. Large PDFs may need Firebase Storage permission.",
            variant: "destructive",
          });
        }

        // Send WhatsApp notification only after uploads finish so links work.
        try {
          const adminPhone = "919078014777";
          const lines = [
            `*New Application Submitted*`,
            `*App ID:* ${appId}`,
            `*Service:* ${title}`,
            `*Name:* ${form.fullName}`,
            `*Phone:* ${form.phone}`,
            `*Email:* ${form.email}`,
            `*Submitted:* ${submittedAt}`,
            ``,
            `*Documents (${docs.length}):*`,
            ...docs.map((d, i) => `${i + 1}. ${d.label} — ${d.name}\n${d.url}`),
          ];
          const msg = encodeURIComponent(lines.join("\n"));
          window.open(`https://wa.me/${adminPhone}?text=${msg}`, "_blank", "noopener,noreferrer");
        } catch {}
      } catch (err: any) {
        toast({
          title: "Some documents failed to upload",
          description: err?.message || "You can re-submit missing files later.",
          variant: "destructive",
        });
      }
    })();

    // 3) Navigate to thank-you instantly — user no longer waits for uploads.
    setSubmitting(false);
    navigate("/thank-you", {
      state: {
        appId,
        service: title,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        documents: fileEntries.map(([key, f]) => {
          const d = REQUIRED_DOCS.find((x) => x.key === key);
          return `${d?.label || key}: ${f.name}`;
        }),
        fee: "₹250",
        submittedAt,
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-saffron">Home</Link>
        <ChevronRight className="inline h-3 w-3 mx-1" />
        <Link to="/services" className="hover:text-saffron">Services</Link>
        <ChevronRight className="inline h-3 w-3 mx-1" />
        <span className="text-ink font-medium">Apply: {title}</span>
      </div>

      <section className="container pb-28 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-border shadow-card bg-card">
            <div className="p-6 bg-gradient-flag">
              <div className="text-xs font-bold uppercase tracking-wider text-saffron">Apply Online</div>
              <h1 className="text-2xl md:text-3xl font-bold text-ink mt-1">{title}</h1>
              <p className="text-sm text-muted-foreground mt-2">Fill your details and upload the required documents below. Our team will verify and submit your application.</p>

              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-ink mb-1">
                  <span>Application progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/70 overflow-hidden">
                  <div className="h-full bg-deep-green transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-card p-6">
            <h2 className="font-bold text-ink flex items-center gap-2"><User className="h-5 w-5 text-saffron" /> Applicant Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Field label="Full Name" error={errors.fullName}>
                <input value={form.fullName} maxLength={100}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
                  placeholder="As per Aadhaar" />
              </Field>
              <Field label="Mobile Number" error={errors.phone}>
                <input value={form.phone} maxLength={10} inputMode="numeric"
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                  className="mt-1 w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
                  placeholder="10-digit mobile" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Email" error={errors.email}>
                  <input value={form.email} type="email" maxLength={255}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
                    placeholder="you@example.com" />
                </Field>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-card p-6">
            <h2 className="font-bold text-ink flex items-center gap-2"><Upload className="h-5 w-5 text-deep-green" /> Required Documents</h2>
            <p className="text-xs text-muted-foreground mt-1">Max 5 MB each. Accepted: PDF, JPG, PNG.</p>

            <div className="mt-4 grid gap-3">
              {REQUIRED_DOCS.map((d) => {
                const Icon = d.icon;
                const file = files[d.key];
                return (
                  <div key={d.key} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-saffron transition-colors">
                    <div className={`h-10 w-10 grid place-items-center rounded-lg ${file ? "bg-deep-green text-white" : "bg-muted text-ink"}`}>
                      {file ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-ink truncate flex items-center gap-1">
                        {d.label} {d.required && <span className="text-saffron">*</span>}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{file ? file.name : d.hint}</div>
                    </div>
                    <label className="cursor-pointer shrink-0 inline-flex items-center gap-1 rounded-md bg-saffron text-white px-3 py-2 text-xs font-bold hover:opacity-90">
                      <Upload className="h-3.5 w-3.5" />
                      {file ? "Replace" : "Upload"}
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleUpload(d.key, e.target.files?.[0])} />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Fee</div>
            <div className="text-3xl font-extrabold text-ink mt-1">₹250</div>
            <p className="text-xs text-muted-foreground mt-1">Inclusive of all charges</p>

            <div className="mt-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Documents</span><span className="font-semibold text-ink">{completed}/{REQUIRED_DOCS.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-semibold text-saffron">Draft</span></div>
            </div>

            <button onClick={handleSubmit} disabled={submitting}
              className="mt-4 w-full rounded-md bg-deep-green text-white font-semibold py-2.5 hover:opacity-90 inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <><FileText className="h-4 w-4" /> Submit Application</>}
            </button>
            <p className="text-[11px] text-muted-foreground mt-2 text-center">By submitting you agree to our Terms & Privacy Policy.</p>
          </div>
        </aside>
      </section>

      <div className="lg:hidden fixed bottom-16 inset-x-0 z-40 bg-card border-t border-border p-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[11px] text-muted-foreground">Total</div>
          <div className="text-lg font-extrabold text-ink leading-tight">₹250</div>
        </div>
        <button onClick={handleSubmit} disabled={submitting}
          className="flex-[2] rounded-md bg-deep-green text-white font-bold py-3 disabled:opacity-60 inline-flex items-center justify-center gap-2">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Application"}
        </button>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="text-sm block">
    <span className="text-ink font-medium">{label}</span>
    {children}
    {error && (
      <span className="mt-1 text-xs text-rose-600 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> {error}
      </span>
    )}
  </label>
);

export default Apply;
