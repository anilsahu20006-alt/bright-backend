import { AccountLayout } from "@/components/AccountLayout";
import { CheckCircle2, Clock, XCircle, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { listMyApplications, type AppRow } from "@/lib/data";
import { Link } from "@/lib/router-compat";

const statusStyle: Record<string, { icon: any; color: string }> = {
  Approved: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  Processing: { icon: Clock, color: "text-amber-600 bg-amber-50" },
  Submitted: { icon: Clock, color: "text-sky-600 bg-sky-50" },
  Rejected: { icon: XCircle, color: "text-rose-600 bg-rose-50" },
};

const Applications = () => {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    listMyApplications()
      .then(setRows)
      .catch((e) => setErr(e?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AccountLayout title="My Applications">
      {loading ? (
        <div className="rounded-xl bg-card border border-border shadow-card p-10 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      ) : err ? (
        <div className="rounded-xl bg-card border border-border shadow-card p-6 text-rose-600 text-sm">{err}</div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl bg-card border border-border shadow-card p-10 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No applications yet.</p>
          <Link to="/services" className="mt-4 inline-block rounded-md bg-brand text-white font-semibold px-5 py-2">
            Browse services
          </Link>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">App ID</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const s = statusStyle[a.status] ?? statusStyle.Processing;
                const Icon = s.icon;
                return (
                  <tr key={a.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{a.appId}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{a.service}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.submittedAt}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.color}`}>
                        <Icon className="h-3 w-3" /> {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AccountLayout>
  );
};

export default Applications;
