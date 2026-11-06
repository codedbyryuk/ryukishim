"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const PLAYLIST_SRC =
    "https://open.spotify.com/embed/playlist/0NK81Minu8NaCg93ES3S4H?utm_source=generator&theme=0";

const onRepeat = { title: "Be intehaan", artist: "Atif Aslam", days: 9 };

const learning: {
    song: string;
    artist: string;
    progress: number;
    status: string;
    variant: "default" | "secondary" | "destructive" | "outline";
}[] = [
    { song: "Tu Hi Meri Shab Hai", artist: "K.K", progress: 4, status: "Nearly there", variant: "default" },
    { song: "Be Intehaan", artist: "Atif Aslam", progress: 2, status: "Learning", variant: "secondary" },
    { song: "Tu Hi Mera", artist: "Shafqat Amanat Ali", progress: 1, status: "Stuck", variant: "destructive" },
];

const artists = ["Atif Aslam", "Michael Jackson", "Arijit Singh", "K.K", "Mohit Chauhan", "Shaan Mukherjee"];

const picks = [
    { title: "Tu Hi Mera", artist: "Shafqat Amanat Ali" },
    { title: "Heaven Can Wait", artist: "Michael Jackson"},
    { title: "Darasal", artist: "Atif Aslam"},
    { title: "Be Intehaan", artist: "Atif Aslam"},
    { title: "Tu Hi Meri Shab hai", artist: "K.K" },
    { title: "Kya Mujhe Pyaar Hai", artist: "K.K"},
    { title: "Mann Mera", artist: "Gajendra Verma" },
    { title: "MERA MANN KEHNE LAGA", artist: "Falak Shabbir" },
    { title: "Just The Two Of Us", artist: "Grover Washington"},
];

const box = "border-black flex-1 border-1 p-5";
const heading = "text-[1.4rem] font-Sans-DM text-black/50 uppercase mb-4";
const btn =
    "border border-black px-3 py-1 font-mono text-sm text-black cursor-pointer select-none transition-colors duration-150 hover:bg-black hover:text-white";

function Record() {
    return (
        <div
            aria-hidden
            className="relative shrink-0 size-[84px] rounded-full border-2 border-black bg-black animate-[spin_5s_linear_infinite] motion-reduce:animate-none"
            style={{ backgroundImage: "repeating-radial-gradient(circle, #000 0 3px, #2a2a2a 3px 4px)" }}
        >
            <div className="absolute inset-[26px] rounded-full bg-white border-2 border-black">
                <span className="absolute left-1/2 top-[2px] size-1 -translate-x-1/2 rounded-full bg-black" />
            </div>
        </div>
    );
}

function Meter({ value, max = 5 }: { value: number; max?: number }) {
    return (
        <div className="flex gap-1" aria-label={`${value} of ${max}`}>
            {Array.from({ length: max }, (_, i) => (
                <span
                    key={i}
                    className={`size-3 border border-black ${i < value ? "bg-black" : "bg-transparent"}`}
                />
            ))}
        </div>
    );
}

export function Music() {
    const [pick, setPick] = useState<number | null>(null);

    const roll = () =>
        setPick((prev) => {
            let next = Math.floor(Math.random() * picks.length);
            while (picks.length > 1 && next === prev) next = Math.floor(Math.random() * picks.length);
            return next;
        });

    const chosen = pick !== null ? picks[pick] : null;

    return (
        <section id="music" className="w-full py-6 px-4 md:px-10 flex flex-col gap-8 border-b-3 border-b-black">
            <div>
                <h2 className="text-[3rem] font-Sans-DM font-bold text-black">Music</h2>
                <h3 className="text-[1.6rem] font-Sans-DM text-black/80">
                    What I'm listening to, what I'm learning, and what I can't stop recommending.
                </h3>
            </div>

            <div className="flex flex-col lg:flex-row">
                <div className={box}>
                    <h3 className={heading}>playlist</h3>
                    <div className="border-2 border-black bg-[#121212] shadow-[7px_7px_0_#000] mb-2">
                        <iframe
                            data-testid="embed-iframe"
                            title="Fahim's Spotify playlist"
                            src={PLAYLIST_SRC}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="block"
                        />
                    </div>
                </div>

                <div className={box}>
                    <h3 className={heading}>on repeat</h3>
                    <div className="flex items-center gap-5 border-t border-black py-5 font-mono">
                        <Record />
                        <div className="min-w-0">
                            <p className="text-[1.4rem] font-bold text-black truncate">{onRepeat.title}</p>
                            <p className="text-black/60">{onRepeat.artist}</p>
                            <p className="mt-2 text-sm text-black/60">stuck for {onRepeat.days} days</p>
                        </div>
                    </div>

                    <h3 className={`${heading} mt-4`}>learning on guitar</h3>
                    <ul className="font-mono text-base">
                        {learning.map((row) => (
                            <li
                                key={row.song}
                                className="flex items-center justify-between gap-4 border-t border-black py-4 last:border-b"
                            >
                                <div className="flex flex-col gap-2 min-w-0">
                                    <span className="text-black/80 font-bold truncate">
                                        {row.song} <span className="font-normal text-black/50">· {row.artist}</span>
                                    </span>
                                    <Meter value={row.progress} />
                                </div>
                                <Badge variant={row.variant} className="text-black/90 text-[0.9rem]">
                                    {row.status}
                                </Badge>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                <div className={box}>
                    <h3 className={heading}>on rotation</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 border-b border-black font-mono text-base md:text-lg">
                        {artists.map((name, i) => (
                            <li
                                key={name}
                                className="flex justify-between gap-4 border-t border-black px-1 py-3 text-black cursor-default hover:bg-black hover:text-white hover:px-3 transition-[padding,background-color,color] duration-150"
                            >
                                <span>{name}</span>
                                <span className="opacity-50">{String(i + 1).padStart(2, "0")}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`${box} flex flex-col`}>
                    <h3 className={heading}>give me a song</h3>
                    <div className="flex-1 flex flex-col justify-between gap-6 font-mono text-black">
                        {chosen ? (
                            <motion.div
                                key={pick}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-b border-black py-5"
                            >
                                <p className="text-[1.4rem] font-bold">{chosen.title}</p>
                                <p className="text-black/60">{chosen.artist}</p>
                                
                                <a
                                    href={`https://open.spotify.com/search/${encodeURIComponent(`${chosen.title} ${chosen.artist}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block text-sm underline underline-offset-4 hover:no-underline"
                                >
                                    listen on spotify
                                </a>
                            </motion.div>
                        ) : (
                            <p className="border-t border-b border-black py-5 text-black/50">
                                Press the button and I'll hand you something to play.
                            </p>
                        )}
                        <button type="button" onClick={roll} className={`${btn} self-start`}>
                            {chosen ? "another one" : "surprise me"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}