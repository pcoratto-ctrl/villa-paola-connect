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

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#1e293b", padding: 0 },
  contentPage: { fontFamily: "Helvetica", fontSize: 10, color: "#1e293b", padding: 40 },
  h2: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 12 },
  kpiRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  kpiBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 10,
  },
  kpiLabel: { fontSize: 7, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  kpiValue: { fontSize: 16, fontFamily: "Helvetica-Bold", marginTop: 4 },
  kpiDelta: { fontSize: 8, marginTop: 3 },
  section: { marginBottom: 20 },
  barLabel: { fontSize: 9, color: "#475569", marginBottom: 3 },
  barTrack: { height: 14, backgroundColor: "#f1f5f9", borderRadius: 4, marginBottom: 8 },
  barFill: { height: 14, borderRadius: 4 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#94a3b8",
  },
});

function Kpi({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: number | null;
}) {
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
  const periodo = meseLabel(report.mese, report.anno);
  const canale =
    report.canale === "instagram" ? "Instagram" : report.canale === "tiktok" ? "TikTok" : "LinkedIn";
  const followerDelta = d.follower_fine - d.follower_inizio;
  const maxRI = Math.max(d.reach, d.impression, prev?.reach ?? 0, prev?.impression ?? 0);
  const footerText = whiteLabel ? `Report ${canale} · ${periodo}` : "Creato con Klaro · klaro.app";

  return (
    <Document title={`Report ${client.nome} — ${periodo}`} author={client.nome}>
      {/* ---- COPERTINA ---- */}
      <Page size="A4" style={styles.page}>
        <View
          style={{
            backgroundColor: color,
            height: "60%",
            padding: 48,
            justifyContent: "flex-end",
          }}
        >
          {logoDataUri && (
            <Image
              src={logoDataUri}
              style={{ width: 72, height: 72, borderRadius: 12, marginBottom: 28, objectFit: "cover" }}
            />
          )}
          <Text style={{ color: "#ffffff", opacity: 0.75, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
            Report mensile — {canale} organico
          </Text>
          <Text style={{ color: "#ffffff", fontSize: 32, fontFamily: "Helvetica-Bold", marginTop: 8 }}>
            {client.nome}
          </Text>
          <Text style={{ color: "#ffffff", opacity: 0.9, fontSize: 16, marginTop: 6 }}>{periodo}</Text>
        </View>
        <View style={{ padding: 48, flex: 1, justifyContent: "space-between" }}>
          <View>
            {client.obiettivi_testo ? (
              <>
                <Text style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Obiettivi
                </Text>
                <Text style={{ fontSize: 11, lineHeight: 1.6, color: "#334155" }}>
                  {client.obiettivi_testo}
                </Text>
              </>
            ) : null}
          </View>
          <Text style={{ fontSize: 8, color: "#94a3b8" }}>{footerText}</Text>
        </View>
      </Page>

      {/* ---- NUMERI ---- */}
      <Page size="A4" style={styles.contentPage}>
        <Text style={[styles.h2, { color }]}>I numeri di {periodo}</Text>

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
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 10 }}>
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
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 10 }}>
            Crescita follower
          </Text>
          <HBar label="Inizio mese" value={d.follower_inizio} max={Math.max(d.follower_inizio, d.follower_fine)} color={light} />
          <HBar label="Fine mese" value={d.follower_fine} max={Math.max(d.follower_inizio, d.follower_fine)} color={color} />
        </View>

        {/* Highlights */}
        <View
          style={{
            backgroundColor: shadeColor(color, 88),
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color, marginBottom: 8 }}>
            Highlights del mese
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 1.6, color: "#334155" }}>
            {d.numero_post} contenuti pubblicati · {formatNumber(d.reach)} persone raggiunte ·{" "}
            {followerDelta >= 0 ? "+" : ""}
            {formatNumber(followerDelta)} follower · engagement {String(d.engagement_rate).replace(".", ",")}%
          </Text>
          {d.risultati_note ? (
            <Text style={{ fontSize: 10, lineHeight: 1.6, color: "#334155", marginTop: 6 }}>
              {d.risultati_note}
            </Text>
          ) : null}
        </View>

        {d.top_post.length > 0 && (
          <View style={styles.section}>
            <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 10 }}>
              Top {d.top_post.length} contenuti
            </Text>
            {d.top_post.map((p, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 8, alignItems: "flex-start" }}>
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

        <View style={styles.footer} fixed>
          <Text>{client.nome}</Text>
          <Text>{footerText}</Text>
        </View>
      </Page>

      {/* ---- COMMENTO ---- */}
      <Page size="A4" style={styles.contentPage}>
        <Text style={[styles.h2, { color }]}>Il commento del consulente</Text>
        {(report.commento_ai ?? "Commento non disponibile.")
          .split(/\n\n+/)
          .map((par, i) => (
            <Text key={i} style={{ fontSize: 10.5, lineHeight: 1.7, color: "#334155", marginBottom: 12 }}>
              {par}
            </Text>
          ))}
        <View style={styles.footer} fixed>
          <Text>{client.nome}</Text>
          <Text>{footerText}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(props: PdfProps): Promise<Buffer> {
  return renderToBuffer(<ReportPdfDocument {...props} />);
}
