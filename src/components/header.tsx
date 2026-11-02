import { ArrowDown } from "lucide-react";

interface HeadignProps{
    heading:string;
}

export function Heading({heading}:HeadignProps){
    return(
        <div className=" px-8 py-2 w-full border-b-3 border-b-black h-full">
            <h4 className="text-black flex items-center gap-5 font-mono text-[1.6rem]">{heading}  <ArrowDown/></h4>
        </div>
    )
}