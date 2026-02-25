export type ResearchLogCategory = "Rectenna" | "MPPT" | "AI" | "Meeting" | "Other";

export type ResearchLogAffiliation = "USJR" | "OIT";

export interface ResearchAttachment {
  id: number;
  file_url: string | null;
  download_url?: string;
  uploaded_at: string;
}

export interface ResearchLog {
  id: number;
  title: string;
  translated_title?: string | null;
  content: string;
  translated_content?: string | null;
  translated_language?: string | null;
  category: ResearchLogCategory;
  affiliation: ResearchLogAffiliation;
  categories?: ResearchLogCategory[];
  affiliations?: ResearchLogAffiliation[];
  created_by_name?: string;
  created_by_email?: string;
  created_at: string;
  updated_at: string;
  attachments?: ResearchAttachment[];
}
