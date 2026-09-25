import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata = {
  title: "Hearthly — Chat, meet, inspect, then pay",
  description:
    "Local classifieds where buyers and sellers negotiate in chat, meet in a public place, inspect the item, and settle payment themselves."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} min-h-screen antialiased`}>
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
