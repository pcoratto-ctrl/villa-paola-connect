import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Pagina non trovata — Villa Paola Caposuvero</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted px-6">
        <div className="text-center">
          <h1 className="mb-4 font-display text-5xl text-foreground">404</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            La pagina che stai cercando non esiste o è stata rimossa.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-cta hover:shadow-elevated transition-all"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
