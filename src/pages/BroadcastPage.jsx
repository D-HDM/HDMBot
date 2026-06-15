import { useState, useEffect } from 'react'
import { Radio, Send, Clock, CheckCircle, XCircle, History, Users } from 'lucide-react'
import { sendBroadcast, getBroadcastHistory } from '../api/broadcast'
import { listSessions } from '../api/sessions'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'
import { formatDate } from '../utils/helpers'

export default function BroadcastPage() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([loadHistory(), loadSessions()]).finally(() => setLoading(false))
  }, [])

  const loadHistory = async () => {
    try {
      const { data } = await getBroadcastHistory()
      setHistory(data.data?.broadcasts || data.broadcasts || [])
    } catch {}
  }

  const loadSessions = async () => {
    try {
      const { data } = await listSessions()
      setSessions(data.sessions || data.data?.sessions || [])
    } catch {}
  }

  const handleSend = async () => {
    if (!message.trim()) return toast.error('Message is required')
    setSending(true)
    try {
      await sendBroadcast({ message: message.trim() })
      toast.success('Broadcast sent!')
      setMessage('')
      loadHistory()
    } catch {
      toast.error('Failed to send broadcast')
    } finally {
      setSending(false)
    }
  }

  const connectedSessions = sessions.filter(s => s.status === 'connected')

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Broadcast</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Send messages to all connected sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Radio size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Compose Broadcast</h3>
                <p className="text-xs text-gray-500">Sent to {connectedSessions.length} connected session(s)</p>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="input-field resize-none"
              placeholder="Type your broadcast message..."
            />

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-500">{message.length} characters</span>
              <Button icon={Send} onClick={handleSend} disabled={sending || !message.trim()}>
                {sending ? 'Sending...' : 'Send Broadcast'}
              </Button>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <History size={18} className="text-gray-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">History</h3>
            </div>
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No broadcasts yet</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 10).map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{b.message}</p>
                      <p className="text-xs text-gray-500">{formatDate(b.createdAt)}</p>
                    </div>
                    <Badge color={b.status === 'completed' ? 'green' : b.status === 'failed' ? 'red' : 'yellow'}>
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-green-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Active Sessions</h3>
            </div>
            {connectedSessions.length === 0 ? (
              <p className="text-gray-400 text-xs">No connected sessions</p>
            ) : (
              <div className="space-y-2">
                {connectedSessions.map(s => (
                  <div key={s.id} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">{s.botName || s.id}</span>
                    <span className="text-gray-400 text-xs ml-auto">{s.phoneNumber}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={18} className="text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Stats</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Sessions</span><span>{sessions.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Connected</span><span className="text-green-500">{connectedSessions.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Broadcasts</span><span>{history.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}