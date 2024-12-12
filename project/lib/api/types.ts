export type SummaryType = "tldr" | "summary" | "full";

export interface ArticleResult {
  tldr?: string;
  summary?: string;
  fullText?: string;
}