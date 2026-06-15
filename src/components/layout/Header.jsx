import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { Menu, LogOut, Moon, Sun, Clock, Calendar, Wifi, WifiOff, Server } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())
  const [wpConnected, setWpConnected] = useState(false)
  const [serverConnected, setServerConnected] = useState(false)
  const [deviceCount, setDeviceCount] = useState({ total: 0, connected: 0 })

  // Health check - Server & WA status
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const healthUrl = apiUrl.replace('/api', '') + '/health'
        const res = await fetch(healthUrl)
        const data = await res.json()
        setServerConnected(data.success || data.status === 'healthy')
        setWpConnected(data.bot === 'connected')
      } catch {
        setServerConnected(false)
        setWpConnected(false)
      }
    }
    checkHealth()
    const timer = setInterval(checkHealth, 5000)
    return () => clearInterval(timer)
  }, [])

  // Device count
  useEffect(() => {
    const fetchDeviceCount = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const token = localStorage.getItem('token')
        if (!token) return
        const res = await fetch(`${apiUrl}/sessions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        const sessions = data.sessions || data.data?.sessions || []
        const connected = sessions.filter(s => s.status === 'connected').length
        setDeviceCount({ total: sessions.length, connected })
      } catch {}
    }
    fetchDeviceCount()
    const timer = setInterval(fetchDeviceCount, 10000)
    return () => clearInterval(timer)
  }, [])

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getGreeting = () => {
    const hour = time.getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-KE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-KE', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Top Row */}
      <div className="h-10 px-4 lg:px-6 flex items-center justify-between bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{formatDate(time)}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Clock size={12} />
            <span className="font-mono">{formatTime(time)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${serverConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <Server size={12} className={serverConnected ? 'text-green-500' : 'text-red-500'} />
            <span className={serverConnected ? 'text-green-500' : 'text-red-500'}>
              {serverConnected ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {wpConnected ? (
              <Wifi size={12} className="text-green-500" />
            ) : (
              <WifiOff size={12} className="text-red-500" />
            )}
            <span className={wpConnected ? 'text-green-500' : 'text-red-500'}>
              WA
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-gray-400">
            <span>{deviceCount.connected}/{deviceCount.total} devices</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="h-14 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getGreeting()}, <span className="text-gray-900 dark:text-white font-semibold">{user?.username || 'User'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <Badge color={serverConnected ? 'green' : 'red'}>
              {serverConnected ? '🟢 Server' : '🔴 Server'}
            </Badge>
            <Badge color={wpConnected ? 'green' : 'red'}>
              {wpConnected ? '🟢 WA' : '🔴 WA'}
            </Badge>
          </div>

          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            title={dark ? 'Light' : 'Dark'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout}>
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}