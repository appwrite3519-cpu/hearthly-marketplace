"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STATES, stateLabel } from "@/lib/data";
import { registerUser, requestSignupCode } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState("details");
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "Edo", password: "" });
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function sendCode(e) {
    e?.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Name, email, phone and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Use at least 6 characters for the password.");
      return;
    }
    setBusy(true);
    try {
      const result = await requestSignupCode(form);
      setChallenge(result);
      setCode("");
      setStep("code");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode(e) {
    e.preventDefault();
    setError("");
    if (!String(code).trim()) {
      setError("Enter the 6-digit code sent to your phone.");
      return;
    }
    setBusy(true);
    try {
      await registerUser({ ...form, code });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Join Hearthly</p>
      <h1 className="mt-2 text-4xl">{step === "code" ? "Verify your phone" : "Create your account"}</h1>
      <p className="mt-3 text-sm text-[#6b6458]">
        {step === "code" ? (
          <>
            Enter the 6-digit code we sent to <span className="font-medium text-[#1c1914]">{challenge?.phoneLabel || form.phone}</span>.
          </>
        ) : (
          <>
            You can list items and message sellers with the same login. Already have one?{" "}
            <Link href="/login" className="underline">Log in</Link>.
          </>
        )}
      </p>

      {step === "details" ? (
        <form onSubmit={sendCode} className="mt-8 space-y-3">
          <input className="field" placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <input className="field" type="tel" inputMode="tel" placeholder="Phone e.g. 0803 441 2290" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          <select className="field" value={form.city} onChange={(e) => set("city", e.target.value)}>
            {STATES.map((state) => <option key={state} value={state}>{stateLabel(state)}</option>)}
          </select>
          <input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => set("password", e.target.value)} />
          {error && <p className="text-sm text-[#8f4126]">{error}</p>}
          <button className="btn btn-primary w-full" type="submit" disabled={busy}>{busy ? "Sending code…" : "Send verification code"}</button>
        </form>
      ) : (
        <form onSubmit={confirmCode} className="mt-8 space-y-3">
          <input
            className="field tracking-[0.4em] text-center text-2xl"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          {challenge?.previewCode ? (
            <p className="rounded-xl bg-[#ece4d6] px-3 py-2 text-sm text-[#3b362f]">
              SMS is not connected yet. Use this code: <span className="font-semibold tracking-widest">{challenge.previewCode}</span>
            </p>
          ) : (
            <p className="text-sm text-[#6b6458]">The code expires in 10 minutes.</p>
          )}
          {error && <p className="text-sm text-[#8f4126]">{error}</p>}
          <button className="btn btn-primary w-full" type="submit" disabled={busy}>{busy ? "Checking…" : "Verify and create account"}</button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-[#8f4126]" onClick={() => { setStep("details"); setError(""); }} disabled={busy}>
              Change number
            </button>
            <button type="button" className="text-[#8f4126]" onClick={() => sendCode()} disabled={busy}>
              Resend code
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
