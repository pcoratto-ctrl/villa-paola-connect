"use client";

import { Fragment, useRef, useState, type DragEvent, type ReactNode } from "react";
import { FIELD_KEYS, FIELD_LABELS, getAmbiguousCandidates, type FieldKey } from "@/lib/dataImport/fieldSynonyms";
import { parseCsvText, downloadTemplateCsv, MAX_CSV_SIZE_BYTES, type ParsedCsv } from "@/lib/dataImport/csv";
import { parsePastedText, type RecognizedField } from "@/lib/dataImport/paste";
import { mapCsvRow, buildImportedValues, type ImportedValues, type FieldIssue, type PeriodoInfo } from "@/lib/dataImport/mapping";
import { CANALI, MESI, type Canale } from "@/lib/types";

type Mode = "manuale" | "csv" | "incolla";

function riepilogoRiga(fields: RecognizedField[]): string {
  const { periodo, values } = buildImportedValues(fields);
  const parti: string[] = [];
  if (periodo.mese && periodo.anno) parti.push(`${MESI[periodo.mese - 1]} ${periodo.anno}`);
  if (periodo.canale) parti.push(CANALI.find((c) => c.value === periodo.canale)?.label ?? periodo.canale);
  if (values.reach !== undefined) parti.push(`reach ${values.reach}`);
  return parti.length > 0 ? parti.join(" · ") : "(nessun dato riconoscibile)";
}

function FieldsTable({
  fields,
  overrides,
  onOverrideChange,
}: {
  fields: RecognizedField[];
  overrides: Record<number, FieldKey | "">;
  onOverrideChange: (index: number, value: FieldKey | "") => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-3 py-2">Colonna nel file</th>
            <th className="px-3 py-2">Valore trovato</th>
            <th className="px-3 py-2">Corrisponde a</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f, i) => {
            const effective = overrides[i] !== undefined ? overrides[i] : (f.fieldKey ?? "");
            const ambiguous = f.fieldKey === null ? getAmbiguousCandidates(f.rawLabel) : null;
            const opzioni = ambiguous ?? FIELD_KEYS;
            return (
              <Fragment key={i}>
                <tr className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-700">{f.rawLabel || "(vuoto)"}</td>
                  <td className="px-3 py-2 text-slate-600">{f.rawValue || "—"}</td>
                  <td className="px-3 py-2">
                    <select
                      className="input !py-1.5 text-sm"
                      value={effective}
                      onChange={(e) => onOverrideChange(i, e.target.value as FieldKey | "")}
                    >
                      <option value="">— Ignora questa colonna —</option>
                      {opzioni.map((k) => (
                        <option key={k} value={k}>
                          {FIELD_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                {ambiguous && (
                  <tr className="border-t border-slate-100 bg-amber-50">
                    <td colSpan={3} className="px-3 py-2 text-xs text-amber-800">
                      La colonna &quot;{f.rawLabel}&quot; può indicare un numero di interazioni oppure una
                      percentuale. Seleziona il significato corretto.
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IssuesAndPeriodo({
  issues,
  periodo,
  currentCanale,
  currentMese,
  currentAnno,
}: {
  issues: FieldIssue[];
  periodo: PeriodoInfo;
  currentCanale: Canale;
  currentMese: number;
  currentAnno: number;
}) {
  const periodoDiverso =
    (periodo.mese !== undefined && periodo.mese !== currentMese) ||
    (periodo.anno !== undefined && periodo.anno !== currentAnno) ||
    (periodo.canale !== undefined && periodo.canale !== currentCanale);

  return (
    <>
      {issues.length > 0 && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p className="font-semibold">Valori non validi (non verranno importati):</p>
          <ul className="mt-1 list-disc pl-5">
            {issues.map((iss, i) => (
              <li key={i}>
                {FIELD_LABELS[iss.fieldKey]}: {iss.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {periodoDiverso && (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Attenzione: il file indica{" "}
          {periodo.mese && periodo.anno ? `${MESI[periodo.mese - 1]} ${periodo.anno}` : ""}
          {periodo.canale ? ` su ${CANALI.find((c) => c.value === periodo.canale)?.label}` : ""}, diverso dalla
          selezione attuale ({MESI[currentMese - 1]} {currentAnno} ·{" "}
          {CANALI.find((c) => c.value === currentCanale)?.label}). Il periodo e il canale scelti sopra non vengono
          cambiati automaticamente: verifica di aver caricato il file giusto.
        </div>
      )}
    </>
  );
}

export default function DataImportPanel({
  currentCanale,
  currentMese,
  currentAnno,
  onApply,
}: {
  currentCanale: Canale;
  currentMese: number;
  currentAnno: number;
  onApply: (values: ImportedValues) => void;
}) {
  const [mode, setMode] = useState<Mode>("manuale");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // --- Stato CSV ---
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvParsed, setCsvParsed] = useState<ParsedCsv | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [csvOverrides, setCsvOverrides] = useState<Record<number, FieldKey | "">>({});

  // --- Stato Incolla ---
  const [pasteText, setPasteText] = useState("");
  const [pasteFields, setPasteFields] = useState<RecognizedField[] | null>(null);
  const [pasteUnrecognized, setPasteUnrecognized] = useState<string[]>([]);
  const [pasteOverrides, setPasteOverrides] = useState<Record<number, FieldKey | "">>({});

  function resetCsv() {
    setCsvFileName(null);
    setCsvError(null);
    setCsvParsed(null);
    setSelectedRow(null);
    setCsvOverrides({});
  }

  function resetPaste() {
    setPasteText("");
    setPasteFields(null);
    setPasteUnrecognized([]);
    setPasteOverrides({});
  }

  async function handleFile(file: File) {
    resetCsv();
    setCsvFileName(file.name);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setCsvError("Il file non è un CSV: carica un file con estensione .csv.");
      return;
    }
    if (file.size === 0) {
      setCsvError("Il file è vuoto.");
      return;
    }
    if (file.size > MAX_CSV_SIZE_BYTES) {
      setCsvError(`File troppo grande (max ${Math.round(MAX_CSV_SIZE_BYTES / 1024)} KB).`);
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setCsvError("Impossibile leggere il file. Riprova.");
      return;
    }
    if (!text.trim()) {
      setCsvError("Il file è vuoto.");
      return;
    }
    const parsed = parseCsvText(text);
    if (!parsed) {
      setCsvError("Il file è vuoto.");
      return;
    }
    if (parsed.headers.length <= 1) {
      setCsvError("Non riesco a riconoscere il separatore delle colonne: usa virgola o punto e virgola.");
      return;
    }
    const recognizedAny = parsed.headers.some((h) => h.trim().length > 0);
    if (!recognizedAny) {
      setCsvError("Non sono state trovate intestazioni nel file.");
      return;
    }
    if (parsed.rows.length === 0) {
      setCsvError("Il file contiene solo l'intestazione: nessuna riga di dati da importare.");
      return;
    }
    setCsvParsed(parsed);
    setSelectedRow(parsed.rows.length === 1 ? 0 : null);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function onPasteAnalizza() {
    const result = parsePastedText(pasteText);
    setPasteFields(result.recognized);
    setPasteUnrecognized(result.unrecognizedLines);
    setPasteOverrides({});
  }

  const csvFields: RecognizedField[] | null =
    csvParsed && selectedRow !== null ? mapCsvRow(csvParsed.headers, csvParsed.rows[selectedRow]) : null;

  // Dopo un'importazione riuscita il pannello torna su "Manuale": i dati
  // sono gia' nei campi normali del wizard, restano sempre modificabili li'.
  function handleApply(values: ImportedValues) {
    onApply(values);
    resetCsv();
    resetPaste();
    setMode("manuale");
  }

  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["manuale", "Manuale"],
            ["csv", "CSV"],
            ["incolla", "Incolla dati"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              mode === m ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "manuale" && (
        <p className="text-sm text-slate-500">
          Compila i campi qui sotto a mano, oppure passa a &quot;CSV&quot; o &quot;Incolla dati&quot; per importare i
          numeri automaticamente.
        </p>
      )}

      {mode === "csv" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Scarica il modello, inserisci i numeri del mese e caricalo nuovamente su Klaro.
            </p>
            <button type="button" className="btn-secondary shrink-0 !py-2 text-sm" onClick={() => downloadTemplateCsv()}>
              ⬇ Scarica modello CSV
            </button>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`rounded-xl border-2 border-dashed p-6 text-center text-sm transition ${
              dragOver ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50"
            }`}
          >
            <p className="text-slate-600">Trascina qui il file CSV, oppure</p>
            <button type="button" className="btn-secondary mt-3 !py-2" onClick={() => fileInputRef.current?.click()}>
              Seleziona file CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
                e.target.value = "";
              }}
            />
            {csvFileName && <p className="mt-3 text-xs text-slate-500">File: {csvFileName}</p>}
          </div>

          {csvError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{csvError}</p>}

          {csvParsed && csvParsed.rows.length > 1 && selectedRow === null && (
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="mb-2 text-sm font-semibold text-slate-800">
                Il file contiene {csvParsed.rows.length} righe. Seleziona quale importare:
              </p>
              <ul className="space-y-1.5">
                {csvParsed.rows.map((row, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:border-brand-300"
                      onClick={() => setSelectedRow(i)}
                    >
                      Riga {i + 2}: {riepilogoRiga(mapCsvRow(csvParsed.headers, row))}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {csvFields && (
            <CsvOrPasteResult
              fields={csvFields}
              overrides={csvOverrides}
              onOverrideChange={(i, v) => setCsvOverrides((prev) => ({ ...prev, [i]: v }))}
              currentCanale={currentCanale}
              currentMese={currentMese}
              currentAnno={currentAnno}
              onApply={handleApply}
              onReset={resetCsv}
              rowPicker={
                csvParsed && csvParsed.rows.length > 1 ? (
                  <button type="button" className="text-xs font-semibold text-brand-600 hover:underline" onClick={() => setSelectedRow(null)}>
                    ← Scegli un'altra riga
                  </button>
                ) : null
              }
            />
          )}
        </div>
      )}

      {mode === "incolla" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Incolla i dati copiati da Instagram/LinkedIn Insights, da Excel o Google Sheets. Riconosciamo righe come
            &quot;Copertura: 48.500&quot; oppure tabelle con due colonne incollate insieme.
          </p>
          <textarea
            className="input min-h-40 font-mono text-sm"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"Follower iniziali: 2.850\nFollower finali: 3.040\nCopertura: 48.500\nImpression: 76.200"}
          />
          <button type="button" className="btn-secondary !py-2" onClick={onPasteAnalizza} disabled={!pasteText.trim()}>
            Analizza testo
          </button>

          {pasteFields && (
            <CsvOrPasteResult
              fields={pasteFields}
              overrides={pasteOverrides}
              onOverrideChange={(i, v) => setPasteOverrides((prev) => ({ ...prev, [i]: v }))}
              currentCanale={currentCanale}
              currentMese={currentMese}
              currentAnno={currentAnno}
              onApply={handleApply}
              onReset={resetPaste}
              rowPicker={null}
            />
          )}

          {pasteUnrecognized.length > 0 && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Righe non riconosciute (ignorate):</p>
              <ul className="mt-1 list-disc pl-5">
                {pasteUnrecognized.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CsvOrPasteResult({
  fields,
  overrides,
  onOverrideChange,
  currentCanale,
  currentMese,
  currentAnno,
  onApply,
  onReset,
  rowPicker,
}: {
  fields: RecognizedField[];
  overrides: Record<number, FieldKey | "">;
  onOverrideChange: (index: number, value: FieldKey | "") => void;
  currentCanale: Canale;
  currentMese: number;
  currentAnno: number;
  onApply: (values: ImportedValues) => void;
  onReset: () => void;
  rowPicker: ReactNode;
}) {
  const effectiveFields = fields.map((f, i) => {
    const ov = overrides[i];
    if (ov === undefined) return f;
    return { ...f, fieldKey: ov === "" ? null : ov };
  });
  const { values, issues, periodo } = buildImportedValues(effectiveFields);
  const nessunDato = Object.keys(values).length === 0;

  const CAMPI_PRINCIPALI: FieldKey[] = ["reach", "impression", "follower_inizio", "follower_fine", "numero_post"];
  const mancanti = CAMPI_PRINCIPALI.filter((k) => !(k in values));

  return (
    <div className="space-y-3">
      {rowPicker}
      <FieldsTable fields={effectiveFields} overrides={overrides} onOverrideChange={onOverrideChange} />
      <IssuesAndPeriodo issues={issues} periodo={periodo} currentCanale={currentCanale} currentMese={currentMese} currentAnno={currentAnno} />
      {mancanti.length > 0 && (
        <p className="text-xs text-slate-500">
          Non presenti nel file (potrai compilarli a mano): {mancanti.map((k) => FIELD_LABELS[k]).join(", ")}.
        </p>
      )}
      {nessunDato && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Nessun dato riconosciuto: mappa manualmente le colonne qui sopra, oppure verifica il file.
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-primary !py-2.5"
          disabled={nessunDato}
          onClick={() => onApply(values)}
        >
          Usa questi dati
        </button>
        <button type="button" className="btn-secondary !py-2.5" onClick={onReset}>
          Annulla
        </button>
      </div>
    </div>
  );
}
