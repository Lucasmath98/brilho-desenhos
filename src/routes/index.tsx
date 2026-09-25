import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Home, Search, Shapes, UserRound, Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight, Maximize, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shelves, shows, type Show } from "@/lib/catalog";
import { registerAppServiceWorker } from "@/lib/pwa";
import heroImage from "@/assets/shows/show-01.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Appflix — Desenhos para pequenas grandes imaginações" },
    { name: "description", content: "Uma seleção divertida de desenhos infantis para assistir em família." },
    { property: "og:title", content: "Appflix — Desenhos infantis" },
    { property: "og:description", content: "Aventuras, bichinhos, clássicos e histórias educativas para crianças." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

function Index() {
  const [active, setActive] = useState<Show | null>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    registerAppServiceWorker();
    const listener = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPrompt); };
    window.addEventListener("beforeinstallprompt", listener);
    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  const install = async () => {
    if (installPrompt) { await installPrompt.prompt(); setInstallPrompt(null); return; }
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) setShowIos(true);
  };
  const filtered = useMemo(() => query ? shows.filter((show) => show.title.toLowerCase().includes(query.toLowerCase())) : [], [query]);
  const featured = shows.find((show) => show.id === 1);
  if (!featured) return null;

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground md:pb-8">
      <Header searchOpen={searchOpen} setSearchOpen={setSearchOpen} query={query} setQuery={setQuery} install={install} />
      {searchOpen && query ? <SearchResults shows={filtered} onPlay={setActive} /> : <>
        <section id="inicio" className="relative flex min-h-[78svh] items-end overflow-hidden md:min-h-[82vh]">
          <img src={heroImage} alt="Formiguinha astronauta ao lado de seu foguete" width={768} height={432} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--background)_2%,transparent_70%),linear-gradient(to_right,var(--background)_0%,transparent_75%)]" />
          <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-16 sm:px-8 md:pb-24 lg:px-14">
            <span className="mb-3 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-primary-foreground">Em destaque</span>
            <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">O Foguete do Formiguinha</h1>
            <p className="mt-4 max-w-lg text-base font-semibold text-foreground/85 sm:text-lg">Uma pequena astronauta e uma missão enorme: encontrar a flor mais brilhante da Lua.</p>
            <Button size="lg" className="mt-6" onClick={() => setActive(featured)}><Play className="size-5 fill-current" /> Assistir</Button>
          </div>
        </section>
        <div id="categorias" className="relative z-20 -mt-8 space-y-9 md:-mt-12">
          {shelves.map((shelf, index) => <Shelf key={shelf.title} shelf={shelf} delay={index} onPlay={setActive} />)}
        </div>
      </>}
      <BottomNav onSearch={() => setSearchOpen(true)} install={install} />
      {active && <VideoPlayer show={active} onClose={() => setActive(null)} />}
      {showIos && <div className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-sm rounded-lg border border-border bg-surface-raised p-4 shadow-2xl"><button aria-label="Fechar instruções" onClick={() => setShowIos(false)} className="float-right text-muted-foreground"><X /></button><p className="font-extrabold">Instalar no iPhone</p><p className="mt-2 text-sm text-muted-foreground">Toque em <Share className="mx-1 inline size-4" /> Compartilhar e depois em “Adicionar à Tela de Início”.</p></div>}
    </main>
  );
}

function Header({ searchOpen, setSearchOpen, query, setQuery, install }: { searchOpen: boolean; setSearchOpen: (v: boolean) => void; query: string; setQuery: (v: string) => void; install: () => void }) {
  return <header className="fixed inset-x-0 top-0 z-50 bg-background/75 backdrop-blur-xl"><div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-8 lg:px-14">
    <div className="flex min-w-0 items-center gap-8"><a href="#inicio" className="shrink-0 text-2xl font-black text-primary">APPFLIX</a><nav className="hidden items-center gap-6 text-sm font-bold md:flex"><a href="#inicio">Início</a><a href="#categorias">Categorias</a><button onClick={() => setSearchOpen(true)}>Buscar</button></nav></div>
    <div className="flex shrink-0 items-center gap-1">{searchOpen && <div className="absolute inset-x-3 top-2 flex h-12 items-center gap-2 rounded-md border border-border bg-surface-raised px-3 sm:static sm:w-72"><Search className="size-5 shrink-0"/><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar desenhos" className="min-w-0 flex-1 bg-transparent text-sm outline-none"/><button aria-label="Fechar busca" onClick={()=>{setSearchOpen(false);setQuery("")}}><X className="size-5"/></button></div>} {!searchOpen && <Button variant="ghost" size="icon" aria-label="Buscar" onClick={()=>setSearchOpen(true)}><Search /></Button>}<Button variant="ghost" size="icon" aria-label="Perfil"><UserRound /></Button><Button className="hidden sm:inline-flex" onClick={install}><Download className="size-4"/> Baixar app</Button></div>
  </div></header>;
}

function Shelf({ shelf, onPlay, delay }: { shelf: typeof shelves[number]; onPlay: (show: Show) => void; delay: number }) {
  const rail = useRef<HTMLDivElement>(null);
  const items = shelf.ids.map((id) => shows.find((show) => show.id === id)).filter((show): show is Show => Boolean(show));
  const move = (dir: number) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * .8, behavior: "smooth" });
  return <section className="shelf-reveal" style={{ animationDelay: `${delay * 55}ms` }}><div className="mb-3 flex items-center justify-between px-4 sm:px-8 lg:px-14"><h2 className="text-xl font-black sm:text-2xl">{shelf.title}</h2><div className="hidden gap-1 md:flex"><Button variant="ghost" size="icon" aria-label="Voltar" onClick={()=>move(-1)}><ChevronLeft/></Button><Button variant="ghost" size="icon" aria-label="Avançar" onClick={()=>move(1)}><ChevronRight/></Button></div></div><div ref={rail} className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:px-8 lg:px-14">{items.map((show)=><ShowCard key={show.id} show={show} onPlay={onPlay}/>)}</div></section>;
}

function ShowCard({ show, onPlay }: { show: Show; onPlay: (show: Show) => void }) {
  return <button onClick={()=>onPlay(show)} className="group w-[72vw] max-w-[280px] shrink-0 snap-start text-left sm:w-[34vw] md:w-[25vw] lg:w-[19vw]" aria-label={`Assistir ${show.title}`}><div className="relative aspect-video overflow-hidden rounded-md bg-card transition-transform duration-300 group-hover:scale-[1.04] group-focus-visible:ring-2 group-focus-visible:ring-ring"><img src={show.image} alt="" loading="lazy" width={768} height={432} className="size-full object-cover"/><div className="absolute inset-0 flex items-center justify-center bg-background/0 transition-colors group-hover:bg-background/30"><span className="grid size-12 scale-75 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"><Play className="size-5 fill-current"/></span></div>{show.progress != null && <div className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-foreground/25"><div className="h-full bg-primary" style={{width:`${show.progress}%`}}/></div>}</div><h3 className="mt-2 truncate text-sm font-extrabold sm:text-base">{show.title}</h3><p className="text-xs font-semibold text-muted-foreground">{show.age} · {show.duration}</p></button>;
}

function SearchResults({ shows: results, onPlay }: { shows: Show[]; onPlay: (show: Show)=>void }) { return <section className="mx-auto min-h-screen max-w-[1600px] px-4 pb-24 pt-24 sm:px-8 lg:px-14"><h1 className="text-3xl font-black">Buscar</h1><p className="mt-2 text-muted-foreground">{results.length} resultado(s)</p><div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{results.map(show=><ShowCard key={show.id} show={show} onPlay={onPlay}/>)}</div></section> }

function BottomNav({ onSearch, install }: { onSearch: ()=>void; install: ()=>void }) { const items = [{label:"Início",icon:Home,action:()=>location.hash="inicio"},{label:"Buscar",icon:Search,action:onSearch},{label:"Categorias",icon:Shapes,action:()=>location.hash="categorias"},{label:"Perfil",icon:UserRound,action:install}]; return <nav className="fixed inset-x-0 bottom-0 z-50 grid h-20 grid-cols-4 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">{items.map(({label,icon:Icon,action})=><button key={label} onClick={action} className="flex min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground first:text-primary"><Icon className="size-6"/><span className="truncate">{label}</span></button>)}</nav> }

function VideoPlayer({ show, onClose }: { show: Show; onClose: ()=>void }) {
  const [playing,setPlaying]=useState(true); const [muted,setMuted]=useState(false); const [progress,setProgress]=useState(12); const video=useRef<HTMLVideoElement>(null); const iframe=useRef<HTMLIFrameElement>(null);
  const command=(func:string)=>iframe.current?.contentWindow?.postMessage(JSON.stringify({event:"command",func,args:[]}),"*");
  const toggle=()=>{setPlaying(v=>!v); if(show.source.type==="youtube") command(playing?"pauseVideo":"playVideo"); else if(video.current) playing?video.current.pause():video.current.play();};
  useEffect(()=>{ const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose()}; addEventListener("keydown",key); return()=>removeEventListener("keydown",key)},[onClose]);
  return <div className="fixed inset-0 z-[80] flex flex-col bg-background" role="dialog" aria-modal="true" aria-label={`Player de ${show.title}`}><div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background">{show.source.type==="youtube"?<iframe ref={iframe} title={show.title} className="aspect-video w-full max-h-full" src={`https://www.youtube-nocookie.com/embed/${show.source.id}?autoplay=1&controls=0&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>:<video ref={video} autoPlay playsInline muted={muted} src={show.source.url} className="max-h-full w-full" onTimeUpdate={(e)=>setProgress((e.currentTarget.currentTime/e.currentTarget.duration)*100)}/>}<Button variant="player" size="icon" onClick={onClose} aria-label="Fechar player" className="absolute right-4 top-4"><X/></Button></div><div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,var(--background))] px-4 pb-5 pt-20 sm:px-8"><input aria-label="Progresso do vídeo" type="range" min="0" max="100" value={progress} onChange={(e)=>{setProgress(Number(e.target.value)); if(video.current?.duration) video.current.currentTime=video.current.duration*Number(e.target.value)/100}} className="h-1 w-full accent-primary"/><div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2"><Button variant="player" size="icon" onClick={toggle} aria-label={playing?"Pausar":"Reproduzir"}>{playing?<Pause/>:<Play/>}</Button><div className="min-w-0"><p className="truncate font-black">{show.title}</p><p className="text-xs text-muted-foreground">{show.duration} · {show.age}</p></div><div className="flex"><Button variant="player" size="icon" aria-label={muted?"Ativar som":"Desativar som"} onClick={()=>{setMuted(v=>!v); if(show.source.type==="youtube")command(muted?"unMute":"mute")}}>{muted?<VolumeX/>:<Volume2/>}</Button><Button variant="player" size="icon" aria-label="Tela cheia" onClick={()=>document.documentElement.requestFullscreen?.()}><Maximize/></Button></div></div></div></div>;
}
