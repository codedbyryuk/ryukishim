"use client"
import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionValue,
    useMotionTemplate,
    useSpring,
    useTransform,
    useReducedMotion,
} from "framer-motion";


const works = [
    { title: 'Golden hour', year: '2026', image: '/photos/art2.jfif' },
    { title: 'Canola field', year: '2026', image: '/photos/art1.jfif' },
    { title: 'The pier', year: '2025', image: '/photos/art3.jfif' },
    { title: 'Pink drift', year: '2025', image: '/photos/art4.jfif' },
    { title: 'd drift', year: '2025', image: '/photos/art5.jfif' },
];


const currently = [
    { label: 'drawing', value: 'Sketches' },
    { label: 'listening', value: 'Atif Aslam' },
    { label: 'learning', value: 'Guitar' },
];


const tools = ['Procreate', '2B pencil', 'Wacom tablet', 'Film camera', 'Headphones', 'Sketchbook'];

const REVEAL_RADIUS = 180;

function Sticker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            drag
            dragSnapToOrigin
            dragElastic={0.25}
            dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
            whileHover={{ rotate: -5 }}
            whileDrag={{ scale: 1.12, rotate: 6 }}
            className={`absolute z-20 touch-none cursor-grab active:cursor-grabbing text-black ${className}`}
        >
            {children}
        </motion.div>
    );
}

const svgProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "pointer-events-none w-full h-full",
};

function Star() {
    return (
        <svg viewBox="0 0 80 80" {...svgProps}>
            <path d="M40 6 L48 31 L75 33 L54 49 L62 75 L40 60 L18 75 L26 50 L5 34 L32 32 Z" />
        </svg>
    );
}

function Scribble() {
    return (
        <svg viewBox="0 0 100 80" {...svgProps}>
            <path d="M18 46 C10 22 44 8 66 16 C92 26 90 58 60 68 C32 76 8 62 14 36 C18 22 46 12 62 18" />
        </svg>
    );
}

function Arrow() {
    return (
        <svg viewBox="0 0 100 70" {...svgProps}>
            <path d="M6 38 C30 28 60 32 90 36 M72 18 L92 36 L72 56" />
        </svg>
    );
}


function CurrentlyBlock() {
    return (
        <div className="p-6 md:p-8 flex flex-col">
            <p className="font-mono text-sm text-black/50 mb-6">currently</p>
            <ul className="font-mono text-base md:text-lg">
                {currently.map((row) => (
                    <li
                        key={row.label}
                        className="flex justify-between gap-6 border-t border-black py-4 last:border-b"
                    >
                        <span className="text-black/50">{row.label}</span>
                        <span className="text-right text-black">{row.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
function ArtworkBlock() {
    const reduce = useReducedMotion();
    const [active, setActive] = useState(0);
 
    
    useEffect(() => {
        const id = setInterval(() => setActive((i) => (i + 1) % works.length), 4000);
        return () => clearInterval(id);
    }, []);
 
    const current = works[active];
 
    return (
        <div className="p-6 md:p-8 flex items-center justify-center">
            <motion.figure
                whileHover={{ rotate: 0 }}
                initial={{ rotate: -2 }}
                className="w-[78%] max-w-[340px] bg-white border-2 border-black p-3 shadow-[7px_7px_0_#000]"
            >
                <div className="relative aspect-[4/5] bg-black/5 overflow-hidden">
                    {works.map((w, i) => (
                        <motion.img
                            key={w.image}
                            src={w.image}
                            alt={w.title}
                            draggable={false}
                            initial={false}
                            className="absolute inset-0 w-full h-full object-cover"
                            animate={{ opacity: i === active ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : 0.6, ease: "easeInOut" }}
                        />
                    ))}
                </div>
                <figcaption className="font-mono text-sm pt-3 flex justify-between">
                    <span className="text-black">{current.title}</span>
                    <span className="text-black/50">{current.year}</span>
                </figcaption>
            </motion.figure>
        </div>
    );
}

function ToolsBlock() {
    return (
        <div className="p-6 md:p-8 flex flex-col">
            <p className="font-mono text-sm text-black/50 mb-6">tools</p>
            <ul className="font-mono text-base md:text-lg">
                {tools.map((t) => (
                    <li
                        key={t}
                        className="border-t text-black border-black last:border-b px-1 py-3 cursor-default hover:bg-black hover:text-white hover:px-3 transition-[padding,background-color,color] duration-150"
                    >
                        {t}
                    </li>
                ))}
            </ul>
        </div>
    );
}



export function LandingHero() {
    const ref = useRef<HTMLSpanElement>(null);

 
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);


    const x = useSpring(rawX, { stiffness: 220, damping: 28, mass: 0.6 });
    const y = useSpring(rawY, { stiffness: 220, damping: 28, mass: 0.6 });


    const rawSize = useMotionValue(0);
    const size = useSpring(rawSize, { stiffness: 180, damping: 26 });
    const r = useTransform(size, (s) => Math.max(s, 0.01));


    const revealMask = useMotionTemplate`radial-gradient(circle ${r}px at ${x}px ${y}px, black 100%, transparent 100%)`;
    
    const baseMask = useMotionTemplate`radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 94%, black 100%)`;

    const move = (e: React.PointerEvent<HTMLSpanElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        rawX.set(e.clientX - rect.left);
        rawY.set(e.clientY - rect.top);
    };

    const enter = (e: React.PointerEvent<HTMLSpanElement>) => {
       
        const rect = e.currentTarget.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        rawX.set(px); rawY.set(py);
        x.jump(px); y.jump(py);
        rawSize.set(REVEAL_RADIUS);
    };

    return (
        <main className="w-full border-b-3 border-b-black h-full">
            <div className="flex flex-col w-full items-center">
                <div className="flex flex-col items-center justify-center pt-4 pb-14 md:pb-16">
                    <h1
                        aria-label="RYUKISHIM"
                        className="font-Futura-EB text-[clamp(4rem,15vw,15rem)] text-center text-black leading-none"
                    >
                        <motion.span
                            ref={ref}
                            className="relative inline-block cursor-pointer select-none"
                            onPointerEnter={enter}
                            onPointerMove={move}
                            onPointerLeave={() => rawSize.set(0)}
                        >
                            
                            <motion.span
                                aria-hidden
                                className="block whitespace-nowrap"
                                style={{ maskImage: baseMask, WebkitMaskImage: baseMask }}
                            >
                                RYUKISHIM
                            </motion.span>

                           
                            <motion.span
                                aria-hidden
                                className="absolute inset-0 flex items-center justify-center whitespace-nowrap pointer-events-none"
                                style={{ maskImage: revealMask, WebkitMaskImage: revealMask, color: "#fff", backgroundColor: "#000" }}
                            >
                                FAHIM
                            </motion.span>
                        </motion.span>
                    </h1>
                    <p className="text-black font-mono text-[1.1rem] md:text-[1.4rem] text-center px-4">- A notebook of things I make and love -</p>
                </div>

              
                <section className="relative w-full border-t-2 border-black">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.25fr_1fr] [&>*]:border-black [&>*]:border-b-2 md:[&>*]:border-b-0 md:[&>*]:border-r-2 [&>*:last-child]:border-b-0 md:[&>*:last-child]:border-r-0">
                        <CurrentlyBlock />
                        <ArtworkBlock />
                        <ToolsBlock />
                    </div>

                   
                    <Sticker className="w-12 h-12 md:w-[72px] md:h-[72px] -top-6 md:-top-9 left-[6%] -rotate-12">
                        <Star />
                    </Sticker>
                    <Sticker className="w-16 h-12 md:w-24 md:h-[72px] -top-6 md:-top-9 right-[8%] rotate-6">
                        <Scribble />
                    </Sticker>
                    <Sticker className="hidden md:block w-24 h-16 -top-8 left-[46%] -rotate-3">
                        <Arrow />
                    </Sticker>
                </section>
            </div>
        </main>
    )
}