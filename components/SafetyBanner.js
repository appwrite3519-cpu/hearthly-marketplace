import Link from "next/link";

export default function SafetyBanner() {
  return (
    <div className="rounded-2xl border border-[#e2cbb8] bg-[#fff6ee] px-4 py-3 text-sm leading-6 text-[#3b362f]">
      Meet in public, in daylight. Inspect the item. Pay the other person directly only when you are happy.
      Hearthly does not hold money. <Link href="/safety" className="font-semibold text-[#8f4126]">Meetup rules →</Link>
    </div>
  );
}
