import { LandingHero } from "@/sections/landingHero";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { About } from "@/sections/about";
import { Heading } from "@/components/header";
import { Drawings } from "@/sections/drawings";
import { Music } from "@/sections/music";
import { Books } from "@/sections/books";

export default function Home() {
  return (<>
  <Navbar />
    <main className="min-h-screen border-black px-10 text-neutral-100 flex flex-col justify-between">
      
      <div className="border-l-3 border-r-3 border-black">
        
        <LandingHero />
        <section id="about">
        <Heading  heading="01 - A little about me "/>
        </section>
        <About/>
        <Heading heading="02 - My sketchbook "/>
        <Drawings/>
        <Heading heading="03 - My music taste"/>
        <Music/>
        <Heading heading="04 - My bookshelf"/>
        <Books/>


      </div>


    </main>
  </>
  );
}
