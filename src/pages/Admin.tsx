import { useEffect, useState, type ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, FileAudio, FileImage, FileText, ShieldAlert, ShieldCheck, Trash2, Upload, Users } from "lucide-react";

type Profile = { id: string; username: string; real_name: string; id_image_url: string | null; is_verified: boolean; created_at: string };
type SiteMedia = { id: string; kind: "image" | "audio"; url: string; name: string; active: boolean };
type Post = { id: string; author_id: string; content: string; media_url: string | null; created_at: string };

const PIN = "2026";
const readFile = (file: File) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });

const Admin = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(() => sessionStorage.getItem("geajao-admin") === "1");
  const [pin, setPin] = useState("");
  const [tab, setTab] = useState<"accounts" | "posts" | "media">("accounts");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [media, setMedia] = useState<SiteMedia[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3000); };

  const loadPosts = async () => {
    const { data, error } = await supabase.rpc("list_admin_posts_json", { admin_pin: PIN });
    if (error) notify(`Posts could not be loaded — ${error.message}`);
    else setPosts(data ?? []);
  };

  const load = async () => {
    setBusy(true);
    const results = await Promise.allSettled([
      supabase.rpc("list_admin_profiles", { admin_pin: PIN }),
      supabase.rpc("list_admin_site_media", { admin_pin: PIN }),
    ]);
    const [profileResult, mediaResult] = results;
    const errors = results.map((result, index) => {
      const resource = ["accounts", "media"][index];
      return result.status === "rejected"
        ? `${resource}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`
        : result.value.error && `${resource}: ${result.value.error.message}`;
    }).filter(Boolean);
    if (errors.length) {
      notify(`Database connection failed — ${errors.join(" · ")}`);
      setBusy(false);
      return;
    }
    const profilesData = profileResult.status === "fulfilled" ? profileResult.value.data ?? [] : [];
    const mediaData = mediaResult.status === "fulfilled" ? mediaResult.value.data ?? [] : [];
    setProfiles(profilesData);
    setMedia(mediaData);
    setSelected((current) => current ? profilesData.find((item: Profile) => item.id === current.id) ?? current : profilesData[0] ?? null);
    setBusy(false);
  };

  useEffect(() => { if (authorized) void load(); }, [authorized]);
  useEffect(() => { if (authorized && tab === "posts") void loadPosts(); }, [authorized, tab]);
  const unlock = () => { if (pin !== PIN) return notify("That PIN does not match."); sessionStorage.setItem("geajao-admin", "1"); setAuthorized(true); };
  const approve = async () => { if (!selected) return; const { error } = await supabase.rpc("approve_profile", { target_user_id: selected.id, admin_pin: PIN }); if (error) notify(error.message); else { notify(`${selected.real_name} is now verified.`); await load(); } };
  const deletePost = async (postId: string) => { const { error } = await supabase.rpc("delete_post_admin", { admin_pin: PIN, post_id: postId }); if (error) notify(error.message); else { setPosts((current) => current.filter((post) => post.id !== postId)); notify("Post removed from the community."); } };
  const uploadMedia = async (event: ChangeEvent<HTMLInputElement>, kind: "image" | "audio") => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 8 * 1024 * 1024) return notify("Please choose a file smaller than 8 MB."); setBusy(true); try { const url = await readFile(file); const { data, error } = await supabase.rpc("save_site_media", { admin_pin: PIN, media_kind: kind, media_url: url, media_name: file.name }); if (error) notify(error.message); else { setMedia((current) => [data, ...current]); notify(`${kind === "image" ? "Slideshow image" : "Background audio"} uploaded.`); } } finally { setBusy(false); event.target.value = ""; } };
  const deleteMedia = async (id: string) => { const { error } = await supabase.rpc("delete_site_media", { admin_pin: PIN, media_id: id }); if (error) notify(error.message); else setMedia((current) => current.filter((item) => item.id !== id)); };
  const exit = () => { sessionStorage.removeItem("geajao-admin"); navigate("/"); };

  if (!authorized) return <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-5 text-zinc-100"><div className="w-full max-w-[390px] rounded-2xl border border-zinc-800 bg-[#14151b] p-7 text-center"><ShieldCheck className="mx-auto h-7 w-7 text-violet-300" /><h1 className="mt-5 text-xl font-semibold">Admin PIN required</h1><p className="mt-2 text-sm text-zinc-500">Authorized staff only.</p><Input autoFocus value={pin} onChange={(event) => setPin(event.target.value)} onKeyDown={(event) => event.key === "Enter" && unlock()} type="password" placeholder="Enter PIN" className="mt-6 h-11 border-zinc-700 bg-[#0f1014] text-center tracking-[0.3em]" /><Button onClick={unlock} className="mt-3 h-11 w-full rounded-xl bg-violet-600 text-white hover:bg-violet-500">Unlock workspace</Button>{notice && <p className="mt-3 text-xs text-red-400">{notice}</p>}<button onClick={() => navigate("/")} className="mt-5 text-xs text-zinc-600">Return to sign in</button></div></main>;

  return <div className="min-h-screen bg-[#09090b] text-zinc-100"><header className="border-b border-zinc-800/80 bg-[#0f1014]"><div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15"><Check className="h-4 w-4 text-violet-300" /></div><span className="text-sm font-semibold">geajao <span className="text-zinc-600">/ admin</span></span></div><button onClick={exit} className="text-xs text-zinc-500 hover:text-zinc-200">Exit</button></div></header><main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Trust & safety</p><h1 className="mt-2 text-3xl font-semibold">Admin workspace</h1><p className="mt-2 text-sm text-zinc-500">Moderate members, posts, and the landing experience.</p></div><Button variant="outline" onClick={() => void load()} disabled={busy} className="border-zinc-700 bg-transparent text-xs">{busy ? "Syncing…" : "Sync database"}</Button></div><div className="mt-8 flex flex-wrap gap-2">{([['accounts', `Accounts (${profiles.length})`], ['posts', `Posts (${posts.length})`], ['media', `Landing media (${media.length})`]] as const).map(([value, label]) => <button key={value} onClick={() => setTab(value)} className={`rounded-xl px-4 py-2.5 text-xs ${tab === value ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/30" : "text-zinc-500 hover:bg-zinc-800/60"}`}>{label}</button>)}</div>{tab === "accounts" && <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]"><div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#14151b]"><div className="border-b border-zinc-800 p-5"><h2 className="font-medium">All accounts</h2><p className="mt-1 text-xs text-zinc-500">Verification status is stored in Supabase.</p></div>{profiles.length ? <div className="divide-y divide-zinc-800/80">{profiles.map((profile) => <button key={profile.id} onClick={() => setSelected(profile)} className={`flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-zinc-800/40 ${selected?.id === profile.id ? "bg-violet-500/[0.06]" : ""}`}><div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-xs font-semibold text-violet-200">{profile.real_name.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{profile.real_name}</p><p className="text-xs text-zinc-600">@{profile.username}</p></div>{profile.is_verified ? <Badge className="border-0 bg-emerald-400/10 text-[10px] text-emerald-300">Verified</Badge> : <Badge className="border-0 bg-amber-400/10 text-[10px] text-amber-300">Pending</Badge>}</button>)}</div> : <div className="p-12 text-center text-sm text-zinc-500"><Users className="mx-auto mb-3 h-6 w-6 text-zinc-700" />No accounts found.</div>}</div><aside className="rounded-2xl border border-zinc-800 bg-[#14151b] p-5">{selected ? <><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Account detail</p><h2 className="mt-2 text-xl font-semibold">{selected.real_name}</h2><p className="mt-1 text-sm text-zinc-500">@{selected.username}</p>{selected.id_image_url && <img src={selected.id_image_url} alt="Submitted identity document" className="mt-5 max-h-48 w-full rounded-xl border border-zinc-700 object-contain" />}<Button onClick={approve} disabled={selected.is_verified} className="mt-5 h-10 w-full bg-emerald-600 text-xs text-white disabled:opacity-40"><ShieldCheck className="mr-2 h-4 w-4" />{selected.is_verified ? "Verified" : "Approve account"}</Button></> : <p className="text-sm text-zinc-500">Select an account to review.</p>}</aside></section>}{tab === "posts" && <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#14151b]"><div className="border-b border-zinc-800 p-5"><h2 className="font-medium">Post moderation</h2><p className="mt-1 text-xs text-zinc-500">Deleting here removes the post from the feed for everyone.</p></div>{posts.length ? <div className="divide-y divide-zinc-800/80">{posts.map((post) => <article key={post.id} className="flex gap-4 p-5"><div className="min-w-0 flex-1"><p className="text-xs text-zinc-600">Author {post.author_id.slice(0, 8)} · {new Date(post.created_at).toLocaleString()}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{post.content || "Media post"}</p>{post.media_url && <img src={post.media_url} alt="Post attachment" className="mt-3 max-h-36 rounded-lg object-contain" />}</div><Button variant="outline" onClick={() => void deletePost(post.id)} className="h-9 shrink-0 border-red-400/20 bg-red-400/5 text-xs text-red-300"><Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete</Button></article>)}</div> : <div className="p-12 text-center text-sm text-zinc-500"><FileText className="mx-auto mb-3 h-6 w-6 text-zinc-700" />No posts to moderate.</div>}</section>}{tab === "media" && <section className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]"><div className="rounded-2xl border border-zinc-800 bg-[#14151b] p-5"><h2 className="font-medium">Landing experience</h2><p className="mt-2 text-xs leading-5 text-zinc-500">Images rotate behind the login page. One uploaded audio file plays when a visitor enables sound.</p><label className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-violet-400/30 bg-violet-500/10 px-4 py-5 text-xs text-violet-200"><FileImage className="h-4 w-4" /> Add slideshow image<input type="file" accept="image/*" className="sr-only" onChange={(event) => void uploadMedia(event, "image")} /></label><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 px-4 py-5 text-xs text-zinc-300"><FileAudio className="h-4 w-4" /> Add background audio<input type="file" accept="audio/*" className="sr-only" onChange={(event) => void uploadMedia(event, "audio")} /></label></div><div className="rounded-2xl border border-zinc-800 bg-[#14151b] p-5"><h2 className="font-medium">Uploaded media</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{media.map((item) => <div key={item.id} className="rounded-xl border border-zinc-800 bg-[#0f1014] p-3">{item.kind === "image" ? <img src={item.url} alt={item.name} className="h-32 w-full rounded-lg object-cover" /> : <audio controls src={item.url} className="mt-12 w-full" />}<div className="mt-3 flex items-center justify-between gap-3"><p className="truncate text-xs text-zinc-400">{item.name}</p><button onClick={() => void deleteMedia(item.id)} className="text-zinc-600 hover:text-red-300" aria-label={`Delete ${item.name}`}><Trash2 className="h-4 w-4" /></button></div></div>)}</div>{!media.length && <p className="mt-8 text-center text-sm text-zinc-600">No landing media uploaded yet.</p>}</div></section>}{notice && <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-xl border border-violet-400/20 bg-[#1b1c24] px-4 py-3 text-xs text-zinc-200 shadow-2xl">{notice}</div>}</main></div>;
};
export default Admin;
