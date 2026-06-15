import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Search, Plus, MessageSquare, Star, Trash2, Edit3 } from 'lucide-react'
import { listContacts, createContact, updateContact, deleteContact } from '../api/contacts'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState({ jid: '', phoneNumber: '', pushName: '', displayName: '', notes: '', tags: '' })
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => { loadContacts() }, [])

  const loadContacts = async () => {
    try {
      const { data } = await listContacts()
      setContacts(data.data?.contacts || data.contacts || [])
    } catch {
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form.phoneNumber && !form.jid) return toast.error('Phone number or JID required')
    try {
      const payload = {
        ...form,
        jid: form.jid || `${form.phoneNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
        phoneNumber: form.phoneNumber || form.jid?.split('@')[0]
      }
      if (editing?._id) {
        await updateContact(editing._id, payload)
        toast.success('Contact updated!')
      } else {
        await createContact(payload)
        toast.success('Contact created!')
      }
      setModalOpen(false)
      setEditing(null)
      setForm({ jid: '', phoneNumber: '', pushName: '', displayName: '', notes: '', tags: '' })
      loadContacts()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteContact(deleting._id)
      toast.success('Contact deleted!')
      setConfirmOpen(false)
      setDeleting(null)
      loadContacts()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const openEdit = (contact) => {
    setEditing(contact)
    setForm({
      jid: contact.jid || '',
      phoneNumber: contact.phoneNumber || '',
      pushName: contact.pushName || '',
      displayName: contact.displayName || '',
      notes: contact.notes || '',
      tags: (contact.tags || []).join(', ')
    })
    setModalOpen(true)
  }

  // ==================== CHAT LINKING ====================
  const handleMessageContact = (contact) => {
    const phone = contact.phoneNumber || contact.jid?.split('@')[0]
    const name = contact.pushName || contact.displayName || phone
    const jid = contact.jid || `${phone}@s.whatsapp.net`
    
    navigate('/chats', { 
      state: { 
        contactJid: jid,
        contactName: name,
        contactPhone: phone
      } 
    })
  }

  const filtered = contacts.filter(c =>
    (c.pushName || c.phoneNumber || c.jid || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{contacts.length} contacts</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditing(null); setForm({ jid: '', phoneNumber: '', pushName: '', displayName: '', notes: '', tags: '' }); setModalOpen(true) }}>
          Add Contact
        </Button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Search contacts..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState icon={Users} title="No contacts" description="Add contacts to manage them here" action={<Button icon={Plus} onClick={() => setModalOpen(true)}>Add Contact</Button>} />
          </div>
        ) : (
          filtered.map(contact => (
            <div key={contact._id || contact.jid} className="card p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
                    {(contact.pushName || contact.phoneNumber || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{contact.pushName || contact.displayName || contact.phoneNumber || 'Unknown'}</h3>
                    <p className="text-xs text-gray-500">{contact.phoneNumber || contact.jid?.split('@')[0]}</p>
                  </div>
                </div>
                {contact.isBlocked && <Badge color="red">Blocked</Badge>}
              </div>

              {contact.notes && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{contact.notes}</p>}

              {contact.tags?.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {contact.tags.map((tag, i) => <Badge key={i} color="blue">{tag}</Badge>)}
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => handleMessageContact(contact)} 
                  className="p-1.5 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-500 hover:text-primary-600 transition-colors" 
                  title="Send Message"
                >
                  <MessageSquare size={16} />
                </button>
                <button onClick={() => openEdit(contact)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400" title="Edit">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => { setDeleting(contact); setConfirmOpen(true) }} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 ml-auto" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} title={editing ? 'Edit Contact' : 'Add Contact'}>
        <div className="space-y-4">
          <Input label="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="254712345678" />
          <Input label="Name" value={form.pushName} onChange={(e) => setForm({ ...form, pushName: e.target.value })} placeholder="John Doe" />
          <Input label="Display Name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Johnny" />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Met at conference..." />
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="vip, customer" />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => { setModalOpen(false); setEditing(null) }}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Contact" message={`Delete "${deleting?.pushName || deleting?.phoneNumber}"?`} confirmText="Delete" />
    </div>
  )
}