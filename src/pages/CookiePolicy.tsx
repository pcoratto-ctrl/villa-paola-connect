import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CookiePolicy = () => (
  <>
    <Helmet>
      <title>Cookie Policy | Villa Paola Caposuvero</title>
      <meta name="description" content="Cookie policy di Villa Paola Caposuvero: quali cookie utilizziamo e come gestirli." />
      <link rel="canonical" href="https://villapaolacaposuvero.it/cookie-policy" />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <Navbar />
    <main className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-8 text-foreground">Cookie Policy</h1>
        <div className="text-muted-foreground leading-relaxed space-y-6">
          <p>Il sito villapaolacaposuvero.it utilizza esclusivamente cookie tecnici necessari al corretto funzionamento delle pagine (ad esempio la gestione della sessione e delle preferenze di visualizzazione). Non vengono installati cookie di profilazione o pubblicitari.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Cookie tecnici</h2>
          <p>Sono cookie indispensabili per la navigazione e non richiedono il consenso preventivo dell'utente (art. 122 Codice Privacy).</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Cookie di terze parti</h2>
          <p>Il sito non integra strumenti di analisi o tracciamento di terze parti. In caso di future integrazioni (es. Google Analytics), la presente policy verrà aggiornata e verrà mostrato un banner per la raccolta del consenso.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Gestione dei cookie</h2>
          <p>Puoi disabilitare i cookie in qualsiasi momento agendo sulle impostazioni del tuo browser. La disabilitazione dei cookie tecnici potrebbe compromettere il funzionamento del sito.</p>

          <p className="text-sm mt-8">Ultimo aggiornamento: luglio 2026.</p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default CookiePolicy;
