/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  // @react-pdf/renderer va eseguito come pacchetto esterno lato server
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
