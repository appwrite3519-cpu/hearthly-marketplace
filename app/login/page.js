"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { loginUser } from "@/lib/store";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("amaka@hearthly.demo");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    try {
      loginUser(email, password);
      router.push(params.get("next") || "/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">One account</p>
      <h1 className="mt-2 text-4xl">Log in</h1>
      <p className="mt-3 text-sm text-[#6b6458]">
        Same account lists items and chats with sellers. Demo is prefilled. New here?{" "}
        <Link href="/register" className="underline">Create an account</Link>.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {error && <p className="text-sm text-[#8f4126]">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">Continue</button>
      </form>
      <p className="mt-4 text-xs text-[#6b6458]">Seller demo: ada@hearthly.demo / demo1234</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="px-5 py-16">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
