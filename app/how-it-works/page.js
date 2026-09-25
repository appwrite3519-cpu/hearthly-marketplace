import Link from "next/link";
import SafetyBanner from "@/components/SafetyBanner";

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">The deal</p>
      <h1 className="mt-3 text-5xl">How Hearthly works</h1>
      <p className="mt-4 text-lg leading-8 text-[#3b362f]">
        This is not an online shop. Nobody pays through Hearthly. Buyers and sellers
        find each other, talk, meet, look at the item, then settle themselves.
      </p>
      <div className="mt-6">
        <SafetyBanner />
      </div>
      <div className="mt-10 space-y-10 text-lg leading-8 text-[#3b362f]">
        <section>
          <h2 className="text-3xl">1. Someone posts an item</h2>
          <p className="mt-3">Photos, asking price, city and a short honest description. Price can be marked negotiable.</p>
        </section>
        <section>
          <h2 className="text-3xl">2. A buyer opens a chat</h2>
          <p className="mt-3">Ask questions. Offer another number. Agree what is included. Keep it on Hearthly so there is a record.</p>
        </section>
        <section>
          <h2 className="text-3xl">3. Pick a public place</h2>
          <p className="mt-3">Mall entrance, busy market front, well-known square — daytime. Suggest a spot from the chat so both of you see it.</p>
        </section>
        <section>
          <h2 className="text-3xl">4. Inspect, then pay</h2>
          <p className="mt-3">Switch it on. Sit on it. Check the serial. If it is right, pay cash or transfer there and take the item. If it is not right, leave.</p>
        </section>
        <section>
          <h2 className="text-3xl">5. Mark sold and leave a rating</h2>
          <p className="mt-3">Seller marks the listing sold. Both people can rate the other so the next meetup is easier to trust.</p>
        </section>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/browse" className="btn btn-primary">Start browsing</Link>
        <Link href="/listings/new" className="btn btn-dark">Post an item</Link>
        <Link href="/safety" className="btn btn-ghost">Read safety rules</Link>
      </div>
    </div>
  );
}
