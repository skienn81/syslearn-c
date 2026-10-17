/**
 * codeSanitizer.ts
 * Chuẩn hóa các ký tự đặc biệt, Unicode Math, Smart Punctuation (do bộ gõ tiếng Việt,
 * MacOS Smart Quotes, iOS Autocorrect, hoặc copy-paste từ slide/Word) về cú pháp C tiêu chuẩn.
 * 
 * Ví dụ:
 * - '≠' (U+2260) -> '!='
 * - '≤' (U+2264) -> '<='
 * - '≥' (U+2265) -> '>='
 * - '→' / '➔' / '➜' (U+2192) -> '->'
 * - '“' / '”' / '„' -> '"'
 * - '‘' / '’' -> "'"
 * - '—' (em-dash) -> '--'
 * - '–' (en-dash) / '−' (minus sign) -> '-'
 * - '\u00A0' (non-breaking space) -> ' '
 */

export function normalizeCSymbols(code: string): string {
  if (!code) return code

  return code
    // Toán tử so sánh & logic
    .replace(/≠/g, '!=')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/[→➔➜]/g, '->')
    // Dấu ngoặc kép thông minh (Smart Quotes)
    .replace(/[“”„]/g, '"')
    // Dấu nháy đơn thông minh
    .replace(/[‘’]/g, "'")
    // Dấu gạch ngang / trừ
    .replace(/—/g, '--')
    .replace(/[–−]/g, '-')
    // Khoảng trắng ẩn & non-breaking space
    .replace(/\u00A0/g, ' ')
    .replace(/\u200B/g, '')
}
