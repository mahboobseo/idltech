import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeTextMetrics,
  filterHistoryItems,
  generateCsvFromText,
  generateDocxBlobContent,
  canPerformOcr,
  estimateOcrConfidence,
} from './ocr-helpers';

test('computeTextMetrics calculates correct metrics for empty and non-empty text', () => {
  const empty = computeTextMetrics('');
  assert.equal(empty.wordCount, 0);
  assert.equal(empty.charCount, 0);
  assert.equal(empty.readingTimeMinutes, 0);
  assert.equal(empty.lineCount, 0);

  const sample = 'Hello world\nThis is Photo to Text AI';
  const metrics = computeTextMetrics(sample);
  assert.equal(metrics.wordCount, 8);
  assert.equal(metrics.lineCount, 2);
  assert.equal(metrics.readingTimeMinutes, 1);
});

test('filterHistoryItems searches title, content, and category', () => {
  const items = [
    { title: 'Supermarket Receipt', text: 'Total: $45.20 milk bread', category: 'receipt' },
    { title: 'Office Invoice #102', text: 'Due date: Nov 20, Amount $500', category: 'invoice' },
    { title: 'Lecture Notes', text: 'Quantum physics equations', category: 'notes' },
  ];

  const searchMilk = filterHistoryItems(items, 'milk');
  assert.equal(searchMilk.length, 1);
  assert.equal(searchMilk[0].title, 'Supermarket Receipt');

  const invoiceCat = filterHistoryItems(items, '', 'invoice');
  assert.equal(invoiceCat.length, 1);
  assert.equal(invoiceCat[0].title, 'Office Invoice #102');

  const allItems = filterHistoryItems(items, '', 'all');
  assert.equal(allItems.length, 3);
});

test('generateCsvFromText outputs quoted rows with line numbers', () => {
  const text = 'Line one\nLine "two" with quotes';
  const csv = generateCsvFromText(text);
  assert.ok(csv.includes('"1","Line one"'));
  assert.ok(csv.includes('"2","Line ""two"" with quotes"'));
});

test('generateDocxBlobContent wraps text in Microsoft Word compatible HTML', () => {
  const docx = generateDocxBlobContent('Test Doc', 'Sample text & special chars');
  assert.ok(docx.includes('xmlns:w='));
  assert.ok(docx.includes('urn:schemas-microsoft-com:office:word'));
  assert.ok(docx.includes('Test Doc'));
  assert.ok(docx.includes('&amp;'));
});

test('canPerformOcr enforces tier limits properly', () => {
  const freeOk = canPerformOcr('free', 5);
  assert.equal(freeOk.allowed, true);
  assert.equal(freeOk.remaining, 5);

  const freeBlocked = canPerformOcr('free', 10);
  assert.equal(freeBlocked.allowed, false);
  assert.equal(freeBlocked.remaining, 0);

  const proAllowed = canPerformOcr('pro', 200);
  assert.equal(proAllowed.allowed, true);
});

test('estimateOcrConfidence produces sane confidence score', () => {
  const confidence = estimateOcrConfidence('Invoice #4928 Total USD 199.00 Paid');
  assert.ok(confidence >= 90 && confidence <= 100);
});
