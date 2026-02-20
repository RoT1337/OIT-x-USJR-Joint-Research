export type ResearchCategory = "Rectenna" | "MPPT" | "AI" | "Meeting" | "Other";

export type Affiliation = "USJR" | "OIT";

export interface LogImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface LogAttachment {
  id: number;
  file_url: string | null;
  download_url?: string;
  uploaded_at: string;
}

export interface LogEntry {
  id: number;
  date: string;

  title: string;
  titleJP?: string;

  category: ResearchCategory;
  affiliation: Affiliation;
  categories?: ResearchCategory[];
  affiliations?: Affiliation[];

  authorName?: string;

  content: string;
  contentJP?: string;

  details?: string;
  detailsJP?: string;

  images?: LogImage[];

  attachments?: LogAttachment[];
}