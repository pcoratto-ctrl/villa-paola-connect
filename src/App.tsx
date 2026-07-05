import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import {
  VillaSulMareCalabria,
  VillaAccessoDirettoSpiaggia,
  CasaVacanzeGizzeria,
  VillaVicinoAeroportoLamezia,
  VillaPerFamiglie,
  VillaPetFriendly,
  VacanzeSettembre,
} from "./pages/SeoPages.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/villa-sul-mare-calabria" element={<VillaSulMareCalabria />} />
          <Route path="/villa-accesso-diretto-spiaggia-calabria" element={<VillaAccessoDirettoSpiaggia />} />
          <Route path="/casa-vacanze-gizzeria" element={<CasaVacanzeGizzeria />} />
          <Route path="/villa-vicino-aeroporto-lamezia" element={<VillaVicinoAeroportoLamezia />} />
          <Route path="/villa-per-famiglie-calabria" element={<VillaPerFamiglie />} />
          <Route path="/villa-pet-friendly-calabria" element={<VillaPetFriendly />} />
          <Route path="/vacanze-settembre-calabria" element={<VacanzeSettembre />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
