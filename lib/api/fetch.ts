import { API_HEADERS } from "../constants";

export async function fetchWithHeaders(endpoint: string): Promise<Response> {
  const response = await fetch(endpoint, {
    headers: API_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}