import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ChatWidget from "@/components/chat/ChatWidget";
import { storeName } from "@/lib/format";

export const metadata: Metadata = {
  title: {
    default: `${storeName()} — Material Listrik`,
    template: `%s — ${storeName()}`,
  },
  description:
    "Material listrik, kabel, MCB, saklar, lampu LED, pipa, hingga alat ukur. Pesan mudah lewat WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1 pb-16 sm:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}