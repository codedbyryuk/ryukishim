import { LandingHero } from "@/sections/landingHero";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { About } from "@/sections/about";
import { Heading } from "@/components/header";

export default function Home() {
  return (<>
  <Navbar />
    <main className="min-h-screen border-black px-10 text-neutral-100 flex flex-col justify-between">
      
      <div className="border-l-3 border-r-3 border-black">
        
        <LandingHero />
        <Heading heading="01 - A little about me "/>
        <About/>
        <Heading heading="02 - My sketchbook "/>

      </div>


    </main>
  </>
  );
}
