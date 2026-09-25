"use client";

import { useParams } from "next/navigation";
import ListingForm from "@/components/ListingForm";

export default function EditListingPage() {
  const { id } = useParams();
  return <ListingForm listingId={id} />;
}
