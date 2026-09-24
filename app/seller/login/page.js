"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSeller } from "@/lib/store";

export default function SellerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("ada@hearthly.demo");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    try {
      loginSeller(email, password);
      router.push("/seller/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Seller studio</p>
      <h1 className="mt-2 text-4xl">Welcome back</h1>
      <p className="mt-3 text-sm text-[#6b6458]">
        Demo account is prefilled. New sellers can <Link href="/seller/register" className="underline">create an account</Link>.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {error && <p className="text-sm text-[#8f4126]">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">Enter studio</button>
      </form>
    </div>
  );
}
