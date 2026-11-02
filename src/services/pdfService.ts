import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import {
  BookmarkItem,
  CommentItem,
  FormFieldItem,
  LayerItem,
  AttachmentItem,
  DocumentMetadata,
  PdfDocument,
} from '../types/pdf';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Creates the official PDFpb Showcase specimen PDF document
 */
export async function createDefaultShowcasePdf(): Promise<PdfDocument> {
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);

  // --- Page 1: Cover Page ---
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width: p1W, height: p1H } = page1.getSize();

  // Draw header accent
  page1.drawRectangle({
    x: 0,
    y: p1H - 120,
    width: p1W,
    height: 120,
    color: rgb(0.718, 0.008, 0.157), // #b70228 ArtCraft crimson
  });

  page1.drawText('PDFpb', {
    x: 48,
    y: p1H - 75,
    size: 40,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText('Bancada Moderna de PDF - Editor & Criador de Formularios', {
    x: 48,
    y: p1H - 100,
    size: 11,
    font: helvetica,
    color: rgb(0.95, 0.9, 0.92),
  });

  page1.drawText('PDFpb Showcase Edition', {
    x: 48,
    y: p1H - 170,
    size: 24,
    font: timesRomanBold,
    color: rgb(0.12, 0.12, 0.14),
  });

  page1.drawText('A specimen document demonstrating reading, typography, organize workbench,', {
    x: 48,
    y: p1H - 200,
    size: 13,
    font: timesRoman,
    color: rgb(0.3, 0.3, 0.35),
  });
  page1.drawText('interactive forms, threaded review comments, layers, and security controls.', {
    x: 48,
    y: p1H - 218,
    size: 13,
    font: timesRoman,
    color: rgb(0.3, 0.3, 0.35),
  });

  // Feature boxes on cover
  const boxes = [
    { title: 'Faithful', desc: 'Real-world typography, precise metrics, high-DPI zoom, world scripts.' },
    { title: 'Fearless', desc: 'Incremental and atomic saves, deep undo/redo, organises pages like cards.' },
    { title: 'Yours', desc: 'No account, zero telemetry, 100% private. Runs entirely in your browser.' },
  ];

  boxes.forEach((box, i) => {
    const yPos = p1H - 300 - i * 110;
    page1.drawRectangle({
      x: 48,
      y: yPos,
      width: p1W - 96,
      height: 90,
      borderColor: rgb(0.85, 0.85, 0.88),
      borderWidth: 1,
      color: rgb(0.98, 0.98, 0.99),
    });

    page1.drawRectangle({
      x: 48,
      y: yPos,
      width: 4,
      height: 90,
      color: rgb(0.718, 0.008, 0.157),
    });

    page1.drawText(box.title, {
      x: 68,
      y: yPos + 60,
      size: 16,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.12),
    });

    page1.drawText(box.desc, {
      x: 68,
      y: yPos + 36,
      size: 11,
      font: helvetica,
      color: rgb(0.35, 0.35, 0.4),
    });
  });

  page1.drawText('Use the Toolbar above or press Ctrl+K (Cmd+K) to launch the Command Palette.', {
    x: 48,
    y: 60,
    size: 10,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.55),
  });

  // --- Page 2: Expressive Type & Layout ---
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  const { height: p2H } = page2.getSize();

  page2.drawText('Chapter 1: Expressive Typography', {
    x: 48,
    y: p2H - 70,
    size: 20,
    font: timesRomanBold,
    color: rgb(0.718, 0.008, 0.157),
  });

  page2.drawText('Text Selection, Columns, and Multi-Lingual Glyph Shaping', {
    x: 48,
    y: p2H - 95,
    size: 12,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.45),
  });

  // Body text simulating two columns
  const col1 = [
    'PDFpb renders PDFs with care for the details',
    'that make a page feel right: kerning and ligatures,',
    'right-to-left and complex scripts, vertical CJK,',
    'colour emoji, shadings, blend modes, soft masks',
    'and optional content.',
    '',
    'Search the whole document as you type, step through',
    'matches with Cmd+G, and select text that comes out',
    'in the right natural reading order.',
  ];

  const col2 = [
    'Large pages render in crisp tiles, so text stays',
    'sharp at any magnification. Across the 983-file',
    'pdf.js test corpus, the engine achieves zero crashes.',
    '',
    'Layouts for every task: continuous scroll, single',
    'page, two-up facing pages, view rotation, full screen',
    'and distraction-free Read mode.',
  ];

  col1.forEach((line, idx) => {
    page2.drawText(line, {
      x: 48,
      y: p2H - 140 - idx * 18,
      size: 11,
      font: timesRoman,
      color: rgb(0.15, 0.15, 0.18),
    });
  });

  col2.forEach((line, idx) => {
    page2.drawText(line, {
      x: 310,
      y: p2H - 140 - idx * 18,
      size: 11,
      font: timesRoman,
      color: rgb(0.15, 0.15, 0.18),
    });
  });

  // Code listing sample box
  page2.drawRectangle({
    x: 48,
    y: p2H - 450,
    width: p1W - 96,
    height: 140,
    color: rgb(0.12, 0.13, 0.16),
  });

  page2.drawText('// Scriptable PDF automation with pdfpb-cli', {
    x: 64,
    y: p2H - 340,
    size: 10,
    font: courier,
    color: rgb(0.4, 0.7, 0.4),
  });
  page2.drawText('pdfpb-cli combine report.pdf appendix.pdf --out combined.pdf', {
    x: 64,
    y: p2H - 365,
    size: 10,
    font: courier,
    color: rgb(0.9, 0.85, 0.6),
  });
  page2.drawText('pdfpb-cli extract report.pdf --pages 1,3,5-8 --out highlights.pdf', {
    x: 64,
    y: p2H - 390,
    size: 10,
    font: courier,
    color: rgb(0.9, 0.85, 0.6),
  });
  page2.drawText('pdfpb-cli split   report.pdf --every 10 --out-dir parts/', {
    x: 64,
    y: p2H - 415,
    size: 10,
    font: courier,
    color: rgb(0.9, 0.85, 0.6),
  });

  // --- Page 3: Interactive Forms & Signatures ---
  const page3 = pdfDoc.addPage([595.28, 841.89]);
  const { height: p3H } = page3.getSize();

  page3.drawText('Chapter 2: Interactive Forms & Verification', {
    x: 48,
    y: p3H - 70,
    size: 20,
    font: timesRomanBold,
    color: rgb(0.718, 0.008, 0.157),
  });

  page3.drawText('Fill in interactive fields or author annotations directly on the page', {
    x: 48,
    y: p3H - 95,
    size: 12,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.45),
  });

  // Form mock card
  page3.drawRectangle({
    x: 48,
    y: p3H - 520,
    width: p1W - 96,
    height: 400,
    borderColor: rgb(0.85, 0.85, 0.88),
    borderWidth: 1,
    color: rgb(0.99, 0.99, 1),
  });

  page3.drawText('Customer Project Sign-off Form', {
    x: 68,
    y: p3H - 150,
    size: 15,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.12),
  });

  page3.drawText('Full Name:', { x: 68, y: p3H - 195, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
  page3.drawRectangle({ x: 68, y: p3H - 230, width: 200, height: 26, borderColor: rgb(0.75, 0.75, 0.8), borderWidth: 1, color: rgb(1, 1, 1) });
  page3.drawText('Arthur Pendelton', { x: 76, y: p3H - 218, size: 10, font: helvetica, color: rgb(0.2, 0.2, 0.25) });

  page3.drawText('Organization / Company:', { x: 300, y: p3H - 195, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
  page3.drawRectangle({ x: 300, y: p3H - 230, width: 200, height: 26, borderColor: rgb(0.75, 0.75, 0.8), borderWidth: 1, color: rgb(1, 1, 1) });
  page3.drawText('ArtCraft Creative Guild', { x: 308, y: p3H - 218, size: 10, font: helvetica, color: rgb(0.2, 0.2, 0.25) });

  page3.drawText('Approval Status:', { x: 68, y: p3H - 280, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
  page3.drawRectangle({ x: 68, y: p3H - 315, width: 200, height: 26, borderColor: rgb(0.75, 0.75, 0.8), borderWidth: 1, color: rgb(1, 1, 1) });
  page3.drawText('Approved with notes', { x: 76, y: p3H - 303, size: 10, font: helvetica, color: rgb(0.2, 0.2, 0.25) });

  page3.drawText('Digital Signature:', { x: 68, y: p3H - 370, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
  page3.drawRectangle({ x: 68, y: p3H - 450, width: 432, height: 70, borderColor: rgb(0.718, 0.008, 0.157), borderWidth: 1.5, color: rgb(0.99, 0.98, 0.98) });
  page3.drawText('Arthur Pendelton (Verified SHA-256)', { x: 80, y: p3H - 410, size: 16, font: timesRomanBold, color: rgb(0.718, 0.008, 0.157) });
  page3.drawText('Signed on 2026-11-01 via PDFpb Native Workbench', { x: 80, y: p3H - 435, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.55) });

  // --- Page 4: Organize Pages & Architecture ---
  const page4 = pdfDoc.addPage([595.28, 841.89]);
  const { height: p4H } = page4.getSize();

  page4.drawText('Chapter 3: Organize Pages Like Cards on a Table', {
    x: 48,
    y: p4H - 70,
    size: 20,
    font: timesRomanBold,
    color: rgb(0.718, 0.008, 0.157),
  });

  page4.drawText('Reorder, rotate, split, extract, and combine with zero fidelity loss', {
    x: 48,
    y: p4H - 95,
    size: 12,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.45),
  });

  const organizeFeatures = [
    '- Card Grid View: Zoomable thumbnails with 50% - 150% preview scaling.',
    '- Multi-Page Selection: Click, Shift-click range, Cmd/Ctrl-click individual pages.',
    '- Rotations: Rotate selected pages 90 deg CW, 90 deg CCW, or 180 deg instantly.',
    '- Page Insertion: Insert blank pages (A4 / US Letter) or insert from other files.',
    '- Reordering: Move pages earlier or later with drag-and-drop or toolbar buttons.',
    '- Deep Undo Stack: Every operation is recorded and can be undone with Cmd+Z / Ctrl+Z.',
    '- Atomic Saves: Incremental saves leave original PDF bytes intact.',
  ];

  organizeFeatures.forEach((feat, idx) => {
    page4.drawText(feat, {
      x: 54,
      y: p4H - 145 - idx * 26,
      size: 11,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.24),
    });
  });

  // Table diagram
  page4.drawRectangle({
    x: 48,
    y: p4H - 520,
    width: p1W - 96,
    height: 160,
    borderColor: rgb(0.8, 0.8, 0.85),
    borderWidth: 1,
    color: rgb(0.97, 0.98, 0.99),
  });

  page4.drawText('Engine Layering Architecture', {
    x: 64,
    y: p4H - 390,
    size: 13,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.12),
  });

  const archLayers = [
    'pdfpb-cos: Tolerant parsing, repair, copy-on-write edits',
    'pdfpb-organize: Page operations, combine / extract / split, bookmarks',
    'pdfpb-annot & forms: Comments, appearances, interactive fields',
    'pdfpb-render: Multi-scale tiles, text extraction, reading order',
  ];

  archLayers.forEach((l, idx) => {
    page4.drawText(`[Layer ${idx + 1}]  ${l}`, {
      x: 64,
      y: p4H - 425 - idx * 22,
      size: 9.5,
      font: courier,
      color: rgb(0.25, 0.3, 0.35),
    });
  });

  // --- Page 5: Security & Verification ---
  const page5 = pdfDoc.addPage([595.28, 841.89]);
  const { height: p5H } = page5.getSize();

  page5.drawText('Chapter 4: Security & Permissions', {
    x: 48,
    y: p5H - 70,
    size: 20,
    font: timesRomanBold,
    color: rgb(0.718, 0.008, 0.157),
  });

  page5.drawText('Standard Security Handler & Redaction Tools', {
    x: 48,
    y: p5H - 95,
    size: 12,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.45),
  });

  page5.drawText('This document is verified and encrypted under standard client-side rules.', {
    x: 48,
    y: p5H - 140,
    size: 11,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.24),
  });

  page5.drawText('Permissions:', {
    x: 48,
    y: p5H - 170,
    size: 11,
    font: helveticaBold,
    color: rgb(0.15, 0.15, 0.18),
  });

  const perms = [
    '[x] Printing allowed (High Resolution)',
    '[x] Content copying allowed for accessibility',
    '[x] Document assembly allowed',
    '[x] Commenting and form filling enabled',
  ];

  perms.forEach((perm, idx) => {
    page5.drawText(perm, {
      x: 60,
      y: p5H - 200 - idx * 22,
      size: 10,
      font: helvetica,
      color: rgb(0.1, 0.5, 0.2),
    });
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();

  // Create initial bookmarks
  const bookmarks: BookmarkItem[] = [
    { id: 'b1', title: 'Cover Page', page: 1 },
    {
      id: 'b2',
      title: 'Chapter 1: Expressive Typography',
      page: 2,
      children: [
        { id: 'b2-1', title: 'Code & Automation Listing', page: 2 },
      ],
    },
    { id: 'b3', title: 'Chapter 2: Forms & Verification', page: 3 },
    {
      id: 'b4',
      title: 'Chapter 3: Organize Pages Workbench',
      page: 4,
      children: [
        { id: 'b4-1', title: 'Engine Architecture', page: 4 },
      ],
    },
    { id: 'b5', title: 'Chapter 4: Security & Permissions', page: 5 },
  ];

  // Initial comments matching the README description
  const comments: CommentItem[] = [
    {
      id: 'c1',
      page: 1,
      author: 'Elena Vance',
      text: 'The cover design looks sharp! The ArtCraft crimson header has great contrast.',
      timestamp: '2 hours ago',
      status: 'accepted',
      color: '#b70228',
      position: { x: 50, y: 15 },
      replies: [
        {
          id: 'c1-1',
          author: 'Marcus Brody',
          text: 'Agreed, works well in both light and dark themes.',
          timestamp: '1 hour ago',
        },
      ],
    },
    {
      id: 'c2',
      page: 2,
      author: 'Marcus Brody',
      text: 'Verify reading order of these two text columns when extracted to plaintext.',
      timestamp: '3 hours ago',
      status: 'open',
      color: '#eab308',
      position: { x: 25, y: 22 },
      replies: [],
    },
    {
      id: 'c3',
      page: 3,
      author: 'Sarah Chen',
      text: 'Digital signature verified with SHA-256 certificate hash.',
      timestamp: 'Yesterday',
      status: 'resolved',
      color: '#22c55e',
      position: { x: 45, y: 55 },
      replies: [],
    },
  ];

  // Initial annotations
  const annotations: any[] = [
    {
      id: 'a1',
      page: 2,
      type: 'highlight',
      color: '#fef08a',
      opacity: 0.45,
      rect: { x: 8, y: 8, width: 50, height: 3 },
    },
    {
      id: 'a2',
      page: 3,
      type: 'stamp',
      color: '#b70228',
      stampType: 'APPROVED',
      rect: { x: 72, y: 14, width: 22, height: 7 },
    },
  ];

  // Initial form fields
  const formFields: FormFieldItem[] = [
    {
      id: 'f1',
      name: 'full_name',
      page: 3,
      type: 'text',
      label: 'Full Name',
      value: 'Arthur Pendelton',
      rect: { x: 11.5, y: 25.5, width: 33.6, height: 3.2 },
    },
    {
      id: 'f2',
      name: 'company',
      page: 3,
      type: 'text',
      label: 'Organization',
      value: 'ArtCraft Creative Guild',
      rect: { x: 50.4, y: 25.5, width: 33.6, height: 3.2 },
    },
    {
      id: 'f3',
      name: 'approval_status',
      page: 3,
      type: 'dropdown',
      label: 'Approval Status',
      value: 'Approved with notes',
      options: ['Approved', 'Approved with notes', 'Changes Requested', 'Pending Review'],
      rect: { x: 11.5, y: 35.5, width: 33.6, height: 3.2 },
    },
    {
      id: 'f4',
      name: 'terms_confirmed',
      page: 3,
      type: 'checkbox',
      label: 'I confirm the project specifications',
      value: true,
      rect: { x: 11.5, y: 41, width: 3, height: 3 },
    },
    {
      id: 'f5',
      name: 'signature',
      page: 3,
      type: 'signature',
      label: 'Digital Signature',
      value: 'Arthur Pendelton',
      rect: { x: 11.5, y: 47, width: 72.5, height: 8.5 },
    },
  ];

  // Layers
  const layers: LayerItem[] = [
    { id: 'l1', name: 'Document Body', visible: true, description: 'Core text and vector artwork' },
    { id: 'l2', name: 'Draft Watermark', visible: false, description: 'Optional DRAFT overlay pattern' },
    { id: 'l3', name: 'Print-Only Notes', visible: true, description: 'Marginal notes included in prints' },
  ];

  // Attachments
  const attachments: AttachmentItem[] = [
    { id: 'att1', name: 'showcase-data.json', size: 4096, type: 'application/json', date: '2026-11-01' },
    { id: 'att2', name: 'artcraft-palette.aco', size: 12288, type: 'application/octet-stream', date: '2026-11-01' },
  ];

  const metadata: DocumentMetadata = {
    title: 'PDFpb Showcase',
    author: 'PDFpb',
    subject: 'PDF Workbench Showcase & Specimen',
    keywords: 'PDFpb, PDF editor, Organize, Annotations, Forms',
    creator: 'PDFpb Native Engine v0.8.0',
    producer: 'PDFpb',
    creationDate: '2026-11-01',
    modificationDate: '2026-11-01',
    pdfVersion: '1.7',
    pageSize: 'A4 (595.28 × 841.89 pt)',
    isEncrypted: false,
    permissions: [
      'Print: High Resolution',
      'Copy: Allowed',
      'Modify: Allowed',
      'Annotations: Allowed',
      'Form Fill: Allowed',
    ],
    fonts: ['Helvetica', 'Helvetica-Bold', 'Times-Roman', 'Times-Bold', 'Courier'],
  };

  return {
    id: 'doc-showcase',
    name: 'PDFpb Showcase.pdf',
    data: pdfBytes,
    pageCount: 5,
    currentPage: 1,
    zoom: 1.0,
    rotation: 0,
    pageRotations: {},
    selectedPages: [1],
    isDirty: false,
    metadata,
    bookmarks,
    comments,
    annotations,
    formFields,
    layers,
    attachments,
  };
}

/**
 * Loads a user uploaded PDF file into a PdfDocument model
 */
export async function loadPdfFromFile(file: File): Promise<PdfDocument> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Parse with pdf-lib to get page count and info
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = pdfDoc.getPageCount();

  const title = pdfDoc.getTitle() || file.name.replace(/\.pdf$/i, '');
  const author = pdfDoc.getAuthor() || 'Unknown';
  const subject = pdfDoc.getSubject() || '';
  const keywords = pdfDoc.getKeywords() || '';
  const creator = pdfDoc.getCreator() || 'PDFpb';
  const producer = pdfDoc.getProducer() || 'PDFpb';

  const metadata: DocumentMetadata = {
    title,
    author,
    subject,
    keywords,
    creator,
    producer,
    creationDate: pdfDoc.getCreationDate()?.toLocaleDateString() || new Date().toLocaleDateString(),
    modificationDate: pdfDoc.getModificationDate()?.toLocaleDateString() || new Date().toLocaleDateString(),
    pdfVersion: '1.7',
    pageSize: 'Standard',
    isEncrypted: false,
    permissions: ['Print', 'Copy', 'Modify', 'Annotations'],
    fonts: ['Embedded PDF Fonts'],
  };

  // Generate basic bookmarks
  const bookmarks: BookmarkItem[] = [];
  for (let i = 1; i <= Math.min(pageCount, 12); i++) {
    bookmarks.push({
      id: `b-${i}`,
      title: `Page ${i}`,
      page: i,
    });
  }

  return {
    id: `doc-${Date.now()}`,
    name: file.name,
    data: bytes,
    pageCount,
    currentPage: 1,
    zoom: 1.0,
    rotation: 0,
    pageRotations: {},
    selectedPages: [1],
    isDirty: false,
    metadata,
    bookmarks,
    comments: [],
    annotations: [],
    formFields: [],
    layers: [{ id: 'l1', name: 'Document Content', visible: true }],
    attachments: [],
  };
}

/**
 * Rotate specific pages in the PDF document
 */
export async function rotatePdfPages(
  docBytes: Uint8Array,
  pagesToRotate: number[], // 1-indexed
  angleDelta: number // e.g. 90 or -90
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(docBytes);
  const total = pdfDoc.getPageCount();

  for (const pageNum of pagesToRotate) {
    if (pageNum >= 1 && pageNum <= total) {
      const page = pdfDoc.getPage(pageNum - 1);
      const currentAngle = page.getRotation().angle;
      const newAngle = ((currentAngle + angleDelta) % 360 + 360) % 360;
      page.setRotation(degrees(newAngle));
    }
  }

  return await pdfDoc.save();
}

/**
 * Delete selected pages from the PDF document
 */
export async function deletePdfPages(
  docBytes: Uint8Array,
  pagesToDelete: number[] // 1-indexed
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(docBytes);
  const total = pdfDoc.getPageCount();

  // Sort descending so indices don't shift during removal
  const sorted = [...new Set(pagesToDelete)]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => b - a);

  if (sorted.length >= total) {
    throw new Error('Cannot delete all pages in a document. At least one page must remain.');
  }

  for (const p of sorted) {
    pdfDoc.removePage(p - 1);
  }

  return await pdfDoc.save();
}

/**
 * Reorder pages in the PDF document
 */
export async function reorderPdfPages(
  docBytes: Uint8Array,
  newOrder: number[] // 1-indexed array of page positions
): Promise<Uint8Array> {
  const sourceDoc = await PDFDocument.load(docBytes);
  const newDoc = await PDFDocument.create();

  // 0-indexed indices for copying
  const indices = newOrder.map((p) => p - 1);
  const copiedPages = await newDoc.copyPages(sourceDoc, indices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  return await newDoc.save();
}

/**
 * Insert a blank page into the PDF document
 */
export async function insertBlankPdfPage(
  docBytes: Uint8Array,
  insertAtIndex: number, // 0 to pageCount
  width = 595.28,
  height = 841.89
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(docBytes);
  const clampedIndex = Math.max(0, Math.min(insertAtIndex, pdfDoc.getPageCount()));
  pdfDoc.insertPage(clampedIndex, [width, height]);
  return await pdfDoc.save();
}

/**
 * Duplicate a specific page in the PDF
 */
export async function duplicatePdfPage(
  docBytes: Uint8Array,
  pageNumber: number // 1-indexed
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(docBytes);
  const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
  pdfDoc.insertPage(pageNumber, copiedPage);
  return await pdfDoc.save();
}

/**
 * Extract selected pages into a new standalone PDF
 */
export async function extractPdfPages(
  docBytes: Uint8Array,
  selectedPages: number[] // 1-indexed
): Promise<Uint8Array> {
  const sourceDoc = await PDFDocument.load(docBytes);
  const newDoc = await PDFDocument.create();

  const sortedPages = [...new Set(selectedPages)]
    .filter((p) => p >= 1 && p <= sourceDoc.getPageCount())
    .sort((a, b) => a - b);

  if (sortedPages.length === 0) {
    throw new Error('No pages selected to extract.');
  }

  const indices = sortedPages.map((p) => p - 1);
  const copiedPages = await newDoc.copyPages(sourceDoc, indices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  return await newDoc.save();
}

/**
 * Split document into multiple PDF byte arrays
 */
export async function splitPdf(
  docBytes: Uint8Array,
  mode: 'every' | 'selected',
  nOrPages: number | number[]
): Promise<Array<{ name: string; bytes: Uint8Array; pageCount: number }>> {
  const sourceDoc = await PDFDocument.load(docBytes);
  const total = sourceDoc.getPageCount();
  const results: Array<{ name: string; bytes: Uint8Array; pageCount: number }> = [];

  if (mode === 'every') {
    const everyN = typeof nOrPages === 'number' && nOrPages > 0 ? nOrPages : 1;
    let partNum = 1;

    for (let start = 0; start < total; start += everyN) {
      const end = Math.min(start + everyN, total);
      const subDoc = await PDFDocument.create();
      const pageIndices = [];
      for (let p = start; p < end; p++) pageIndices.push(p);

      const copied = await subDoc.copyPages(sourceDoc, pageIndices);
      for (const cp of copied) subDoc.addPage(cp);

      const bytes = await subDoc.save();
      results.push({
        name: `Part ${partNum} (Pages ${start + 1}-${end}).pdf`,
        bytes,
        pageCount: copied.length,
      });
      partNum++;
    }
  } else {
    // Mode selected
    const selected = (Array.isArray(nOrPages) ? nOrPages : [1])
      .filter((p) => p >= 1 && p <= total)
      .sort((a, b) => a - b);

    // Split into Part 1 (selected) and Part 2 (remaining)
    const subDoc1 = await PDFDocument.create();
    const copied1 = await subDoc1.copyPages(sourceDoc, selected.map((p) => p - 1));
    for (const cp of copied1) subDoc1.addPage(cp);
    const bytes1 = await subDoc1.save();
    results.push({
      name: `Selected Pages (${selected.join(',')}).pdf`,
      bytes: bytes1,
      pageCount: copied1.length,
    });

    const remaining = [];
    for (let i = 1; i <= total; i++) {
      if (!selected.includes(i)) remaining.push(i);
    }
    if (remaining.length > 0) {
      const subDoc2 = await PDFDocument.create();
      const copied2 = await subDoc2.copyPages(sourceDoc, remaining.map((p) => p - 1));
      for (const cp of copied2) subDoc2.addPage(cp);
      const bytes2 = await subDoc2.save();
      results.push({
        name: `Remaining Pages (${remaining.length} pages).pdf`,
        bytes: bytes2,
        pageCount: copied2.length,
      });
    }
  }

  return results;
}

/**
 * Combine / merge multiple PDFs into one
 */
export async function combinePdfFiles(
  documents: Array<{ name: string; bytes: Uint8Array }>
): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();

  for (const docInfo of documents) {
    const srcDoc = await PDFDocument.load(docInfo.bytes, { ignoreEncryption: true });
    const indices = [];
    for (let i = 0; i < srcDoc.getPageCount(); i++) indices.push(i);

    const copiedPages = await mergedDoc.copyPages(srcDoc, indices);
    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  return await mergedDoc.save();
}

/**
 * Trigger file download in browser
 */
export function downloadPdfBytes(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Creates a brand new document from scratch (blank page or pre-designed form template)
 */
export async function createNewBlankDocument(
  title = 'Novo Formulário',
  templateType: 'blank' | 'registration' | 'service_order' | 'consent_agreement' = 'blank'
): Promise<PdfDocument> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width: pW, height: pH } = page.getSize();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  let initialFields: FormFieldItem[] = [];

  // Header band
  page.drawRectangle({
    x: 0,
    y: pH - 70,
    width: pW,
    height: 70,
    color: rgb(0.718, 0.008, 0.157), // #b70228
  });

  if (templateType === 'blank') {
    page.drawText(title, {
      x: 40,
      y: pH - 45,
      size: 22,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('Documento criado a partir do zero no PDFpb', {
      x: 40,
      y: pH - 60,
      size: 10,
      font: helvetica,
      color: rgb(0.9, 0.85, 0.88),
    });

    // Subtle canvas grid guideline box
    page.drawRectangle({
      x: 40,
      y: 40,
      width: pW - 80,
      height: pH - 130,
      borderColor: rgb(0.88, 0.88, 0.9),
      borderWidth: 1,
      color: rgb(0.99, 0.99, 1),
    });

    page.drawText('Adicione campos de formulario arrastando ou clicando na barra de ferramentas.', {
      x: 60,
      y: pH - 110,
      size: 11,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.55),
    });
  } else if (templateType === 'registration') {
    page.drawText('Ficha de Cadastro de Cliente', {
      x: 40,
      y: pH - 45,
      size: 22,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    page.drawText('PDFpb Form Builder - Preenchimento Cadastral', {
      x: 40,
      y: pH - 60,
      size: 10,
      font: helvetica,
      color: rgb(0.9, 0.85, 0.88),
    });

    // Form card section 1: Dados Pessoais
    page.drawText('1. Identificacao do Cliente', { x: 40, y: pH - 100, size: 13, font: helveticaBold, color: rgb(0.15, 0.15, 0.18) });

    page.drawText('Nome Completo:', { x: 40, y: pH - 130, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('CPF / CNPJ:', { x: 380, y: pH - 130, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });

    page.drawText('E-mail Principal:', { x: 40, y: pH - 195, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Telefone / WhatsApp:', { x: 380, y: pH - 195, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });

    page.drawText('Cidade / Estado:', { x: 40, y: pH - 260, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Genero:', { x: 380, y: pH - 260, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });

    page.drawText('Observacoes adicionais:', { x: 40, y: pH - 340, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });

    page.drawText('Assinatura do Titular:', { x: 40, y: pH - 490, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Data:', { x: 380, y: pH - 490, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });

    initialFields = [
      {
        id: 'f-reg-1',
        name: 'nome_completo',
        page: 1,
        type: 'text',
        label: 'Nome Completo',
        placeholder: 'Digite seu nome completo',
        value: '',
        required: true,
        rect: { x: 6.7, y: 16.5, width: 54, height: 3.5 },
      },
      {
        id: 'f-reg-2',
        name: 'cpf_cnpj',
        page: 1,
        type: 'text',
        label: 'CPF / CNPJ',
        placeholder: '000.000.000-00',
        value: '',
        required: true,
        rect: { x: 63.8, y: 16.5, width: 29.5, height: 3.5 },
      },
      {
        id: 'f-reg-3',
        name: 'email',
        page: 1,
        type: 'text',
        label: 'E-mail',
        placeholder: 'cliente@exemplo.com.br',
        value: '',
        required: true,
        rect: { x: 6.7, y: 24.2, width: 54, height: 3.5 },
      },
      {
        id: 'f-reg-4',
        name: 'telefone',
        page: 1,
        type: 'text',
        label: 'Telefone',
        placeholder: '(11) 90000-0000',
        value: '',
        rect: { x: 63.8, y: 24.2, width: 29.5, height: 3.5 },
      },
      {
        id: 'f-reg-5',
        name: 'cidade_estado',
        page: 1,
        type: 'text',
        label: 'Cidade / Estado',
        placeholder: 'Sao Paulo - SP',
        value: '',
        rect: { x: 6.7, y: 32, width: 54, height: 3.5 },
      },
      {
        id: 'f-reg-6',
        name: 'genero',
        page: 1,
        type: 'dropdown',
        label: 'Genero',
        value: 'Prefiro nao informar',
        options: ['Feminino', 'Masculino', 'Nao-binario', 'Outro', 'Prefiro nao informar'],
        rect: { x: 63.8, y: 32, width: 29.5, height: 3.5 },
      },
      {
        id: 'f-reg-7',
        name: 'aceita_comunicacao',
        page: 1,
        type: 'checkbox',
        label: 'Autorizo envio de comunicacoes e notificacoes',
        value: true,
        rect: { x: 6.7, y: 37.5, width: 3, height: 2.5 },
      },
      {
        id: 'f-reg-8',
        name: 'observacoes',
        page: 1,
        type: 'textarea',
        label: 'Observacoes',
        placeholder: 'Informacoes complementares ou instrucoes especiais...',
        value: '',
        rect: { x: 6.7, y: 42.5, width: 86.6, height: 11 },
      },
      {
        id: 'f-reg-9',
        name: 'assinatura_cliente',
        page: 1,
        type: 'signature',
        label: 'Assinatura',
        value: '',
        required: true,
        rect: { x: 6.7, y: 60, width: 54, height: 6.5 },
      },
      {
        id: 'f-reg-10',
        name: 'data_cadastro',
        page: 1,
        type: 'date',
        label: 'Data',
        value: new Date().toISOString().split('T')[0],
        rect: { x: 63.8, y: 60, width: 29.5, height: 4 },
      },
    ];
  } else if (templateType === 'service_order') {
    page.drawText('Ordem de Servico e Faturamento', {
      x: 40,
      y: pH - 45,
      size: 22,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    page.drawText('PDFpb OS Workbench - Controle Tecnico', {
      x: 40,
      y: pH - 60,
      size: 10,
      font: helvetica,
      color: rgb(0.9, 0.85, 0.88),
    });

    page.drawText('Cliente / Razao Social:', { x: 40, y: pH - 120, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Tipo de Servico:', { x: 380, y: pH - 120, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Descricao dos Servicos Executados:', { x: 40, y: pH - 200, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Valor Total (R$):', { x: 40, y: pH - 380, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Assinatura do Responsavel Tecnico:', { x: 40, y: pH - 460, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });

    initialFields = [
      {
        id: 'f-os-1',
        name: 'cliente_os',
        page: 1,
        type: 'text',
        label: 'Cliente',
        placeholder: 'Razao social ou cliente',
        value: '',
        rect: { x: 6.7, y: 15.5, width: 54, height: 3.5 },
      },
      {
        id: 'f-os-2',
        name: 'tipo_servico',
        page: 1,
        type: 'dropdown',
        label: 'Tipo de Servico',
        value: 'Manutencao Preventiva',
        options: ['Manutencao Preventiva', 'Instalacao de Equipamentos', 'Consultoria Tecnica', 'Reparo Emergencial'],
        rect: { x: 63.8, y: 15.5, width: 29.5, height: 3.5 },
      },
      {
        id: 'f-os-3',
        name: 'descricao_os',
        page: 1,
        type: 'textarea',
        label: 'Descricao do Servico',
        placeholder: 'Detalhes dos servicos e pecas utilizadas...',
        value: '',
        rect: { x: 6.7, y: 25, width: 86.6, height: 16 },
      },
      {
        id: 'f-os-4',
        name: 'valor_total',
        page: 1,
        type: 'text',
        label: 'Valor Total',
        placeholder: 'R$ 0,00',
        value: 'R$ 450,00',
        rect: { x: 6.7, y: 46.5, width: 35, height: 3.5 },
      },
      {
        id: 'f-os-5',
        name: 'servico_aprovado',
        page: 1,
        type: 'checkbox',
        label: 'Servico executado e aprovado em conformidade',
        value: true,
        rect: { x: 6.7, y: 51.5, width: 3, height: 2.5 },
      },
      {
        id: 'f-os-6',
        name: 'assinatura_tecnico',
        page: 1,
        type: 'signature',
        label: 'Assinatura Tecnico',
        value: '',
        rect: { x: 6.7, y: 56.5, width: 54, height: 6.5 },
      },
    ];
  } else if (templateType === 'consent_agreement') {
    page.drawText('Termo de Consentimento e Acordo', {
      x: 40,
      y: pH - 45,
      size: 22,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    page.drawText('PDFpb Digital Consent - Validacao Juridica', {
      x: 40,
      y: pH - 60,
      size: 10,
      font: helvetica,
      color: rgb(0.9, 0.85, 0.88),
    });

    page.drawText('Declarante / Titular:', { x: 40, y: pH - 110, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Documento RG / CPF:', { x: 380, y: pH - 110, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });

    const termsLines = [
      'Por meio deste instrumento, o Declarante expressa seu consentimento livre,',
      'informado e inequivoco para os fins especificos declarados neste documento.',
      'Fica assegurada a privacidade e o tratamento restrito dos dados coletados,',
      'em integral conformidade com as legislacoes aplicaveis de protecao de dados.',
    ];
    termsLines.forEach((l, i) => {
      page.drawText(l, { x: 40, y: pH - 190 - i * 18, size: 11, font: timesRoman, color: rgb(0.2, 0.2, 0.25) });
    });

    page.drawText('Assinatura Eletronica:', { x: 40, y: pH - 340, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });
    page.drawText('Data de Validacao:', { x: 380, y: pH - 340, size: 10, font: helveticaBold, color: rgb(0.3, 0.3, 0.35) });

    initialFields = [
      {
        id: 'f-trm-1',
        name: 'nome_declarante',
        page: 1,
        type: 'text',
        label: 'Nome do Declarante',
        placeholder: 'Nome completo',
        value: '',
        rect: { x: 6.7, y: 14.5, width: 54, height: 3.5 },
      },
      {
        id: 'f-trm-2',
        name: 'doc_declarante',
        page: 1,
        type: 'text',
        label: 'Documento',
        placeholder: '000.000.000-00',
        value: '',
        rect: { x: 63.8, y: 14.5, width: 29.5, height: 3.5 },
      },
      {
        id: 'f-trm-3',
        name: 'aceito_integral',
        page: 1,
        type: 'checkbox',
        label: 'Declaro que li, compreendi e concordo integralmente com os termos',
        value: true,
        rect: { x: 6.7, y: 32, width: 3, height: 2.5 },
      },
      {
        id: 'f-trm-4',
        name: 'assinatura_termo',
        page: 1,
        type: 'signature',
        label: 'Assinatura',
        value: '',
        rect: { x: 6.7, y: 42, width: 54, height: 6.5 },
      },
      {
        id: 'f-trm-5',
        name: 'data_termo',
        page: 1,
        type: 'date',
        label: 'Data',
        value: new Date().toISOString().split('T')[0],
        rect: { x: 63.8, y: 42, width: 29.5, height: 4 },
      },
    ];
  }

  const pdfBytes = await pdfDoc.save();

  const metadata: DocumentMetadata = {
    title,
    author: 'PDFpb Form Builder',
    subject: 'Formulário Criado no PDFpb',
    keywords: 'PDFpb, Formulario, AcroForm, Interativo',
    creator: 'PDFpb Form Studio',
    producer: 'PDFpb Native Engine',
    creationDate: new Date().toLocaleDateString('pt-BR'),
    modificationDate: new Date().toLocaleDateString('pt-BR'),
    pdfVersion: '1.7',
    pageSize: 'A4 (595.28 x 841.89 pt)',
    isEncrypted: false,
    permissions: ['Impressao', 'Preenchimento de Formulario', 'Assinatura'],
    fonts: ['Helvetica', 'Helvetica-Bold', 'Times-Roman', 'Times-Bold'],
  };

  return {
    id: `doc-${Date.now()}`,
    name: `${title}.pdf`,
    data: pdfBytes,
    pageCount: 1,
    currentPage: 1,
    zoom: 1.0,
    rotation: 0,
    pageRotations: {},
    selectedPages: [1],
    isDirty: true,
    metadata,
    bookmarks: [{ id: 'b1', title: title, page: 1 }],
    comments: [],
    annotations: [],
    formFields: initialFields,
    layers: [{ id: 'l1', name: 'Campos do Formulario', visible: true }],
    attachments: [],
  };
}

/**
 * Embeds actual native AcroForm fields into any PDF bytes
 */
export async function bakeFormFieldsIntoPdf(
  docBytes: Uint8Array,
  fields: FormFieldItem[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(docBytes);
  const form = pdfDoc.getForm();

  for (const field of fields) {
    const pageIndex = Math.max(0, Math.min(field.page - 1, pdfDoc.getPageCount() - 1));
    const page = pdfDoc.getPage(pageIndex);
    const { width: pW, height: pH } = page.getSize();

    const x = (field.rect.x / 100) * pW;
    const y = pH - ((field.rect.y + field.rect.height) / 100) * pH;
    const width = (field.rect.width / 100) * pW;
    const height = (field.rect.height / 100) * pH;

    try {
      if (field.type === 'text' || field.type === 'date') {
        let tf: any;
        try {
          tf = form.getTextField(field.name);
        } catch {
          tf = form.createTextField(field.name);
          tf.addToPage(page, { x, y, width, height });
        }
        if (typeof field.value === 'string' && field.value) {
          tf.setText(field.value);
        }
      } else if (field.type === 'textarea') {
        let tf: any;
        try {
          tf = form.getTextField(field.name);
        } catch {
          tf = form.createTextField(field.name);
          tf.enableMultiline();
          tf.addToPage(page, { x, y, width, height });
        }
        if (typeof field.value === 'string' && field.value) {
          tf.setText(field.value);
        }
      } else if (field.type === 'checkbox') {
        let cb: any;
        try {
          cb = form.getCheckBox(field.name);
        } catch {
          cb = form.createCheckBox(field.name);
          cb.addToPage(page, { x, y, width, height });
        }
        if (field.value === true) {
          cb.check();
        } else {
          cb.uncheck();
        }
      } else if (field.type === 'dropdown') {
        let dd: any;
        try {
          dd = form.getDropdown(field.name);
        } catch {
          dd = form.createDropdown(field.name);
          if (field.options && field.options.length > 0) {
            dd.setOptions(field.options);
          }
          dd.addToPage(page, { x, y, width, height });
        }
        if (typeof field.value === 'string' && field.value) {
          dd.select(field.value);
        }
      } else if (field.type === 'signature') {
        let sf: any;
        try {
          sf = form.getTextField(field.name);
        } catch {
          sf = form.createTextField(field.name);
          sf.addToPage(page, { x, y, width, height });
        }
        if (typeof field.value === 'string' && field.value) {
          sf.setText(field.value);
        }
      }
    } catch (e) {
      console.warn(`AcroForm field binding notice for ${field.name}:`, e);
    }
  }

  return await pdfDoc.save();
}

