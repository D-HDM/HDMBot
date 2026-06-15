export const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export const formatDate = (date) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleString()
}

export const getInitials = (text) => {
  if (!text) return '?'
  const parts = String(text).split(/[^a-zA-Z0-9]/)
  return parts[0]?.charAt(0)?.toUpperCase() || '?'
}

export const truncate = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}