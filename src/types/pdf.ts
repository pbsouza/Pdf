export interface BookmarkItem {
  id: string;
  title: string;
  page: number; // 1-indexed
  children?: BookmarkItem[];
}

export interface CommentItem {
  id: string;
  page: number;
  author: string;
  text: string;
  timestamp: string;
  status: 'open' | 'accepted' | 'resolved';
  color?: string;
  replies?: Array<{
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }>;
  position?: { x: number; y: number }; // Percentage 0-100 of page
}

export interface AnnotationItem {
  id: string;
  page: number;
  type: 'highlight' | 'draw' | 'text' | 'rect' | 'circle' | 'arrow' | 'stamp' | 'redact';
  color: string;
  opacity?: number;
  strokeWidth?: number;
  points?: Array<{ x: number; y: number }>; // For freehand drawing (percentage 0-100)
  rect?: { x: number; y: number; width: number; height: number }; // Percentage
  text?: string;
  stampType?: 'APPROVED' | 'DRAFT' | 'CONFIDENTIAL' | 'REVIEWED' | 'VOID';
}

export type FormFieldType = 'text' | 'textarea' | 'checkbox' | 'radio' | 'dropdown' | 'signature' | 'date';

export interface FormFieldItem {
  id: string;
  name: string;
  page: number;
  type: FormFieldType;
  label: string;
  value: string | boolean;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  groupName?: string;
  fontSize?: number;
  rect: { x: number; y: number; width: number; height: number }; // Percentage 0-100
  readOnly?: boolean;
}

export interface LayerItem {
  id: string;
  name: string;
  visible: boolean;
  description?: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: number;
  type: string;
  date: string;
}

export interface DocumentMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  pdfVersion: string;
  pageSize: string;
  isEncrypted: boolean;
  encryptionMethod?: string;
  permissions?: string[];
  fonts?: string[];
}

export interface PdfDocument {
  id: string;
  name: string;
  data: Uint8Array;
  pageCount: number;
  currentPage: number;
  zoom: number; // e.g. 1.0 = 100%
  rotation: number; // 0, 90, 180, 270
  pageRotations: Record<number, number>; // pageIndex -> rotation angle
  selectedPages: number[]; // 1-indexed page numbers
  isDirty: boolean;
  metadata: DocumentMetadata;
  bookmarks: BookmarkItem[];
  comments: CommentItem[];
  annotations: AnnotationItem[];
  formFields: FormFieldItem[];
  layers: LayerItem[];
  attachments: AttachmentItem[];
}

export type ViewMode = 'continuous' | 'single' | 'twoup' | 'organize';
export type SidebarTab = 'pages' | 'bookmarks' | 'comments' | 'forms' | 'layers' | 'properties' | null;
export type ActiveTool = 
  | 'select' 
  | 'hand' 
  | 'highlight' 
  | 'note' 
  | 'draw' 
  | 'text' 
  | 'shape' 
  | 'stamp' 
  | 'redact' 
  | 'form_fill' 
  | 'sign';

export interface HistoryAction {
  description: string;
  undo: () => void;
  redo: () => void;
}
