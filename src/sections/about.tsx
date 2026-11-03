import { Badge } from "@/components/ui/badge"
import { SlidingPuzzle } from "./SlidingPuzzle";

const level = ["default", "outline", "secondary", "destructive"] as const;


const obsessions = [
    { obsession: "Software", badge: "A lot", level: level[0], description: "Building software, games, anything that comes to my mind." },
    { obsession: "Guitar", badge: "Learning", level: level[2],description:"Playing guitar, discovering music and occasionally getting stuck on one song." },
    { obsession: "Drawing", badge: "A lot", level: level[0],description:"Making sketches, discovering new things to draw, learning new styles." },
    { obsession: "Reading", badge: "At free time", level: level[1],description:"Reading murder mystery novels." },
]

export function About() {
    return (
        <div className="w-full py-6 px-10 flex gap-10 flex-col border-b-3 border-b-black h-full">
            <div>
                <h3 className="text-[2.4rem] font-Sans-DM text-black/90">Hello, I'm Fahim.</h3>
                <h2 className="text-[3rem] font-Sans-DM font-bold text-black">Into programming, guitar, drawing, and pretty much anything I find interesting.</h2>
                <h3 className="text-[2.4rem] font-Sans-DM text-black/90">A bit of a perfectionist, always curious, and rarely satisfied with the first attempt.</h3>
            </div>
            <div className="flex">
                <div className="border-black flex-1 border-1 p-5">
                    <h3 className="text-[1.4rem] font-Sans-DM text-black/50 uppercase mb-4">current obsessions</h3>
                    <ul className="font-mono text-base md:text-lg">
                        {obsessions.map((row) => (
                            <li
                                key={row.obsession}
                                className="flex justify-between gap-6 border-t border-black py-4 last:border-b"
                            >
                                <div className="flex flex-col gap-2">
                                    <span className="text-black/60 text-[1.4rem] font-bold">{row.obsession}</span>
                                    <span className="text-black/60">{row.description}</span>
                                </div>
                                <Badge variant={row.level} className="text-right text-black/90 text-[0.9rem]">{row.badge}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-black flex-1 border-1 p-5">
                        <SlidingPuzzle image="/photos/art1.jfif" />
                </div>

            </div>
        </div>
    )
}