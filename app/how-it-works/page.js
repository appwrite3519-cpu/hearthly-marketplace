import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">The house rules</p>
      <h1 className="mt-3 text-5xl">How Hearthly works</h1>
      <div className="mt-10 space-y-8 text-lg leading-8 text-[#3b362f]">
        <section>
          <h2 className="text-3xl">For buyers</h2>
          <p className="mt-3">Browse by room, city and condition. Message the seller from the listing — no account needed.</p>
        </section>
        <section>
          <h2 className="text-3xl">For sellers</h2>
          <p className="mt-3">Create an account in the seller studio. Post, edit, mark sold, and read buyer messages in one place.</p>
        </section>
        <section>
          <h2 className="text-3xl">What neat and fairly used means</h2>
          <p className="mt-3">Clean, working pieces described honestly: like new, excellent, good or fair.</p>
        </section>
      </div>
      <div className="mt-10 flex gap-3">
        <Link href="/browse" className="btn btn-primary">Start browsing</Link>
        <Link href="/seller/register" className="btn btn-dark">Open seller studio</Link>
      </div>
    </div>
  );
}
