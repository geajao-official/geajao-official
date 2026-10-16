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

  return logoUrl ? <img src={logoUrl} alt="Cadet logo" className="h-12 w-28 rounded-xl object-contain object-left ring-1 ring-violet-400/30" /> : <div className="relative flex h-12 w-28 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/30"><div className="absolute h-7 w-7 rounded-full border-2 border-violet-400" /><Check className="relative h-5 w-5 text-violet-300" strokeWidth={3} /></div>;
};

export default BrandLogo;
