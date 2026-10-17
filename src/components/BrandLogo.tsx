import { useEffect, useState, type ChangeEvent } from "react";
import { Check, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const logoMotion = "transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:rotate-1 hover:shadow-[0_12px_28px_rgba(139,92,246,0.28)]";
const readFile = (file: File) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });

const TeamFooter = ({ logoUrl }: { logoUrl: string }) => <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4 sm:pb-5"><div className="pointer-events-auto flex w-full max-w-xl items-center gap-4 rounded-3xl border border-violet-400/20 bg-[#111219]/95 px-5 py-4 text-sm text-zinc-400 shadow-[0_18px_60px_rgba(0,0,0,0.45),0_0_30px_rgba(124,58,237,0.12)] backdrop-blur-2xl sm:px-6"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/30 bg-violet-500/10 shadow-[inset_0_0_20px_rgba(139,92,246,0.12)]">{logoUrl ? <img src={logoUrl} alt="Team logo" className="h-full w-full object-contain p-1" /> : <span className="text-sm font-bold tracking-wide text-violet-300">M</span>}</div><div className="min-w-0 leading-5"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/80">A Initiative of</p><p className="truncate text-base font-semibold text-zinc-100">Mukhosh</p><div className="mt-1 flex items-center gap-2 text-xs text-zinc-500"><span className="h-px w-5 bg-violet-400/30" /><span>Dedicated To-</span><strong className="font-medium text-zinc-300">50th-CCR</strong></div></div><div className="ml-auto hidden h-10 w-px bg-zinc-800 sm:block" /><div className="hidden text-right text-[10px] uppercase tracking-[0.18em] text-zinc-600 sm:block">Rangpur<br />Cadet<br />College</div></div></footer>;

const BrandLogo = ({ showFooter = true }: { showFooter?: boolean }) => {
  const [logoUrl, setLogoUrl] = useState("");
  const [teamLogoUrl, setTeamLogoUrl] = useState("");
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const isAdmin = window.location.pathname === "/admin";

  useEffect(() => {
    supabase.rpc("get_site_branding").then(({ data }) => { setLogoUrl(typeof data?.logo_url === "string" ? data.logo_url : ""); setTeamLogoUrl(typeof data?.team_logo_url === "string" ? data.team_logo_url : ""); });
    supabase.auth.getSession().then(({ data }) => setHasSession(Boolean(data.session)));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => setHasSession(Boolean(session)));
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes("A considered space for real people")) {
        node.nodeValue = node.nodeValue.replace("A considered space for real people", "A considered space for Cadet");
        node.parentElement?.classList.add("old-english-font");
      }
      if (node.nodeValue?.includes("A quieter kind of ")) node.nodeValue = node.nodeValue.replace("A quieter kind of ", "CHOLO ");
      if (node.nodeValue?.includes("social.")) {
        node.nodeValue = node.nodeValue.replace("social.", "GEAJAI");
        node.parentElement?.classList.add("geajai-hover");
      }
    }
    return () => authListener.subscription.unsubscribe();
  }, []);

  const uploadTeamLogo = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const url = await readFile(file); const { data } = await supabase.rpc("save_team_logo", { admin_pin: "2026", logo_url: url }); if (data?.value) setTeamLogoUrl(data.value); event.target.value = ""; };
  const mark = logoUrl ? <img src={logoUrl} alt="Cadet logo" className={`h-12 w-auto max-w-28 rounded-xl object-contain object-left ring-1 ring-violet-400/30 ${logoMotion}`} /> : <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/30 ${logoMotion}`}><div className="absolute h-7 w-7 rounded-full border-2 border-violet-400" /><Check className="relative h-5 w-5 text-violet-300" strokeWidth={3} /></div>;
  return <><div className="flex items-center gap-3"><div className="brand-logo-hover">{mark}</div>{isAdmin && <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-2 text-[10px] text-zinc-400 hover:text-violet-200"><Upload className="h-3 w-3" /> Team logo<input type="file" accept="image/*" className="sr-only" onChange={(event) => void uploadTeamLogo(event)} /></label>}{window.location.pathname === "/" && hasSession === false && <a href="/forgot-password" className="text-xs text-zinc-500 transition-colors hover:text-violet-300">Forgot password?</a>}</div>{showFooter && hasSession === false && !isAdmin && <TeamFooter logoUrl={teamLogoUrl} />}</>;
};

export default BrandLogo;
