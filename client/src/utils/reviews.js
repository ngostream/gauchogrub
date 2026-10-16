export function reviewEndpoint(hall, item) {
  const safeItem = item.replaceAll('/', '__slash__')
  return `/${hall}/${encodeURIComponent(safeItem)}`
}

export function apiUrl(base, path) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

export function reviewUrl(base, hall, item) {
  return apiUrl(base, reviewEndpoint(hall, item))
}

export function reviewCacheKey(hall, item) {
  return `${hall}-${item.replaceAll('/', '__slash__')}-reviews`
}

export function validateReview(review, isProfane) {
  const trimmed = review.trim()
  if (!trimmed) return 'Please enter a review before submitting.'
  if (trimmed.length > 300) return 'Review cannot exceed 300 characters.'
  if (isProfane(trimmed)) return 'Please avoid using offensive language.'
  return null
}
