"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Book = {
    title: string;
    author: string;
    year: string;
    pages: number;
    rating: number;
    thought?: string;
    cover?: string;
};

const PAPER = "#e8ecef";

const books: Book[] = [
    { title: "Harry Potter: Philosopher's Stone",cover:"/books/harry-potter-1.jpg", author: "J.K Rowling", year: "2026", pages: 320, rating: 4, thought: "Slow start, worth it." },
    { title: "Harry Potter: Chamber of Secrets",cover:"/books/harry-potter-2.jpg", author: "J.K Rowling", year: "2026", pages: 210, rating: 4, thought: "intense..." },
    { title: "Harry Potter Prisoner of Azkaban",cover:"/books/harry-potter-3.jpg", author: "J.K Rowling", year: "2026", pages: 480, rating: 5, thought: "One of my favourites" },
    { title: "Murder of Roger Ackroyd",cover:"/books/roger-ackroyd.webp", author: "Christie Agatha", year: "2026", pages: 290, rating: 4,thought:"Still reading"},
    { title: "Murder on the Orient Express",cover:"/books/orient-express.webp", author: "Christie Agatha", year: "Haven't read", pages: 540, rating: 0},
    { title: "And There Were None",cover:"/books/and-there-were-none.webp", author: "Christie Agatha", year: "Haven't read", pages: 180, rating: 0 },
    { title: "Ikigai", author: "Author Seven",cover:"/books/ikigai.png", year: "2025", pages: 360, rating: 1,thought:"Overhyped, waste of money and time." },
    { title: "Book title eight", author: "Author Eight", year: "2024", pages: 410, rating: 3 },
    { title: "Book title nine", author: "Author Nine", year: "2024", pages: 260, rating: 5 },
    { title: "Book title ten", author: "Author Ten", year: "2024", pages: 330, rating: 4 },
];

const PALETTE = [
    { bg: "#000000", fg: "#ffffff" },
    { bg: "#ffffff", fg: "#000000" },
    { bg: PAPER, fg: "#000000" },
];
const HEIGHTS = [220, 250, 235, 270, 245, 260];
const GAP = 4;
const ROW_PADDING = 16;

const btn =
    "border border-black px-3 py-1 font-mono text-sm text-black cursor-pointer select-none transition-colors duration-150 hover:bg-black hover:text-white";

const entries = books.map((b, i) => {
    const h = Math.imul(i + 1, 2654435761) >>> 0;
    return {
        ...b,
        i,
        no: String(i + 1).padStart(2, "0"),
        width: Math.min(64, Math.max(34, Math.round(20 + b.pages / 10))),
        height: HEIGHTS[(h >>> 8) % HEIGHTS.length],
        palette: PALETTE[h % PALETTE.length],
    };
});

type Entry = (typeof entries)[number];

function Meter({ value, max = 5 }: { value: number; max?: number }) {
    return (
        <div className="flex gap-1" aria-label={`${value} out of ${max}`}>
            {Array.from({ length: max }, (_, i) => (
                <span key={i} className={`size-3 border border-black ${i < value ? "bg-black" : "bg-transparent"}`} />
            ))}
        </div>
    );
}

function Spine({ book, onOpen }: { book: Entry; onOpen: () => void }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label={`${book.title} by ${book.author}`}
            className="shrink-0 flex flex-col items-center border-2 border-black cursor-pointer transition-transform duration-150 hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none"
            style={{ width: book.width, height: book.height, backgroundColor: book.palette.bg, color: book.palette.fg }}
        >
            <span className="mt-3 h-1.5 w-full border-y border-current opacity-70" />
            <span
                className="mt-4 mb-3 flex-1 overflow-hidden whitespace-nowrap text-ellipsis font-mono text-sm"
                style={{ writingMode: "vertical-rl" }}
            >
                {book.title}
            </span>
        </button>
    );
}

export function Books() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [open, setOpen] = useState<number | null>(null);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const ro = new ResizeObserver((items) => setWidth(items[0].contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const rows = useMemo(() => {
        const available = width - ROW_PADDING;
        if (available <= 0) return [entries];
        const out: Entry[][] = [];
        let row: Entry[] = [];
        let used = 0;
        for (const b of entries) {
            const w = b.width + GAP;
            if (used + w > available && row.length) {
                out.push(row);
                row = [];
                used = 0;
            }
            row.push(b);
            used += w;
        }
        if (row.length) out.push(row);
        return out;
    }, [width]);

    const close = useCallback(() => setOpen(null), []);
    const step = useCallback(
        (dir: number) => setOpen((i) => (i === null ? null : (i + dir + entries.length) % entries.length)),
        []
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

    const current = open !== null ? entries[open] : null;

    return (
        <section id="books" className="w-full py-6 px-4 md:px-10 flex flex-col gap-8 border-b-3 border-b-black">
            <div className="flex items-baseline gap-4">
                <h2 className="text-[3rem] font-Sans-DM font-bold text-black">Books</h2>
                <span className="font-mono text-base text-black/50">{entries.length}</span>
            </div>

            <div ref={wrapRef} className="w-full">
                {rows.map((row, r) => (
                    <div
                        key={r}
                        className="flex items-end gap-1 px-2 pt-4 border-b-[6px] border-black mb-8 last:mb-0"
                    >
                        {row.map((b) => (
                            <Spine key={b.title} book={b} onOpen={() => setOpen(b.i)} />
                        ))}
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {current && (
                    <motion.div
                        key="book-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label={current.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={close}
                        className="fixed inset-0 z-50 overflow-y-auto bg-[#e8ecef]/95"
                    >
                        <div className="min-h-full flex items-center justify-center p-4 md:p-8">
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-3xl flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-stretch"
                            >
                                <motion.div
                                    key={current.title}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="shrink-0"
                                >
                                    {current.cover ? (
                                        <img
                                            src={current.cover}
                                            alt={current.title}
                                            draggable={false}
                                            className="w-[200px] md:w-[240px] aspect-[2/3] object-cover border-2 border-black bg-white shadow-[7px_7px_0_#000]"
                                        />
                                    ) : (
                                        <div
                                            className="w-[200px] md:w-[240px] aspect-[2/3] border-2 border-black shadow-[7px_7px_0_#000] p-4 flex flex-col justify-between"
                                            style={{ backgroundColor: current.palette.bg, color: current.palette.fg }}
                                        >
                                            <span className="h-1.5 w-full border-y border-current opacity-70" />
                                            <div>
                                                <p className="font-Sans-DM font-bold text-[1.8rem] leading-tight">{current.title}</p>
                                                <p className="mt-2 font-mono text-sm opacity-70">{current.author}</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                <aside className="w-full flex-1 flex flex-col border-2 border-black bg-white font-mono text-sm text-black">
                                    <div className="p-4 border-b border-black">
                                        <p className="text-black/50">{current.no}</p>
                                        <h3 className="mt-1 font-Sans-DM font-bold text-[1.6rem] leading-tight">{current.title}</h3>
                                        <p className="mt-1 text-black/60">{current.author}</p>
                                    </div>
                                    <div className="flex justify-between px-4 py-3 border-b border-black">
                                        <span className="text-black/50">read</span>
                                        <span>{current.year}</span>
                                    </div>
                                    <div className="flex justify-between px-4 py-3 border-b border-black">
                                        <span className="text-black/50">pages</span>
                                        <span>{current.pages}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-4 py-3 border-b border-black">
                                        <span className="text-black/50">rating</span>
                                        <Meter value={current.rating} />
                                    </div>
                                    {current.thought && <p className="px-4 py-3 border-b border-black">{current.thought}</p>}

                                    <div className="mt-auto p-4 flex flex-col gap-3">
                                        <span className="text-black/50">{current.i + 1} / {entries.length}</span>
                                        <div className="flex gap-2">
                                            <button type="button" className={btn} onClick={() => step(-1)} aria-label="previous book">
                                                prev
                                            </button>
                                            <button type="button" className={btn} onClick={() => step(1)} aria-label="next book">
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