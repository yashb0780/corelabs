/* ==========================================================================
   COMPANY LOGO URLS.

   Logos are loaded as plain <img> URLs from a logo CDN, keyed on each
   company's domain in src/data/companies.js. This is the one sanctioned
   exception to the no-external-calls guardrail: it is an image URL, not an
   API call, and every logo falls back to a monogram tile if it fails, so the
   prototype still works with no network at all.

   `fallback=false` matters. Without it the CDN answers 200 with a generated
   placeholder blob for domains it does not know, which would show a
   meaningless shape instead of the company's initials. With it, unknown
   domains 404, the <img> fires onError, and the monogram takes over.

   TO SWITCH CDN: change this one function.
   ========================================================================== */

const CDN = 'https://unavatar.io'

/**
 * @param {string} domain e.g. 'deere.com'
 * @returns {string|null} null when a company has no domain, which sends the
 *   component straight to the monogram without a wasted request.
 */
export function logoUrl(domain) {
  if (!domain) return null
  return `${CDN}/${domain}?fallback=false`
}
