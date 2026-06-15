import { useState } from 'react'
import { FlaskConical, CheckCircle, XCircle } from 'lucide-react'

export default function RuleTester() {
  const [text, setText] = useState('')
  const [results, setResults] = useState(null)

  const matchTypes = {
    exact: (input, trigger) => input.toLowerCase() === trigger.toLowerCase(),
    contains: (input, trigger) => input.toLowerCase().includes(trigger.toLowerCase()),
    startsWith: (input, trigger) => input.toLowerCase().startsWith(trigger.toLowerCase()),
    regex: (input, trigger) => {
      try { return new RegExp(trigger, 'i').test(input) } catch { return false }
    },
  }

  const testRules = () => {
    if (!text.trim()) {
      setResults(null)
      return
    }

    // Simulate rule matching
    const sampleRules = [
      { trigger: 'hello', response: 'Hi there! 👋', matchType: 'contains' },
      { trigger: 'help', response: 'How can I assist?', matchType: 'exact' },
      { trigger: 'price', response: 'Prices start at KES 500', matchType: 'contains' },
    ]

    const matched = []
    for (const rule of sampleRules) {
      const matcher = matchTypes[rule.matchType] || matchTypes.contains
      if (matcher(text, rule.trigger)) {
        matched.push(rule)
      }
    }

    setResults({ input: text, matched, total: sampleRules.length })
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-purple-500/10">
          <FlaskConical size={18} className="text-purple-500" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Rule Tester</h3>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="input-field resize-none text-sm mb-3"
        placeholder="Type a test message..."
      />

      <button onClick={testRules} className="btn-primary w-full text-sm">
        Test Rules
      </button>

      {results && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500">
            Input: <span className="text-gray-700 dark:text-gray-300">"{results.input}"</span>
          </p>
          <p className="text-xs text-gray-500">
            Matched: <span className="font-medium">{results.matched.length}/{results.total} rules</span>
          </p>
          
          {results.matched.length > 0 ? (
            <div className="space-y-2 mt-2">
              {results.matched.map((rule, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="text-green-600 dark:text-green-400 font-medium">"{rule.trigger}" →</p>
                    <p className="text-gray-600 dark:text-gray-400">{rule.response}</p>
                    <p className="text-gray-400 mt-0.5">Type: {rule.matchType}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <XCircle size={14} className="text-red-500" />
              <p className="text-xs text-red-500">No rules matched</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}