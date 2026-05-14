/**
 * Privacy policy version. Bump when the policy text changes materially
 * so the UI can prompt users to re-accept.
 */
export const POLICY_VERSION = '1.0';

/** ISO date of the current policy version. */
export const POLICY_LAST_UPDATED = '2026-05-13';

/** localStorage key for the user's privacy-policy acceptance record (UX only — server is source of truth). */
export const CONSENT_STORAGE_KEY = 'auth-consent';

/** localStorage key for the dismissible cookie banner. */
export const COOKIE_BANNER_STORAGE_KEY = 'cookie-banner-dismissed';

export interface ConsentRecord {
  policyVersion: string;
  acceptedAt: string;
}
