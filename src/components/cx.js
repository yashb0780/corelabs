/** Joins class names together, skipping anything falsy. */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}
