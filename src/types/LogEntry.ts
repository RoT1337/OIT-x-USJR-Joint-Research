export interface LogEntry {
    id: number;
    date: string;
    title: string;
    category: "Rectenna" | "MPPT" | "AI" | "Meeting";
    author: "USJR" | "OIT"
    content: string;
}