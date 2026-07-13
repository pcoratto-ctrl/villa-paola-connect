import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("notFound.title")}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted px-6">
        <div className="text-center">
          <h1 className="mb-4 font-display text-5xl text-foreground">{t("notFound.heading")}</h1>
          <p className="mb-6 text-lg text-muted-foreground">{t("notFound.text")}</p>
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-cta hover:shadow-elevated transition-all">
            {t("notFound.back")}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
