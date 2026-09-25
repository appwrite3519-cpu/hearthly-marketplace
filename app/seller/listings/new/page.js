import { redirect } from "next/navigation";

export default function SellerNewListingRedirect() {
  redirect("/listings/new");
}
