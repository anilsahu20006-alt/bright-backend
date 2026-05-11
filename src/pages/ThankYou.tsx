import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { CheckCircle2, FileText, Home, MessageCircle, Download, Clock, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

interface ApplicationState {
  appId: string;
  service: string;
  fullName: string;
  phone: string;
  email: string;
  documents: string[];
  fee: string;
  submittedAt: string;
}

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as ApplicationState | null;

  useEffect(() => {
    if (!data) navigate("/", { replace: true });
  }, [data, navigate]);

  if (!data) return null;

  const waMsg = encodeURIComponent(
    `Hello Digital Service, I just submitted my application.\n\nApp ID: ${data.appId}\nService: ${data.service}\nName: ${data.fullName}\nPhone: ${data.phone}`
  );

  const handleDownload = () => {
    const text = `DIGITAL SERVICE — APPLICATION RECEIPT
=====================================

Application ID : ${data.appId}
Service        : ${data.service}
Submitted On   : ${data.submittedAt}

Applicant
---------
Name   : ${data.fullName}
Phone  : ${data.phone}
Email  : ${data.email}

Documents Uploaded (${data.documents.length})
${data.documents.map((d, i) => `  ${i + 1}. ${d}`).join("\n")}

Fee Paid : ${data.fee}
Status   : Submitted (under review)

Support: anilsahukalia8@gmail.com | +91 90780 14777
Thank you for choosing Digital Service.
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.appId}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-flag pb-24">
      <Navbar />

      <section className="container py-8 md:py-14">
        <div className="max-w-2xl mx-auto">
          {/* Success card */}
          <div className="rounded-3xl bg-card border border-border shadow-elegant overflow-hidden">
            <div className="bg-deep-green text-white p-8 text-center relative">
              <div className="mx-auto h-20 w-20 rounded-full bg-white grid place-items-center shadow-card animate-in zoom-in duration-500">
                <CheckCircle2 className="h-12 w-12 text-deep-green" />
              </div>
              <h1 className="mt-4 text-2xl md:text-3xl font-extrabold">Thank You!</h1>
              <p className="mt-1 text-sm md:text-base text-white/90">
                Your application has been submitted successfully.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full">
                <FileText className="h-4 w-4" />
                <span className="font-mono font-bold tracking-wide">{data.appId}</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <Info label="Service" value={data.service} />
                <Info label="Applicant" value={data.fullName} />
                <Info label="Phone" value={data.phone} />
                <Info label="Email" value={data.email} />
                <Info label="Fee Paid" value={data.fee} />
                <Info label="Submitted" value={data.submittedAt} />
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Documents Received ({data.documents.length})
                </div>
                <ul className="text-sm space-y-1">
                  {data.documents.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-ink">
                      <CheckCircle2 className="h-4 w-4 text-deep-green shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next steps */}
              <div className="rounded-xl border border-saffron/30 bg-saffron/5 p-4">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <Clock className="h-4 w-4 text-saffron" /> What happens next?
                </div>
                <ol className="mt-2 text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                  <li>Our team verifies your documents within 2–4 hours.</li>
                  <li>You'll receive WhatsApp & email updates on <span className="font-semibold text-ink">{data.phone}</span>.</li>
                  <li>Final certificate / acknowledgment will be available in your account.</li>
                </ol>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-deep-green" />
                Your data is encrypted & shared only with the issuing authority.
              </div>

              <div className="grid gap-2 sm:grid-cols-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-ink text-white font-semibold py-2.5 hover:opacity-90"
                >
                  <Download className="h-4 w-4" /> Receipt
                </button>
                <a
                  href={`https://wa.me/919078014777?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] text-white font-semibold py-2.5 hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <Link
                  to="/account/applications"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-deep-green text-white font-semibold py-2.5 hover:opacity-90"
                >
                  <FileText className="h-4 w-4" /> My Applications
                </Link>
              </div>

              <Link to="/" className="flex items-center justify-center gap-1 text-sm text-saffron font-semibold pt-1">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border p-3">
    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
    <div className="text-sm font-semibold text-ink mt-0.5 break-words">{value}</div>
  </div>
);

export default ThankYou;
