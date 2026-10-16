import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  FileCheck2,
  Image as ImageIcon,
  LockKeyhole,
  LogIn,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

const badWords = ["idiot", "stupid", "hate", "damn"];

const initialPosts = [
  {
    id: 1,
    name: "Maya Chen",
    handle: "mayac",
    time: "18 min ago",
    initials: "MC",
    tone: "from-violet-500/30 to-sky-500/10",
    copy: "Small, thoughtful updates make a community feel like home. What are you making space for this week?",
    likes: 42,
    comments: 8,
    liked: false,
  },
  {
    id: 2,
    name: "Andre Okafor",
    handle: "andre.o",
    time: "1 hr ago",
    initials: "AO",
    tone: "from-fuchsia-500/25 to-orange-400/10",
    copy: "The first Geajao community meetup is coming together. Share a song that belongs on the welcome playlist.",
    likes: 28,
    comments: 14,
    liked: true,
  },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/30">
        <div className="absolute h-5 w-5 rounded-full border-2 border-violet-400" />
        <Check className="relative h-4 w-4 text-violet-300" strokeWidth={3} />
      </div>
      {!compact && <span className="text-[17px] font-semibold tracking-[-0.03em] text-zinc-100">geajao</span>}
    </div>
  );
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-8 w-8 text-[10px]", md: "h-10 w-10 text-xs", lg: "h-12 w-12 text-sm" };
  return <div className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/80 to-indigo-600 font-semibold text-white ring-2 ring-violet-400/10 ${sizes[size]}`}>{initials}</div>;
}

function BadgedName({ name, handle }: { name: string; handle: string }) {
  return <div><div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-100">{name}<BadgeCheck className="h-3.5 w-3.5 text-violet-400" /></div><div className="text-xs text-zinc-500">@{handle}</div></div>;
}

function FilteredText({ text }: { text: string }) {
  return <>{text.split(/(\s+)/).map((part, index) => badWords.some((word) => part.toLowerCase().includes(word)) ? <span key={index} className="rounded bg-zinc-700/80 px-1 text-transparent blur-[4px]" title="Sensitive language filtered">{part}</span> : <span key={index}>{part}</span>)}</>;
}

function AuthScreen() {
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", name: "", contact: "" });

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: event.target.value });
  const enter = (event: React.FormEvent) => { event.preventDefault(); setSubmitted(true); };

  if (showAdmin) return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-5 py-10 text-zinc-100">
      <div className="ambient ambient-auth" />
      <div className="relative w-full max-w-[410px]">
        <button onClick={() => setShowAdmin(false)} className="mb-8 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-200"><X className="h-4 w-4" /> Back to sign in</button>
        <div className="rounded-2xl border border-zinc-800 bg-[#14151b]/95 p-7 shadow-2xl shadow-black/30 sm:p-9">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300"><LockKeyhole className="h-5 w-5" /></div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Private access</p>
          <h1 className="text-2xl font-semibold tracking-tight">Admin gateway</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Enter the secure PIN to open the moderation workspace.</p>
          <Input autoFocus value={adminPin} onChange={(e) => setAdminPin(e.target.value)} type="password" placeholder="••••••••" className="mt-7 h-12 border-zinc-700 bg-[#0f1014] text-center text-xl tracking-[0.4em]" />
          <Button onClick={() => adminPin === "2026" ? (sessionStorage.setItem("geajao-admin", "1"), navigate("/admin")) : setSubmitted(true)} className="mt-4 h-12 w-full rounded-xl bg-violet-600 text-white hover:bg-violet-500">Unlock workspace <ArrowRight className="ml-2 h-4 w-4" /></Button>
          {submitted && adminPin !== "2026" && <p className="mt-3 text-center text-xs text-red-400">That PIN doesn’t match. Try again.</p>}
          <p className="mt-7 text-center text-[11px] text-zinc-600">Authorized staff only · Activity is logged</p>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090b] text-zinc-100">
      <div className="ambient ambient-auth" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12"><Logo /><button onClick={() => setShowAdmin(true)} className="group flex items-center gap-2 text-xs text-zinc-600 transition hover:text-violet-300"><LockKeyhole className="h-3.5 w-3.5" /> Staff access</button></nav>
      <div className="relative mx-auto grid min-h-[calc(100vh-86px)] max-w-7xl items-center gap-14 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1fr_410px] lg:gap-24 lg:px-12 lg:pb-24">
        <section className="max-w-xl">
          <Badge className="mb-6 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-300"><Sparkles className="mr-1.5 h-3 w-3" /> A considered space for real people</Badge>
          <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-zinc-50 sm:text-6xl">A quieter kind of <span className="text-violet-400">social.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-zinc-500 sm:text-lg">Geajao is a private community built around trust, identity, and conversations worth keeping.</p>
          <div className="mt-10 flex flex-wrap gap-6 text-xs text-zinc-500"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Verified members only</div><div className="flex items-center gap-2"><Users className="h-4 w-4 text-sky-400" /> Human-first by design</div></div>
        </section>
        <section className="rounded-2xl border border-zinc-800 bg-[#14151b]/95 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="mb-7"><h2 className="text-xl font-semibold tracking-tight">{registering ? "Create your account" : "Welcome back"}</h2><p className="mt-1.5 text-sm text-zinc-500">{registering ? "Join the community when your identity is approved." : "Sign in to your verified community."}</p></div>
          {submitted && registering ? <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4"><div className="flex items-center gap-2 text-sm font-medium text-amber-200"><FileCheck2 className="h-4 w-4" /> Application started</div><p className="mt-2 text-xs leading-5 text-amber-100/60">Your account is ready for the office verification step. Continue with your ID card once signed in.</p><Button onClick={() => { setSubmitted(false); setRegistering(false); }} variant="ghost" className="mt-4 h-9 px-0 text-xs text-amber-200 hover:bg-transparent hover:text-white">Return to sign in <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button></div> : <form onSubmit={enter} className="space-y-4">{registering && <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2"><span className="text-xs font-medium text-zinc-400">Real name</span><Input required value={form.name} onChange={update("name")} placeholder="Your name" className="h-11 border-zinc-700 bg-[#0f1014]" /></label><label className="space-y-2"><span className="text-xs font-medium text-zinc-400">Mobile or email</span><Input required value={form.contact} onChange={update("contact")} placeholder="you@example.com" className="h-11 border-zinc-700 bg-[#0f1014]" /></label></div>}<label className="block space-y-2"><span className="text-xs font-medium text-zinc-400">Username</span><Input required value={form.username} onChange={update("username")} placeholder="your.handle" className="h-11 border-zinc-700 bg-[#0f1014]" /></label><label className="block space-y-2"><span className="text-xs font-medium text-zinc-400">Password</span><Input required value={form.password} onChange={update("password")} type="password" placeholder="Enter your password" className="h-11 border-zinc-700 bg-[#0f1014]" /></label><Button type="submit" className="h-11 w-full rounded-xl bg-violet-600 text-white hover:bg-violet-500">{registering ? "Create account" : "Sign in"}<ArrowRight className="ml-2 h-4 w-4" /></Button></form>}
          <div className="mt-6 text-center text-sm text-zinc-500">{registering ? "Already a member?" : "New to Geajao?"} <button onClick={() => { setRegistering(!registering); setSubmitted(false); }} className="font-medium text-violet-400 hover:text-violet-300">{registering ? "Sign in" : "Create an account"}</button></div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600"><ShieldCheck className="h-3 w-3" /> Your ID is only visible to authorized office admins</p>
        </section>
      </div>
    </main>
  );
}

function VerificationGate({ onSubmit }: { onSubmit: () => void }) {
  const [fileName, setFileName] = useState("");
  return <div className="mx-auto max-w-2xl py-12"><div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300"><FileCheck2 className="h-6 w-6" /></div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">One last step</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Verify your identity to enter</h1><p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">Geajao is a verified community. Upload a clear photo of your office ID card and our admins will review it privately.</p><div className="mt-8 rounded-2xl border border-zinc-800 bg-[#14151b] p-6"><div className="flex flex-col gap-6 sm:flex-row sm:items-center"><div className="flex h-32 flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-[#0f1014] text-center">{fileName ? <div><FileCheck2 className="mx-auto h-7 w-7 text-emerald-400" /><p className="mt-2 max-w-[180px] truncate text-xs text-zinc-300">{fileName}</p></div> : <label className="cursor-pointer px-6"><ImageIcon className="mx-auto h-7 w-7 text-zinc-600" /><p className="mt-2 text-xs text-zinc-500">Choose ID card image</p><input type="file" accept="image/*" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} /></label>}</div><div className="flex-1 space-y-3 text-xs text-zinc-500"><p className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-400" /> Reviewed only by authorized admins</p><p className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-400" /> Used only to confirm your identity</p><p className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-400" /> You’ll hear back after review</p></div></div><Button disabled={!fileName} onClick={onSubmit} className="mt-6 h-11 w-full rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40">Send for review <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
}

function PostCard({ post, onLike }: { post: typeof initialPosts[number]; onLike: () => void }) {
  return <article className="border-b border-zinc-800/80 px-5 py-6 sm:px-7"><div className="flex items-start gap-3"><Avatar initials={post.initials} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><BadgedName name={post.name} handle={post.handle} /><p className="mt-0.5 text-[11px] text-zinc-600">{post.time}</p></div><button aria-label="More post options" className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"><MoreHorizontal className="h-4 w-4" /></button></div><p className="mt-4 text-[15px] leading-7 text-zinc-300"><FilteredText text={post.copy} /></p>{post.id === 2 && <div className={`mt-5 flex h-40 items-end rounded-xl bg-gradient-to-br ${post.tone} p-5 ring-1 ring-inset ring-white/5`}><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">community note</p><p className="mt-1 text-lg font-medium text-zinc-100">Make room for good things.</p></div></div>}<div className="mt-5 flex items-center gap-5 text-xs text-zinc-600"><button onClick={onLike} className={`flex items-center gap-1.5 transition hover:text-violet-300 ${post.liked ? "text-violet-400" : ""}`}><span className="text-sm">{post.liked ? "♥" : "♡"}</span>{post.likes}</button><button className="flex items-center gap-1.5 hover:text-zinc-300"><MessageCircle className="h-3.5 w-3.5" /> {post.comments}</button><button className="ml-auto hover:text-zinc-300">Share</button></div></div></div></article>;
}

function Feed({ onLogout }: { onLogout: () => void }) {
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState("");
  const [posted, setPosted] = useState(false);
  const [active, setActive] = useState("Home");
  const createPost = () => { if (!draft.trim()) return; setPosts([{ id: Date.now(), name: "You", handle: "you", time: "Just now", initials: "YU", tone: "from-violet-500/25 to-indigo-500/10", copy: draft.trim(), likes: 0, comments: 0, liked: false }, ...posts]); setDraft(""); setPosted(true); setTimeout(() => setPosted(false), 2500); };
  const nav = [{ label: "Home", icon: Sparkles }, { label: "Discover", icon: Search }, { label: "Notifications", icon: Bell }];
  return <div className="min-h-screen bg-[#09090b] text-zinc-100"><header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-7"><Logo /><div className="hidden items-center gap-1 md:flex">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActive(label)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${active === label ? "bg-violet-500/10 text-violet-300" : "text-zinc-500 hover:text-zinc-200"}`}><Icon className="h-4 w-4" /> {label}</button>)}</div><div className="flex items-center gap-3"><button aria-label="Help" className="hidden rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 sm:block"><CircleHelp className="h-4 w-4" /></button><Avatar initials="YU" size="sm" /><button onClick={onLogout} className="hidden text-xs text-zinc-600 hover:text-zinc-300 sm:block">Sign out</button><button className="rounded-lg p-2 text-zinc-500 md:hidden"><Menu className="h-5 w-5" /></button></div></div></header><main className="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 px-0 pb-16 lg:grid-cols-[minmax(0,680px)_280px] lg:gap-16 lg:px-7"><section className="min-w-0"><div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-5 sm:px-7"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Community feed</p><h1 className="mt-1 text-xl font-semibold tracking-tight">Good to see you, Alex</h1></div><button className="rounded-lg border border-zinc-800 p-2 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200"><Search className="h-4 w-4" /></button></div>{active !== "Home" ? <div className="mx-5 mt-8 rounded-2xl border border-dashed border-zinc-800 p-10 text-center sm:mx-7"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300"><Search className="h-5 w-5" /></div><h2 className="mt-4 font-medium">{active} is taking shape</h2><p className="mt-2 text-sm text-zinc-500">This quiet corner is ready for the next community update.</p><Button onClick={() => setActive("Home")} variant="ghost" className="mt-4 text-violet-300">Back to home</Button></div> : <><div className="border-b border-zinc-800/80 p-5 sm:p-7"><div className="flex gap-3"><Avatar initials="YU" /><div className="flex-1"><Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="What’s worth sharing?" className="min-h-[82px] resize-none border-0 bg-transparent px-0 text-[15px] shadow-none placeholder:text-zinc-600 focus-visible:ring-0" /><div className="mt-4 flex items-center justify-between border-t border-zinc-800/80 pt-4"><div className="flex items-center gap-1"><button aria-label="Add photo" className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-800 hover:text-violet-300"><ImageIcon className="h-4 w-4" /></button><button aria-label="Add video" className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-800 hover:text-violet-300"><Play className="h-4 w-4" /></button><span className="ml-2 text-[11px] text-zinc-600">Inappropriate words are automatically filtered</span></div><Button onClick={createPost} disabled={!draft.trim()} className="h-9 rounded-lg bg-violet-600 px-4 text-xs text-white hover:bg-violet-500 disabled:opacity-40">Post</Button></div></div></div></div>{posted && <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-300 sm:mx-7"><Check className="h-4 w-4" /> Your post is live for verified members.</div>}{posts.map((post) => <PostCard key={post.id} post={post} onLike={() => setPosts(posts.map((item) => item.id === post.id ? { ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) } : item))} />)}</>}</section><aside className="hidden space-y-5 pt-9 lg:block"><div className="rounded-2xl border border-zinc-800 bg-[#14151b] p-5"><div className="flex items-center gap-2 text-sm font-medium"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Your account is verified</div><p className="mt-3 text-xs leading-5 text-zinc-500">You’re part of a private space where every member has been reviewed.</p><div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs"><span className="text-zinc-600">Member since</span><span className="text-zinc-300">Jan 2026</span></div></div><div className="rounded-2xl border border-zinc-800 bg-[#14151b] p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">People to know</p><button className="text-[11px] text-violet-400">See all</button></div><div className="mt-5 space-y-4"><div className="flex items-center gap-3"><Avatar initials="SK" size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">Sofia Khan</p><p className="text-[11px] text-zinc-600">Product & design</p></div><button className="rounded-md bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 hover:bg-violet-500/20 hover:text-violet-300">Follow</button></div><div className="flex items-center gap-3"><Avatar initials="TR" size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">Theo Rivera</p><p className="text-[11px] text-zinc-600">Community member</p></div><button className="rounded-md bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 hover:bg-violet-500/20 hover:text-violet-300">Follow</button></div></div></div><p className="px-1 text-[11px] leading-5 text-zinc-700">Geajao · Community guidelines · Privacy<br />Made for people, not engagement loops.</p></aside></main></div>;
}

const Index = () => {
  const [session, setSession] = useState<"auth" | "verification" | "feed">("auth");
  const [reviewed, setReviewed] = useState(false);
  if (session === "auth") return <AuthScreen />;
  if (session === "verification") return <div className="min-h-screen bg-[#09090b] px-5 text-zinc-100"><header className="mx-auto flex max-w-5xl items-center justify-between py-6"><Logo /><button onClick={() => setSession("auth")} className="text-xs text-zinc-500 hover:text-zinc-200">Sign out</button></header><VerificationGate onSubmit={() => setReviewed(true)} />{reviewed && <div className="fixed inset-x-5 bottom-6 mx-auto max-w-md rounded-xl border border-emerald-400/20 bg-[#14151b] px-5 py-4 shadow-2xl"><div className="flex gap-3"><Check className="mt-0.5 h-4 w-4 text-emerald-400" /><div><p className="text-sm font-medium">Application sent to the office</p><p className="mt-1 text-xs text-zinc-500">For this preview, your account is now approved.</p><button onClick={() => setSession("feed")} className="mt-3 text-xs font-medium text-violet-300">Enter Geajao <ArrowRight className="ml-1 inline h-3 w-3" /></button></div></div></div>}</div>;
  return <Feed onLogout={() => setSession("auth")} />;
};

export default Index;
