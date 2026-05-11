import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "@/hooks/use-auth";

const Account = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  if (!authLoading && user) {
    // Already signed in — show shortcut
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="container py-16 grid place-items-center">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-soft p-8 text-center">
            <h1 className="text-2xl font-bold text-ink">You're signed in</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            <div className="grid gap-2 mt-6">
              <button onClick={() => navigate("/account/profile")} className="rounded-md bg-brand text-white font-semibold py-2.5">
                Go to Dashboard
              </button>
              <button
                onClick={async () => { await signOut(); toast({ title: "Signed out" }); }}
                className="rounded-md border border-border font-semibold py-2.5"
              >
                Log out
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/account/profile" : undefined,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "Check your inbox if email confirmation is required." });
        navigate("/account/profile");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!" });
        navigate("/account/profile");
      }
    } catch (err: any) {
      toast({ title: "Authentication failed", description: err?.message ?? "Try again.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container py-16 grid place-items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-card border border-border shadow-soft p-8">
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-saffron via-white to-deep-green text-deep-green grid place-items-center font-black">DS</div>
            <h1 className="mt-3 text-2xl font-bold text-ink">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Log in to manage your applications" : "Sign up to start applying online"}
            </p>
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-semibold text-ink">Full Name</label>
                <Input className="mt-1" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-ink">Email</label>
              <Input className="mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Password</label>
              <Input className="mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
            </div>
            <button disabled={busy} className="w-full rounded-md bg-brand text-white font-semibold py-2.5 hover:bg-brand-dark inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {mode === "login" ? "Log in" : "Sign up"}
            </button>
            <p className="text-xs text-center text-muted-foreground">
              {mode === "login" ? (
                <>Don't have an account?{" "}
                  <button type="button" onClick={() => setMode("signup")} className="text-brand font-semibold">Sign up</button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button type="button" onClick={() => setMode("login")} className="text-brand font-semibold">Log in</button>
                </>
              )}
            </p>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Account;
