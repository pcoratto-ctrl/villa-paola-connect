import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("cookies.metaTitle")}</title>
        <meta name="description" content={t("cookies.metaDesc")} />
        <link rel="canonical" href="https://villapaolacaposuvero.it/cookie-policy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="villa-section py-24 md:py-32 bg-villa-warm-white">
        <div className="villa-container max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-8 text-foreground">{t("cookies.title")}</h1>
          <div className="text-muted-foreground leading-relaxed space-y-6">
            <p>{t("cookies.intro")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("cookies.techH")}</h2>
            <p>{t("cookies.tech")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("cookies.thirdH")}</h2>
            <p>{t("cookies.third")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("cookies.manageH")}</h2>
            <p>{t("cookies.manage")}</p>

            <p className="text-sm mt-8">{t("cookies.updated")}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CookiePolicy;
