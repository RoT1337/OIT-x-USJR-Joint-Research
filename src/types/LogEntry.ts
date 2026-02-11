export type ResearchCategory = "Rectenna" | "MPPT" | "AI" | "Meeting";

export type Affiliation = "USJR" | "OIT";

export interface LogEntry {
    id: number;
    date: string;
    title: string;
    category: ResearchCategory;
    affiliation: Affiliation;
    authorName?: string;
    content: string;
    details?: string;
}