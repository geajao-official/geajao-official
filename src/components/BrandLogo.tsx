import { useEffect, useState, type ChangeEvent } from "react";
import { Check, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const logoMotion = "transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:rotate-1 hover:shadow-[0_12px_28px_rgba(139,92,246,0.28)]";
const readFile = (file: File) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });

const TeamFooter = ({ logoUrl }: { logoUrl: string }) => <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-3"><div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-zinc-800/90 bg-[#111219]/90 px-4 py-2.5 text-xs text-zinc-400 shadow-2xl backdrop-blur-xl"><div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-violet-500/10 ring-1 ring-violet-400/20">{logoUrl ? <img src={logoUrl} alt="Team logo" className="h-full w-full object-contain" /> : <span className="text-[10px] font-bold text-violet-300">AI</span>}</div><span><span className="text-zinc-500">A Initiative of </span><strong className="font-medium text-zinc-200">Mukhosh</strong><span className="mx-2 text-zinc-700">·</span><span className="text-zinc-500">Dedicated To- </span><strong className="font-medium text-zinc-200">50th-CCR</strong></span></div></footer>;

const BrandLogo = () => {
  const [logoUrl, setLogoUrl] = useState("");
  const [teamLogoUrl, setTeamLogoUrl] = useState("");
  const isAdmin = window.location.pathname === "/admin";

  useEffect(() => {
    supabase.rpc("get_site_branding").then(({ data }) => { setLogoUrl(typeof data?.logo_url === "string" ? data.logo_url : ""); setTeamLogoUrl(typeof data?.team_logo_url === "string" ? data.team_logo_url : ""); });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes("A considered space for real people")) node.nodeValue = node.nodeValue.replace("A considered space for real people", "A considered space for Cadet");
    }
  }, []);

  const uploadTeamLogo = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const url = await readFile(file); const { data } = await supabase.rpc("save_team_logo", { admin_pin: "2026", logo_url: url }); if (data?.value) setTeamLogoUrl(data.value); event.target.value = ""; };
  const mark = logoUrl ? <img src={logoUrl} alt="Cadet logo" className={`h-12 w-auto max-w-28 rounded-xl object-contain object-left ring-1 ring-violet-400/30 ${logoMotion}`} /> : <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/30 ${logoMotion}`}><div className="absolute h-7 w-7 rounded-full border-2 border-violet-400" /><Check className="relative h-5 w-5 text-violet-300" strokeWidth={3} /></div>;
  return <><div className="flex items-center gap-3">{mark}{isAdmin && <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-2 text-[10px] text-zinc-400 hover:text-violet-200"><Upload className="h-3 w-3" /> Team logo<input type="file" accept="image/*" className="sr-only" onChange={(event) => void uploadTeamLogo(event)} /></label>}</div><TeamFooter logoUrl={teamLogoUrl} /></>;
};

export default BrandLogo;
