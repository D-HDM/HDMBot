import { Smartphone, Shield } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDate } from '../../utils/helpers'

const statusColors = {
  connected: 'green',
  connecting: 'yellow',
  disconnected: 'red',
  error: 'red',
  inactive: 'gray',
}

export default function DeviceCard({ session, onConnect, onDisconnect, onQR, onDelete, onRestart, isDefault }) {
  const isConnected = session.status === 'connected'
  const isConnecting = session.status === 'connecting'

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border p-5 transition-all hover:border-gray-300 dark:hover:border-gray-600 ${
      isConnected ? 'border-green-500/30 shadow-lg shadow-green-500/5' :
      isConnecting ? 'border-yellow-500/30' : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            isConnected ? 'bg-green-500/20' : isConnecting ? 'bg-yellow-500/20' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Smartphone size={22} className={
              isConnected ? 'text-green-500' : isConnecting ? 'text-yellow-500' : 'text-gray-400'
            } />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900 dark:text-white font-semibold">{session.botName || session.id}</h3>
              {isDefault && (
                <Badge color="purple"><Shield size={10} className="inline mr-1" />Default</Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{session.id}</p>
          </div>
        </div>
        <Badge color={statusColors[session.status] || 'gray'}>
          {session.status}
        </Badge>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4 text-sm">
        {session.phoneNumber && session.phoneNumber !== 'N/A' && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Phone</span>
            <span className="text-gray-900 dark:text-white">+{session.phoneNumber}</span>
          </div>
        )}
        {session.lastConnected && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Last Connected</span>
            <span className="text-gray-700 dark:text-gray-300 text-xs">{formatDate(session.lastConnected)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {!isConnected && !isConnecting ? (
          <Button size="sm" onClick={() => onConnect(session.id)} className="flex-1">
            🔌 Connect
          </Button>
        ) : isConnecting ? (
          <Button size="sm" variant="secondary" disabled className="flex-1">
            ⏳ Connecting...
          </Button>
        ) : (
          <Button size="sm" variant="danger" onClick={() => onDisconnect(session.id)} className="flex-1">
            ❌ Disconnect
          </Button>
        )}

        {isConnected && (
          <Button size="sm" variant="secondary" onClick={() => onRestart(session.id)}>
            🔄 Restart
          </Button>
        )}

        {!isConnected && (
          <Button size="sm" variant="secondary" onClick={() => onQR(session.id)}>
            📱 QR
          </Button>
        )}

        {!isDefault && (
          <Button size="sm" variant="ghost" onClick={() => onDelete(session)} className="text-red-500 hover:text-red-400">
            🗑️
          </Button>
        )}
      </div>
    </div>
  )
}