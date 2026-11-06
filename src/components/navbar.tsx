"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw, ChevronDown } from "lucide-react";

const sections = [
    { name: "About", id: "about" },
    { name: "Drawings", id: "drawings" },
    { name: "Music", id: "music" },
    { name: "Bookshelf", id: "bookshelf" },
    { name: "Contact", id: "contact" },
];

const themes = {
    personal: {
        nav: "bg-[#e9ecef] text-black border-black",
        link: "text-black/60 hover:text-black",
    },
    developer: {
        nav: "bg-[#affc41] text-[#060606] border-[#060606]",
        link: "text-[#060606]/60 hover:text-[#060606]",
    },
};

interface NavProps {
    mode: string;
    onSwitch: () => void;
}

export function Navbar({ mode, onSwitch }: NavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const theme = mode === "personal" ? themes.personal : themes.developer;

    return (
        <nav
            className={`w-full sticky top-0 z-50 px-5 border-b-3 py-5 transition-colors duration-300 ${theme.nav}`}
        >
            <ul className="flex justify-evenly items-center">

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

                <li>
                    <button
                        onClick={onSwitch}
                        className="flex gap-2 cursor-pointer"
                    >
                        {mode === "personal" ? "Developer" : "Personal"}
                        <RefreshCcw />
                    </button>
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
                                    className={`transition-colors ${theme.link}`}
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