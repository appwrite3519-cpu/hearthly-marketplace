"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { countUnreadConversations, getSession } from "@/lib/store";

export default function Header() {
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    let timer;
    function tick() {
      const s = getSession();
      setSession(s);
      if (!s) {
        setUnreadChats(0);
        return;
      }
      countUnreadConversations(s.id)
        .then(setUnreadChats)
        .catch(() => setUnreadChats(0));
    }
    tick();
    timer = setInterval(tick, 8000);
    return () => clearInterval(timer);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#ddd4c6] bg-[#f4efe6]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3f4a3a] text-sm font-semibold text-[#f4efe6]">
            H
          </span>
          <span className="serif text-xl tracking-tight">Hearthly</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#6b6458] md:flex">
          <Link href="/browse" className="hover:text-[#1c1914]">Browse</Link>
          <Link href="/how-it-works" className="hover:text-[#1c1914]">How it works</Link>
          <Link href="/safety" className="hover:text-[#1c1914]">Meet safely</Link>
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/messages" className="btn btn-ghost relative text-sm">
                Chats
                {unreadChats > 0 && (
                  <span className="ml-1 grid min-w-5 place-items-center rounded-full bg-[#25d366] px-1.5 text-[11px] font-semibold text-white">
                    {unreadChats}
                  </span>
                )}
              </Link>
              <Link href="/dashboard" className="btn btn-dark text-sm">My listings</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost text-sm">Log in</Link>
              <Link href="/register" className="btn btn-primary text-sm">Join free</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
