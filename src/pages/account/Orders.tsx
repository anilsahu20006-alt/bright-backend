import { AccountLayout } from "@/components/AccountLayout";
import { Package } from "lucide-react";

const orders = [
  { id: "ORD-9921", item: "PAN Card – Physical Copy", amt: "₹107", status: "Delivered", date: "Apr 20, 2026" },
  { id: "ORD-9890", item: "Caste Certificate Print", amt: "₹30", status: "Shipped", date: "Apr 18, 2026" },
  { id: "ORD-9854", item: "Resident Certificate Print", amt: "₹30", status: "Processing", date: "Apr 16, 2026" },
];

const Orders = () => (
  <AccountLayout title="Orders">
    <div className="grid gap-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-xl bg-card border border-border shadow-card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-brand-soft text-brand grid place-items-center"><Package className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="font-semibold text-ink">{o.item}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{o.id} • {o.date}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-ink">{o.amt}</div>
            <div className="text-xs font-semibold text-brand">{o.status}</div>
          </div>
        </div>
      ))}
    </div>
  </AccountLayout>
);

export default Orders;
