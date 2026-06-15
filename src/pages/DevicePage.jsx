import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Smartphone, RefreshCw, Zap, ExternalLink } from 'lucide-react'
import { listSessions, createSession, deleteSession, connectSession, disconnectSession } from '../api/sessions'
import DeviceCard from '../components/device/DeviceCard'
import QRModal from '../components/device/QRModal'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'
import { useSocket } from '../hooks/useSocket'

const DEFAULT_SESSION = 'HDM-BOT-SESSION'

export default function DevicePage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrSession, setQrSession] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [form, setForm] = useState({ sessionId: '', botName: '', ownerNumber: '' })
  const { toast } = useToast()
  const { socket } = useSocket()
  const navigate = useNavigate()

  const fetchSessions = useCallback(async () => {
    try {
      const { data } = await listSessions()
      const sessionsData = data.sessions || data.data?.sessions || []
      setSessions(Array.isArray(sessionsData) ? sessionsData : [])
    } catch {
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSessions()
    const timer = setInterval(fetchSessions, 10000)
    return () => clearInterval(timer)
  }, [fetchSessions])

  useEffect(() => {
    if (!socket) return
    socket.on('session_status', (data) => {
      if (data.sessions) {
        setSessions(prev => prev.map(s => {
          const updated = data.sessions.find(us => us.sessionId === s.id)
          return updated ? { ...s, status: updated.connected ? 'connected' : s.status } : s
        }))
      }
    })
    return () => { socket.off('session_status') }
  }, [socket])

  const handleConnectDefault = async () => {
    try {
      const res = await connectSession(DEFAULT_SESSION)
      if (res.data?.qr || res.data?.needQr) {
        handleViewQR(DEFAULT_SESSION)
      }
      toast.info('Connecting default session...')
      setTimeout(fetchSessions, 3000)
    } catch (err) {
      if (err.response?.data?.error?.includes('Create')) {
        try {
          await createSession({ sessionId: DEFAULT_SESSION, botName: 'HDM BOT', ownerNumber: '254768784909' })
          toast.success('Session created! Connecting...')
          const res = await connectSession(DEFAULT_SESSION)
          if (res.data?.qr || res.data?.needQr) {
            handleViewQR(DEFAULT_SESSION)
          }
          fetchSessions()
        } catch {
          toast.error('Failed to create session')
        }
      } else {
        toast.error('Failed to connect')
      }
    }
  }

  const handleConnect = async (sessionId) => {
    try {
      await connectSession(sessionId)
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'connecting' } : s))
      toast.info('Connecting...')
      setTimeout(fetchSessions, 3000)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to connect')
    }
  }

  const handleDisconnect = async (sessionId) => {
    try {
      await disconnectSession(sessionId)
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'disconnected' } : s))
      toast.success('Disconnected')
      fetchSessions()
    } catch {
      toast.error('Failed to disconnect')
    }
  }

  const handleRestart = async (sessionId) => {
    await handleDisconnect(sessionId)
    setTimeout(() => handleConnect(sessionId), 2000)
  }

  const handleViewQR = (sessionId) => {
    setQrSession(sessionId)
    setQrModalOpen(true)
  }

  const handleExportQR = (sessionId) => {
    navigate(`/qr?session=${sessionId}`)
  }

  const handleDelete = async () => {
    if (!selectedSession) return
    try {
      await deleteSession(selectedSession.id)
      setSessions(prev => prev.filter(s => s.id !== selectedSession.id))
      toast.success('Session deleted')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete')
    }
    setConfirmOpen(false)
    setSelectedSession(null)
  }

  const handleAddSession = async () => {
    if (!form.sessionId) return toast.error('Session ID is required')
    try {
      await createSession(form)
      toast.success('Session created!')
      setAddModalOpen(false)
      setForm({ sessionId: '', botName: '', ownerNumber: '' })
      fetchSessions()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const connectedCount = sessions.filter(s => s.status === 'connected').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Devices</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} • {connectedCount} connected
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" icon={Zap} onClick={handleConnectDefault}>
            Connect Default
          </Button>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchSessions}>
            Refresh
          </Button>
          <Button icon={Plus} onClick={() => setAddModalOpen(true)}>
            Add Device
          </Button>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState
              icon={Smartphone}
              title="No devices"
              description="Add a WhatsApp session to get started"
              action={
                <div className="flex gap-2">
                  <Button icon={Zap} onClick={handleConnectDefault}>Connect Default</Button>
                  <Button icon={Plus} onClick={() => setAddModalOpen(true)}>Add Device</Button>
                </div>
              }
            />
          </div>
        ) : (
          sessions.map(session => (
            <DeviceCard
              key={session.id}
              session={session}
              isDefault={session.id === DEFAULT_SESSION}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onQR={handleViewQR}
              onExport={handleExportQR}
              onDelete={(s) => { setSelectedSession(s); setConfirmOpen(true) }}
              onRestart={handleRestart}
            />
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Device">
        <div className="space-y-4">
          <Input label="Session ID *" value={form.sessionId} onChange={(e) => setForm({ ...form, sessionId: e.target.value })} placeholder="device_1" />
          <Input label="Display Name" value={form.botName} onChange={(e) => setForm({ ...form, botName: e.target.value })} placeholder="My Bot" />
          <Input label="Phone Number" value={form.ownerNumber} onChange={(e) => setForm({ ...form, ownerNumber: e.target.value })} placeholder="254712345678" />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSession}>Add Device</Button>
          </div>
        </div>
      </Modal>

      {/* QR Modal */}
      <QRModal open={qrModalOpen} onClose={() => { setQrModalOpen(false); setQrSession(null) }} sessionId={qrSession} />

      {/* Delete Confirm */}
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Device" message={`Delete "${selectedSession?.botName || selectedSession?.id}"?`} confirmText="Delete" />
    </div>
  )
}