import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Client, Report, ReportData } from "@/lib/types";
import { meseLabel } from "@/lib/types";
import { formatNumber, formatPct, pctChange, shadeColor } from "@/lib/utils";
import { parseCommento, sintesiBlocks, SEZIONI_COMMENTO } from "@/lib/commento";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#1e293b", padding: 0 },
  contentPage: { fontFamily: "Helvetica", fontSize: 10, color: "#1e293b", padding: 48 },
  h2: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  h2Sub: { fontSize: 10, color: "#64748b", marginBottom: 24 },
  h3: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 10 },
  kpiRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  kpiBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
  },
  kpiLabel: { fontSize: 7, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  kpiValue: { fontSize: 17, fontFamily: "Helvetica-Bold", marginTop: 5 },
  kpiDelta: { fontSize: 8, marginTop: 4 },
  section: { marginBottom: 26 },
  barLabel: { fontSize: 9, color: "#475569", marginBottom: 3 },
  barTrack: { height: 14, backgroundColor: "#f1f5f9", borderRadius: 4, marginBottom: 9 },
  barFill: { height: 14, borderRadius: 4 },
  paragraph: { fontSize: 10.5, lineHeight: 1.75, color: "#334155", marginBottom: 10 },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
});

function Kpi({ label, value, delta }: { label: string; value: string; delta: number | null }) {
  return (
    <View style={styles.kpiBox}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text
        style={[
          styles.kpiDelta,
          { color: delta === null ? "#94a3b8" : delta >= 0 ? "#059669" : "#dc2626" },
        ]}
      >
        {delta === null ? "—" : `${formatPct(delta)} vs mese prec.`}
      </Text>
    </View>
  );
}

function HBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const width = max > 0 ? Math.max((value / max) * 100, 2) : 2;
  return (
    <View>
      <Text style={styles.barLabel}>
        {label} — {formatNumber(value)}
      </Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${width}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// Blocco della pagina "In sintesi": bordo colorato a sinistra, molto respiro
function SintesiBlock({
  titolo,
  testo,
  color,
  bg,
}: {
  titolo: string;
  testo: string;
  color: string;
  bg: string;
}) {
  return (
    <View
      style={{
        borderLeftWidth: 4,
        borderLeftColor: color,
        backgroundColor: bg,
        borderRadius: 8,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color, marginBottom: 8 }}>
        {titolo}
      </Text>
      <Text style={{ fontSize: 10.5, lineHeight: 1.7, color: "#334155" }}>{testo}</Text>
    </View>
  );
}

function PdfFooter({ nome, testo }: { nome: string; testo: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>{nome}</Text>
      <Text>{testo}</Text>
    </View>
  );
}

type PdfProps = {
  report: Report;
  client: Client;
  prev: ReportData | null;
  prevLabel: string | null;
  logoDataUri: string | null;
  whiteLabel: boolean;
};

function ReportPdfDocument({ report, client, prev, prevLabel, logoDataUri, whiteLabel }: PdfProps) {
  const d = report.dati_json;
  const color = client.colore_primario;
  const light = shadeColor(color, 55);
  const bgSoft = shadeColor(color, 92);
  const periodo = meseLabel(report.mese, report.anno);
  const canale =
    report.canale === "instagram" ? "Instagram" : report.canale === "tiktok" ? "TikTok" : "LinkedIn";
  const followerDelta = d.follower_fine - d.follower_inizio;
  const maxRI = Math.max(d.reach, d.impression, prev?.reach ?? 0, prev?.impression ?? 0);
  const footerText = whiteLabel ? `Report ${canale} · ${periodo}` : "Creato con Klaro · klaro.app";

  // Sezione "In sintesi": dal contesto del mese, con fallback sul commento AI
  const sintesi = sintesiBlocks(d.contesto, report.commento_ai);
  const hasSintesi = Boolean(sintesi.bene || sintesi.migliorare || sintesi.priorita);
  const hasObiettivi = Boolean(client.obiettivi_testo || d.valutazione_obiettivi);

  // Commento: se segue la struttura a 5 sezioni, ogni sezione ha il suo titolo
  const sezioni = report.commento_ai ? parseCommento(report.commento_ai) : null;
  const strutturato = Boolean(
    sezioni && (sezioni.andato_bene || sezioni.migliorare || sezioni.numeri || sezioni.priorita)
  );

  return (
    <Document title={`Report ${client.nome} — ${periodo}`} author={client.nome}>
      {/* ---- COPERTINA ---- */}
      <Page size="A4" style={styles.page}>
        <View
          style={{
            backgroundColor: color,
            height: "60%",
            padding: 52,
            justifyContent: "flex-end",
          }}
        >
          {logoDataUri && (
            <Image
              src={logoDataUri}
              style={{ width: 76, height: 76, borderRadius: 14, marginBottom: 30, objectFit: "cover" }}
            />
          )}
          <Text style={{ color: "#ffffff", opacity: 0.75, fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase" }}>
            Report mensile — {canale} organico
          </Text>
          <Text style={{ color: "#ffffff", fontSize: 34, fontFamily: "Helvetica-Bold", marginTop: 10 }}>
            {client.nome}
          </Text>
          <Text style={{ color: "#ffffff", opacity: 0.9, fontSize: 17, marginTop: 8 }}>{periodo}</Text>
        </View>
        <View style={{ padding: 52, flex: 1, justifyContent: "space-between" }}>
          <View>
            {client.obiettivi_testo ? (
              <>
                <Text style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  Obiettivi
                </Text>
                <Text style={{ fontSize: 11, lineHeight: 1.7, color: "#334155" }}>
                  {client.obiettivi_testo}
                </Text>
              </>
            ) : null}
          </View>
          <Text style={{ fontSize: 8, color: "#94a3b8" }}>{footerText}</Text>
        </View>
      </Page>

      {/* ---- IN SINTESI + OBIETTIVI ---- */}
      {(hasSintesi || hasObiettivi) && (
        <Page size="A4" style={styles.contentPage}>
          {hasSintesi && (
            <>
              <Text style={[styles.h2, { color }]}>In sintesi</Text>
              <Text style={styles.h2Sub}>
                Il mese di {periodo} in tre punti, prima dei numeri.
              </Text>
              {sintesi.bene ? (
                <SintesiBlock titolo="Cosa è andato bene" testo={sintesi.bene} color={color} bg={bgSoft} />
              ) : null}
              {sintesi.migliorare ? (
                <SintesiBlock titolo="Cosa migliorare" testo={sintesi.migliorare} color={color} bg={bgSoft} />
              ) : null}
              {sintesi.priorita ? (
                <SintesiBlock titolo="Priorità del prossimo mese" testo={sintesi.priorita} color={color} bg={bgSoft} />
              ) : null}
            </>
          )}

          {hasObiettivi && (
            <View style={{ marginTop: hasSintesi ? 14 : 0 }}>
              <Text style={[styles.h2, { color }]}>Obiettivi del cliente</Text>
              <Text style={styles.h2Sub}>Come sta andando rispetto a ciò che conta davvero.</Text>
              {client.obiettivi_testo ? (
                <Text style={[styles.paragraph, { fontFamily: "Helvetica-Oblique" }]}>
                  “{client.obiettivi_testo}”
                </Text>
              ) : null}
              <Text style={styles.paragraph}>
                {d.valutazione_obiettivi ||
                  "I dati di questo mese non sono sufficienti per una valutazione affidabile dell'andamento rispetto agli obiettivi: la aggiorneremo nei prossimi report."}
              </Text>
            </View>
          )}
          <PdfFooter nome={client.nome} testo={footerText} />
        </Page>
      )}

      {/* ---- NUMERI ---- */}
      <Page size="A4" style={styles.contentPage}>
        <Text style={[styles.h2, { color }]}>I numeri di {periodo}</Text>
        <Text style={styles.h2Sub}>
          {prev && prevLabel
            ? `Con il confronto rispetto a ${prevLabel}.`
            : "Primo mese misurato: dal prossimo report vedrai anche il confronto."}
        </Text>

        <View style={styles.kpiRow}>
          <Kpi label="Reach" value={formatNumber(d.reach)} delta={prev ? pctChange(d.reach, prev.reach) : null} />
          <Kpi label="Impression" value={formatNumber(d.impression)} delta={prev ? pctChange(d.impression, prev.impression) : null} />
          <Kpi
            label="Nuovi follower"
            value={`${followerDelta >= 0 ? "+" : ""}${formatNumber(followerDelta)}`}
            delta={prev ? pctChange(d.follower_fine, prev.follower_fine) : null}
          />
          <Kpi
            label="Engagement"
            value={`${String(d.engagement_rate).replace(".", ",")}%`}
            delta={prev ? pctChange(d.engagement_rate, prev.engagement_rate) : null}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.h3}>
            Reach e impression{prev && prevLabel ? ` — confronto con ${prevLabel}` : ""}
          </Text>
          {prev && prevLabel ? (
            <>
              <HBar label={`Reach ${prevLabel}`} value={prev.reach} max={maxRI} color={light} />
              <HBar label={`Reach ${periodo}`} value={d.reach} max={maxRI} color={color} />
              <HBar label={`Impression ${prevLabel}`} value={prev.impression} max={maxRI} color={light} />
              <HBar label={`Impression ${periodo}`} value={d.impression} max={maxRI} color={color} />
            </>
          ) : (
            <>
              <HBar label="Reach" value={d.reach} max={maxRI} color={color} />
              <HBar label="Impression" value={d.impression} max={maxRI} color={color} />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.h3}>Crescita follower</Text>
          <HBar label="Inizio mese" value={d.follower_inizio} max={Math.max(d.follower_inizio, d.follower_fine)} color={light} />
          <HBar label="Fine mese" value={d.follower_fine} max={Math.max(d.follower_inizio, d.follower_fine)} color={color} />
        </View>

        {/* Highlights */}
        <View
          style={{
            backgroundColor: bgSoft,
            borderRadius: 10,
            padding: 18,
            marginBottom: 26,
          }}
        >
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color, marginBottom: 8 }}>
            Highlights del mese
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 1.7, color: "#334155" }}>
            {d.numero_post} contenuti pubblicati · {formatNumber(d.reach)} persone raggiunte ·{" "}
            {followerDelta >= 0 ? "+" : ""}
            {formatNumber(followerDelta)} follower · engagement {String(d.engagement_rate).replace(".", ",")}%
          </Text>
          {d.risultati_note ? (
            <Text style={{ fontSize: 10, lineHeight: 1.7, color: "#334155", marginTop: 6 }}>
              {d.risultati_note}
            </Text>
          ) : null}
        </View>

        {d.top_post.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.h3}>Contenuti più performanti</Text>
            {d.top_post.map((p, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 9, alignItems: "flex-start" }}>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: color,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "#ffffff", fontSize: 9, fontFamily: "Helvetica-Bold" }}>
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>{p.testo}</Text>
                  {p.metrica ? (
                    <Text style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>{p.metrica}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        <PdfFooter nome={client.nome} testo={footerText} />
      </Page>

      {/* ---- COMMENTO ---- */}
      <Page size="A4" style={styles.contentPage}>
        <Text style={[styles.h2, { color }]}>Il commento del consulente</Text>
        <Text style={styles.h2Sub}>La lettura del mese, sezione per sezione.</Text>

        {strutturato && sezioni ? (
          (
            [
              [SEZIONI_COMMENTO[0], sezioni.sintesi],
              [SEZIONI_COMMENTO[1], sezioni.andato_bene],
              [SEZIONI_COMMENTO[2], sezioni.migliorare],
              [SEZIONI_COMMENTO[3], sezioni.numeri],
              [SEZIONI_COMMENTO[4], sezioni.priorita],
            ] as [string, string][]
          )
            .filter(([, testo]) => testo.trim().length > 0)
            .map(([titolo, testo]) => (
              <View key={titolo} style={{ marginBottom: 16 }} wrap={false}>
                <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color, marginBottom: 6 }}>
                  {titolo}
                </Text>
                {testo.split(/\n\n+/).map((par, i) => (
                  <Text key={i} style={styles.paragraph}>
                    {par.trim()}
                  </Text>
                ))}
              </View>
            ))
        ) : (
          (report.commento_ai ?? "Commento non disponibile.").split(/\n\n+/).map((par, i) => (
            <Text key={i} style={styles.paragraph}>
              {par.trim()}
            </Text>
          ))
        )}

        <PdfFooter nome={client.nome} testo={footerText} />
      </Page>
    </Document>
  );
}

export async function renderReportPdf(props: PdfProps): Promise<Buffer> {
  return renderToBuffer(<ReportPdfDocument {...props} />);
}
