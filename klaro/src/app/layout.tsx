import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klaro — Report social mensili per i tuoi clienti in 5 minuti",
  description:
    "Klaro aiuta i social media manager freelance a creare report mensili brandizzati (Instagram, TikTok, LinkedIn) con commento AI e confronto col mese precedente.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
