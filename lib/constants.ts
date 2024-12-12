export const API_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Origin, X-Requested-With'
} as const;

export const ENDPOINTS = {
  tldr: (url: string) => `/generate_tldr/${url}`,
  summary: (url: string) => `/generate_summery/${url}`,
  full: (url: string) => `/generate_text/${url}`,
} as const;