import { ENDPOINTS } from "../constants";
import { buildEndpoint } from "../config";
import { fetchWithHeaders } from "./fetch";
import type { SummaryType, ArticleResult } from "./types";

export async function fetchArticleSummary(url: string, type: SummaryType): Promise<string> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const path = ENDPOINTS[type](encodedUrl);
    const endpoint = buildEndpoint(path);
    
    const response = await fetchWithHeaders(endpoint);
    return response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${type}: ${error.message}`);
    }
    throw new Error(`Failed to fetch ${type}`);
  }
}

export function updateArticleResult(
  prevResult: ArticleResult,
  type: SummaryType,
  data: string
): ArticleResult {
  const resultKey = type === "tldr" ? "tldr" : type === "summary" ? "summary" : "fullText";
  return {
    ...prevResult,
    [resultKey]: data
  };
}