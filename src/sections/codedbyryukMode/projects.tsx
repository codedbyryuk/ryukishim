"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Project = {
    title: string;
    year: string;
    type: string;
    stack: string[];
    description: string;
    role?: string;
    src?: string;
    live?: string;
    repo?: string;
};

const projects: Project[] = [
    {
        title: "CLI-Craft auncher",
        year: "2026",
        type: "game",
        stack: ["Python", "minecraft_lib"],
        description: "CLI based minecraft launcher.",
        role: "solo",
        src: "/projects/clicraft.png",
        live: "https://clicraft.pages.dev",
        repo: "https://github.com/codedbyryuk/CLI-Craft",
    },
    {
        title: "Pokemon Bid Wars",
        year: "2025",
        type: "game",
        stack: ["react", "firebase","websocket"],
        description: "A pokemon game where two player bids on a random pokemon, and then they fight with the team on pokemon showdown.",
        role: "solo",
        src:"/projects/pokemonbidwars.png",
        live:"https://pokemonbidwars.pages.dec",
        
    },
    {
        title: "FireSideTalks",
        year: "2025",
        role:"solo",
        type: "web",
        stack: ["firebase", "cloudflare","Node.js","SQL"],
        description: "A chatting website where anyone can talk with anyone.",
        live:"https://firesidetalk.pages.dev"
    },
    {
        title: "StashKit",
        year: "2026",
        type: "tool",
        stack: ["Python", "CLI"],
        description: "Stash is a Python CLI tool designed to eliminate boring and repetitive tasks. From organizing directories and finding duplicate files to automating project setups and managing your projects, Stash helps streamline your development workflow.",
        role: "solo",
        live: "https://pypi.org/project/stashkit/",
        repo: "https://github.com/codedbyryuk/stash",
    },
    {
        title: "Grydle",
        year: "In Development",
        type: "web",
        stack: ["Next.Js", "firebase","typescript"],
        description: "Grydle is a personal page builder that lets anyone turn their identity, interests, and work into a beautiful, customizable bento-grid profile.",
        live: "https://grydle.pages.dev",
    },
];

const PAGE_SIZE = 9;

const btn =
    "border border-black px-3 py-1 font-mono text-sm text-black cursor-pointer select-none transition-colors duration-150 hover:bg-black hover:text-[#affc41]";

const numbered = projects.map((p, i) => ({
    ...p,
    no: String(projects.length - i).padStart(3, "0"),
}));

type Entry = (typeof numbered)[number];

const types = ["all", ...Array.from(new Set(projects.map((p) => p.type)))];

function Shot({ project, large = false }: { project: Entry; large?: boolean }) {
    const [failed, setFailed] = useState(false);

    if (!project.src || failed) {
        return (
            <div className="flex aspect-[16/10] w-full flex-col justify-between bg-black p-4 font-mono text-[#affc41]">
                <span className="text-xs opacity-60">[ no preview ]</span>
                <div>
                    <p className={`${large ? "text-2xl" : "text-lg"} font-bold leading-tight`}>{project.title}</p>
                    <p className="mt-1 text-xs opacity-70">{project.stack.join(" · ")}</p>
                </div>
            </div>
        );
    }

    return (
        <img
            src={project.src}
            alt={`${project.title} screenshot`}
            loading={large ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
            className={
                large
                    ? "block w-full h-auto max-h-[62dvh] md:max-h-[80dvh] object-contain bg-white select-none"
                    : "block aspect-[16/10] w-full object-cover object-top bg-white"
            }
        />
    );
}

function Tag({ children }: { children: React.ReactNode }) {
    return <span className="border border-current px-1.5 py-0.5 font-mono text-[0.7rem] leading-none">{children}</span>;
}

export function Projects() {
    const [filter, setFilter] = useState("all");
    const [visible, setVisible] = useState(PAGE_SIZE);
    const [open, setOpen] = useState<number | null>(null);

    const filtered = useMemo(
        () => (filter === "all" ? numbered : numbered.filter((p) => p.type === filter)),
        [filter]
    );

    const close = useCallback(() => setOpen(null), []);

    const step = useCallback(
        (dir: number) =>
            setOpen((i) => (i === null ? null : (i + dir + filtered.length) % filtered.length)),
        [filtered.length]
    );

    useEffect(() => {
        if (open === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
        };
        window.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, close, step]);

    const changeFilter = (t: string) => {
        setFilter(t);
        setVisible(PAGE_SIZE);
        setOpen(null);
    };

    const openRandom = () => {
        if (filtered.length === 0) return;
        setOpen(Math.floor(Math.random() * filtered.length));
    };

    const current = open !== null ? filtered[open] : null;

    return (
        <section id="projects" className="w-full py-6 px-4 md:px-10 flex flex-col gap-8 border-b-3 border-b-black">
            <div className="flex flex-col gap-5">
                <div className="flex items-baseline gap-4">
                    <h2 className="text-[3rem] font-Pixelify-Sans font-bold text-black">Projects</h2>
                    <span className="font-Pixelify-Sans text-base text-black/60">{filtered.length}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {types.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => changeFilter(t)}
                            className={`${btn} ${t === filter ? "bg-black !text-[#affc41]" : ""}`}
                        >
                            {t}
                        </button>
                    ))}
                    <button type="button" onClick={openRandom} className={`${btn} md:ml-auto`}>
                        random project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.slice(0, visible).map((p, i) => (
                    <button
                        key={p.title}
                        type="button"
                        onClick={() => setOpen(i)}
                        className="group flex flex-col border border-black text-left text-black cursor-pointer"
                    >
                        <div className="border-b border-black">
                            <Shot key={p.title} project={p} />
                        </div>
                        <div className="flex flex-1 flex-col gap-3 px-3 py-3 transition-colors duration-150 group-hover:bg-black group-hover:text-[#affc41]">
                            <div className="flex justify-between gap-3 font-mono text-xs">
                                <span className="truncate">{p.no} · {p.title}</span>
                                <span className="shrink-0 opacity-60">{p.year}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {p.stack.map((s) => (
                                    <Tag key={s}>{s}</Tag>
                                ))}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {visible < filtered.length && (
                <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className={`${btn} self-center`}
                >
                    load more ({filtered.length - visible} left)
                </button>
            )}

            <AnimatePresence>
                {current && (
                    <motion.div
                        key="project-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label={current.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={close}
                        className="fixed inset-0 z-50 overflow-y-auto bg-[#affc41]/95"
                    >
                        <div className="min-h-full flex items-center justify-center p-4 md:p-8">
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-6xl flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-stretch"
                            >
                                <motion.div
                                    key={current.title}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.2}
                                    onDragEnd={(_, info) => {
                                        if (info.offset.x < -80) step(1);
                                        else if (info.offset.x > 80) step(-1);
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-w-0 self-center border-2 border-black shadow-[7px_7px_0_#000]"
                                >
                                    <Shot key={current.title} project={current} large />
                                </motion.div>

                                <aside className="w-full md:w-[300px] shrink-0 flex flex-col border-2 border-black font-mono text-sm text-black">
                                    <div className="p-4 border-b border-black">
                                        <p className="text-black/60">{current.no}</p>
                                        <h3 className="mt-1 font-Sans-DM font-bold text-[1.6rem] leading-tight">{current.title}</h3>
                                    </div>
                                    <p className="px-4 py-3 border-b border-black">{current.description}</p>
                                    <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-black">
                                        {current.stack.map((s) => (
                                            <Tag key={s}>{s}</Tag>
                                        ))}
                                    </div>
                                    <div className="flex justify-between px-4 py-3 border-b border-black">
                                        <span className="text-black/60">year</span>
                                        <span>{current.year}</span>
                                    </div>
                                    <div className="flex justify-between px-4 py-3 border-b border-black">
                                        <span className="text-black/60">type</span>
                                        <span>{current.type}</span>
                                    </div>
                                    {current.role && (
                                        <div className="flex justify-between px-4 py-3 border-b border-black">
                                            <span className="text-black/60">role</span>
                                            <span>{current.role}</span>
                                        </div>
                                    )}
                                    {(current.live || current.repo) && (
                                        <div className="flex gap-2 px-4 py-3 border-b border-black">
                                            {current.live && (
                                                <a href={current.live} target="_blank" rel="noopener noreferrer" className={btn}>
                                                    live ↗
                                                </a>
                                            )}
                                            {current.repo && (
                                                <a href={current.repo} target="_blank" rel="noopener noreferrer" className={btn}>
                                                    repo ↗
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-auto p-4 flex flex-col gap-3">
                                        <span className="text-black/60">{(open ?? 0) + 1} / {filtered.length}</span>
                                        <div className="flex gap-2">
                                            <button type="button" className={btn} onClick={() => step(-1)} aria-label="previous project">
                                                prev
                                            </button>
                                            <button type="button" className={btn} onClick={() => step(1)} aria-label="next project">
                                                next
                                            </button>
                                            <button type="button" className={`${btn} ml-auto`} onClick={close}>
                                                close
                                            </button>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}