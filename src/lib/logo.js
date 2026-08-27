/* ==========================================================================
   COMPANY LOGO SOURCES.

   Every company carries a `logo` path pointing at a file in public/logos/.
   Those files are the real CDN assets, downloaded once and committed, not
   drawings. Serving them locally means:

     - no network request on page load, so nothing to rate limit
     - the Netlify build is self contained, so a dragged dist folder works
       anywhere
     - the monogram fallback never fires in a demo

   The CDN builder below is kept deliberately. It is how these files were
   fetched, and switching back to live CDN logos is a one line change: return
   cdnLogoUrl(company.domain) first in logoSrc() instead of company.logo.

   The monogram fallback in CompanyLogo stays either way. It should never
   fire now, but it is the safety net if a file is missing or renamed.
   ========================================================================== */

const CDN = 'https://unavatar.io'

/**
 * Live CDN logo for a domain. Not used on page load any more, kept so the
 * project can switch back in one place, and as the recipe for refreshing the
 * cached files in public/logos/.
 *
 * `fallback=false` matters. Without it the CDN answers 200 with a generated
 * placeholder blob for domains it does not know, which would show a
 * meaningless shape instead of the company's initials.
 *
 * @param {string} domain e.g. 'caterpillar.com'
 */
export function cdnLogoUrl(domain) {
  if (!domain) return null
  return `${CDN}/${domain}?fallback=false`
}

/**
 * Where to load a company's logo from. Local file first, CDN only if a
 * company has no local file, nothing if it has neither.
 *
 * @param {{logo?: string, domain?: string}} company
 * @returns {string|null} null sends the component straight to the monogram
 *   without a wasted request.
 */
export function logoSrc(company) {
  if (company.logo) return company.logo
  return cdnLogoUrl(company.domain)
}
