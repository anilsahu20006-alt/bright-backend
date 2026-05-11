import { AccountLayout } from "@/components/AccountLayout";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", state: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            full_name: data.full_name ?? "",
            phone: data.phone ?? "",
            state: data.state ?? "",
            address: data.address ?? "",
          });
        }
        setLoading(false);
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      state: form.state,
      address: form.address,
    });
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Profile saved" });
  };

  return (
    <AccountLayout title="Profile">
      <div className="rounded-xl bg-card border border-border shadow-card p-6 grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="md:col-span-2 p-10 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-semibold text-ink">Full Name</label>
              <Input className="mt-1" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Mobile</label>
              <Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Email</label>
              <Input className="mt-1" value={user?.email ?? ""} disabled />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">State</label>
              <Input className="mt-1" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-ink">Address</label>
              <Input className="mt-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <button onClick={save} disabled={saving} className="rounded-md bg-brand text-white font-semibold px-6 py-2.5 hover:bg-brand-dark disabled:opacity-60">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
};

export default Profile;
