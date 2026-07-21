import { matchField, type FieldKey } from "./fieldSynonyms";

export type RecognizedField = {
  rawLabel: string;
  rawValue: string;
  fieldKey: FieldKey | null;
};

export type PasteParseResult = {
  recognized: RecognizedField[];
  unrecognizedLines: string[];
};

// Riconosce testo incollato da Excel/Google Sheets (due colonne separate da
// tabulazione), oppure righe "Etichetta: valore" o "Etichetta<TAB>valore".
// Le righe non riconosciute vengono restituite, mai scartate in silenzio.
export function parsePastedText(text: string): PasteParseResult {
  const lines = text.split(/\r\n|\r|\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { recognized: [], unrecognizedLines: [] };

  // Tentativo tabellare: prima riga = intestazioni, seconda riga = valori,
  // entrambe separate da tabulazione (tipico incolla di una riga con header
  // da un foglio di calcolo).
  if (lines.length >= 2) {
    const headerCells = lines[0].split("\t").map((s) => s.trim());
    const valueCells = lines[1].split("\t").map((s) => s.trim());
    if (headerCells.length >= 3 && headerCells.length === valueCells.length) {
      const matched = headerCells.map((h) => matchField(h));
      const matchCount = matched.filter((m) => m !== null).length;
      if (matchCount >= Math.ceil(headerCells.length / 2)) {
        return {
          recognized: headerCells.map((h, i) => ({
            rawLabel: h,
            rawValue: valueCells[i],
            fieldKey: matched[i],
          })),
          unrecognizedLines: [],
        };
      }
    }
  }

  // Riga per riga: "Etichetta: valore" o "Etichetta<TAB>valore".
  const recognized: RecognizedField[] = [];
  const unrecognizedLines: string[] = [];
  for (const line of lines) {
    let label: string | null = null;
    let value: string | null = null;

    if (line.includes("\t")) {
      const idx = line.indexOf("\t");
      label = line.slice(0, idx);
      value = line.slice(idx + 1).trim();
    } else if (line.includes(":")) {
      const idx = line.indexOf(":");
      label = line.slice(0, idx);
      value = line.slice(idx + 1).trim();
    }

    if (label && value) {
      recognized.push({ rawLabel: label.trim(), rawValue: value, fieldKey: matchField(label) });
    } else {
      unrecognizedLines.push(line);
    }
  }
  return { recognized, unrecognizedLines };
}
