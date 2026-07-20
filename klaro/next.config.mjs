/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  // @react-pdf/renderer va eseguito come pacchetto esterno lato server
  serverExternalPackages: ["@react-pdf/renderer"],
  // Un package-lock.json nella cartella padre fa sì che Next.js indovini la
  // workspace root sbagliata: la fissiamo esplicitamente a questa cartella.
  outputFileTracingRoot: import.meta.dirname,
  // Consente l'accesso dev da 127.0.0.1 oltre a localhost (utile per test
  // automatizzati locali, es. Playwright).
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
