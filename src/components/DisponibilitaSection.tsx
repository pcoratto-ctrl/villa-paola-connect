import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, MessageCircle, CheckCircle, Send } from "lucide-react";
import { useSubmitLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_URL =
  "https://wa.me/393355384250?text=" +
  encodeURIComponent(
    "Buongiorno, vorrei verificare la disponibilità di Villa Paola Caposuvero per queste date:"
  );

const DisponibilitaSection = () => {
  const submit = useSubmitLead();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    guest_name: "",
    email: "",
    phone: "",
    arrival_date: "",
    departure_date: "",
    guests_count: "",
    message: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guest_name.trim() || !form.email.trim()) {
      toast({ title: "Nome ed email sono obbligatori", variant: "destructive" });
      return;
    }
    if (form.guest_name.length > 100 || form.email.length > 200 || form.message.length > 1500) {
      toast({ title: "Testo troppo lungo", variant: "destructive" });
      return;
    }
    try {
      await submit.mutateAsync({
        guest_name: form.guest_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        arrival_date: form.arrival_date || undefined,
        departure_date: form.departure_date || undefined,
        guests_count: form.guests_count ? Number(form.guests_count) : undefined,
        message: form.message.trim() || undefined,
      });
      setSent(true);
    } catch {
      toast({ title: "Errore nell'invio", description: "Riprova o scrivici su WhatsApp.", variant: "destructive" });
    }
  };

  return (
    <section id="disponibilita" className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Richiedi disponibilità
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Richiedi le date <span className="italic">disponibili</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Scrivici le date che ti interessano e ti risponderemo con disponibilità,
            dettagli e un preventivo personalizzato.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {sent ? (
            <div className="text-center p-10 rounded-villa bg-card shadow-card border border-border">
              <CheckCircle className="w-14 h-14 text-accent mx-auto mb-5" strokeWidth={1.5} />
              <p className="font-display text-2xl text-foreground mb-3">Grazie!</p>
              <p className="text-muted-foreground">
                Abbiamo ricevuto la tua richiesta. Ti risponderemo al più presto con
                disponibilità e dettagli.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="p-6 md:p-10 rounded-villa bg-card shadow-card border border-border space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nome e cognome *</label>
                  <input
                    type="text" required maxLength={100}
                    value={form.guest_name} onChange={update("guest_name")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Mario Rossi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <input
                    type="email" required maxLength={200}
                    value={form.email} onChange={update("email")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="mario@email.it"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Telefono</label>
                  <input
                    type="tel" maxLength={40}
                    value={form.phone} onChange={update("phone")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="+39 ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Numero ospiti</label>
                  <input
                    type="number" min={1} max={20}
                    value={form.guests_count} onChange={update("guests_count")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Data di arrivo</label>
                  <input
                    type="date"
                    value={form.arrival_date} onChange={update("arrival_date")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Data di partenza</label>
                  <input
                    type="date"
                    value={form.departure_date} onChange={update("departure_date")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Messaggio / richieste particolari
                </label>
                <textarea
                  rows={4} maxLength={1500}
                  value={form.message} onChange={update("message")}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Viaggiamo con un bambino piccolo e un cane di taglia media..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit" disabled={submit.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                  {submit.isPending ? "Invio..." : "Ricevi un preventivo personalizzato"}
                </button>
                <a
                  href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-accent text-accent-foreground font-medium hover:opacity-90 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  WhatsApp
                </a>
              </div>

              <p className="text-xs text-muted-foreground pt-2 flex items-center gap-2">
                <CalendarCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
                Non è una prenotazione: ti confermeremo disponibilità e dettagli via email o WhatsApp.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default DisponibilitaSection;
