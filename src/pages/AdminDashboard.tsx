import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAllReviews, useUpdateReviewStatus, useDeleteReview } from "@/hooks/useReviews";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Star, CheckCircle, XCircle, Trash2, Clock, Eye, Home } from "lucide-react";
import type { Review } from "@/hooks/useReviews";

const statusConfig = {
  pending: { label: "In attesa", icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  approved: { label: "Approvata", icon: CheckCircle, color: "text-accent bg-villa-sage-light border-accent/20" },
  rejected: { label: "Rifiutata", icon: XCircle, color: "text-destructive bg-red-50 border-destructive/20" },
};

type FilterStatus = "all" | "pending" | "approved" | "rejected";

const AdminDashboard = () => {
  const { session, loading: authLoading, signOut } = useAuth();
  const { data: reviews, isLoading } = useAllReviews();
  const updateStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Caricamento...</p></div>;
  if (!session) return <Navigate to="/admin/login" replace />;

  const filtered = reviews?.filter((r) => filter === "all" || r.status === filter) || [];
  const counts = {
    all: reviews?.length || 0,
    pending: reviews?.filter((r) => r.status === "pending").length || 0,
    approved: reviews?.filter((r) => r.status === "approved").length || 0,
    rejected: reviews?.filter((r) => r.status === "rejected").length || 0,
  };

  const handleStatusChange = async (id: string, status: "approved" | "rejected" | "pending") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast({ title: `Recensione ${status === "approved" ? "approvata" : status === "rejected" ? "rifiutata" : "messa in attesa"}` });
    } catch {
      toast({ title: "Errore", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
      setConfirmDelete(null);
      toast({ title: "Recensione eliminata" });
    } catch {
      toast({ title: "Errore", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">Dashboard Recensioni</h1>
            <p className="text-muted-foreground text-sm">{session.user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-foreground hover:bg-muted transition-colors">
              <Home className="w-4 h-4" strokeWidth={1.5} />
              Sito
            </a>
            <button onClick={signOut} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-foreground hover:bg-muted transition-colors">
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(["all", "pending", "approved", "rejected"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`p-4 rounded-villa border text-left transition-all ${
                filter === key ? "border-primary bg-villa-sea-light shadow-card" : "border-border bg-card hover:shadow-soft"
              }`}
            >
              <p className="text-2xl font-display text-foreground">{counts[key]}</p>
              <p className="text-sm text-muted-foreground">
                {key === "all" ? "Totale" : key === "pending" ? "In attesa" : key === "approved" ? "Approvate" : "Rifiutate"}
              </p>
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-villa bg-muted animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Eye className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-muted-foreground">Nessuna recensione trovata</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((review: Review) => {
              const cfg = statusConfig[review.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={review.id} className="p-6 rounded-villa bg-card border border-border shadow-soft">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-foreground">{review.guest_name}</p>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" strokeWidth={2} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`} strokeWidth={1.5} />
                          ))}
                        </div>
                        {review.stay_date && <span className="text-xs text-muted-foreground">· {review.stay_date}</span>}
                      </div>
                      <p className="text-foreground/80 text-sm leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => handleStatusChange(review.id, "approved")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                        >
                          <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} /> Approva
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusChange(review.id, "rejected")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-foreground hover:bg-muted transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" strokeWidth={2} /> Rifiuta
                        </button>
                      )}
                      {confirmDelete === review.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(review.id)} className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                            Conferma
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-full text-xs border border-border text-foreground">
                            Annulla
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(review.id)}
                          className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
