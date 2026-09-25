"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SellerEditRedirect() {
  const { id } = useParams();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/listings/${id}/edit`);
  }, [id, router]);
  return <div className="px-5 py-16">Redirecting…</div>;
}
