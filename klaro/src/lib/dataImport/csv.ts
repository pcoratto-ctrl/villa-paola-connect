// Parser CSV minimale, senza dipendenze esterne: supporta separatore virgola
// o punto e virgola, campi tra virgolette (con "" come escape), BOM UTF-8 e
// ignora righe completamente vuote.

const BOM = String.fromCharCode(0xfeff);

export const MAX_CSV_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB, generoso per un report mensile

export type ParsedCsv = {
  headers: string[];
  rows: string[][];
  delimiter: "," | ";" | "\t";
};

function detectDelimiter(headerLine: string): "," | ";" | "\t" {
  const counts: Record<string, number> = {
    ",": (headerLine.match(/,/g) ?? []).length,
    ";": (headerLine.match(/;/g) ?? []).length,
    "\t": (headerLine.match(/\t/g) ?? []).length,
  };
  const best = (Object.entries(counts) as ["," | ";" | "\t", number][]).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : ",";
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

// Restituisce null se il testo non contiene nessuna riga utile (file vuoto).
export function parseCsvText(text: string): ParsedCsv | null {
  const clean = text.startsWith(BOM) ? text.slice(1) : text;
  const lines = clean.split(/\r\n|\r|\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return null;
  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter);
  const rows = lines.slice(1).map((l) => parseCsvLine(l, delimiter));
  return { headers, rows, delimiter };
}

const TEMPLATE_HEADERS = [
  "mese",
  "anno",
  "canale",
  "follower_inizio",
  "follower_fine",
  "reach",
  "impression",
  "interazioni",
  "engagement_rate",
  "visite_profilo",
  "click_link",
  "contenuti_pubblicati",
  "top_contenuto_1",
  "top_contenuto_2",
  "top_contenuto_3",
  "note",
];

const TEMPLATE_EXAMPLE_ROW = [
  "Giugno",
  "2026",
  "instagram",
  "2850",
  "3040",
  "48500",
  "76200",
  "3650",
  "7,5",
  "2180",
  "390",
  "18",
  "Reel dietro le quinte del nuovo menu",
  "Reel collaborazione con food creator locale",
  "Carosello anteprima piatti del brunch",
  "Mese positivo grazie ai reel",
];

function escapeCsvCell(v: string): string {
  return /[,;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function generateTemplateCsv(): string {
  return [
    TEMPLATE_HEADERS.join(","),
    TEMPLATE_EXAMPLE_ROW.map(escapeCsvCell).join(","),
  ].join("\r\n");
}

// Genera e avvia il download del CSV modello direttamente nel browser,
// senza alcun servizio esterno.
export function downloadTemplateCsv(): void {
  const csv = generateTemplateCsv();
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "klaro-modello-report.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
