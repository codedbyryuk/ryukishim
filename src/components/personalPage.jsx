import { About } from "@/sections/ryukishimMode/about";
import { Heading } from "@/components/header";
import { Drawings } from "@/sections/ryukishimMode/drawings";
import { Music } from "@/sections/ryukishimMode/music";
import { Books } from "@/sections/ryukishimMode/books";
import { Contact } from "@/sections/ryukishimMode/contact";
import { LandingHero } from "@/sections/ryukishimMode/landingHero";


export function Ryukishim() {
    return (
        <>
            <main className="min-h-screen  border-black px-10 text-neutral-100 flex flex-col justify-between">

                <div className="border-l-3 border-r-3 border-black">
                    <LandingHero />
                    <section id="about">
                        <Heading heading="01 - A little about me " />
                    </section>
                    <About />
                    <Heading heading="02 - My sketchbook " />
                    <Drawings />
                    <Heading heading="03 - My music taste" />
                    <Music />
                    <section id="bookshelf">
                        <Heading heading="04 - My bookshelf" />
                    </section>

                    <Books />
                    <Heading heading="05 - Find me else where" />
                    <Contact />
                </div>
            </main>
        </>
    )
}