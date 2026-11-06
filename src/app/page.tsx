
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import {  Ryukishim } from "@/components/personalPage";
import { Codedbyryuk } from "@/components/developerPage";

export default function Home() {
  const [mode, setMode] = useState("personal");

  return (
    <>
      <Navbar
        mode={mode}
        onSwitch={() =>
          setMode((current) =>
            current === "personal" ? "developer" : "personal"
          )
        }
      />

      {mode === "personal" ? <Ryukishim/> : <Codedbyryuk/>}
    </>
  );
}
