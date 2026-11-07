import { Badge } from "@/components/ui/badge"
import { Terminal } from "./terminal";


const level = ["default", "outline", "secondary", "destructive"] as const;

const badgeStyles: Record<(typeof level)[number], string> = {
    default: "bg-[#000] text-[#affc41] border-transparent",
    secondary: "bg-[#000]/20 text-[#000] border-transparent",
    outline: "bg-transparent text-[#000] border-[#000]",
    destructive: "bg-transparent text-[#000] border-[#000]",
};


const obsessions = [
    { obsession: "Web development", badge: "A lot", level: level[0], description: "Building interfaces that feel alive, mostly in React and Next.js." },
    { obsession: "Game development", badge: "A lot", level: level[0], description: "Small games and prototypes, usually rebuilt at least once." },
    { obsession: "UI and motion", badge: "A lot", level: level[0], description: "Hover states, easing curves, and details most people never notice." },
    { obsession: "Rewriting my code", badge: "Always", level: level[2], description: "Rewriting things I finished last week because I know I can do better." },
]

export function About() {
    return (
        <div className="w-full py-6 px-10 flex gap-10 flex-col border-b-3 border-b-[#000] h-full">
            <div>
                <h3 className="text-[2.4rem] font-Sans-DM text-[#000]/90">Hello, I'm Fahim.</h3>
                <h2 className="text-[3rem] font-PixelifySans font-bold text-[#000]">I enjoy building software, experimenting with ideas, and turning random thoughts into actual projects.</h2>
                <h3 className="text-[2.4rem] font-Sans-DM text-[#000]/90">Always learning, constantly tinkering, and probably already thinking about the next thing to build.</h3>
            </div>
            <div className="flex">
                <div className="border-[#000] flex-1 border-1 p-5">
                    <h3 className="text-[1.4rem] font-Sans-DM text-[#000]/50 uppercase mb-4">current obsessions</h3>
                    <ul className="font-mono text-base md:text-lg">
                        {obsessions.map((row) => (
                            <li
                                key={row.obsession}
                                className="flex justify-between gap-6 border-t border-[#000] py-4 last:border-b"
                            >
                                <div className="flex flex-col gap-2">
                                    <span className="text-[#000] text-[1.4rem] font-bold">{row.obsession}</span>
                                    <span className="text-[#000]/60">{row.description}</span>
                                </div>
                                <Badge variant={row.level} className={`text-right text-[0.9rem] ${badgeStyles[row.level]}`}>{row.badge}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-[#000] flex-1 border-1 p-5">
                        <Terminal/>
                </div>

            </div>
        </div>
    )
}