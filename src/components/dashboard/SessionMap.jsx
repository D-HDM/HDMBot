import { Smartphone } from 'lucide-react'
import Badge from '../ui/Badge'

export default function SessionMap({ sessions = [] }) {
  const connected = sessions.filter(s => s.status === 'connected').length

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Sessions ({connected}/{sessions.length})
      </h3>
      {sessions.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">No sessions</p>
      ) : (
        <div className="space-y-2">
          {sessions.slice(0, 5).map(s => (
            <div key={s.id || s.session_id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className={s.status === 'connected' ? 'text-green-500' : 'text-gray-400'} />
                <span className="text-sm text-gray-700 dark:text-gray-300">{s.botName || s.id || s.session_id}</span>
              </div>
              <Badge color={s.status === 'connected' ? 'green' : 'gray'}>
                {s.status || 'inactive'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}