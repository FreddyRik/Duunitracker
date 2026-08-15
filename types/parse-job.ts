export const PARSE_JOB_ERROR_CODES = [
  "invalid_url",
  "invalid_request",
  "timeout",
  "network",
  "blocked",
  "invalid_html",
  "unparseable",
  "too_large",
  "redirect",
] as const;

export type ParseJobErrorCode = (typeof PARSE_JOB_ERROR_CODES)[number];
