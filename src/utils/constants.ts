export enum USERS_TOKENS_TYPES {
  REFRESH = 1, // BEARER
  AGENT = 2
}

export enum TEST_COMPANY {
  MY_COMPANY = 1
}

export enum OneTimePasswordType {
  AUTH = 'auth',
  REG = 'reg',
}

export enum ERROR_STATUS_CODE {
  EAUTH = 'Authentication failed, invalid login or password',
  ECONNREFUSED = 'Connection to SMTP server refused',
  ETIMEDOUT = 'Connection timed out',
  ECONNRESET = 'The connection was broken by the server',
  ESOCKET = 'SSL/TLS error (SELF_SIGNED_CERT_IN_CHAIN)',
  EENVELOPE = 'Message failed validation',
}

export enum COLLECTIONS_NAMES {
  COMMON = 'common',
  AVATAR = 'avatar',
  WORKSPACE = 'workspace',
  COMPANY = 'company',
  SOCIAL_NETWORK = 'social-network',
  POSTS = 'posts'
}

export const SPECIAL_COLLECTION = [COLLECTIONS_NAMES.AVATAR, COLLECTIONS_NAMES.COMPANY, COLLECTIONS_NAMES.WORKSPACE]

export enum COMPANIES_TYPES {
  PERSONAL = 'personal',
  COMMERCIAL = 'commercial',
}

export enum SOCIAL_NETWORK {
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
}

export enum POST_TYPE {
  POST = 'POST',
  ARTICLE = 'ARTICLE',
  REELS = 'REELS',
  STORIES = 'STORIES',
  CAROUSEL = 'CAROUSEL',
}

export enum THREAD_STATUS {
  IDLE = 'idle',
  BUSY = 'busy',
  INTERRUPTED = 'interrupted',
  ERROR = 'error',
}

export enum STAGES_TYPE {
  AWARENESS= 'awareness',
  CONSIDERATION = 'consideration',
  DECISION = 'decision',
  ACTION = 'action',
  LOYALTY = 'loyalty',
}

export enum METRIC_TYPE {
  INSIGHT = 'insight',
  CONTENT_FEED = 'content-feed',
  KEYWORDS = 'keywords',
  HASHTAGS = 'hashtags',
  QUESTIONS = 'questions',
}

export enum REPORTS_STATUS {
  SCHEDULED = 1,
  SCRAPING = 2,
  PROCESSING = 3,
  AI_ANALYSIS = 4,
  COMPLETED = 5,
  ERROR = 6
}

export enum EXTERNAL_STATUS {
  SCHEDULED = 'PENDING',
  SCRAPING = 'PROCESSING',
  PROCESSING = 'processing',
  AI_ANALYSIS = 'openAI',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export const EXTERNAL_TO_INTERNAL: Record<string, REPORTS_STATUS> = {
  PENDING: REPORTS_STATUS.SCHEDULED,
  PROCESSING: REPORTS_STATUS.SCRAPING,
  processing: REPORTS_STATUS.PROCESSING,
  openAI: REPORTS_STATUS.AI_ANALYSIS,
  completed: REPORTS_STATUS.COMPLETED,
  error: REPORTS_STATUS.ERROR,
};