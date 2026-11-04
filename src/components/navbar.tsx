
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw, ChevronDown } from "lucide-react";

const sections = [
    { name: "About", id: "about" },
    { name: "Drawings", id: "drawings" },
    { name: "Music", id: "music" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full sticky top-0 z-50 bg-[#e9ecef] px-5 border-b-3 border-black py-5">
            <ul className="flex justify-evenly items-center text-black">

                <li>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        Explore
                        <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown size={16} />
                        </motion.span>
                    </button>
                </li>

                <li>TIME</li>

                <li className="flex gap-2 cursor-pointer">
                    Switch <RefreshCcw />
                </li>

            </ul>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="flex justify-center gap-10 pt-6 pb-2">
                            {sections.map((section, index) => (
                                <motion.a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: index * 0.06,
                                    }}
                                    onClick={() => setIsOpen(false)}
                                    className="text-black/60 hover:text-black transition-colors"
                                >
                                    {section.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
