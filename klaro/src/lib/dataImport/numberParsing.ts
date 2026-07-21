// Interpreta numeri scritti con separatori ambigui: "48.500" e "48,500"
// devono valere entrambi 48500 (migliaia), mentre "3,8" e "3.8" devono
// valere entrambi 3.8 (decimale). La regola: un separatore seguito da
// esattamente gruppi di 3 cifre e' migliaia; altrimenti e' decimale.
export function parseFlexibleNumber(raw: string | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  let s = raw.trim().replace(/\s/g, "");
  if (s === "") return null;
  // Un simbolo di percentuale non cambia il valore numerico.
  s = s.replace(/%$/, "");
  if (s === "") return null;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");
    if (lastComma > lastDot) {
      // la virgola e' il separatore decimale, i punti sono migliaia
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      // il punto e' il separatore decimale, le virgole sono migliaia
      s = s.replace(/,/g, "");
    }
  } else if (hasComma) {
    if (/^-?\d{1,3}(,\d{3})+$/.test(s)) {
      s = s.replace(/,/g, ""); // migliaia
    } else {
      s = s.replace(",", "."); // decimale
    }
  } else if (hasDot) {
    if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) {
      s = s.replace(/\./g, ""); // migliaia
    }
    // altrimenti e' gia' un decimale valido (es. "3.8") o un intero
  }

  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}
