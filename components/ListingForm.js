"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, CONDITIONS, STATES, locationsFor, stateLabel } from "@/lib/data";
import { getListing, getSession, saveListing, uploadListingPhoto } from "@/lib/store";

const EMPTY = {
  title: "",
  category: "home",
  condition: "excellent",
  price: "",
  negotiable: true,
  hasReceipt: false,
  hasCarton: false,
  city: "Edo",
  neighborhood: "1st Ugbor",
  image: "",
  description: ""
};

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });
}

export default function ListingForm({ listingId }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const areas = useMemo(() => locationsFor(form.city), [form.city]);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
    if (listingId) {
      getListing(listingId).then((existing) => {
        if (!existing || existing.sellerId !== s.id) {
          router.replace("/dashboard");
          return;
        }
        const state = STATES.includes(existing.city) ? existing.city : "Edo";
        const spots = locationsFor(state);
        setForm({
          title: existing.title,
          category: existing.category,
          condition: existing.condition,
          price: existing.price,
          negotiable: Boolean(existing.negotiable),
          hasReceipt: Boolean(existing.hasReceipt),
          hasCarton: Boolean(existing.hasCarton),
          city: state,
          neighborhood: spots.includes(existing.neighborhood) ? existing.neighborhood : spots[0] || "",
          image: existing.image,
          description: existing.description
        });
      }).catch((err) => setError(err.message));
    }
  }, [listingId, router]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setState(state) {
    const spots = locationsFor(state);
    setForm((prev) => ({
      ...prev,
      city: state,
      neighborhood: spots.includes(prev.neighborhood) ? prev.neighborhood : spots[0] || ""
    }));
  }

  async function onPickPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !session) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a photo file (jpg, png or webp).");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Photo must be under 3MB. Take or crop a smaller picture.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const dataUrl = await readFileAsBase64(file);
      const url = await uploadListingPhoto({
        sellerId: session.id,
        fileName: file.name,
        contentType: file.type,
        base64: dataUrl
      });
      set("image", url);
    } catch (err) {
      setError(err.message || "Could not upload that photo.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.price || !form.description) {
      setError("Title, asking price and description are required.");
      return;
    }
    if (!form.neighborhood) {
      setError("Pick the area where the item is.");
      return;
    }
    if (!String(form.image || "").trim()) {
      setError("Add a photo of the item so buyers can see it.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const existing = listingId ? await getListing(listingId) : null;
      const id = await saveListing({
        id: listingId,
        ...form,
        price: Number(form.price),
        image: form.image,
        status: existing?.status || "active"
      }, session.id);
      router.push(`/item/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!session) return <div className="px-5 py-16">Loading form…</div>;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 px-5 py-10">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Post locally</p>
      <h1 className="text-4xl">{listingId ? "Edit listing" : "Post an item"}</h1>
      <p className="text-sm text-[#6b6458]">Buyers will chat with you, then you pick a public place to meet. No checkout on Hearthly.</p>
      <input className="field" placeholder="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
      <div className="grid gap-3 md:grid-cols-2">
        <select className="field" value={form.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="field" value={form.condition} onChange={(e) => set("condition", e.target.value)}>
          {CONDITIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="field" type="number" min="0" placeholder="Asking price (NGN)" value={form.price} onChange={(e) => set("price", e.target.value)} />
        <select className="field" value={form.city} onChange={(e) => setState(e.target.value)}>
          {STATES.map((state) => <option key={state} value={state}>{stateLabel(state)}</option>)}
        </select>
      </div>
      <select className="field" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)}>
        <option value="">Key location</option>
        {areas.map((area) => <option key={area} value={area}>{area}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm text-[#3b362f]">
        <input type="checkbox" checked={form.negotiable} onChange={(e) => set("negotiable", e.target.checked)} />
        Price is negotiable in chat
      </label>

      <div className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-4">
        <p className="text-sm font-medium">Item photo</p>
        <p className="mt-1 text-xs text-[#6b6458]">Choose from your gallery or take a new picture. Max 3MB.</p>
        {form.image ? (
          <img src={form.image} alt="Listing preview" className="mt-3 h-48 w-full rounded-xl object-cover" />
        ) : (
          <div className="mt-3 grid h-36 place-items-center rounded-xl bg-[#ece4d6] text-sm text-[#6b6458]">
            No photo yet
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <label className="btn btn-dark cursor-pointer">
            {uploading ? "Uploading…" : "Choose from gallery"}
            <input type="file" accept="image/*" className="hidden" disabled={uploading || busy} onChange={onPickPhoto} />
          </label>
          <label className="btn btn-ghost cursor-pointer">
            Take photo
            <input type="file" accept="image/*" capture="environment" className="hidden" disabled={uploading || busy} onChange={onPickPhoto} />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[#3b362f]">
        <input type="checkbox" checked={form.hasReceipt} onChange={(e) => set("hasReceipt", e.target.checked)} />
        Reciept dey?
      </label>
      <label className="flex items-center gap-2 text-sm text-[#3b362f]">
        <input type="checkbox" checked={form.hasCarton} onChange={(e) => set("hasCarton", e.target.checked)} />
        Carton dey?
      </label>

      <textarea className="field min-h-36" placeholder="Honest description: wear, what is included, and a public place you are happy to meet." value={form.description} onChange={(e) => set("description", e.target.value)} />
      {error && <p className="text-sm text-[#8f4126]">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy || uploading}>{busy ? "Saving…" : listingId ? "Save changes" : "Publish listing"}</button>
    </form>
  );
}
