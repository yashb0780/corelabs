/* ==========================================================================
   FILLING IN COPY FROM THE content/ FOLDER.

   Copy there is plain JSON, so it cannot hold functions the way the files
   in src/data/ do. Instead it marks the gaps with curly brackets, and a
   line that changes with a number comes as { zero, one, other }.
   ========================================================================== */

/** "Opened {company}" + { company: 'Cummins' } -> "Opened Cummins". */
export function fill(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (whole, key) =>
    key in values ? String(values[key]) : whole,
  )
}

/**
 * Picks `zero`, `one` or `other` for n, then fills it. `{n}` is always
 * available. A missing `zero` falls back to `other`.
 */
export function plural(forms, n, values = {}) {
  const form = n === 0 && forms.zero ? forms.zero : n === 1 ? forms.one : forms.other
  return fill(form, { n: n.toLocaleString('en-US'), ...values })
}

/** "A", "A and B", "A, B and C". */
export function listOf(items, join = ' and ') {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')}${join}${items[items.length - 1]}`
}
