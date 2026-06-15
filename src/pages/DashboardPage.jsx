import { useEffect, useState } from 'react'
import { MessageSquare, Terminal, Smartphone, Users } from 'lucide-react'
import { getOverview } from '../api/dashboard'
import { listSessions } from '../api/sessions'
import StatCard from '../components/dashboard/StatCard'
import QuickActions from '../components/dashboard/QuickActions'
import ActivityChart from '../components/dashboard/ActivityChart'
import SessionMap from '../components/dashboard/SessionMap'
import HealthCard from '../components/dashboard/HealthCard'
import SendMessage from '../components/whatsapp/SendMessage'
import Spinner from '../components/ui/Spinner'

export default function DashboardPage() {
  const [overview, setOverview] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getOverview(),
      listSessions(),
    ])
      .then(([overviewRes, sessionsRes]) => {
        // Parse overview - path: data.data.overview
        const overviewData = overviewRes.data?.data?.overview || 
                             overviewRes.data?.overview || {}
        
        // Parse sessions - path: data.sessions
        const sessionsData = sessionsRes.data?.sessions || 
                             sessionsRes.data?.data?.sessions || []
                
        setOverview(overviewData)
        setSessions(Array.isArray(sessionsData) ? sessionsData : [])
      })
      .catch((err) => console.error('Dashboard error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Welcome back, here's your bot overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Messages" 
          value={overview?.messages?.total || 0} 
          icon={MessageSquare} 
          color="primary" 
        />
        <StatCard 
          title="Commands" 
          value={overview?.total_commands || 0} 
          icon={Terminal} 
          color="accent" 
        />
        <StatCard 
          title="Active Sessions" 
          value={overview?.active_sessions || 0} 
          icon={Smartphone} 
          color="green" 
        />
        <StatCard 
          title="Total Users" 
          value={overview?.total_users || 0} 
          icon={Users} 
          color="purple" 
        />
      </div>

      {/* Charts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={[
            { label: 'Mon', count: 45 }, { label: 'Tue', count: 62 },
            { label: 'Wed', count: 38 }, { label: 'Thu', count: 71 },
            { label: 'Fri', count: 55 }, { label: 'Sat', count: 28 },
            { label: 'Sun', count: 15 },
          ]} />
        </div>
        <div className="space-y-4">
          <QuickActions />
          <HealthCard overview={overview} />
          <SessionMap sessions={sessions} />
        </div>
      </div>

      {/* Quick Send + Bot Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SendMessage />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Bot Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Bot Name</span>
                <span className="text-gray-900 dark:text-white font-medium">HDM BOT</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Prefix</span>
                <span className="text-gray-900 dark:text-white font-medium">{overview?.prefix || '.'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Commands</span>
                <span className="text-gray-900 dark:text-white font-medium">{overview?.total_commands || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Custom Commands</span>
                <span className="text-gray-900 dark:text-white font-medium">{overview?.custom_commands || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Rules</span>
                <span className="text-gray-900 dark:text-white font-medium">{overview?.rules?.total || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Sessions</span>
                <span className="text-gray-900 dark:text-white font-medium">{overview?.total_sessions || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">WA Status</span>
                <span className={`font-medium ${overview?.wa_connected ? 'text-green-500' : 'text-red-500'}`}>
                  {overview?.wa_connected ? '🟢 Connected' : '🔴 Disconnected'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Users</span>
                <span className="text-gray-900 dark:text-white font-medium">{overview?.total_users || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}