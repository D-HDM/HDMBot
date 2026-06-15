import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Select from '../ui/Select'

const MATCH_TYPES = [
  { value: 'exact', label: 'Exact Match' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'regex', label: 'Regex' },
]

const CATEGORIES = [
  { value: 'global', label: 'Global (All Chats)' },
  { value: 'group', label: 'Group Only' },
  { value: 'private', label: 'Private Only' },
]

export default function RuleForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    trigger: initial.trigger || '',
    response: initial.response || '',
    matchType: initial.matchType || 'contains',
    category: initial.category || 'global',
    priority: initial.priority || 0,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.trigger.trim() || !form.response.trim()) return
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Trigger *"
        value={form.trigger}
        onChange={(e) => setForm({ ...form, trigger: e.target.value })}
        placeholder="hello, hi, help"
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Response *</label>
        <textarea
          value={form.response}
          onChange={(e) => setForm({ ...form, response: e.target.value })}
          rows={3}
          className="input-field resize-none"
          placeholder="Hi! How can I help you today? 🤖"
          required
        />
      </div>

      <Select
        label="Match Type"
        value={form.matchType}
        onChange={(e) => setForm({ ...form, matchType: e.target.value })}
        options={MATCH_TYPES}
      />

      <Select
        label="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        options={CATEGORIES}
      />

      <Input
        label="Priority (higher runs first)"
        type="number"
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
      />

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Rule</Button>
      </div>
    </form>
  )
}