"use client"
import  {RefreshCcw}  from "lucide-react"
export function Navbar(){
    
    return(<>

        <nav className="w-full px-5 border-b-3 border-black py-5">
            <ul className="flex  justify-evenly text-black">
                <li>SOMETHING</li>
                <li>TIME</li>
                <li className="flex gap-2">Switch<RefreshCcw/></li>
            </ul>
        </nav>
    
    
    </>)
}