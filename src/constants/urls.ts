export const URLS = {
  home: '/parabank/index.htm',
  register: '/parabank/register.htm',
  overview: '/parabank/overview.htm',
} as const;

// Regex patterns for waitForURL — kept alongside path strings so both stay in sync
export const URL_PATTERNS = {
  home: /index\.htm/,
  overview: /overview\.htm/,
} as const;
