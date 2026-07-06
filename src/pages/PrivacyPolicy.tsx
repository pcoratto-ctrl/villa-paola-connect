import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EMAIL = "R.falvo@agenzietripodi.com";

const PrivacyPolicy = () => (
  <>
    <Helmet>
      <title>Privacy Policy | Villa Paola Caposuvero</title>
      <meta name="description" content="Informativa privacy di Villa Paola Caposuvero: come trattiamo i dati raccolti tramite il modulo di richiesta disponibilità." />
      <link rel="canonical" href="https://villapaolacaposuvero.it/privacy-policy" />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <Navbar />
    <main className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl mb-8 text-foreground">Informativa sulla Privacy</h1>
        <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed space-y-6">
          <p>Ai sensi del Regolamento UE 2016/679 (GDPR), la presente informativa descrive le modalità di trattamento dei dati personali degli utenti che consultano il sito villapaolacaposuvero.it e utilizzano il modulo di richiesta disponibilità.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Titolare del trattamento</h2>
          <p>Villa Paola Caposuvero — Contrada Caposuvero 31, SS18, Gizzeria Lido (CZ), Italia.<br />
          Email: <a className="text-primary hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
          Telefono: +39 335 538 4250</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Dati raccolti</h2>
          <p>Attraverso il modulo di richiesta disponibilità raccogliamo: nome e cognome, email, telefono (facoltativo), date di soggiorno, numero di ospiti ed eventuale messaggio.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Finalità del trattamento</h2>
          <p>I dati sono trattati esclusivamente per rispondere alla richiesta di disponibilità, fornire un preventivo e gestire la comunicazione con l'ospite. Non vengono utilizzati per finalità di marketing né ceduti a terzi.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Base giuridica</h2>
          <p>Il trattamento si basa sul consenso dell'interessato (art. 6.1.a GDPR) e sull'esecuzione di misure precontrattuali richieste dallo stesso (art. 6.1.b GDPR).</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Conservazione</h2>
          <p>I dati sono conservati per il tempo necessario a evadere la richiesta e comunque non oltre 24 mesi, salvo diverso obbligo di legge.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Fornitori</h2>
          <p>I dati sono conservati su infrastruttura Supabase (backend gestito) con accesso protetto e crittografia in transito.</p>

          <h2 className="font-display text-2xl text-foreground mt-8">Diritti dell'interessato</h2>
          <p>Puoi in ogni momento richiedere l'accesso, la rettifica, la cancellazione o la limitazione del trattamento dei tuoi dati, oppure opporti al trattamento, scrivendo a <a className="text-primary hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali.</p>

          <p className="text-sm mt-8">Ultimo aggiornamento: luglio 2026.</p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default PrivacyPolicy;
