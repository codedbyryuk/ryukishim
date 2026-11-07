"use client"
import { useEffect, useMemo, useState } from "react";

const GITHUB_USERNAME = "codedbyryuk";
const MAX_ACTIVITY = 8;

type Level = "daily" | "comfortable" | "learning";

const stack: { group: string; items: { name: string; level: Level }[] }[] = [
    {
        group: "languages",
        items: [
            { name: "TypeScript", level: "daily" },
            { name: "JavaScript", level: "daily" },
            { name: "Python", level: "comfortable" },
            { name: "C/C++", level: "comfortable" },
            { name: "GO", level: "learning" },
        ],
    },
    {
        group: "frontend QHUU6ELN",
        items: [
            { name: "React", level: "daily" },
            { name: "Next.js", level: "daily" },
            { name: "Tailwind CSS", level: "daily" },
            { name: "Framer Motion", level: "comfortable" },
        ],
    },
    {
        group: "backend",
        items: [
            { name: "Node.js", level: "comfortable" },
            { name: "websocket", level: "comfortable" },
            { name: "REST APIs", level: "learning" },
        ],
    },
    {
        group: "tools",
        items: [
            { name: "Git", level: "daily" },
            { name: "VS Code", level: "daily" },
            { name: "Linux", level: "comfortable" },
            { name: "Docker", level: "learning" },
        ],
    },
];

const filters: ("all" | Level)[] = ["all", "daily", "comfortable", "learning"];

type ApiEvent = {
    id: string;
    type: string;
    created_at: string;
    repo: { name: string };
    payload: {
        ref_type?: string;
        size?: number;
        commits?: { message?: string }[];
        action?: string;
        pull_request?: { title?: string; merged?: boolean };
        release?: { name?: string; tag_name?: string };
    };
};

type Activity = {
    id: string;
    label: string;
    detail?: string;
    repo: string;
    url: string;
    at: string;
};

type Feed = { items: Activity[]; lastPush: string | null };

let cache: Feed | null = null;

function firstLine(text: string | undefined, max = 90) {
    if (!text) return undefined;
    const line = text.split("\n")[0].trim();
    if (!line) return undefined;
    return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}

function toActivity(e: ApiEvent): Activity | null {
    const repo = e.repo.name.split("/")[1] ?? e.repo.name;
    const url = `https://github.com/${e.repo.name}`;
    const base = { id: e.id, repo, url, at: e.created_at };
    const p = e.payload ?? {};

    if (e.type === "PushEvent") {
        const count = p.size ?? p.commits?.length;
        const last = p.commits?.[p.commits.length - 1]?.message;
        return {
            ...base,
            label: count ? `pushed ${count} commit${count === 1 ? "" : "s"}` : "pushed",
            detail: firstLine(last),
        };
    }
    if (e.type === "CreateEvent" && p.ref_type === "repository") {
        return { ...base, label: "created the repo" };
    }
    if (e.type === "PullRequestEvent") {
        if (p.action === "opened") return { ...base, label: "opened a pull request", detail: firstLine(p.pull_request?.title) };
        if (p.action === "closed" && p.pull_request?.merged) {
            return { ...base, label: "merged a pull request", detail: firstLine(p.pull_request?.title) };
        }
        return null;
    }
    if (e.type === "ReleaseEvent" && p.action === "published") {
        return { ...base, label: "published a release", detail: p.release?.name || p.release?.tag_name };
    }
    return null;
}

function ago(iso: string) {
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d >= 30) return `${Math.floor(d / 30)}mo ago`;
    if (d >= 1) return `${d}d ago`;
    if (h >= 1) return `${h}h ago`;
    if (m >= 1) return `${m}m ago`;
    return "just now";
}

function daysSince(iso: string) {
    return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

const box = "border-black flex-1 border-1 p-5";
const heading = "text-[1.4rem] font-Sans-DM text-black/50 uppercase mb-4";
const btn =
    "border border-black px-3 py-1 font-mono text-sm text-black cursor-pointer select-none transition-colors duration-150 hover:bg-black hover:text-[#affc41]";

export function Stack() {
    const [filter, setFilter] = useState<"all" | Level>("all");
    const [feed, setFeed] = useState<Feed | null>(cache);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cache) return;
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=50`,
                    { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal }
                );
                if (res.status === 403 || res.status === 429) throw new Error("GitHub's rate limit was hit. Try again in a bit.");
                if (res.status === 404) throw new Error("That GitHub user wasn't found.");
                if (!res.ok) throw new Error(`GitHub returned ${res.status}.`);
                const data: ApiEvent[] = await res.json();
                const items = data
                    .map(toActivity)
                    .filter((a): a is Activity => a !== null)
                    .slice(0, MAX_ACTIVITY);
                const lastPush = data.find((e) => e.type === "PushEvent")?.created_at ?? null;
                const next = { items, lastPush };
                cache = next;
                setFeed(next);
            } catch (e) {
                if ((e as Error).name === "AbortError") return;
                setError((e as Error).message || "Couldn't load activity.");
            }
        })();

        return () => controller.abort();
    }, []);

    const groups = useMemo(
        () =>
            stack
                .map((g) => ({ ...g, items: g.items.filter((i) => filter === "all" || i.level === filter) }))
                .filter((g) => g.items.length > 0),
        [filter]
    );

    const since = feed?.lastPush ? daysSince(feed.lastPush) : null;

    return (
        <section id="stack" className="w-full py-6 px-4 md:px-10 flex flex-col gap-8 border-b-3 border-b-black">
            <div>
                <h2 className="text-[3rem] font-PixelifySans font-bold text-black">Stack</h2>
                <h3 className="text-[1.6rem] font-Sans-DM text-black/80">
                    What I build with, and what I've actually been doing lately.
                </h3>
            </div>

            <div className="flex flex-col lg:flex-row">
                <div className={box}>
                    <h3 className={heading}>toolbox</h3>

                    <div className="mb-4 flex flex-wrap gap-2">
                        {filters.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                className={`${btn} ${f === filter ? "bg-black !text-[#affc41]" : ""}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-5 font-mono text-base">
                        {groups.map((g) => (
                            <div key={g.group}>
                                <p className="mb-1 text-sm text-black/60">{g.group}</p>
                                <ul className="border-b border-black">
                                    {g.items.map((item) => (
                                        <li
                                            key={item.name}
                                            className="flex justify-between gap-4 border-t border-black px-1 py-2.5 text-black cursor-default transition-[padding,background-color,color] duration-150 hover:bg-black hover:text-[#affc41] hover:px-3"
                                        >
                                            <span>{item.name}</span>
                                            <span className="text-sm opacity-60">{item.level}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={box}>
                    <h3 className={heading}>lately</h3>

                    {!feed && !error && (
                        <p className="font-mono text-base text-black animate-pulse" aria-live="polite">
                            fetching activity_
                        </p>
                    )}

                    {error && (
                        <p className="font-mono text-base text-black border-2 border-black p-4">
                            {error} You can still see everything on my GitHub.
                        </p>
                    )}

                    {feed && (
                        <div className="font-mono text-black">
                            <div className="flex items-end gap-4 border-t border-black py-5">
                                <p className="font-Sans-DM text-[4rem] font-bold leading-none">
                                    {since === null ? "–" : since === 0 ? "0" : since}
                                </p>
                                <p className="pb-1 text-sm text-black/70">
                                    {since === null
                                        ? "no public pushes in the last 90 days"
                                        : since === 0
                                          ? "days since my last push (today)"
                                          : `day${since === 1 ? "" : "s"} since my last push`}
                                </p>
                            </div>

                            {feed.items.length === 0 ? (
                                <p className="border-t border-b border-black py-4 text-black/60">
                                    Nothing public lately. Quiet stretch.
                                </p>
                            ) : (
                                <ul className="border-b border-black">
                                    {feed.items.map((a) => (
                                        <li key={a.id} className="border-t border-black">
                                            <a
                                                href={a.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start justify-between gap-4 px-1 py-3 text-black transition-[padding,background-color,color] duration-150 hover:bg-black hover:text-[#affc41] hover:px-3 focus-visible:bg-black focus-visible:text-[#affc41] focus-visible:px-3 outline-none"
                                            >
                                                <span className="min-w-0">
                                                    <span className="block text-sm">
                                                        {a.label} <span className="font-bold">{a.repo}</span>
                                                    </span>
                                                    {a.detail && (
                                                        <span className="mt-1 block truncate text-xs opacity-60">{a.detail}</span>
                                                    )}
                                                </span>
                                                <span className="shrink-0 text-xs opacity-60">{ago(a.at)}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <p className="mt-4 text-xs text-black/60">live from the GitHub API · public activity only</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}