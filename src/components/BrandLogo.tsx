import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const showName = window.location.pathname !== "/admin";
  return <div className="flex items-center gap-3"><div className="shrink-0">{logoUrl ? <img src={logoUrl} alt="Cadet logo" className="h-9 w-9 rounded-xl object-cover ring-1 ring-violet-400/30" /> : <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/30"><div className="absolute h-5 w-5 rounded-full border-2 border-violet-400" /><Check className="relative h-4 w-4 text-violet-300" strokeWidth={3} /></div>}</div>{showName && <span className="text-[17px] font-semibold tracking-[-0.03em] text-zinc-100">Cadet</span>}</div>;
};

export default BrandLogo;
