import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#ddd4c6] bg-[#ece4d6]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="serif text-2xl">Hearthly</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#6b6458]">
            A calm marketplace for neat, fairly used household items. Give a sofa,
            a mixer or a wardrobe another good home — without the landfill.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b6458]">
            Explore
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/browse">All listings</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/seller/register">Become a seller</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b6458]">
            Studio
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/seller/login">Seller login</Link>
            <Link href="/seller/dashboard">Manage listings</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#ddd4c6] px-5 py-4 text-center text-xs text-[#6b6458]">
        Demo marketplace. Listings persist in your browser. Demo sellers: ada@hearthly.demo / demo1234
      </div>
    </footer>
  );
}
