import type { ISODateString } from "./common.js";

export type DataSource = "openalex" | "semanticscholar" | "crossref" | "arxiv";

export interface PaperAuthorRef {
  authorId?: string;
  displayName: string;
  position: number;
  affiliation?: string;
}

export interface PaperKeyword {
  term: string;
  score?: number; // confidence/weight when extracted by AI
}

export interface Paper {
  id: string;
  externalIds: {
    doi?: string;
    openalexId?: string;
    semanticScholarId?: string;
    arxivId?: string;
    pubmedId?: string;
  };
  title: string;
  abstract?: string;
  authors: PaperAuthorRef[];
  journalId?: string;
  journalName?: string;
  publicationYear: number;
  publicationDate?: ISODateString;
  type?: "article" | "proceedings" | "preprint" | "review" | "book-chapter" | "other";
  language?: string;
  citationCount: number;
  referenceCount?: number;
  keywords: PaperKeyword[];
  topics?: string[];
  openAccessUrl?: string;
  pdfUrl?: string;
  isOpenAccess: boolean;
  source: DataSource;
  hasEmbedding: boolean;
  aiScore?: PaperAiScore;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PaperAiScore {
  relevanceScore: number;          // 0..1 — vs the user's query
  semanticSimilarityScore: number; // 0..1 — vector similarity
  trendAlignmentScore: number;     // 0..1 — does it match a rising topic
  metadataQualityScore: number;    // 0..1 — completeness
  recencyScore: number;            // 0..1 — newer = higher
  researchGapScore: number;        // 0..1 — does it expose a gap
  finalScore: number;              // 0..1 — weighted blend
  modelVersion: string;
  computedAt: ISODateString;
}

export type PaperSummary = Pick<
  Paper,
  | "id"
  | "title"
  | "authors"
  | "publicationYear"
  | "journalName"
  | "citationCount"
  | "isOpenAccess"
  | "aiScore"
>;
