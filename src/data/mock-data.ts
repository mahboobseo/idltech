import { BlogPost, HistoryItem, SeoLandingConfig } from '../types';

// SVG Data URIs representing realistic mock documents for instant 1-click test runs
export const SAMPLE_DOCUMENTS = [
  {
    id: 'sample-receipt',
    title: 'Supermarket Grocery Receipt',
    category: 'receipt',
    badge: 'Retail Receipt',
    description: 'Itemized grocery receipt with prices, taxes, and card payment info.',
    previewText: `FRESH MARKET GROCERY #402
124 Main Street, Seattle, WA 98101
Tel: (206) 555-0199

DATE: 11/08/2026   TIME: 14:32
CASHIER: Sarah M.    STORE #402

1  ORGANIC WHOLE MILK 1GAL     $4.89 T
1  SOURDOUGH ARTISAN BREAD     $3.99 T
2  AVOCADOS HASS ($1.50 ea)    $3.00
1  ROASTED ALMONDS 12OZ        $6.49 T
1  COLD BREW COFFEE 32OZ       $5.29 T
-------------------------------------
SUBTOTAL:                      $23.66
TAX (6.5%):                     $1.54
TOTAL:                         $25.20

VISA ENDING IN 8941
AUTH: #092819  AID: A0000000031010
THANK YOU FOR SHOPPING FRESH MARKET!`,
    // Clean SVG graphic rendered as base64
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#f8fafc"/>
  <rect x="50" y="30" width="500" height="690" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="300" y="80" font-family="Courier, monospace" font-size="20" font-weight="bold" text-anchor="middle" fill="#0f172a">FRESH MARKET GROCERY #402</text>
  <text x="300" y="110" font-family="Courier, monospace" font-size="14" text-anchor="middle" fill="#475569">124 Main Street, Seattle, WA 98101</text>
  <text x="300" y="130" font-family="Courier, monospace" font-size="13" text-anchor="middle" fill="#475569">Tel: (206) 555-0199</text>
  
  <line x1="80" y1="150" x2="520" y2="150" stroke="#94a3b8" stroke-dasharray="4"/>
  <text x="80" y="175" font-family="Courier, monospace" font-size="13" fill="#334155">DATE: 11/08/2026</text>
  <text x="520" y="175" font-family="Courier, monospace" font-size="13" text-anchor="end" fill="#334155">TIME: 14:32</text>
  <text x="80" y="195" font-family="Courier, monospace" font-size="13" fill="#334155">CASHIER: Sarah M.</text>
  <line x1="80" y1="210" x2="520" y2="210" stroke="#94a3b8" stroke-dasharray="4"/>

  <text x="80" y="240" font-family="Courier, monospace" font-size="14" fill="#0f172a">1 ORGANIC WHOLE MILK 1GAL</text>
  <text x="520" y="240" font-family="Courier, monospace" font-size="14" text-anchor="end" fill="#0f172a">$4.89</text>

  <text x="80" y="270" font-family="Courier, monospace" font-size="14" fill="#0f172a">1 SOURDOUGH ARTISAN BREAD</text>
  <text x="520" y="270" font-family="Courier, monospace" font-size="14" text-anchor="end" fill="#0f172a">$3.99</text>

  <text x="80" y="300" font-family="Courier, monospace" font-size="14" fill="#0f172a">2 AVOCADOS HASS ($1.50 ea)</text>
  <text x="520" y="300" font-family="Courier, monospace" font-size="14" text-anchor="end" fill="#0f172a">$3.00</text>

  <text x="80" y="330" font-family="Courier, monospace" font-size="14" fill="#0f172a">1 ROASTED ALMONDS 12OZ</text>
  <text x="520" y="330" font-family="Courier, monospace" font-size="14" text-anchor="end" fill="#0f172a">$6.49</text>

  <text x="80" y="360" font-family="Courier, monospace" font-size="14" fill="#0f172a">1 COLD BREW COFFEE 32OZ</text>
  <text x="520" y="360" font-family="Courier, monospace" font-size="14" text-anchor="end" fill="#0f172a">$5.29</text>

  <line x1="80" y1="400" x2="520" y2="400" stroke="#0f172a" stroke-width="1.5"/>
  <text x="80" y="430" font-family="Courier, monospace" font-size="15" fill="#334155">SUBTOTAL:</text>
  <text x="520" y="430" font-family="Courier, monospace" font-size="15" text-anchor="end" fill="#334155">$23.66</text>

  <text x="80" y="455" font-family="Courier, monospace" font-size="15" fill="#334155">TAX (6.5%):</text>
  <text x="520" y="455" font-family="Courier, monospace" font-size="15" text-anchor="end" fill="#334155">$1.54</text>

  <text x="80" y="490" font-family="Courier, monospace" font-size="18" font-weight="bold" fill="#0f172a">TOTAL:</text>
  <text x="520" y="490" font-family="Courier, monospace" font-size="18" font-weight="bold" text-anchor="end" fill="#0284c7">$25.20</text>

  <line x1="80" y1="520" x2="520" y2="520" stroke="#94a3b8" stroke-dasharray="4"/>
  <text x="300" y="555" font-family="Courier, monospace" font-size="13" text-anchor="middle" fill="#475569">VISA ENDING IN 8941</text>
  <text x="300" y="580" font-family="Courier, monospace" font-size="12" text-anchor="middle" fill="#64748b">AUTH: #092819 - APPROVED</text>
  <text x="300" y="630" font-family="Courier, monospace" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">THANK YOU FOR SHOPPING!</text>
  <rect x="200" y="660" width="200" height="18" fill="#1e293b"/>
</svg>`),
  },
  {
    id: 'sample-invoice',
    title: 'Consulting & Tech Invoice',
    category: 'invoice',
    badge: 'B2B Invoice',
    description: 'Corporate invoice with line items, VAT number, PO #, and payment terms.',
    previewText: `TECHVISION ENTERPRISES LLC
100 Innovation Way, Suite 400, San Francisco, CA
Email: billing@techvision.io | Web: techvision.io

INVOICE TO:
Vertex Digital Media
Attn: Accounts Payable
742 Evergreen Terrace, Chicago, IL

INVOICE #: INV-2026-904
DATE: November 05, 2026
PAYMENT TERMS: Net 30 Days
DUE DATE: December 05, 2026

SERVICES RENDERED:
1. Cloud Architecture Consulting (20 hrs @ $150/hr): $3,000.00
2. AI Model Fine-tuning & Data Pipeline (1 milestone): $4,500.00
3. Security Audit & SOC2 Preparation (Fixed): $1,800.00
--------------------------------------------------------------
SUBTOTAL: $9,300.00
DISCOUNT (Partner 5%): -$465.00
TAX / GST (0% Export): $0.00
TOTAL AMOUNT DUE: $8,835.00

Bank Wire Transfer:
Bank: Silicon Valley Trust
Account: 9482-1049-2819
Routing (ABA): 121000358`,
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#f1f5f9"/>
  <rect x="40" y="30" width="520" height="690" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <rect x="40" y="30" width="520" height="100" fill="#0284c7" rx="6"/>
  <text x="70" y="80" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff">TECHVISION ENTERPRISES</text>
  <text x="70" y="105" font-family="sans-serif" font-size="13" fill="#e0f2fe">Cloud &amp; AI Enterprise Solutions</text>
  <text x="520" y="85" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="end" fill="#ffffff">INVOICE</text>
  <text x="520" y="110" font-family="sans-serif" font-size="14" text-anchor="end" fill="#bae6fd">#INV-2026-904</text>
  
  <text x="70" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b">BILLED TO:</text>
  <text x="70" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Vertex Digital Media</text>
  <text x="70" y="205" font-family="sans-serif" font-size="12" fill="#475569">Attn: Accounts Payable</text>
  <text x="70" y="222" font-family="sans-serif" font-size="12" fill="#475569">742 Evergreen Terrace, Chicago, IL</text>

  <text x="360" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b">INVOICE DETAILS:</text>
  <text x="360" y="185" font-family="sans-serif" font-size="12" fill="#475569">Date: Nov 05, 2026</text>
  <text x="360" y="205" font-family="sans-serif" font-size="12" fill="#475569">Due Date: Dec 05, 2026</text>
  <text x="360" y="222" font-family="sans-serif" font-size="12" fill="#475569">Terms: Net 30</text>

  <rect x="70" y="250" width="460" height="32" fill="#f8fafc"/>
  <text x="80" y="271" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">DESCRIPTION</text>
  <text x="510" y="271" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="end" fill="#334155">AMOUNT</text>

  <text x="80" y="310" font-family="sans-serif" font-size="13" fill="#0f172a">Cloud Architecture Consulting (20h)</text>
  <text x="510" y="310" font-family="sans-serif" font-size="13" text-anchor="end" fill="#0f172a">$3,000.00</text>

  <text x="80" y="345" font-family="sans-serif" font-size="13" fill="#0f172a">AI Model Fine-tuning &amp; Pipeline</text>
  <text x="510" y="345" font-family="sans-serif" font-size="13" text-anchor="end" fill="#0f172a">$4,500.00</text>

  <text x="80" y="380" font-family="sans-serif" font-size="13" fill="#0f172a">Security Audit &amp; SOC2 Prep</text>
  <text x="510" y="380" font-family="sans-serif" font-size="13" text-anchor="end" fill="#0f172a">$1,800.00</text>

  <line x1="70" y1="410" x2="530" y2="410" stroke="#cbd5e1"/>
  <text x="350" y="440" font-family="sans-serif" font-size="13" fill="#475569">SUBTOTAL:</text>
  <text x="510" y="440" font-family="sans-serif" font-size="13" text-anchor="end" fill="#475569">$9,300.00</text>

  <text x="350" y="465" font-family="sans-serif" font-size="13" fill="#475569">DISCOUNT (5%):</text>
  <text x="510" y="465" font-family="sans-serif" font-size="13" text-anchor="end" fill="#16a34a">-$465.00</text>

  <rect x="330" y="485" width="200" height="40" fill="#0369a1" rx="4"/>
  <text x="345" y="510" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">TOTAL DUE:</text>
  <text x="515" y="510" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="end" fill="#ffffff">$8,835.00</text>

  <text x="70" y="570" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b">PAYMENT INSTRUCTIONS:</text>
  <text x="70" y="590" font-family="sans-serif" font-size="12" fill="#475569">Bank: Silicon Valley Trust | Account: 9482-1049-2819</text>
  <text x="70" y="608" font-family="sans-serif" font-size="12" fill="#475569">Routing: 121000358 | Please reference INV-2026-904</text>
</svg>`),
  },
  {
    id: 'sample-handwriting',
    title: 'Handwritten Meeting Notes',
    category: 'handwriting',
    badge: 'Cursive & Print',
    description: 'Real-world handwritten notes with bullet points, action items, and arrows.',
    previewText: `Product Strategy Review - Q4 Goals
Attendees: Liam, Priya, Marcus, Elena

1. Launch Mobile OCR SDK by Dec 15th
   -> Ensure latency is < 200ms per image
   -> Priya to benchmark against competitor engines

2. Multi-language support expansion:
   - Add native Arabic, Japanese, Urdu & Hindi OCR models
   - Test handwriting recognition accuracy on medical scripts

3. Action Items:
   [X] Marcus: Update API pricing tiers
   [ ] Elena: Finalize UI redesign for batch processor
   [ ] Liam: Review SOC2 compliance checklist by Friday

Next sync: Monday at 10:00 AM (Room 4B / Zoom)`,
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#fffbeb"/>
  <!-- Lined notebook paper simulation -->
  <line x1="80" y1="0" x2="80" y2="750" stroke="#fca5a5" stroke-width="1.5"/>
  <defs>
    <pattern id="lines" width="600" height="32" patternUnits="userSpaceOnUse">
      <line x1="0" y1="31" x2="600" y2="31" stroke="#e0e7ff" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="600" height="750" fill="url(#lines)"/>

  <text x="100" y="90" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="28" font-weight="bold" fill="#1e3a8a">Product Strategy Review - Q4 Goals</text>
  <text x="100" y="125" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="20" fill="#374151">Attendees: Liam, Priya, Marcus, Elena</text>

  <text x="100" y="185" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="22" fill="#111827">1. Launch Mobile OCR SDK by Dec 15th</text>
  <text x="130" y="215" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="19" fill="#1f2937">-&gt; Ensure latency is &lt; 200ms per image</text>
  <text x="130" y="248" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="19" fill="#1f2937">-&gt; Priya to benchmark against competitor engines</text>

  <text x="100" y="310" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="22" fill="#111827">2. Multi-language support expansion:</text>
  <text x="130" y="342" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="19" fill="#1f2937">* Add native Arabic, Japanese, Urdu &amp; Hindi OCR models</text>
  <text x="130" y="375" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="19" fill="#1f2937">* Test handwriting accuracy on medical scripts</text>

  <text x="100" y="440" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="22" font-weight="bold" fill="#0284c7">3. Action Items:</text>
  <text x="130" y="472" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="20" fill="#111827">[X] Marcus: Update API pricing tiers</text>
  <text x="130" y="504" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="20" fill="#111827">[ ] Elena: Finalize UI redesign for batch processor</text>
  <text x="130" y="536" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="20" fill="#111827">[ ] Liam: Review SOC2 compliance checklist by Friday</text>

  <text x="100" y="600" font-family="Caveat, 'Segoe Script', cursive, sans-serif" font-size="20" font-style="italic" fill="#dc2626">Next sync: Monday at 10:00 AM (Room 4B / Zoom)</text>
</svg>`),
  },
  {
    id: 'sample-business-card',
    title: 'Executive Business Card',
    category: 'business-card',
    badge: 'Card & Contact',
    description: 'Corporate business card with title, phone, email, and social handles.',
    previewText: `ALEXANDRA CHEN
Vice President of Artificial Intelligence
Nexus Systems Global

Direct: +1 (415) 892-4910
Office: +1 (800) 555-8900
Email: a.chen@nexussystems.com
Web: https://www.nexussystems.com
Headquarters: 500 Howard Street, Suite 900, San Francisco, CA 94105`,
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#0f172a"/>
  <rect x="25" y="25" width="550" height="350" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/>
  <circle cx="500" cy="80" r="36" fill="#0284c7" opacity="0.2"/>
  <circle cx="500" cy="80" r="20" fill="#0284c7"/>
  
  <text x="60" y="100" font-family="sans-serif" font-size="26" font-weight="bold" fill="#f8fafc">ALEXANDRA CHEN</text>
  <text x="60" y="130" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">VP OF ARTIFICIAL INTELLIGENCE</text>
  <text x="60" y="155" font-family="sans-serif" font-size="13" fill="#94a3b8">Nexus Systems Global</text>

  <line x1="60" y1="185" x2="540" y2="185" stroke="#334155"/>

  <text x="60" y="225" font-family="sans-serif" font-size="13" fill="#cbd5e1">Direct: +1 (415) 892-4910</text>
  <text x="60" y="255" font-family="sans-serif" font-size="13" fill="#cbd5e1">Office: +1 (800) 555-8900</text>
  <text x="60" y="285" font-family="sans-serif" font-size="13" fill="#38bdf8">Email: a.chen@nexussystems.com</text>
  <text x="60" y="315" font-family="sans-serif" font-size="13" fill="#94a3b8">Web: www.nexussystems.com</text>
  
  <text x="60" y="348" font-family="sans-serif" font-size="11" fill="#64748b">500 Howard Street, Suite 900, San Francisco, CA</text>
</svg>`),
  },
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    title: 'Supermarket Grocery Receipt',
    text: SAMPLE_DOCUMENTS[0].previewText,
    detectedLanguage: 'English',
    confidence: 99.4,
    wordCount: 68,
    charCount: 462,
    lineCount: 19,
    readingTimeMinutes: 1,
    documentType: 'receipt',
    imageUrl: SAMPLE_DOCUMENTS[0].imageUrl,
    createdAt: '2026-11-09T06:12:00Z',
    keyDetails: { total: '$25.20', date: '11/08/2026' },
  },
  {
    id: 'hist-2',
    title: 'TechVision Consulting Invoice',
    text: SAMPLE_DOCUMENTS[1].previewText,
    detectedLanguage: 'English',
    confidence: 99.8,
    wordCount: 104,
    charCount: 698,
    lineCount: 24,
    readingTimeMinutes: 1,
    documentType: 'invoice',
    imageUrl: SAMPLE_DOCUMENTS[1].imageUrl,
    createdAt: '2026-11-08T18:40:00Z',
    keyDetails: { total: '$8,835.00', date: 'Nov 05, 2026', invoiceNumber: 'INV-2026-904' },
  },
  {
    id: 'hist-3',
    title: 'Q4 Product Strategy Handwriting',
    text: SAMPLE_DOCUMENTS[2].previewText,
    detectedLanguage: 'English',
    confidence: 98.7,
    wordCount: 92,
    charCount: 580,
    lineCount: 18,
    readingTimeMinutes: 1,
    documentType: 'handwriting',
    imageUrl: SAMPLE_DOCUMENTS[2].imageUrl,
    createdAt: '2026-11-07T11:20:00Z',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'how-ai-ocr-revolutionizes-document-scanning',
    title: 'How Next-Gen AI Vision Replaces Traditional Tesseract OCR',
    excerpt: 'Discover how modern multimodal transformers achieve 99.8% precision even on crumpled receipts, cursive handwriting, and tilted phone photos.',
    category: 'AI',
    readTime: '5 min read',
    date: 'Nov 08, 2026',
    author: 'Dr. Aaron Vance',
    content: `For decades, Optical Character Recognition (OCR) relied on matrix matching and feature extraction algorithms such as Tesseract. While effective on high-contrast scanned books, traditional OCR routinely failed when encountering skewed camera angles, crumpled paper, cursive writing, and multilingual documents.

With the advent of multimodal AI models like Gemini 3.8 Flash, OCR has transformed from simple pixel thresholding to semantic vision comprehension. The AI understands document geometry, contextual grammar, and tabular relationships in parallel.

Key benefits of AI-driven OCR:
1. Contextual Error Correction: Distinguishes between numeral '0' and letter 'O' based on surrounding words.
2. Handwriting Decoupling: Capable of parsing complex medical prescriptions and meeting notes.
3. Zero Template Parsing: Automatically detects whether a document is a receipt, tax form, contract, or ID card.`,
  },
  {
    id: 'blog-2',
    slug: 'extract-tables-and-financials-from-invoices',
    title: 'Extracting Structured Data from Invoices and Receipts with AI',
    excerpt: 'Step-by-step guide to turning unstructured PDF scans into clean CSV, Excel, and JSON data without writing manual regex rules.',
    category: 'Business',
    readTime: '4 min read',
    date: 'Nov 06, 2026',
    author: 'Elena Rostova',
    content: `Finance teams spend an estimated 14 hours per week manually keying data from vendor invoices and receipt photos into accounting software.

Photo to Text automates this pipeline entirely. By uploading invoice snapshots, users can extract totals, tax rates, vendor addresses, and PO numbers in milliseconds. The extracted data can then be exported directly into CSV or DOCX formats for immediate enterprise reconciliation.`,
  },
  {
    id: 'blog-3',
    slug: 'handwriting-to-text-best-practices',
    title: 'Tips for Getting Flawless Handwriting OCR Results Every Time',
    excerpt: 'Maximize recognition accuracy on student notebooks, whiteboard brainstorming sessions, and historical cursive documents.',
    category: 'Scanning',
    readTime: '6 min read',
    date: 'Nov 03, 2026',
    author: 'Marcus Sterling',
    content: `Handwriting remains one of the toughest frontiers in computer vision. Variations in slant, pen pressure, line ruling, and ligature connections create extreme ambiguity.

To obtain the highest confidence score when scanning handwriting:
• Maintain even overhead illumination to eliminate harsh shadows.
• Keep your camera lens parallel to the paper surface to minimize perspective distortion.
• Utilize Photo to Text's built-in "Explain & Fix Grammar" tool after extraction to normalize slang or fragmented notes into coherent prose.`,
  },
];

export const SEO_LANDINGS: SeoLandingConfig[] = [
  {
    id: 'seo-image-to-text',
    slug: 'image-to-text',
    title: 'Image to Text Converter Online',
    h1: 'Free AI Image to Text Converter',
    metaDesc: 'Convert JPG, PNG, WEBP, and scanned images into editable text instantly with AI OCR. 100+ languages supported.',
    badge: 'Universal OCR',
    highlightText: 'Extract printed text, screenshots, and photos with zero loss in formatting.',
    supportedFormats: ['PNG', 'JPG', 'JPEG', 'WEBP', 'TIFF', 'BMP'],
    recommendedPreset: 'sample-receipt',
  },
  {
    id: 'seo-receipt-ocr',
    slug: 'receipt-ocr',
    title: 'Receipt OCR & Expense Scanner',
    h1: 'AI Receipt Scanner to Text & CSV',
    metaDesc: 'Extract totals, dates, items, and tax numbers from shopping receipts, supermarket bills, and dining checks.',
    badge: 'Expense Tracker',
    highlightText: 'Turn paper receipts into organized tables, TXT, and Excel sheets in seconds.',
    supportedFormats: ['JPG', 'PNG', 'PDF', 'HEIC'],
    recommendedPreset: 'sample-receipt',
  },
  {
    id: 'seo-invoice-ocr',
    slug: 'invoice-ocr',
    title: 'Invoice OCR & AP Automation',
    h1: 'Intelligent B2B Invoice OCR Extractor',
    metaDesc: 'Extract invoice numbers, line items, due dates, and vendor details from PDF and photo invoices.',
    badge: 'Finance & AP',
    highlightText: 'Eliminate manual bookkeeping with automated data extraction and DOCX export.',
    supportedFormats: ['PDF', 'PNG', 'JPG', 'TIFF'],
    recommendedPreset: 'sample-invoice',
  },
  {
    id: 'seo-handwriting-ocr',
    slug: 'handwriting-ocr',
    title: 'Handwriting to Text OCR Online',
    h1: 'Convert Handwriting to Digital Text',
    metaDesc: 'Accurately convert cursive handwriting, whiteboard notes, and handwritten memos to editable text.',
    badge: 'Cursive & Notes',
    highlightText: 'Advanced handwriting neural networks trained on diverse writing styles and scripts.',
    supportedFormats: ['JPG', 'PNG', 'WEBP', 'PDF'],
    recommendedPreset: 'sample-handwriting',
  },
  {
    id: 'seo-business-card-ocr',
    slug: 'business-card-ocr',
    title: 'Business Card OCR & Contact Scanner',
    h1: 'Business Card Reader to Text & VCF',
    metaDesc: 'Extract names, email addresses, phone numbers, and company titles from business cards instantly.',
    badge: 'CRM Ready',
    highlightText: 'Convert physical business cards into digital contact records and clean text.',
    supportedFormats: ['PNG', 'JPG', 'WEBP'],
    recommendedPreset: 'sample-business-card',
  },
  {
    id: 'seo-pdf-to-text',
    slug: 'pdf-to-text',
    title: 'Scanned PDF to Text Converter',
    h1: 'Extract Text from Scanned PDFs with AI',
    metaDesc: 'Convert non-searchable scanned PDF documents, books, and legal agreements into editable text.',
    badge: 'Multi-Page PDF',
    highlightText: 'Process multi-page documents and preserve paragraph structure and headers.',
    supportedFormats: ['PDF', 'TIFF', 'PNG'],
    recommendedPreset: 'sample-invoice',
  },
];

export const POPULAR_LANGUAGES = [
  'English',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Arabic (العربية)',
  'Urdu (اردو)',
  'Hindi (हिन्दी)',
  'Chinese (中文)',
  'Japanese (日本語)',
  'Italian (Italiano)',
  'Portuguese (Português)',
  'Russian (Русский)',
  'Korean (한국어)',
  'Dutch (Nederlands)',
  'Turkish (Türkçe)',
  'Vietnamese (Tiếng Việt)',
  'Polish (Polski)',
  'Indonesian (Bahasa Indonesia)',
];
