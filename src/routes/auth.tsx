import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Particles } from "@/components/Ambient";
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In — FocusFlow X" },
      { name: "description", content: "Sign in to your FocusFlow X deep work account." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="dark min-h-screen ambient-bg text-foreground relative overflow-hidden flex items-center justify-center p-5">
      <Toaster theme="dark" position="top-center" />
      <Particles />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-elevated p-8 w-full max-w-md relative z-10"
      >
        <Link to="/auth" className="flex items-center gap-2.5 mb-7">
          <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background font-semibold">F</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tracking-tight">FocusFlow</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">X</span>
          </div>
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "signin" ? "Sign in to continue your deep work." : "Start your deep work journey."}
        </p>

        <button
          onClick={onGoogle}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.891-1.742 2.981-4.305 2.981-7.35Z"/><path fill="#fff" d="M12 22c2.7 0 4.964-.895 6.619-2.422l-3.232-2.51c-.895.6-2.04.955-3.387.955-2.605 0-4.81-1.76-5.596-4.123H3.064v2.59A9.996 9.996 0 0 0 12 22Z" opacity=".7"/><path fill="#fff" d="M6.404 13.9A6.01 6.01 0 0 1 6.09 12c0-.66.114-1.3.314-1.9V7.51H3.064A9.996 9.996 0 0 0 2 12c0 1.614.386 3.14 1.064 4.49l3.34-2.59Z" opacity=".5"/><path fill="#fff" d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.959 2.99 14.695 2 12 2a9.996 9.996 0 0 0-8.936 5.51l3.34 2.59C7.19 7.737 9.395 5.977 12 5.977Z" opacity=".85"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-white/[0.07]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-white/[0.07]" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "signup" && (
            <Field icon={<UserIcon size={14} />} placeholder="Your name" value={name} onChange={setName} />
          )}
          <Field icon={<Mail size={14} />} type="email" placeholder="you@email.com" value={email} onChange={setEmail} required />
          <Field icon={<Lock size={14} />} type="password" placeholder="••••••••" value={password} onChange={setPassword} required minLength={6} />

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full justify-center mt-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-5">
          {mode === "signin" ? "New here? " : "Have an account? "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-foreground font-medium hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  icon, type = "text", placeholder, value, onChange, required, minLength,
}: {
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="w-full rounded-lg bg-white/[0.03] border border-white/[0.08] pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-colors"
      />
    </div>
  );
}
