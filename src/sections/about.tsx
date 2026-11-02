import { Badge } from "@/components/ui/badge"

const level = ["default","outline","secondary","destructive"] as const;


const obsessions = [
    { obession: "Software", badge: "A lot", level: level[0] },
    {obsession:"Guitar",badge:"Learning",level:level[1]},
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
                    <h3 className="text-[1.4rem] font-Sans-DM text-black/50 uppercase">current obsessions</h3>
                    <ul className="font-mono text-base md:text-lg">
                        {obsessions.map((row) => (
                            <li
                                key={row.obession}
                                className="flex justify-between gap-6 border-t border-black py-4 last:border-b"
                            >
                                <span className="text-black/50">{row.obession}</span>
                                <Badge variant={row.level} className="text-right text-white">{row.badge}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-black flex-1 border-1 p-5">

                </div>

            </div>
        </div>
    )
}