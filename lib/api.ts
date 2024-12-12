export type SummaryType = "tldr" | "summary" | "full";

export interface ArticleResult {
  tldr?: string;
  summary?: string;
  fullText?: string;
}

export async function fetchArticleSummary(url: string, type: SummaryType): Promise<string> {
  const encodedUrl = encodeURIComponent(url);
  const endpoint = getEndpoint(type, encodedUrl);
  
  const response = await fetch(endpoint);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  return response.text();
}

function getEndpoint(type: SummaryType, encodedUrl: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/https:\/\/.*?ngrok\.io/, "") || "";
  
  const endpoints = {
    tldr: `/generate_tldr/${encodedUrl}`,
    summary: `/generate_summery/${encodedUrl}`,
    full: `/generate_text/${encodedUrl}`,
  };

  return `${baseUrl}${endpoints[type]}`;
}