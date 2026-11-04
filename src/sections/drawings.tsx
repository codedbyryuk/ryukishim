"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Drawing = {
    src: string;
    title: string;
    year: string;
    medium: string;
    note?: string;
    w: number;
    h: number;
};

const drawings: Drawing[] = [
    { src: "/photos/art1.jfif", title: "Old man", year: "2026", medium: "sketch", note: "took three attempts", w: 1000, h: 1300 },
    { src: "/photos/art2.jfif", title: "Window light", year: "2026", medium: "anime", w: 1400, h: 1000 },
    { src: "/photos/art3.jfif", title: "Hands study", year: "2025", medium: "anime", w: 1000, h: 1000 },
    { src: "/photos/art4.jfif", title: "First sketch of the book", year: "2025", medium: "anime", w: 1300, h: 1000 },
    { src: "/photos/art5.jfif", title: "Self portrait", year: "2025", medium: "anime", note: "rarely satisfied, still not satisfied", w: 1000, h: 1250 },
    //{ src: "/photos/drawing-01.jpg", title: "First sketch", year: "2024", medium: "graphite", w: 1000, h: 1200 },
];

const PAGE_SIZE = 12;

const btn =
    "border border-black px-3 py-1 font-mono text-sm text-black cursor-pointer select-none transition-colors duration-150 hover:bg-black hover:text-white";

const numbered = drawings.map((d, i) => ({
    ...d,
    no: String(drawings.length - i).padStart(3, "0"),
}));

const mediums = ["all", ...Array.from(new Set(drawings.map((d) => d.medium)))];

export function Drawings() {
    const [filter, setFilter] = useState("all");
    const [visible, setVisible] = useState(PAGE_SIZE);
    const [open, setOpen] = useState<number | null>(null);

    const filtered = useMemo(
        () => (filter === "all" ? numbered : numbered.filter((d) => d.medium === filter)),
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

    const changeFilter = (m: string) => {
        setFilter(m);
        setVisible(PAGE_SIZE);
        setOpen(null);
    };

    const openRandom = () => {
        if (filtered.length === 0) return;
        setOpen(Math.floor(Math.random() * filtered.length));
    };

    const current = open !== null ? filtered[open] : null;

    return (
        <section id="drawings" className="w-full py-6 px-4 md:px-10 flex flex-col gap-8 border-b-3 border-b-black">
            <div className="flex flex-col gap-5">
                <div className="flex items-baseline gap-4">
                    <h2 className="text-[3rem] font-Sans-DM font-bold text-black">Drawings</h2>
                    <span className="font-mono text-base text-black/50">{filtered.length}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {mediums.map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => changeFilter(m)}
                            className={`${btn} ${m === filter ? "bg-black !text-white" : ""}`}
                        >
                            {m}
                        </button>
                    ))}
                    <button type="button" onClick={openRandom} className={`${btn} md:ml-auto`}>
                        random
                    </button>
                </div>
            </div>

            <div className="columns-2 md:columns-3 xl:columns-4 gap-4">
                {filtered.slice(0, visible).map((d, i) => (
                    <button
                        key={d.src}
                        type="button"
                        onClick={() => setOpen(i)}
                        className="group mb-4 block w-full break-inside-avoid border border-black bg-white text-left cursor-pointer"
                    >
                        <div className="bg-black/5" style={{ aspectRatio: `${d.w} / ${d.h}` }}>
                            <img
                                src={d.src}
                                alt={d.title}
                                width={d.w}
                                height={d.h}
                                loading="lazy"
                                decoding="async"
                                className="block w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex justify-between gap-3 border-t border-black px-2 py-2 font-mono text-xs text-black transition-colors duration-150 group-hover:bg-black group-hover:text-white">
                            <span className="truncate">{d.no} · {d.title}</span>
                            <span className="shrink-0 opacity-60">{d.year}</span>
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
                        key="lightbox"
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
                                className="w-full max-w-6xl flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-stretch"
                            >
                                <div className="flex-1 min-w-0 flex items-center justify-center">
                                    <motion.img
                                        key={current.src}
                                        src={current.src}
                                        alt={current.title}
                                        draggable={false}
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
                                        className="max-w-full max-h-[62dvh] md:max-h-[85dvh] object-contain border-2 border-black bg-white select-none"
                                    />
                                </div>

                                <aside className="w-full md:w-[280px] shrink-0 flex flex-col border-2 border-black bg-white font-mono text-sm text-black">
                                    <div className="p-4 border-b border-black">
                                        <p className="text-black/50">{current.no}</p>
                                        <h3 className="mt-1 font-Sans-DM font-bold text-[1.6rem] leading-tight">{current.title}</h3>
                                    </div>
                                    <div className="flex justify-between px-4 py-3 border-b border-black">
                                        <span className="text-black/50">year</span>
                                        <span>{current.year}</span>
                                    </div>
                                    <div className="flex justify-between px-4 py-3 border-b border-black">
                                        <span className="text-black/50">medium</span>
                                        <span>{current.medium}</span>
                                    </div>
                                    {current.note && <p className="px-4 py-3 border-b border-black">{current.note}</p>}

                                    <div className="mt-auto p-4 flex flex-col gap-3">
                                        <span className="text-black/50">{(open ?? 0) + 1} / {filtered.length}</span>
                                        <div className="flex gap-2">
                                            <button type="button" className={btn} onClick={() => step(-1)} aria-label="previous drawing">
                                                prev
                                            </button>
                                            <button type="button" className={btn} onClick={() => step(1)} aria-label="next drawing">
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