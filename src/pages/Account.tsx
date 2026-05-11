import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/router-compat";
import { LogIn } from "lucide-react";

const Account = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-16 grid place-items-center">
      <form
        onSubmit={(e) => { e.preventDefault(); window.location.href = "/account/profile"; }}
        className="w-full max-w-md rounded-2xl bg-card border border-border shadow-soft p-8"
      >
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-saffron via-white to-deep-green text-deep-green grid place-items-center font-black">DS</div>
          <h1 className="mt-3 text-2xl font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Log in to manage your applications</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink">Mobile / Email</label>
            <Input className="mt-1" placeholder="Enter your mobile or email" />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">Password</label>
            <Input className="mt-1" type="password" placeholder="••••••••" />
          </div>
          <button className="w-full rounded-md bg-brand text-white font-semibold py-2.5 hover:bg-brand-dark inline-flex items-center justify-center gap-2">
            <LogIn className="h-4 w-4" /> Log in
          </button>
          <p className="text-xs text-center text-muted-foreground">
            Don't have an account? <Link to="/account" className="text-brand font-semibold">Sign up</Link>
          </p>
        </div>
      </form>
    </section>
    <Footer />
  </div>
);

export default Account;
