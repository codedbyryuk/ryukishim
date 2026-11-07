import { About } from "@/sections/codedbyryukMode/about";
import { Heading } from "@/components/header";
import { Contact } from "@/sections/codedbyryukMode/contact";
import { LandingHero } from "@/sections/codedbyryukMode/landingHero";
import { Projects } from "@/sections/codedbyryukMode/projects";
import { Repos } from "@/sections/codedbyryukMode/repos";
import { Stack } from "@/sections/codedbyryukMode/stack";



export function Codedbyryuk() {
    return (
        <>
            <main className="min-h-screen bg-[#affc41] border-white px-10 text-neutral-100 flex flex-col justify-between">

                <div className="border-l-3 border-r-3 border-[#000]">
                    <LandingHero />
                    <section id="about">
                        <Heading heading="01 - A little about me " />
                    </section>
                    <About />
                    <Heading heading="02 - Projects i have built"/>
                    <Projects/>
                    <Heading heading="03 - My repository"/>
                    <Repos/>
                    <Heading heading="04 - My stack"/>
                    <Stack/>
                    <Heading heading="05 - Find me else where" />
                    <Contact />
                    
                </div>
            </main>
        </>
    )
}