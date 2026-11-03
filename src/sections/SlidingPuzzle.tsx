"use client"
import { useEffect, useState } from "react";

const SIZES = [3, 4];

const btn =
    "border border-black px-3 py-1 cursor-pointer select-none transition-colors duration-150 hover:bg-black hover:text-white";

function solvedBoard(n: number) {
    return Array.from({ length: n * n }, (_, i) => i);
}

function neighbours(pos: number, n: number) {
    const row = Math.floor(pos / n);
    const col = pos % n;
    const out: number[] = [];
    if (row > 0) out.push(pos - n);
    if (row < n - 1) out.push(pos + n);
    if (col > 0) out.push(pos - 1);
    if (col < n - 1) out.push(pos + 1);
    return out;
}

function shuffledBoard(n: number) {
    let board = solvedBoard(n);
    while (board.every((t, i) => t === i)) {
        board = solvedBoard(n);
        let blank = board.length - 1;
        let prev = -1;
        for (let i = 0; i < n * n * 20; i++) {
            const options = neighbours(blank, n).filter((p) => p !== prev);
            const next = options[Math.floor(Math.random() * options.length)];
            [board[blank], board[next]] = [board[next], board[blank]];
            prev = blank;
            blank = next;
        }
    }
    return board;
}

export function SlidingPuzzle({ image = "/photos/art1.jfif" }: { image?: string }) {
    const [size, setSize] = useState(3);
    const [tiles, setTiles] = useState<number[]>(() => solvedBoard(3));
    const [moves, setMoves] = useState(0);
    const [peek, setPeek] = useState(false);
    const [done, setDone] = useState(false);

    const blankId = size * size - 1;

    const start = (n: number) => {
        setSize(n);
        setTiles(shuffledBoard(n));
        setMoves(0);
        setDone(false);
    };

    useEffect(() => {
        setTiles(shuffledBoard(3));
    }, []);

    const move = (pos: number) => {
        if (done) return;
        const blankPos = tiles.indexOf(blankId);
        if (!neighbours(blankPos, size).includes(pos)) return;
        const next = [...tiles];
        [next[blankPos], next[pos]] = [next[pos], next[blankPos]];
        setTiles(next);
        setMoves((m) => m + 1);
        if (next.every((t, i) => t === i)) setDone(true);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        const b = tiles.indexOf(blankId);
        const targets: Record<string, number | null> = {
            ArrowLeft: b % size < size - 1 ? b + 1 : null,
            ArrowRight: b % size > 0 ? b - 1 : null,
            ArrowUp: b + size < size * size ? b + size : null,
            ArrowDown: b - size >= 0 ? b - size : null,
        };
        if (!(e.key in targets)) return;
        e.preventDefault();
        const target = targets[e.key];
        if (target !== null) move(target);
    };

    return (
        <div className="flex flex-col">
            <h3 className="text-[1.4rem] font-Sans-DM text-black/50 uppercase mb-4">A puzzle for you</h3>

            <div className="w-full max-w-[390px] mx-auto flex flex-col gap-4">
                <div
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    className="relative aspect-square w-full border-2 border-black bg-black/5 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                    {solvedBoard(size).map((id) => {
                        if (id === blankId) return null;
                        const pos = tiles.indexOf(id);
                        if (pos < 0) return null;
                        const row = Math.floor(pos / size);
                        const col = pos % size;
                        const homeRow = Math.floor(id / size);
                        const homeCol = id % size;
                        return (
                            <button
                                key={id}
                                type="button"
                                tabIndex={-1}
                                aria-label={`tile ${id + 1}`}
                                onClick={() => move(pos)}
                                className="absolute border border-black bg-white transition-[left,top] duration-150 ease-out motion-reduce:transition-none"
                                style={{
                                    left: `${(col / size) * 100}%`,
                                    top: `${(row / size) * 100}%`,
                                    width: `${100 / size}%`,
                                    height: `${100 / size}%`,
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: `${size * 100}% ${size * 100}%`,
                                    backgroundPosition: `${(homeCol / (size - 1)) * 100}% ${(homeRow / (size - 1)) * 100}%`,
                                }}
                            >
                                <span className="absolute left-1 top-1 bg-white border border-black px-1 font-mono text-[0.7rem] leading-4 text-black">
                                    {id + 1}
                                </span>
                            </button>
                        );
                    })}

                    <div
                        aria-hidden
                        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: peek || done ? 1 : 0,
                        }}
                    />
                </div>

                <div className="flex items-center justify-between font-mono text-sm text-black">
                    <span>{done ? `solved in ${moves} moves` : `moves ${moves}`}</span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className={`${btn} touch-none`}
                            onPointerDown={() => setPeek(true)}
                            onPointerUp={() => setPeek(false)}
                            onPointerLeave={() => setPeek(false)}
                            onPointerCancel={() => setPeek(false)}
                        >
                            hold to peek
                        </button>
                        <button type="button" className={btn} onClick={() => start(size)}>
                            shuffle
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 font-mono text-sm text-black">
                    {SIZES.map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => start(n)}
                            className={`${btn} ${n === size ? "bg-black text-white" : ""}`}
                        >
                            {n}×{n}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}