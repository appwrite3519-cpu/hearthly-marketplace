import Link from "next/link";
import { categoryLabel, conditionLabel, formatMoney } from "@/lib/format";

export default function ItemCard({ item }) {
  const sold = item.status === "sold";
  return (
    <Link
      href={`/item/${item.id}`}
      className="group overflow-hidden rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] shadow-[0_8px_30px_rgba(28,25,20,0.04)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ece4d6]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#fffdf8]/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
          {conditionLabel(item.condition)}
        </span>
        {sold && (
          <span className="absolute right-3 top-3 rounded-full bg-[#1c1914] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Sold
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6b6458]">
          {categoryLabel(item.category)} · {item.city}
        </p>
        <h3 className="mt-1 text-lg leading-snug">{item.title}</h3>
        <p className="mt-2 font-semibold text-[#8f4126]">
          {formatMoney(item.price)}
          {item.negotiable ? <span className="ml-2 text-xs font-medium text-[#6b6458]">Negotiable</span> : null}
        </p>
      </div>
    </Link>
  );
}
