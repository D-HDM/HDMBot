import { useEffect, useState } from 'react'
import { Activity, Clock, Cpu, Database, HardDrive, Server } from 'lucide-react'

export default function HealthCard({ overview }) {
  const [uptime, setUptime] = useState('--')

  useEffect(() => {
    if (overview?.uptime) {
      setUptime(formatUptime(overview.uptime))
    }
    const timer = setInterval(() => {
      if (overview?.uptime) setUptime(formatUptime(overview.uptime + 30))
    }, 30000)
    return () => clearInterval(timer)
  }, [overview])

  const formatUptime = (seconds) => {
    if (!seconds || seconds <= 0) return '--'
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const parts = []
    if (d > 0) parts.push(`${d}d`)
    if (h > 0) parts.push(`${h}h`)
    parts.push(`${m}m`)
    return parts.join(' ')
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={18} className="text-green-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">System Health</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-400" />
            <span className="text-xs text-gray-500">Uptime</span>
          </div>
          <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300">{uptime}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-green-400" />
            <span className="text-xs text-gray-500">Sessions</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {overview?.active_sessions || 0}/{overview?.total_sessions || 0} active
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-purple-400" />
            <span className="text-xs text-gray-500">Commands</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{overview?.total_commands || 0}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-500">Users</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{overview?.total_users || 0}</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-cyan-400" />
            <span className="text-xs text-gray-500">Messages</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{overview?.messages?.total || 0}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-500 font-medium">System Healthy</span>
        </div>
      </div>
    </div>
  )
}