import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TerminiCondizioni = () => (
  <>
    <Helmet>
      <title>Termini e condizioni | Villa Paola Caposuvero</title>
      <meta name="description" content="Termini e condizioni d'uso del sito Villa Paola Caposuvero." />
      <link rel="canonical" href="https://villapaolacaposuvero.it/termini-condizioni" />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <Navbar />
    <main className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-8 text-foreground">Termini e condizioni</h1>
        <div className="text-muted-foreground leading-relaxed space-y-6">
          <p>L'utilizzo del sito villapaolacaposuvero.it implica l'accettazione dei presenti Termini e Condizioni.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Natura del sito</h2>
          <p>Il sito ha carattere puramente informativo e presenta l'immobile Villa Paola Caposuvero (Gizzeria Lido, Calabria). Il modulo "Richiedi disponibilità" è una richiesta di informazioni e non costituisce prenotazione. La conferma della disponibilità e delle condizioni economiche avviene tramite email o WhatsApp direttamente con il gestore.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Contenuti</h2>
          <p>Testi, immagini e materiali presenti sul sito sono proprietà di Villa Paola Caposuvero e non possono essere riprodotti senza autorizzazione scritta.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Limitazione di responsabilità</h2>
          <p>Le informazioni pubblicate sono aggiornate con la massima cura ma potrebbero contenere imprecisioni. Villa Paola Caposuvero non risponde di eventuali danni derivanti dall'utilizzo delle informazioni presenti sul sito.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Legge applicabile</h2>
          <p>I presenti termini sono regolati dalla legge italiana. Per ogni controversia è competente il foro di Lamezia Terme.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Dati identificativi</h2>
          <p>
            CIN: IT079060C299OUQTIW<br />
            CIR: 079060-AAT-00018<br />
            P.IVA: [da inserire, se presente]
          </p>

          <p className="text-sm mt-8">Ultimo aggiornamento: luglio 2026.</p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default TerminiCondizioni;
