import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock3,
  Download,
  Home,
  Maximize,
  Pause,
  Play,
  Share,
  Shapes,
  Sparkles,
  UserRound,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { shelves, shows, type Show } from "@/lib/catalog";
import { registerAppServiceWorker } from "@/lib/pwa";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Appflix — Seu cantinho com Jesus" },
      { name: "description", content: "Histórias de Jesus e da Bíblia contadas com carinho para crianças e famílias." },
      { property: "og:title", content: "Appflix — Seu cantinho com Jesus" },
      { property: "og:description", content: "Uma coleção cristã infantil sobre Jesus, seus milagres, parábolas, discípulos e ressurreição." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
type Screen = { name: "home" } | { name: "categories" } | { name: "profile" } | { name: "category"; title: string } | { name: "detail"; show: Show };

function Index() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [active, setActive] = useState<Show | null>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [showIos, setShowIos] = useState(false);
  const featured = shows[0];

  useEffect(() => {
    registerAppServiceWorker();
    const listener = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", listener);
    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [screen]);

  if (!featured) return null;

  const install = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
      return;
    }
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      setShowIos(true);
    }
  };

  const openHome = () => setScreen({ name: "home" });
  const openCategories = () => setScreen({ name: "categories" });
  const openProfile = () => setScreen({ name: "profile" });
  const openDetail = (show: Show) => setScreen({ name: "detail", show });

  return (
    <div className="min-h-screen bg-surround">
      <main className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-background pb-24 text-foreground shadow-app">
        {screen.name === "home" && (
          <HomeScreen
            featured={featured}
            install={install}
            onPlay={setActive}
            onOpenShow={openDetail}
            onOpenCategory={(title) => setScreen({ name: "category", title })}
            onOpenCategories={openCategories}
          />
        )}
        {screen.name === "categories" && <CategoriesScreen onBack={openHome} onOpen={(title) => setScreen({ name: "category", title })} />}
        {screen.name === "category" && <CategoryScreen title={screen.title} onBack={openCategories} onOpenShow={openDetail} onPlay={setActive} />}
        {screen.name === "detail" && <DetailScreen show={screen.show} onBack={openHome} onPlay={setActive} />}
        {screen.name === "profile" && <ProfileScreen install={install} onBack={openHome} />}
        <BottomNav active={screen.name} onHome={openHome} onCategories={openCategories} onProfile={openProfile} />
      </main>
      {active && <VideoPlayer show={active} onClose={() => setActive(null)} />}
      {showIos && <IosInstall onClose={() => setShowIos(false)} />}
    </div>
  );
}

function HomeScreen({ featured, install, onPlay, onOpenShow, onOpenCategory, onOpenCategories }: {
  featured: Show;
  install: () => void;
  onPlay: (show: Show) => void;
  onOpenShow: (show: Show) => void;
  onOpenCategory: (title: string) => void;
  onOpenCategories: () => void;
}) {
  const continueShows = shows.filter((show) => show.progress !== undefined);
  return (
    <div className="px-5 pb-8 pt-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase text-primary">Seu cantinho com Jesus</p>
          <h1 className="font-display mt-1 text-[2rem] leading-tight">Oi, pequeno explorador! <span aria-hidden="true">👋</span></h1>
        </div>
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-border bg-card shadow-soft" aria-label="24 desenhos">
          <strong className="font-display text-3xl text-primary">24</strong>
          <span className="-mt-3 text-[9px] font-bold uppercase text-muted-foreground">desenhos</span>
        </div>
      </header>

      <section className="relative mt-7 min-h-[390px] overflow-hidden rounded-3xl bg-card shadow-soft">
        <img src={featured.image} alt={featured.title} width={768} height={432} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-feature-overlay" />
        <div className="relative flex min-h-[390px] flex-col items-start justify-end p-6">
          <span className="rounded-full bg-card/85 px-3 py-1 text-[10px] font-black uppercase text-primary backdrop-blur-md">Coleção completa</span>
          <h2 className="font-display mt-3 max-w-[290px] text-[2.15rem] leading-[1.05]">{featured.title}</h2>
          <p className="mt-3 max-w-[310px] text-sm font-semibold leading-relaxed text-foreground/80">{featured.description}</p>
          <Button className="mt-5 rounded-full px-6" onClick={() => onPlay(featured)}><Play className="size-4 fill-current" /> Assistir agora</Button>
        </div>
      </section>

      <InstallBanner onInstall={install} />

      <SectionHeading title="Categorias" count={shelves.length} action="Ver todas" onAction={onOpenCategories} />
      <div className="grid grid-cols-2 gap-3">
        {shelves.slice(0, 4).map((shelf, index) => (
          <CategoryCard key={shelf.title} shelf={shelf} imageId={shelf.ids[index % shelf.ids.length] ?? shelf.ids[0]} onOpen={() => onOpenCategory(shelf.title)} />
        ))}
      </div>

      <SectionHeading title="Continue assistindo" count={continueShows.length} />
      <div className="grid grid-cols-2 gap-3">
        {continueShows.slice(0, 4).map((show) => <ShowCard key={show.id} show={show} onOpen={() => onOpenShow(show)} onPlay={() => onPlay(show)} />)}
      </div>

      <SectionHeading title="Todos os desenhos" count={shows.length} />
      <div className="grid grid-cols-2 gap-3">
        {shows.slice(5, 11).map((show) => <ShowCard key={show.id} show={show} onOpen={() => onOpenShow(show)} onPlay={() => onPlay(show)} />)}
      </div>
    </div>
  );
}

function ScreenHeader({ eyebrow, title, onBack }: { eyebrow: string; title: string; onBack: () => void }) {
  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-5 pb-5 pt-7">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="Voltar" className="rounded-full bg-card"><ArrowLeft /></Button>
      <div className="min-w-0"><p className="text-[10px] font-black uppercase text-primary">{eyebrow}</p><h1 className="font-display truncate text-3xl">{title}</h1></div>
    </header>
  );
}

function CategoriesScreen({ onBack, onOpen }: { onBack: () => void; onOpen: (title: string) => void }) {
  return (
    <div className="pb-8">
      <ScreenHeader eyebrow="Explore por tema" title="Categorias" onBack={onBack} />
      <div className="grid grid-cols-2 gap-3 px-5">
        {shelves.map((shelf, index) => <CategoryCard key={shelf.title} shelf={shelf} imageId={shelf.ids[index % shelf.ids.length] ?? shelf.ids[0]} onOpen={() => onOpen(shelf.title)} />)}
      </div>
    </div>
  );
}

function CategoryScreen({ title, onBack, onOpenShow, onPlay }: { title: string; onBack: () => void; onOpenShow: (show: Show) => void; onPlay: (show: Show) => void }) {
  const shelf = shelves.find((item) => item.title === title);
  const items = shelf?.ids.map((id) => shows.find((show) => show.id === id)).filter((show): show is Show => Boolean(show)) ?? [];
  return (
    <div className="pb-8">
      <ScreenHeader eyebrow={`${items.length} desenhos`} title={title} onBack={onBack} />
      <div className="grid grid-cols-2 gap-3 px-5">
        {items.map((show) => <ShowCard key={show.id} show={show} onOpen={() => onOpenShow(show)} onPlay={() => onPlay(show)} />)}
      </div>
    </div>
  );
}

function DetailScreen({ show, onBack, onPlay }: { show: Show; onBack: () => void; onPlay: (show: Show) => void }) {
  const related = shows.filter((item) => item.id !== show.id).slice(0, 4);
  return (
    <div className="pb-8">
      <div className="relative h-[330px] overflow-hidden">
        <img src={show.image} alt={show.title} width={768} height={432} className="size-full object-cover" />
        <div className="absolute inset-0 bg-detail-overlay" />
        <Button variant="player" size="icon" onClick={onBack} aria-label="Voltar" className="absolute left-5 top-6 rounded-full"><ArrowLeft /></Button>
      </div>
      <div className="relative -mt-16 px-5">
        <span className="rounded-full bg-card px-3 py-1 text-[10px] font-black uppercase text-primary">Livre para toda família</span>
        <h1 className="font-display mt-3 text-[2.5rem] leading-none">{show.title}</h1>
        <div className="mt-3 flex items-center gap-4 text-xs font-bold text-muted-foreground"><span className="flex items-center gap-1"><Clock3 className="size-4" /> {show.duration}</span><span>{show.age}</span></div>
        <p className="mt-5 text-sm font-semibold leading-7 text-foreground/75">{show.description}</p>
        <Button size="lg" className="mt-6 w-full rounded-full" onClick={() => onPlay(show)}><Play className="size-5 fill-current" /> Assistir agora</Button>
        <SectionHeading title="Você também pode gostar" count={related.length} />
        <div className="grid grid-cols-2 gap-3">{related.map((item) => <ShowCard key={item.id} show={item} onOpen={() => onPlay(item)} onPlay={() => onPlay(item)} />)}</div>
      </div>
    </div>
  );
}

function ProfileScreen({ install, onBack }: { install: () => void; onBack: () => void }) {
  return (
    <div className="pb-8">
      <ScreenHeader eyebrow="Seu espaço" title="Perfil" onBack={onBack} />
      <div className="px-5">
        <div className="flex flex-col items-center rounded-3xl bg-card px-5 py-8 text-center shadow-soft">
          <div className="grid size-20 place-items-center rounded-full bg-accent text-primary"><UserRound className="size-9" /></div>
          <h2 className="font-display mt-4 text-3xl">Pequeno explorador</h2>
          <p className="mt-2 max-w-xs text-sm font-semibold leading-relaxed text-muted-foreground">Seu lugar para conhecer Jesus, aprender histórias da Bíblia e crescer em família.</p>
        </div>
        <div className="mt-5 rounded-3xl border border-border bg-card p-5">
          <div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Download /></div><div><h3 className="font-display text-xl">Leve o Appflix com você</h3><p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">Instale na tela inicial para abrir como um aplicativo.</p></div></div>
          <Button className="mt-5 w-full rounded-full" onClick={install}><Download className="size-4" /> Instalar app</Button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={BookOpen} value="24" label="desenhos" />
          <Stat icon={Shapes} value="6" label="categorias" />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof BookOpen; value: string; label: string }) {
  return <div className="rounded-2xl bg-card p-4"><Icon className="size-5 text-primary" /><strong className="font-display mt-3 block text-3xl">{value}</strong><span className="text-xs font-bold text-muted-foreground">{label}</span></div>;
}

function InstallBanner({ onInstall }: { onInstall: () => void }) {
  return (
    <button onClick={onInstall} className="mt-4 grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-accent" aria-label="Instalar Appflix">
      <span className="grid size-9 place-items-center rounded-xl bg-accent text-primary"><Download className="size-4" /></span>
      <span className="min-w-0"><strong className="block text-xs">Instale o Appflix</strong><small className="block truncate text-[10px] font-semibold text-muted-foreground">Seu cantinho, sempre por perto</small></span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

function SectionHeading({ title, count, action, onAction }: { title: string; count: number; action?: string; onAction?: () => void }) {
  return (
    <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 pb-3">
      <div className="min-w-0"><h2 className="font-display truncate text-[1.65rem]">{title}</h2><p className="text-[10px] font-bold uppercase text-muted-foreground">{count} {count === 1 ? "item" : "itens"}</p></div>
      {action && <Button variant="ghost" className="h-9 min-h-9 rounded-full px-3 text-xs text-primary" onClick={onAction}>{action}</Button>}
    </div>
  );
}

function CategoryCard({ shelf, imageId, onOpen }: { shelf: typeof shelves[number]; imageId: number | undefined; onOpen: () => void }) {
  const image = shows.find((show) => show.id === imageId)?.image ?? shows[0]?.image;
  return (
    <Button variant="ghost" onClick={onOpen} className="group relative aspect-[4/5] h-auto min-h-0 w-full overflow-hidden rounded-2xl p-0 text-left shadow-soft">
      {image && <img src={image} alt="" loading="lazy" width={768} height={768} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />}
      <span className="absolute inset-0 bg-card-overlay" />
      <span className="absolute inset-x-3 bottom-3 min-w-0"><strong className="font-display block text-lg leading-tight text-foreground">{shelf.title}</strong><small className="mt-1 block text-[10px] font-bold text-foreground/65">{shelf.ids.length} episódios</small></span>
      <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="size-3.5 fill-current" /></span>
    </Button>
  );
}

function ShowCard({ show, onOpen, onPlay }: { show: Show; onOpen: () => void; onPlay: () => void }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-card shadow-soft">
      <button onClick={onOpen} className="group relative block aspect-[4/3] w-full overflow-hidden text-left" aria-label={`Ver detalhes de ${show.title}`}>
        <img src={show.image} alt={show.title} loading="lazy" width={768} height={768} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 bg-thumbnail-overlay" />
      </button>
      <div className="grid min-h-[92px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-3">
        <button onClick={onOpen} className="min-w-0 text-left"><strong className="font-display line-clamp-2 block text-base leading-tight">{show.title}</strong><small className="mt-1 block text-[10px] font-bold text-muted-foreground">{show.duration} · {show.age}</small></button>
        <Button size="icon" onClick={onPlay} className="size-9 min-h-9 rounded-full" aria-label={`Assistir ${show.title}`}><Play className="size-3.5 fill-current" /></Button>
      </div>
      {show.progress !== undefined && <div className="h-1 bg-muted"><div className="h-full bg-primary" style={{ width: `${show.progress}%` }} /></div>}
    </article>
  );
}

function BottomNav({ active, onHome, onCategories, onProfile }: { active: Screen["name"]; onHome: () => void; onCategories: () => void; onProfile: () => void }) {
  const items = [
    { label: "Início", icon: Home, selected: active === "home" || active === "detail", action: onHome },
    { label: "Categorias", icon: Shapes, selected: active === "categories" || active === "category", action: onCategories },
    { label: "Perfil", icon: UserRound, selected: active === "profile", action: onProfile },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto grid h-[76px] w-full max-w-[430px] grid-cols-3 border-t border-border bg-nav px-5 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl" aria-label="Navegação principal">
      {items.map(({ label, icon: Icon, selected, action }) => <Button key={label} variant="ghost" onClick={action} className={`h-full min-h-0 flex-col gap-1 rounded-none text-[10px] ${selected ? "text-primary" : "text-muted-foreground"}`}><Icon className="size-5" /><span>{label}</span></Button>)}
    </nav>
  );
}

function VideoPlayer({ show, onClose }: { show: Show; onClose: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(show.progress ?? 0);
  const video = useRef<HTMLVideoElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const command = (func: string) => iframe.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  const toggle = () => {
    setPlaying((value) => !value);
    if (show.source.type === "youtube") command(playing ? "pauseVideo" : "playVideo");
    else if (video.current) playing ? video.current.pause() : void video.current.play();
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] bg-surround" role="dialog" aria-modal="true" aria-label={`Player de ${show.title}`}>
      <div ref={player} className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background shadow-app">
        <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4 py-4"><Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar player" className="rounded-full bg-card"><X /></Button><div className="min-w-0"><p className="text-[10px] font-black uppercase text-primary">Assistindo agora</p><h1 className="font-display truncate text-xl">{show.title}</h1></div></header>
        <div className="relative flex flex-1 items-center overflow-hidden bg-player-surface">
          {show.source.type === "youtube" ? <iframe ref={iframe} title={show.title} className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${show.source.id}?autoplay=1&controls=0&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video ref={video} autoPlay playsInline muted={muted} src={show.source.url} className="w-full" onTimeUpdate={(event) => { const duration = event.currentTarget.duration; if (duration) setProgress((event.currentTarget.currentTime / duration) * 100); }} />}
        </div>
        <div className="bg-card px-5 pb-8 pt-5">
          <input aria-label="Progresso do vídeo" type="range" min="0" max="100" value={progress} onChange={(event) => { const value = Number(event.target.value); setProgress(value); if (video.current?.duration) video.current.currentTime = video.current.duration * value / 100; }} className="h-1 w-full accent-primary" />
          <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"><Button size="icon" onClick={toggle} aria-label={playing ? "Pausar" : "Reproduzir"} className="rounded-full">{playing ? <Pause /> : <Play />}</Button><div className="min-w-0"><p className="font-display truncate text-lg">{show.title}</p><p className="text-[10px] font-bold text-muted-foreground">{show.duration} · {show.age}</p></div><div className="flex"><Button variant="ghost" size="icon" aria-label={muted ? "Ativar som" : "Desativar som"} onClick={() => { setMuted((value) => !value); if (show.source.type === "youtube") command(muted ? "unMute" : "mute"); }}>{muted ? <VolumeX /> : <Volume2 />}</Button><Button variant="ghost" size="icon" aria-label="Tela cheia" onClick={() => player.current?.requestFullscreen?.()}><Maximize /></Button></div></div>
        </div>
      </div>
    </div>
  );
}

function IosInstall({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-end bg-modal px-4 pb-6" role="dialog" aria-modal="true" aria-label="Instalar no iPhone">
      <div className="mx-auto w-full max-w-[398px] rounded-3xl border border-border bg-card p-5 shadow-app">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"><div><p className="font-display text-2xl">Instalar no iPhone</p><p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">Toque em <Share className="mx-1 inline size-4" /> Compartilhar e depois em “Adicionar à Tela de Início”.</p></div><Button variant="ghost" size="icon" aria-label="Fechar instruções" onClick={onClose}><X /></Button></div>
      </div>
    </div>
  );
}
