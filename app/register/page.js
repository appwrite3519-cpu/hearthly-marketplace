"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/lib/data";
import { registerUser } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "Lagos", password: "" });
  const [error, setError] = useState("");
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Use at least 6 characters for the password.");
      return;
    }
    try {
      registerUser(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Join Hearthly</p>
      <h1 className="mt-2 text-4xl">Create your account</h1>
      <p className="mt-3 text-sm text-[#6b6458]">
        You can list items and message sellers with the same login. Already have one?{" "}
        <Link href="/login" className="underline">Log in</Link>.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input className="field" placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input className="field" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <select className="field" value={form.city} onChange={(e) => set("city", e.target.value)}>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => set("password", e.target.value)} />
        {error && <p className="text-sm text-[#8f4126]">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">Create account</button>
      </form>
    </div>
  );
}
