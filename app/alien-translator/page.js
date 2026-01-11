import dynamic from "next/dynamic";
import React from "react";

const AlienCodeTranslator = dynamic(() => import("@/components/AlienCodeTranslator"), { ssr: false });

export const metadata = {
  title: "Alien Code Translator | Alien Signal Blog",
  description: "Ask cosmic coding questions and get alien-themed answers powered by AI!"
};

export default function AlienTranslatorPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem 0" }}>
      <AlienCodeTranslator />
    </main>
  );
}
