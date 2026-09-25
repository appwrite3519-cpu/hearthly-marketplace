import Link from "next/link";
import { CITIES, MEETUP_SPOTS, SAFETY_RULES } from "@/lib/data";

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Look after each other</p>
      <h1 className="mt-3 text-5xl">Meet safely</h1>
      <ul className="mt-8 space-y-3 text-lg leading-8 text-[#3b362f]">
        {SAFETY_RULES.map((rule) => (
          <li key={rule} className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] px-4 py-3">{rule}</li>
        ))}
      </ul>
      <h2 className="mt-12 text-3xl">Suggested public spots</h2>
      <p className="mt-2 text-[#6b6458]">These are starting points. Choose somewhere busy and easy to leave.</p>
      <div className="mt-6 space-y-5">
        {CITIES.map((city) => (
          <div key={city}>
            <p className="font-semibold">{city}</p>
            <p className="text-sm text-[#6b6458]">{(MEETUP_SPOTS[city] || []).join(" · ")}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-sm text-[#6b6458]">
        Hearthly is a noticeboard and a chat. We do not escrow funds, arrange transport, or guarantee items.
      </p>
      <Link href="/browse" className="btn btn-primary mt-6">Back to listings</Link>
    </div>
  );
}
