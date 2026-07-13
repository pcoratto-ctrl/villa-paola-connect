import { Helmet } from "react-helmet-async";
import { Trans, useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EMAIL = "R.falvo@agenzietripodi.com";

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("privacy.metaTitle")}</title>
        <meta name="description" content={t("privacy.metaDesc")} />
        <link rel="canonical" href="https://villapaolacaposuvero.it/privacy-policy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="villa-section py-24 md:py-32 bg-villa-warm-white">
        <div className="villa-container max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-8 text-foreground">{t("privacy.title")}</h1>
          <div className="text-muted-foreground leading-relaxed space-y-6">
            <p>{t("privacy.intro")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("privacy.controllerH")}</h2>
            <p>
              {t("privacy.controller")}<br />
              Email: <a className="text-primary hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
              Tel: +39 335 538 4250
            </p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("privacy.dataH")}</h2>
            <p>{t("privacy.data")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("privacy.purposeH")}</h2>
            <p>{t("privacy.purpose")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("privacy.basisH")}</h2>
            <p>{t("privacy.basis")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("privacy.retentionH")}</h2>
            <p>{t("privacy.retention")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("privacy.vendorsH")}</h2>
            <p>{t("privacy.vendors")}</p>

            <h2 className="font-display text-2xl text-foreground mt-8">{t("privacy.rightsH")}</h2>
            <p>
              <Trans
                i18nKey="privacy.rights"
                values={{ email: EMAIL }}
                components={{ 1: <a className="text-primary hover:underline" href={`mailto:${EMAIL}`} /> }}
              />
            </p>

            <p className="text-sm mt-8">{t("privacy.updated")}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
