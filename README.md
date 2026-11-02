# PdfCraft (React Edition)

> The PDF workbench; an open-source, modern PDF reader and editor rewritten as a high-performance React + TypeScript application.

Read, organize, combine, split, annotate, fill forms, and secure PDFs in a fast, private web workbench.

## Highlights

- **Faithful**: High-resolution canvas rendering, deep zoom (50% to 300%), and support for multi-column layouts and typographic details.
- **Fearless**: Deep undo/redo history stack (⌘Z / ⌘⇧Z), atomic saves, and incremental non-destructive edits.
- **Yours**: 100% private in-browser processing with zero telemetry and no accounts required.

## Features

- **Organize Pages Workbench**: Visual cards-on-a-table grid to reorder, rotate (90° CW/CCW), duplicate, delete, and insert blank pages.
- **Combine & Split**:
  - Merge multiple PDF documents with custom ordering.
  - Split document every N pages or split by selected pages.
  - Extract chosen pages into standalone PDF documents.
- **Reading Modes**:
  - Continuous scroll
  - Single page view
  - Two-up facing pages (Read Mode)
  - Distraction-free full reading view
- **Search & Navigation**:
  - Find as you type with match counting ("match 1 of 6") and step navigation (Enter / Shift+Enter / ⌘G).
  - Searchable bookmarks tree with parent-child hierarchy.
  - Page thumbnails with adjustable zoom slider (50% - 150%).
- **Markup & Review Tools**:
  - Text and area highlighting
  - Threaded conversation comments with status badges (Open, Accepted, Resolved) and inline replies
  - Freehand vector ink drawing
  - Text box callouts
  - Document stamps (APPROVED, DRAFT, CONFIDENTIAL, REVIEWED)
  - Redaction tool
- **Interactive Forms & Signatures**:
  - Live form filling for text fields, checkboxes, and dropdown lists
  - Clear Form feature
  - Digital signature verification and placement
- **Security & Inspection**:
  - AES-256 password protection (User & Owner passwords with print/copy permissions)
  - Document properties inspection (Title, Author, Subject, Keywords, Fonts, Permissions, Attachments)
  - Optional Content & Layers switcher (e.g. Draft watermarks, background graphics)
- **Command Palette & Catalogue**:
  - Instant ⌘K / Ctrl+K fuzzy command palette
  - Visual All Tools catalogue

## Development

```bash
npm install
npm run dev
npm run build
```
