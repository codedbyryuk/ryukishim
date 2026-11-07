"use client"
import { useEffect, useRef, useState } from "react";

const ME = { name: "Fahim", handle: "ryuk", role: "developer" };
const EMAIL = "codedbyryuk@gmail.com";
const GITHUB_USERNAME = "codedbyryuk";

const LINKS = [
    { label: "github", href: `https://github.com/${GITHUB_USERNAME}` },
    { label: "instagram", href: "https://instagram.com/codedbyryuk" },
    { label: "linkedin", href: "https://linkedin.com/in/yourname" },
];

const STACK = [
    { group: "languages", items: ["TypeScript", "Python", "C#"] },
    { group: "frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
    { group: "backend", items: ["Node.js", "PostgreSQL"] },
    { group: "tools", items: ["Git", "VS Code", "Linux"] },
];

const PROJECTS = [
    { name: "portfolio", desc: "this site, two personalities, one codebase", href: "https://github.com/yourname/portfolio" },
    { name: "game-prototype", desc: "a small game I keep rebuilding", href: "https://github.com/yourname/game-prototype" },
    { name: "notes-cli", desc: "a tiny command line notebook", href: "https://github.com/yourname/notes-cli" },
];

const FORTUNES = [
    "It works on my machine.",
    "There are two hard things: cache invalidation, naming things, and off-by-one errors.",
    "Weeks of coding can save you hours of planning.",
    "A bug is just an undocumented feature with bad PR.",
    "I'll just rewrite it. It'll be quick. (famous last words)",
    "Real programmers count from zero.",
];

const COMMANDS = [
    "help", "about", "whoami", "stack", "projects", "repos", "contact", "socials",
    "ls", "cat", "neofetch", "uptime", "date", "echo", "history", "clear", "fortune",
    "pwd", "coffee", "sudo", "exit",
];
const FILE_NAMES = ["about.md", "stack.txt", "projects.md", "contact.txt"];

const PROMPT = `visitor@${ME.handle}:~$`;

type Line =
    | { id: number; kind: "cmd"; text: string }
    | { id: number; kind: "out"; node: React.ReactNode };

let reposCache: { name: string; language: string | null; stars: number; url: string }[] | null = null;

function formatUptime(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    if (m < 1) return `${s}s`;
    return `${m}m ${s % 60}s`;
}

export function Terminal() {
    const [lines, setLines] = useState<Line[]>([]);
    const [value, setValue] = useState("");
    const idRef = useRef(0);
    const historyRef = useRef<string[]>([]);
    const histPosRef = useRef<number | null>(null);
    const draftRef = useRef("");
    const startRef = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const runRef = useRef<(c: string) => void>(() => {});

    const nextId = () => ++idRef.current;
    const addOut = (node: React.ReactNode) => setLines((l) => [...l, { id: nextId(), kind: "out", node }]);

    useEffect(() => {
        startRef.current = Date.now();
        setLines([
            {
                id: nextId(),
                kind: "out",
                node: (
                    <div>
                        <p>
                            {ME.handle}-terminal v1.0 <span className="opacity-60">· type a command below</span>
                        </p>
                        <p className="mt-1 opacity-80">
                            try {cmd("help")} {cmd("neofetch")} {cmd("projects")} {cmd("repos")}
                        </p>
                    </div>
                ),
            },
        ]);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [lines]);

    function cmd(c: string, label?: string) {
        return (
            <button
                key={c}
                type="button"
                onClick={() => runRef.current(c)}
                className="cursor-pointer underline underline-offset-4 hover:bg-[#affc41] hover:text-black"
            >
                {label ?? c}
            </button>
        );
    }

    function link(href: string, label: string) {
        return (
            <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="underline underline-offset-4 hover:bg-[#affc41] hover:text-black"
            >
                {label}
            </a>
        );
    }

    const rows = (items: React.ReactNode[]) => (
        <div className="flex flex-col">
            {items.map((item, i) => (
                <div key={i}>{item}</div>
            ))}
        </div>
    );

    const aboutOut = () =>
        rows([
            `${ME.name}. ${ME.role}.`,
            "Into programming and pretty much anything I find interesting.",
            "A bit of a perfectionist, always curious, and rarely satisfied with the first attempt.",
        ]);

    const stackOut = () =>
        rows(
            STACK.map((g) => (
                <span>
                    <span className="inline-block w-24 opacity-60">{g.group}</span>
                    {g.items.join(", ")}
                </span>
            ))
        );

    const projectsOut = () =>
        rows(
            PROJECTS.map((p) => (
                <span>
                    {link(p.href, p.name)} <span className="opacity-60">— {p.desc}</span>
                </span>
            ))
        );

    const contactOut = () =>
        rows([
            <span>
                <span className="inline-block w-24 opacity-60">email</span>
                {link(`mailto:${EMAIL}`, EMAIL)}
            </span>,
            ...LINKS.map((l) => (
                <span>
                    <span className="inline-block w-24 opacity-60">{l.label}</span>
                    {link(l.href, l.href.replace("https://", ""))}
                </span>
            )),
        ]);

    const files: Record<string, () => React.ReactNode> = {
        "about.md": aboutOut,
        "stack.txt": stackOut,
        "projects.md": projectsOut,
        "contact.txt": contactOut,
    };

    const helpOut = () => {
        const items: [string, string][] = [
            ["about", "a short intro"],
            ["stack", "what I build with"],
            ["projects", "things I've made"],
            ["repos", "my latest repos, live from GitHub"],
            ["contact", "how to reach me"],
            ["socials", "where else to find me"],
            ["ls", "list files (try cat <file>)"],
            ["neofetch", "system info, my way"],
            ["fortune", "a developer wisdom"],
            ["history", "what you've typed so far"],
            ["clear", "clean the screen"],
        ];
        return (
            <div>
                {rows(
                    items.map(([c, d]) => (
                        <span>
                            <span className="inline-block w-24">{cmd(c)}</span>
                            <span className="opacity-60">{d}</span>
                        </span>
                    ))
                )}
                <p className="mt-2 opacity-60">tab completes, ↑ ↓ browse history, ctrl+L clears. a few are hidden.</p>
            </div>
        );
    };

    const reposOut = async () => {
        try {
            if (!reposCache) {
                const res = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=pushed&direction=desc`,
                    { headers: { Accept: "application/vnd.github+json" } }
                );
                if (res.status === 403 || res.status === 429) return "error: GitHub rate limit hit. try again later.";
                if (!res.ok) return `error: GitHub returned ${res.status}.`;
                const data: { name: string; language: string | null; stargazers_count: number; html_url: string; fork: boolean }[] =
                    await res.json();
                reposCache = data
                    .filter((r) => !r.fork)
                    .slice(0, 6)
                    .map((r) => ({ name: r.name, language: r.language, stars: r.stargazers_count, url: r.html_url }));
            }
            if (reposCache.length === 0) return "no public repos yet.";
            return rows(
                reposCache.map((r) => (
                    <span>
                        <span className="inline-block w-40 max-w-[55%] truncate align-bottom">{link(r.url, r.name)}</span>
                        <span className="opacity-60">
                            {r.language ?? "n/a"}
                            {r.stars > 0 ? ` · ★ ${r.stars}` : ""}
                        </span>
                    </span>
                ))
            );
        } catch {
            return "error: couldn't reach GitHub.";
        }
    };

    const execute = (name: string, args: string[]): React.ReactNode | Promise<React.ReactNode> => {
        switch (name) {
            case "help":
                return helpOut();
            case "about":
                return aboutOut();
            case "whoami":
                return `${ME.name.toLowerCase()} — ${ME.role}. you're logged in as visitor, which is fine by me.`;
            case "stack":
                return stackOut();
            case "projects":
                return projectsOut();
            case "repos":
                return reposOut();
            case "contact":
                return contactOut();
            case "socials":
                return rows(LINKS.map((l) => link(l.href, l.label)));
            case "ls":
                return (
                    <span className="flex flex-wrap gap-x-6">
                        {FILE_NAMES.map((f) => (
                            <span key={f}>{cmd(`cat ${f}`, f)}</span>
                        ))}
                    </span>
                );
            case "cat": {
                if (!args[0]) return "usage: cat <file>";
                const f = files[args[0]];
                return f ? f() : `cat: ${args[0]}: no such file`;
            }
            case "neofetch":
                return rows([
                    <span className="font-bold">visitor@{ME.handle}</span>,
                    "---------------",
                    <span>
                        <span className="inline-block w-20 opacity-60">role</span>
                        {ME.role}
                    </span>,
                    <span>
                        <span className="inline-block w-20 opacity-60">stack</span>
                        {STACK.flatMap((g) => g.items).slice(0, 4).join(", ")}
                    </span>,
                    <span>
                        <span className="inline-block w-20 opacity-60">editor</span>
                        VS Code
                    </span>,
                    <span>
                        <span className="inline-block w-20 opacity-60">uptime</span>
                        {formatUptime(Date.now() - startRef.current)}
                    </span>,
                    <span>
                        <span className="inline-block w-20 opacity-60">theme</span>
                        #affc41 on #060606
                    </span>,
                ]);
            case "uptime":
                return `you've been here for ${formatUptime(Date.now() - startRef.current)}.`;
            case "date":
                return new Date().toString();
            case "echo":
                return args.join(" ");
            case "history":
                return historyRef.current.length
                    ? rows(historyRef.current.map((h, i) => `${String(i + 1).padStart(2, " ")}  ${h}`))
                    : "nothing yet.";
            case "fortune":
                return FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
            case "pwd":
                return "/home/visitor";
            case "coffee":
                return "brewing... done. productivity +12%, sleep -3h.";
            case "sudo":
                return args.join(" ").includes("sandwich")
                    ? "what? make it yourself."
                    : "visitor is not in the sudoers file. this incident will be reported.";
            case "rm":
                return "permission denied. this terminal is read-only (and so is my patience).";
            case "vim":
            case "nano":
            case "emacs":
                return "no editor wars here. just scroll down.";
            case "ping":
                return "pong.";
            case "cd":
                return "cd: this isn't a real filesystem, but I like the confidence.";
            case "exit":
                return "there's no leaving. scroll down instead.";
            default:
                return `command not found: ${name}. try help.`;
        }
    };

    const run = (raw: string) => {
        const input = raw.trim();
        const echo: Line = { id: nextId(), kind: "cmd", text: raw };
        if (!input) {
            setLines((l) => [...l, echo]);
            return;
        }
        historyRef.current.push(input);
        histPosRef.current = null;

        const [name, ...args] = input.split(/\s+/);
        if (name.toLowerCase() === "clear") {
            setLines([]);
            return;
        }

        const result = execute(name.toLowerCase(), args);
        if (result instanceof Promise) {
            const pendingId = nextId();
            setLines((l) => [...l, echo, { id: pendingId, kind: "out", node: <span className="animate-pulse">fetching_</span> }]);
            result.then((node) =>
                setLines((l) => l.map((x) => (x.id === pendingId ? ({ id: pendingId, kind: "out", node } as Line) : x)))
            );
        } else {
            setLines((l) => [...l, echo, { id: nextId(), kind: "out", node: result }]);
        }
    };

    runRef.current = run;

    const complete = () => {
        const parts = value.split(/\s+/);
        let candidates: string[] = [];
        let prefix = "";
        if (parts.length === 1) {
            candidates = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
        } else if (parts[0] === "cat" && parts.length === 2) {
            candidates = FILE_NAMES.filter((f) => f.startsWith(parts[1]));
            prefix = "cat ";
        }
        if (candidates.length === 1) {
            setValue(`${prefix}${candidates[0]}${parts.length === 1 ? " " : ""}`);
        } else if (candidates.length > 1) {
            setLines((l) => [
                ...l,
                { id: nextId(), kind: "cmd", text: value },
                { id: nextId(), kind: "out", node: candidates.join("   ") },
            ]);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const hist = historyRef.current;
        if (e.key === "Enter") {
            run(value);
            setValue("");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!hist.length) return;
            if (histPosRef.current === null) {
                draftRef.current = value;
                histPosRef.current = hist.length - 1;
            } else {
                histPosRef.current = Math.max(0, histPosRef.current - 1);
            }
            setValue(hist[histPosRef.current]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (histPosRef.current === null) return;
            if (histPosRef.current >= hist.length - 1) {
                histPosRef.current = null;
                setValue(draftRef.current);
            } else {
                histPosRef.current += 1;
                setValue(hist[histPosRef.current]);
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            complete();
        } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        } else if (e.key.toLowerCase() === "c" && e.ctrlKey) {
            e.preventDefault();
            setLines((l) => [...l, { id: nextId(), kind: "cmd", text: `${value}^C` }]);
            setValue("");
        }
    };

    return (
        <div className="flex flex-col">
            <h3 className="text-[1.4rem] font-Sans-DM text-black/50 uppercase mb-4">terminal</h3>

            <div
                onClick={() => inputRef.current?.focus({ preventScroll: true })}
                className="flex h-[490px] md:h-[490px] flex-col border-2 border-black bg-black font-mono text-sm text-[#affc41] "
            >
                <div className="flex items-center gap-3  px-3 py-2 text-xs">
                    <span className="flex gap-1.5" aria-hidden>
                        <span className="size-2.5 border border-[#affc41]" />
                        <span className="size-2.5 border border-[#affc41]" />
                        <span className="size-2.5 bg-[#affc41]" />
                    </span>
                    <span className="truncate opacity-70">{PROMPT.replace("$", "")}</span>
                </div>

                <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 scrollbar-none overflow-y-auto px-3 py-3 leading-relaxed">
                    {lines.map((l) =>
                        l.kind === "cmd" ? (
                            <div key={l.id} className="flex gap-2">
                                <span className="shrink-0 opacity-60">{PROMPT}</span>
                                <span className="min-w-0 break-words text-white">{l.text}</span>
                            </div>
                        ) : (
                            <div key={l.id} className="my-1 whitespace-pre-wrap break-words">
                                {l.node}
                            </div>
                        )
                    )}

                    <label className="mt-1 flex items-center gap-2">
                        <span className="shrink-0 opacity-60">{PROMPT}</span>
                        <input
                            ref={inputRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={onKeyDown}
                            aria-label="terminal input"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck={false}
                            className="min-w-0 flex-1 bg-transparent text-base md:text-sm text-white caret-[#affc41] outline-none"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}