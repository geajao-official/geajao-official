import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session))); }, []);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return setError("Use at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setError("");
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError(updateError.message);
    else navigate("/");
    setBusy(false);
  };
  return <main className="min-h-screen bg-[#09090b] px-5 py-6 text-zinc-100"><div className="mx-auto max-w-5xl"><BrandLogo showFooter={false} /><div className="mx-auto mt-16 max-w-md rounded-3xl border border-zinc-800 bg-[#14151b] p-7 shadow-2xl sm:p-9"><Link to="/" className="text-sm text-zinc-500 hover:text-violet-300"><ArrowLeft className="mr-2 inline h-4 w-4" />Back to sign in</Link><KeyRound className="mt-9 h-8 w-8 text-violet-300" /><h1 className="mt-6 text-3xl font-semibold">Choose a new password</h1>{ready ? <form onSubmit={submit} className="mt-7 space-y-4"><Input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="h-12 border-zinc-700 bg-[#0f1014]" /><Input required minLength={6} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Confirm new password" className="h-12 border-zinc-700 bg-[#0f1014]" /><Button disabled={busy} type="submit" className="h-12 w-full bg-violet-600 text-white">{busy ? "Updating…" : "Update password"}</Button>{error && <p className="text-sm text-red-300">{error}</p>}</form> : <><p className="mt-3 text-sm leading-6 text-zinc-400">This reset link is missing or has expired. Request a new link to continue.</p><Link to="/forgot-password" className="mt-7 block"><Button className="h-12 w-full bg-violet-600 text-white">Request a new link</Button></Link></>}</div></div></main>;
};

export default ResetPassword;
