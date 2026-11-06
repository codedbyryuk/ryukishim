"use client"
import { useEffect, useRef, useState } from "react";

const EMAIL = "codedbyryuk@gmail.com";

const LOCATION = { label: "Guwahati", timeZone: "UTC" };

const SIGNATURE = "/art/signature.svg";

const links = [
    { label: "email", handle: EMAIL, href: `mailto:${EMAIL}` },
    { label: "github", handle: "@codedbyryuk", href: "https://github.com/codebyryuk" },
    { label: "instagram", handle: "@codedbyryuk", href: "https://instagram.com/codedbyryuk" },
    { label: "X/twitter", handle: "@codedbyryuk", href: "https://x.com/codedbyryuk" },
];

export function Contact() {
    const [copied, setCopied] = useState(false);
    const [time, setTime] = useState("");
    const [sigFailed, setSigFailed] = useState(false);
    const timer = useRef<number | null>(null);

    useEffect(() => {
        const tick = () =>
            setTime(
                new Intl.DateTimeFormat("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: LOCATION.timeZone,
                }).format(new Date())
            );
        tick();
        const id = setInterval(tick, 15000);
        return () => {
            clearInterval(id);
            if (timer.current) window.clearTimeout(timer.current);
        };
    }, []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            if (timer.current) window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 1600);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    };

    return (
        <section id="contact" className="w-full py-6 px-4 md:px-10 flex flex-col gap-8">
            <div>
                <h2 className="text-[3rem] font-Pixelify-Sans font-bold text-black">Say hi.</h2>
                <h3 className="text-[1.6rem] font-Sans-DM text-black/80">
                    Got an idea, a drawing, or a song I should hear? I'd like to know.
                </h3>
            </div>

            <div>
                <button
                    type="button"
                    onClick={copy}
                    aria-label={`Copy email address ${EMAIL}`}
                    className="group w-full border-2 border-black px-4 py-6 md:px-8 md:py-10 text-left cursor-pointer text-black transition-colors duration-150 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white outline-none"
                >
                    <span className="grid font-RasterForge text-[clamp(1.5rem,6.2vw,6rem)] leading-none break-all">
                        <span
                            className={`col-start-1 row-start-1 transition-opacity duration-150 ${copied ? "opacity-0" : "opacity-100"}`}
                        >
                            {EMAIL}
                        </span>
                        <span
                            aria-hidden
                            className={`col-start-1 row-start-1 transition-opacity duration-150 ${copied ? "opacity-100" : "opacity-0"}`}
                        >
                            copied
                        </span>
                    </span>
                    <span className="mt-4 block font-mono text-sm opacity-60" aria-live="polite">
                        {copied ? "email copied to clipboard" : "click to copy"}
                    </span>
                </button>
                <a
                    href={`mailto:${EMAIL}`}
                    className="mt-3 inline-block font-mono text-sm text-black underline underline-offset-4 hover:no-underline"
                >
                    or open in your mail app
                </a>
            </div>

            <ul className="border-b border-black font-mono text-base md:text-lg">
                {links.map((l) => (
                    <li key={l.label}>
                        <a
                            href={l.href}
                            target={l.href.startsWith("http") ? "_blank" : undefined}
                            rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="flex items-center justify-between gap-4 border-t border-black px-1 py-4 text-black transition-[padding,background-color,color] duration-150 hover:bg-black hover:text-white hover:px-3 focus-visible:bg-black focus-visible:text-white focus-visible:px-3 outline-none"
                        >
                            <span className="opacity-60">{l.label}</span>
                            <span className="flex items-center gap-3 min-w-0">
                                <span className="truncate">{l.handle}</span>
                                <span aria-hidden>↗</span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            <footer className="flex flex-col gap-6 border-t-2 border-black pt-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-3">
                    {!sigFailed && (
                        <img
                            src={SIGNATURE}
                            alt="Fahim's signature"
                            draggable={false}
                            onError={() => setSigFailed(true)}
                            className="w-[min(60vw,300px)] select-none"
                        />
                    )}
                    <p className="font-mono text-sm text-black/60">
                        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Fahim Akhtar.  Built from scratch, no template.
                    </p>
                </div>

                <div className="flex flex-col gap-2 font-mono text-sm text-black md:items-end">
                    <span suppressHydrationWarning>
                        {LOCATION.label}, {time || "--:--"}
                    </span>
                    <a href="#" className="underline underline-offset-4 hover:no-underline">
                        back to top ↑
                    </a>
                </div>
            </footer>
        </section>
    );
}