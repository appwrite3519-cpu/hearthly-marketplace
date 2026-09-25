"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const inThread = /^\/messages\/[^/]+$/.test(pathname || "");

  return (
    <>
      <Header />
      <main className={inThread ? "h-[calc(100dvh-57px)] overflow-hidden" : "min-h-[70vh]"}>
        {children}
      </main>
      {!inThread && <Footer />}
    </>
  );
}
