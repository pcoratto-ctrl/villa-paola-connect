import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConsentChoices from "@/components/ConsentChoices";
import Index from "./pages/Index.tsx";
import InternationalVilla from "./pages/InternationalVilla";
import AdminLogin from "./pages/AdminLogin.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import PartnerLogin from "./pages/PartnerLogin.tsx";
import PartnerCalendar from "./pages/PartnerCalendar.tsx";
import AdminOperators from "./pages/AdminOperators.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import TerminiCondizioni from "./pages/TerminiCondizioni.tsx";
import {
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
          <Route path="/it/home" element={<Navigate to="/" replace />} />
          <Route path="/villa-sul-mare-calabria" element={<InternationalVilla locale="it" />} />
          <Route path="/en/beachfront-villa-calabria" element={<InternationalVilla locale="en" />} />
          <Route path="/en/villa-direct-beach-access-calabria" element={<InternationalVilla locale="en" topic="beach" />} />
          <Route path="/en/calabria-spring-autumn-holidays" element={<InternationalVilla locale="en" topic="seasons" />} />
          <Route path="/villa-accesso-diretto-spiaggia-calabria" element={<VillaAccessoDirettoSpiaggia />} />
          <Route path="/casa-vacanze-gizzeria" element={<CasaVacanzeGizzeria />} />
          <Route path="/villa-vicino-aeroporto-lamezia" element={<VillaVicinoAeroportoLamezia />} />
          <Route path="/villa-per-famiglie-calabria" element={<VillaPerFamiglie />} />
          <Route path="/villa-pet-friendly-calabria" element={<VillaPetFriendly />} />
          <Route path="/vacanze-settembre-calabria" element={<VacanzeSettembre />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/termini-condizioni" element={<TerminiCondizioni />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/operatori" element={<AdminOperators />} />
          <Route path="/calendario/login" element={<PartnerLogin />} />
          <Route path="/calendario" element={<PartnerCalendar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ConsentChoices />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
