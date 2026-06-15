import { useState, useEffect } from 'react'
import { Plus, Terminal, Search } from 'lucide-react'
import { listCommands, createCommand, updateCommand, deleteCommand, toggleCommand } from '../api/commands'
import CommandTable from '../components/cmd/CommandTable'
import CommandForm from '../components/cmd/CommandForm'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useToast } from '../hooks/useToast'

export default function CommandsPage() {
  const [commands, setCommands] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const { toast } = useToast()

  useEffect(() => { loadCommands() }, [])

  const loadCommands = async () => {
    try {
      const { data } = await listCommands()
      setCommands(data.data?.commands || data.commands || [])
    } catch {
      toast.error('Failed to load commands')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editing?._id) {
        await updateCommand(editing._id, formData)
        toast.success('Command updated!')
      } else {
        await createCommand(formData)
        toast.success('Command created!')
      }
      setModalOpen(false)
      setEditing(null)
      loadCommands()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteCommand(deleting._id || deleting.id)
      toast.success('Command deleted!')
      setConfirmOpen(false)
      setDeleting(null)
      loadCommands()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleToggle = async (cmd) => {
    try {
      await toggleCommand(cmd._id || cmd.id)
      toast.success(cmd.enabled !== false ? 'Disabled' : 'Enabled')
      loadCommands()
    } catch {
      toast.error('Failed to toggle')
    }
  }

  const filtered = commands.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Commands</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{commands.length} custom commands</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true) }}>Add Command</Button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Search commands..."
        />
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState icon={Terminal} title="No custom commands" description="Add custom commands that users can trigger" action={<Button icon={Plus} onClick={() => setModalOpen(true)}>Add Command</Button>} />
        ) : (
          <CommandTable
            commands={filtered}
            onEdit={(cmd) => { setEditing(cmd); setModalOpen(true) }}
            onDelete={(cmd) => { setDeleting(cmd); setConfirmOpen(true) }}
            onToggle={handleToggle}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} title={editing ? 'Edit Command' : 'Add Command'}>
        <CommandForm initial={editing || {}} onSave={handleSave} onCancel={() => { setModalOpen(false); setEditing(null) }} />
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Command" message={`Delete "${deleting?.name}"?`} confirmText="Delete" />
    </div>
  )
}