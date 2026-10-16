import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const logoMotion = "transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:rotate-1 hover:shadow-[0_12px_28px_rgba(139,92,246,0.28)]";

const BrandLogo = () => {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    supabase.rpc("get_site_branding").then(({ data }) => setLogoUrl(typeof data?.logo_url === "string" ? data.logo_url : ""));
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes("A considered space for real people")) node.nodeValue = node.nodeValue.replace("A considered space for real people", "A considered space for Cadet");
    }
  }, []);

  return logoUrl ? <img src={logoUrl} alt="Cadet logo" className={`h-12 w-auto max-w-28 rounded-xl object-contain object-left ring-1 ring-violet-400/30 ${logoMotion}`} /> : <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/30 ${logoMotion}`}><div className="absolute h-7 w-7 rounded-full border-2 border-violet-400" /><Check className="relative h-5 w-5 text-violet-300" strokeWidth={3} /></div>;
};

export default BrandLogo;
