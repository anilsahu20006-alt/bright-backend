import { AccountLayout } from "@/components/AccountLayout";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const apps = [
  { id: "BR-10293", name: "PAN Card", date: "Apr 14, 2026", status: "Approved", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  { id: "BR-10288", name: "Income Certificate", date: "Apr 10, 2026", status: "Processing", icon: Clock, color: "text-amber-600 bg-amber-50" },
  { id: "BR-10250", name: "Caste Certificate", date: "Mar 30, 2026", status: "Approved", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  { id: "BR-10211", name: "Voter ID Update", date: "Mar 14, 2026", status: "Rejected", icon: XCircle, color: "text-rose-600 bg-rose-50" },
];

const Applications = () => (
  <AccountLayout title="My Applications">
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
          {apps.map((a) => (
            <tr key={a.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs text-foreground">{a.id}</td>
              <td className="px-4 py-3 font-semibold text-ink">{a.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{a.date}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${a.color}`}>
                  <a.icon className="h-3 w-3" /> {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AccountLayout>
);

export default Applications;
