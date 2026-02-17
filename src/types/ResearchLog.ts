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
  content: string;
  category: ResearchLogCategory;
  affiliation: ResearchLogAffiliation;
  created_at: string;
  updated_at: string;
  attachments?: ResearchAttachment[];
}
