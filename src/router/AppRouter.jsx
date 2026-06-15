import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/layout/Layout'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import DevicePage from '../pages/DevicePage'
import ChatPage from '../pages/ChatPage'
import RulesPage from '../pages/RulesPage'
import CommandsPage from '../pages/CommandsPage'
import SettingsPage from '../pages/SettingsPage'
import BroadcastPage from '../pages/BroadcastPage'
import ContactsPage from '../pages/ContactsPage'
import QRPage from '../pages/QRPage'
import NotFoundPage from '../pages/NotFoundPage'
import Spinner from '../components/ui/Spinner'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  return isAuthenticated ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  return isAuthenticated ? <Navigate to="/" /> : children
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/qr" element={<QRPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/devices" element={<DevicePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/commands" element={<CommandsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/broadcast" element={<BroadcastPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}