import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, CheckCircle } from "lucide-react";
import { useApprovedReviews, useSubmitReview } from "@/hooks/useReviews";
import { useToast } from "@/hooks/use-toast";

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 transition-colors ${
          star <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"
        } ${interactive ? "cursor-pointer hover:text-primary" : ""}`}
        strokeWidth={1.5}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: { guest_name: string; rating: number; comment: string; stay_date: string | null; created_at: string } }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    className="p-6 md:p-8 rounded-villa bg-card shadow-card border border-border"
  >
    <StarRating rating={review.rating} />
    <p className="mt-4 text-foreground leading-relaxed italic">"{review.comment}"</p>
    <div className="mt-4 flex items-center justify-between">
      <p className="font-medium text-foreground text-sm">{review.guest_name}</p>
      <p className="text-muted-foreground text-xs">
        {review.stay_date || new Date(review.created_at).toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
      </p>
    </div>
  </motion.div>
);

const RecensioniSection = () => {
  const { data: reviews, isLoading } = useApprovedReviews();
  const submitReview = useSubmitReview();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [stayDate, setStayDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) {
      toast({ title: "Compila tutti i campi", description: "Nome, valutazione e commento sono obbligatori.", variant: "destructive" });
      return;
    }
    if (name.trim().length > 100 || comment.trim().length > 1000) {
      toast({ title: "Testo troppo lungo", variant: "destructive" });
      return;
    }
    try {
      await submitReview.mutateAsync({ guest_name: name.trim(), rating, comment: comment.trim(), stay_date: stayDate || undefined });
      setSubmitted(true);
      setName(""); setRating(0); setComment(""); setStayDate("");
    } catch {
      toast({ title: "Errore nell'invio", description: "Riprova più tardi.", variant: "destructive" });
    }
  };

  const avgRating = reviews?.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <section id="recensioni" className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">Recensioni</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Cosa dicono i nostri <span className="italic">ospiti</span>
          </h2>
          {avgRating && reviews && reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <StarRating rating={Math.round(Number(avgRating))} />
              <span className="font-display text-2xl text-foreground">{avgRating}</span>
              <span className="text-muted-foreground text-sm">({reviews.length} recensioni)</span>
            </div>
          )}
        </motion.div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-villa bg-card border border-border animate-pulse h-48" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : null}

        {/* Submit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-lg mx-auto"
        >
          {!formOpen && !submitted && (
            <div className="text-center">
              <button
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <Star className="w-5 h-5" strokeWidth={1.5} />
                Lascia una recensione
              </button>
            </div>
          )}

          {submitted && (
            <div className="text-center p-8 rounded-villa bg-card shadow-card border border-border">
              <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" strokeWidth={1.5} />
              <p className="font-display text-2xl text-foreground mb-2">Grazie!</p>
              <p className="text-muted-foreground">La tua recensione è stata inviata e sarà pubblicata dopo la moderazione.</p>
              <button onClick={() => { setSubmitted(false); setFormOpen(false); }} className="mt-4 text-primary text-sm hover:underline">
                Scrivi un'altra recensione
              </button>
            </div>
          )}

          {formOpen && !submitted && (
            <form onSubmit={handleSubmit} className="p-8 rounded-villa bg-card shadow-card border border-border space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Il tuo nome *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="Mario Rossi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Valutazione *</label>
                <StarRating rating={rating} onRate={setRating} interactive />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Periodo del soggiorno</label>
                <input
                  type="text"
                  value={stayDate}
                  onChange={(e) => setStayDate(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="Agosto 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">La tua esperienza *</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
                  placeholder="Racconta la tua esperienza a Villa Paola Caposuvero..."
                />
                <p className="text-xs text-muted-foreground mt-1">{comment.length}/1000</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitReview.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                  {submitReview.isPending ? "Invio..." : "Invia recensione"}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors">
                  Annulla
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RecensioniSection;
