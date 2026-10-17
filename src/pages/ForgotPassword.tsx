import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const redirectTo = new URL("/reset-password", window.location.origin).href;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (resetError) setError(resetError.message);
    else setSent(true);
    setBusy(false);
  };
  return <main className="min-h-screen bg-[#09090b] px-5 py-6 text-zinc-100"><div className="mx-auto max-w-5xl"><BrandLogo showFooter={false} /><div className="mx-auto mt-16 max-w-md rounded-3xl border border-zinc-800 bg-[#14151b] p-7 shadow-2xl sm:p-9"><Link to="/" className="text-sm text-zinc-500 hover:text-violet-300"><ArrowLeft className="mr-2 inline h-4 w-4" />Back to sign in</Link><Mail className="mt-9 h-8 w-8 text-violet-300" /><h1 className="mt-6 text-3xl font-semibold">Forgot your password?</h1>{sent ? <><p className="mt-3 text-sm leading-6 text-zinc-400">If an account exists for that email, we sent a password reset link. Check your inbox and follow it to choose a new password.</p><Button onClick={() => setSent(false)} variant="outline" className="mt-7 w-full border-zinc-700">Send another link</Button></> : <><p className="mt-3 text-sm leading-6 text-zinc-400">Enter your account email and we’ll send you a secure reset link.</p><form onSubmit={submit} className="mt-7 space-y-4"><Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-12 border-zinc-700 bg-[#0f1014]" /><Button disabled={busy} type="submit" className="h-12 w-full bg-violet-600 text-white">{busy ? "Sending…" : "Send reset link"}</Button></form>{error && <p className="mt-4 text-sm text-red-300">{error}</p>}</>}</div></div></main>;
};

export default ForgotPassword;
