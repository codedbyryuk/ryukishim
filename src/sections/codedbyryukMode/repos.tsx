"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const GITHUB_USERNAME = "codedbyryuk";
const EXCLUDE: string[] = [GITHUB_USERNAME];
const HIDE_FORKS = true;
const MAX_REPOS = 40;

type ApiRepo = {
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    pushed_at: string;
    html_url: string;
    homepage: string | null;
    size: number;
    fork: boolean;
    archived: boolean;
    topics?: string[];
};

type Repo = {
    name: string;
    description: string;
    language: string;
    size: number;
    stars: number;
    updated: string;
    url: string;
    live?: string;
    topics: string[];
};

let cache: Repo[] | null = null;

function toRepo(r: ApiRepo): Repo {
    const homepage = r.homepage?.trim();
    return {
        name: r.name,
        description: r.description ?? "No description yet.",
        language: r.language ?? "n/a",
        size: r.size,
        stars: r.stargazers_count,
        updated: new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(r.pushed_at)),
        url: r.html_url,
        live: homepage ? (/^https?:\/\//.test(homepage) ? homepage : `https://${homepage}`) : undefined,
        topics: (r.topics ?? []).slice(0, 6),
    };
}

function formatSize(kb: number) {
    return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

function sizeBar(size: number, maxLog: number, cells = 12) {
    const ratio = maxLog > 0 ? Math.log10(size + 1) / maxLog : 0;
    const filled = Math.max(1, Math.min(cells, Math.round(ratio * cells)));
    return "█".repeat(filled) + "░".repeat(cells - filled);
}

function KV({ k, children }: { k: string; children: React.ReactNode }) {
    return (
        <span>
            <span className="inline-block w-20 text-black/60">{k}</span>
            {children}
        </span>
    );
}

export function Repos() {
    const [repos, setRepos] = useState<Repo[] | null>(cache);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState(0);
    const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        if (cache) return;
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed&direction=desc`,
                    { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal }
                );
                if (res.status === 403 || res.status === 429) throw new Error("GitHub's rate limit was hit. Try again in a bit.");
                if (res.status === 404) throw new Error("That GitHub user wasn't found.");
                if (!res.ok) throw new Error(`GitHub returned ${res.status}.`);
                const data: ApiRepo[] = await res.json();
                const list = data
                    .filter((r) => !(HIDE_FORKS && r.fork) && !r.archived && !EXCLUDE.includes(r.name))
                    .slice(0, MAX_REPOS)
                    .map(toRepo);
                cache = list;
                setRepos(list);
            } catch (e) {
                if ((e as Error).name === "AbortError") return;
                setError((e as Error).message || "Couldn't load repos.");
            }
        })();

        return () => controller.abort();
    }, []);

    const list = repos ?? [];
    const current = list[selected] ?? null;
    const maxLog = useMemo(() => Math.log10(Math.max(1, ...list.map((r) => r.size)) + 1), [list]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!list.length) return;
        let next = selected;
        if (e.key === "ArrowDown") next = Math.min(list.length - 1, selected + 1);
        else if (e.key === "ArrowUp") next = Math.max(0, selected - 1);
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = list.length - 1;
        else return;
        e.preventDefault();
        setSelected(next);
        rowRefs.current[next]?.focus();
    };

    const lines: React.ReactNode[] = [];
    if (current) {
        lines.push(<span className="font-bold"># {current.name}</span>);
        lines.push("");
        lines.push(<span>{current.description}</span>);
        lines.push("");
        lines.push(<KV k="language">{current.language}</KV>);
        lines.push(
            <KV k="size">
                <span aria-hidden>{sizeBar(current.size, maxLog)}</span> {formatSize(current.size)}
            </KV>
        );
        if (current.stars > 0) lines.push(<KV k="stars">{current.stars}</KV>);
        lines.push(<KV k="pushed">{current.updated}</KV>);
        if (current.topics.length > 0) lines.push(<KV k="topics">[{current.topics.join(", ")}]</KV>);
        lines.push("");
        lines.push(
            <span className="flex flex-wrap gap-x-6 gap-y-1">
                <a href={current.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:no-underline">
                    → repo ↗
                </a>
                {current.live && (
                    <a href={current.live} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:no-underline">
                        → live ↗
                    </a>
                )}
            </span>
        );
    }

    return (
        <section id="repos" className="w-full py-6 px-4 md:px-10 flex flex-col gap-8 border-b-3 border-b-black">
            <div className="flex items-baseline gap-4">
                <h2 className="text-[3rem] font-PixelifySans font-bold text-black">Repos</h2>
                {repos && <span className="font-mono text-base text-black/60">{list.length}</span>}
                <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto font-mono text-sm text-black underline underline-offset-4 hover:no-underline"
                >
                    github.com/{GITHUB_USERNAME} ↗
                </a>
            </div>

            <div className="border-2 border-black shadow-[7px_7px_0_#000] font-mono text-sm text-black">
                <div className="flex items-center gap-3 border-b-2 border-black bg-black px-3 py-2 text-xs text-[#affc41]">
                    <span className="flex gap-1.5" aria-hidden>
                        <span className="size-2.5 border border-[#affc41]" />
                        <span className="size-2.5 border border-[#affc41]" />
                        <span className="size-2.5 bg-[#affc41]" />
                    </span>
                    <span className="truncate">~/repos/{GITHUB_USERNAME}</span>
                    {repos && <span className="ml-auto shrink-0 opacity-70">{list.length} items</span>}
                </div>

                <div className="grid md:grid-cols-[260px_1fr] md:h-[440px]">
                    <div
                        role="listbox"
                        aria-label="Repositories"
                        onKeyDown={onKeyDown}
                        className="max-h-[260px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/90 hover:[&::-webkit-scrollbar-thumb]:bg-black/90 border-b-2 border-black md:max-h-none md:min-h-0 md:border-b-0 md:border-r-2"
                    >
                        {list.map((r, i) => (
                            <button
                                key={r.name}
                                ref={(el) => {
                                    rowRefs.current[i] = el;
                                }}
                                type="button"
                                role="option"
                                aria-selected={i === selected}
                                onClick={() => setSelected(i)}
                                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left cursor-pointer outline-none transition-colors duration-100 focus-visible:underline ${
                                    i === selected ? "bg-black text-[#affc41]" : "hover:bg-black/10"
                                }`}
                            >
                                <span className="truncate">
                                    <span aria-hidden className="mr-2 inline-block w-3">{i === selected ? "▸" : ""}</span>
                                    {r.name}
                                </span>
                                <span className="shrink-0 text-xs opacity-60">{r.language}</span>
                            </button>
                        ))}
                        {!repos && !error && (
                            <p className="px-3 py-3 animate-pulse" aria-live="polite">fetching repos_</p>
                        )}
                    </div>

                    <div className="bg-white/25 p-4 md:min-h-0 md:overflow-y-auto md:p-6">
                        {error && <p>{error} You can still see everything on my GitHub.</p>}
                        {repos && repos.length === 0 && <p>No public repos to show yet.</p>}
                        {current && (
                            <motion.div
                                key={current.name}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex flex-col gap-1 leading-relaxed"
                            >
                                {lines.map((line, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span aria-hidden className="w-5 shrink-0 select-none text-right text-black/40">
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0 break-words">{line === "" ? "\u00A0" : line}</div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 border-t-2 border-black px-3 py-1.5 text-xs">
                    <span>● {current ? current.language : "..."}</span>
                    <span className="opacity-60">{current ? `${selected + 1}/${list.length}` : "0/0"}</span>
                    <span className="ml-auto hidden opacity-60 md:inline">↑ ↓ to browse</span>
                </div>
            </div>
        </section>
    );
}