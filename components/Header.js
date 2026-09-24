"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/store";

export default function Header() {
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const sellerZone = pathname.startsWith("/seller");

  useEffect(() => {
    setSession(getSession());
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

        {!sellerZone && (
          <nav className="hidden items-center gap-7 text-sm text-[#6b6458] md:flex">
            <Link href="/browse" className="hover:text-[#1c1914]">
              Browse
            </Link>
            <Link href="/how-it-works" className="hover:text-[#1c1914]">
              How it works
            </Link>
            <Link href="/browse?category=furniture" className="hover:text-[#1c1914]">
              Furniture
            </Link>
            <Link href="/browse?category=kitchen" className="hover:text-[#1c1914]">
              Kitchen
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {session ? (
            <Link href="/seller/dashboard" className="btn btn-dark text-sm">
              Seller studio
            </Link>
          ) : (
            <>
              <Link href="/seller/login" className="btn btn-ghost text-sm">
                Seller login
              </Link>
              <Link href="/seller/register" className="btn btn-primary text-sm">
                Start selling
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
