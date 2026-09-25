"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const inThread = /^\/messages\/[^/]+$/.test(pathname || "");

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (inThread) document.body.style.overflow = "hidden";
    else document.body.style.overflow = previous || "";
    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [inThread]);

  return (
    <>
      {!inThread && <Header />}
      <main className={inThread ? "" : "min-h-[70vh]"}>{children}</main>
      {!inThread && <Footer />}
    </>
  );
}
