import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TerminiCondizioni = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("terms.metaTitle")}</title>
        <meta name="description" content={t("terms.metaDesc")} />
        <link rel="canonical" href="https://villapaolacaposuvero.it/termini-condizioni" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="villa-section py-24 md:py-32 bg-villa-warm-white">
        <div className="villa-container max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-8 text-foreground">{t("terms.title")}</h1>
          <div className="text-muted-foreground leading-relaxed space-y-6">
            <p>{t("terms.intro")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("terms.natureH")}</h2>
            <p>{t("terms.nature")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("terms.contentH")}</h2>
            <p>{t("terms.content")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("terms.liabilityH")}</h2>
            <p>{t("terms.liability")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("terms.lawH")}</h2>
            <p>{t("terms.law")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("terms.idH")}</h2>
            <p>
              CIN: IT079060C299OUQTIW<br />
              CIR: 079060-AAT-00018
            </p>

            <p className="text-sm mt-8">{t("terms.updated")}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TerminiCondizioni;
