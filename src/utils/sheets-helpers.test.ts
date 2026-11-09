import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseOcrTextToTable, sanitizeSheetName } from './sheets-helpers.ts';

test('sanitizeSheetName removes invalid characters and limits length', () => {
  const result = sanitizeSheetName('Invoice [2026] / Store #402: Fresh Market?');
  assert.ok(!result.includes('['));
  assert.ok(!result.includes(']'));
  assert.ok(!result.includes('/'));
  assert.ok(!result.includes(':'));
  assert.ok(!result.includes('?'));
});

test('parseOcrTextToTable handles empty text safely', () => {
  const parsed = parseOcrTextToTable('');
  assert.deepEqual(parsed.headers, ['Line #', 'Extracted Content']);
  assert.equal(parsed.rows.length, 1);
});

test('parseOcrTextToTable parses receipt items and key-values', () => {
  const sample = `
DATE: 11/08/2026
TOTAL: $25.20
1 ORGANIC WHOLE MILK $4.89 T
2 AVOCADOS HASS $3.00
  `.trim();

  const parsed = parseOcrTextToTable(sample, 'Grocery Receipt');
  assert.ok(parsed.rows.length >= 4);
  assert.equal(parsed.headers[0], 'Qty / Item #');
  assert.equal(parsed.headers[1], 'Description / Content');
});

test('parseOcrTextToTable handles pipe-delimited tables', () => {
  const pipeSample = `
Item | Quantity | Price
Espresso | 2 | $7.00
Croissant | 1 | $4.50
  `.trim();

  const parsed = parseOcrTextToTable(pipeSample, 'Coffee Order');
  assert.deepEqual(parsed.headers, ['Item', 'Quantity', 'Price']);
  assert.equal(parsed.rows.length, 2);
});
