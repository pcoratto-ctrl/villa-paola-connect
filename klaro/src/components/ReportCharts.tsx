"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ReportData } from "@/lib/types";
import { formatNumber, formatPct, pctChange, shadeColor } from "@/lib/utils";

function KpiTile({
  label,
  value,
  delta,
  color,
}: {
  label: string;
  value: string;
  delta: number | null;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {delta !== null ? (
        <p
          className={`mt-0.5 text-sm font-semibold ${delta >= 0 ? "text-emerald-600" : "text-red-600"}`}
        >
          {formatPct(delta)} vs mese prec.
        </p>
      ) : (
        <p className="mt-0.5 text-sm text-slate-400">nessun confronto</p>
      )}
    </div>
  );
}

export default function ReportCharts({
  data,
  prev,
  color,
  meseCorrente,
  mesePrecedente,
}: {
  data: ReportData;
  prev: ReportData | null;
  color: string;
  meseCorrente: string;
  mesePrecedente: string | null;
}) {
  const followerDelta = data.follower_fine - data.follower_inizio;
  const lightColor = shadeColor(color, 55);

  // Confronto reach/impression tra i due mesi (se disponibile)
  const confronto = [
    {
      name: "Reach",
      ...(prev ? { [mesePrecedente ?? "Prec."]: prev.reach } : {}),
      [meseCorrente]: data.reach,
    },
    {
      name: "Impression",
      ...(prev ? { [mesePrecedente ?? "Prec."]: prev.impression } : {}),
      [meseCorrente]: data.impression,
    },
  ];

  const followerData = [
    { name: "Inizio mese", value: data.follower_inizio },
    { name: "Fine mese", value: data.follower_fine },
  ];

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Reach"
          value={formatNumber(data.reach)}
          delta={prev ? pctChange(data.reach, prev.reach) : null}
          color={color}
        />
        <KpiTile
          label="Impression"
          value={formatNumber(data.impression)}
          delta={prev ? pctChange(data.impression, prev.impression) : null}
          color={color}
        />
        <KpiTile
          label="Nuovi follower"
          value={`${followerDelta >= 0 ? "+" : ""}${formatNumber(followerDelta)}`}
          delta={
            prev ? pctChange(data.follower_fine, prev.follower_fine) : null
          }
          color={color}
        />
        <KpiTile
          label="Engagement rate"
          value={`${data.engagement_rate.toString().replace(".", ",")}%`}
          delta={prev ? pctChange(data.engagement_rate, prev.engagement_rate) : null}
          color={color}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reach & impression */}
        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            Reach e impression{prev ? " — confronto con il mese precedente" : ""}
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={confronto} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(v: number) => formatNumber(v)}
                width={56}
              />
              <Tooltip
                formatter={(v) => formatNumber(Number(v))}
                cursor={{ fill: "#f1f5f9" }}
              />
              {prev && mesePrecedente && (
                <Bar dataKey={mesePrecedente} fill={lightColor} radius={[4, 4, 0, 0]} maxBarSize={48} />
              )}
              <Bar dataKey={meseCorrente} fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
          {prev && (
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: lightColor }} />
                {mesePrecedente}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
                {meseCorrente}
              </span>
            </div>
          )}
        </div>

        {/* Follower */}
        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Crescita follower</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={followerData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(v: number) => formatNumber(v)}
                width={56}
                domain={["dataMin - 100", "auto"]}
              />
              <Tooltip formatter={(v) => formatNumber(Number(v))} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={64}>
                <Cell fill={lightColor} />
                <Cell fill={color} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top post */}
      <div className="card">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Top 3 contenuti del mese</h3>
        <ol className="space-y-3">
          {data.top_post.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{p.testo}</p>
                <p className="text-sm text-slate-500">{p.metrica}</p>
              </div>
            </li>
          ))}
        </ol>
        {data.risultati_note && (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-900">Note: </span>
            {data.risultati_note}
          </p>
        )}
      </div>
    </div>
  );
}
