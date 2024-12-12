export function getBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('API URL not configured');
  }
  return apiUrl.replace(/https:\/\/.*?ngrok\.io/, "");
}

export function buildEndpoint(path: string): string {
  return `${getBaseUrl()}${path}`;
}