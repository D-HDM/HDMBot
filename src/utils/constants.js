export const API_URL = import.meta.env.VITE_API_URL || '/api'

export const STATUS_COLORS = {
  connected: 'green',
  connecting: 'yellow',
  disconnected: 'red',
  error: 'red',
  inactive: 'gray',
}

export const STATUS_ICONS = {
  connected: '🟢',
  connecting: '🟡',
  disconnected: '🔴',
  error: '⚪',
  inactive: '⚫',
}

export const MATCH_TYPES = [
  { value: 'exact', label: 'Exact Match' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'regex', label: 'Regex' },
]

export const RULE_CATEGORIES = [
  { value: 'global', label: 'Global' },
  { value: 'group', label: 'Group' },
  { value: 'private', label: 'Private' },
]