/**
 * Google Sheets Data Conversion & Helper Utilities
 * Converts raw OCR text and receipts into clean, structured 2D arrays for Google Sheets.
 */

export interface ParsedTableData {
  headers: string[];
  rows: (string | number)[][];
  suggestedSheetTitle: string;
}

/**
 * Parses OCR extracted text into structured 2D table data for Google Sheets.
 */
export function parseOcrTextToTable(rawText: string, documentTitle = 'Document OCR'): ParsedTableData {
  if (!rawText || !rawText.trim()) {
    return {
      headers: ['Line #', 'Extracted Content'],
      rows: [['1', 'No content detected']],
      suggestedSheetTitle: sanitizeSheetName(documentTitle),
    };
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Check if text appears to be tabular/CSV delimited (comma, semicolon, or pipe)
  const pipeCount = lines.filter((l) => l.includes('|')).length;
  const commaCount = lines.filter((l) => l.includes(',') && !l.includes('$')).length;

  if (pipeCount >= 2) {
    const rawRows = lines
      .map((l) =>
        l
          .split('|')
          .map((c) => c.trim())
          .filter(Boolean)
      )
      .filter((r) => r.length > 0);

    if (rawRows.length > 0) {
      const headers = rawRows[0];
      const rows = rawRows.slice(1);
      return {
        headers,
        rows: rows.length > 0 ? rows : [new Array(headers.length).fill('(empty)')],
        suggestedSheetTitle: sanitizeSheetName(documentTitle),
      };
    }
  }

  // Attempt smart receipt/invoice line item parsing
  const parsedItems: (string | number)[][] = [];
  const metadataRows: [string, string][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for key-value pair like "DATE: 11/08/2026" or "TOTAL: $25.20"
    const kvMatch = line.match(/^([^:]{2,25}):\s*(.+)$/i);
    if (kvMatch && !kvMatch[1].toLowerCase().includes('http')) {
      metadataRows.push([kvMatch[1].trim(), kvMatch[2].trim()]);
      continue;
    }

    // Check for receipt item line: e.g. "1 ORGANIC WHOLE MILK 1GAL $4.89 T" or "Web Development $3,500.00"
    const receiptMatch = line.match(/^(\d+)?\s*(.*?)\s+([$€£¥]?\d+(?:[.,]\d{2})?)\s*([A-Z])?$/);
    if (receiptMatch && receiptMatch[2] && receiptMatch[3]) {
      const qty = receiptMatch[1] || '1';
      const desc = receiptMatch[2].trim();
      const price = receiptMatch[3].trim();
      const tag = receiptMatch[4] || '';
      parsedItems.push([qty, desc, price, tag]);
      continue;
    }

    // Default line
    parsedItems.push([i + 1, line, '', '']);
  }

  // If we found receipt items or metadata, build a rich spreadsheet format
  if (parsedItems.length > 0) {
    const headers = ['Qty / Item #', 'Description / Content', 'Amount / Value', 'Notes / Tax'];
    
    // Add metadata block at the top if present
    const combinedRows: (string | number)[][] = [];
    if (metadataRows.length > 0) {
      metadataRows.forEach(([key, val]) => {
        combinedRows.push([key, val, '', '']);
      });
      combinedRows.push(['---', '---', '---', '---']);
    }
    
    combinedRows.push(...parsedItems);

    return {
      headers,
      rows: combinedRows,
      suggestedSheetTitle: sanitizeSheetName(documentTitle),
    };
  }

  // Fallback to indexed lines
  return {
    headers: ['Line #', 'Extracted Content'],
    rows: lines.map((line, idx) => [idx + 1, line]),
    suggestedSheetTitle: sanitizeSheetName(documentTitle),
  };
}

/**
 * Ensures a valid Google Sheets tab name (<= 100 characters, no forbidden symbols).
 */
export function sanitizeSheetName(name: string): string {
  const cleaned = name
    .replace(/[\\/?*[\]:]/g, ' ')
    .trim()
    .slice(0, 50);
  return cleaned || 'OCR Data';
}
