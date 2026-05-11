import { AccountLayout } from "@/components/AccountLayout";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";

const tx = [
  { t: "Added to wallet", a: "+ ₹500", d: "Apr 18, 2026", icon: ArrowDownLeft, color: "text-emerald-600" },
  { t: "PAN Card application", a: "- ₹107", d: "Apr 14, 2026", icon: ArrowUpRight, color: "text-rose-600" },
  { t: "Income Certificate", a: "- ₹30", d: "Apr 10, 2026", icon: ArrowUpRight, color: "text-rose-600" },
];

const WalletPage = () => (
  <AccountLayout title="Wallet">
    <div className="rounded-2xl bg-gradient-warm text-white p-6 shadow-soft">
      <div className="text-xs uppercase tracking-wider opacity-90 font-semibold">Available Balance</div>
      <div className="text-4xl font-extrabold mt-1">₹ 363.00</div>
      <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-white text-brand font-semibold px-5 py-2 hover:bg-white/90">
        <Plus className="h-4 w-4" /> Add Money
      </button>
    </div>

    <h2 className="mt-8 mb-3 text-lg font-bold text-ink">Recent Transactions</h2>
    <div className="rounded-xl bg-card border border-border shadow-card divide-y divide-border">
      {tx.map((x) => (
        <div key={x.t + x.d} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-full bg-muted grid place-items-center ${x.color}`}>
              <x.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-ink text-sm">{x.t}</div>
              <div className="text-xs text-muted-foreground">{x.d}</div>
            </div>
          </div>
          <div className={`font-bold ${x.color}`}>{x.a}</div>
        </div>
      ))}
    </div>
  </AccountLayout>
);

export default WalletPage;
