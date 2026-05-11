import { AccountLayout } from "@/components/AccountLayout";
import { Input } from "@/components/ui/input";

const Profile = () => (
  <AccountLayout title="Profile">
    <div className="rounded-xl bg-card border border-border shadow-card p-6 grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-semibold text-ink">Full Name</label>
        <Input className="mt-1" defaultValue="Rahul Agarwal" />
      </div>
      <div>
        <label className="text-sm font-semibold text-ink">Mobile</label>
        <Input className="mt-1" defaultValue="+91 90000 00000" />
      </div>
      <div>
        <label className="text-sm font-semibold text-ink">Email</label>
        <Input className="mt-1" defaultValue="rahul@example.com" />
      </div>
      <div>
        <label className="text-sm font-semibold text-ink">State</label>
        <Input className="mt-1" defaultValue="Odisha" />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-semibold text-ink">Address</label>
        <Input className="mt-1" defaultValue="123, Main Road, Bhubaneswar" />
      </div>
      <div className="md:col-span-2">
        <button className="rounded-md bg-brand text-white font-semibold px-6 py-2.5 hover:bg-brand-dark">Save Changes</button>
      </div>
    </div>
  </AccountLayout>
);

export default Profile;
