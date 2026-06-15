import { useState, useEffect } from 'react'
import { Plus, Shield } from 'lucide-react'
import { listRules, createRule, updateRule, deleteRule, toggleRule } from '../api/rules'
import RuleTable from '../components/automation/RuleTable'
import RuleForm from '../components/automation/RuleForm'
import RuleTester from '../components/automation/RuleTester'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useToast } from '../hooks/useToast'

export default function RulesPage() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const { toast } = useToast()

  const fetchRules = async () => {
    try {
      const { data } = await listRules()
      setRules(data.data?.rules || data.rules || [])
    } catch {
      toast.error('Failed to load rules')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRules() }, [])

  const handleSave = async (formData) => {
    try {
      if (editing?._id) {
        await updateRule(editing._id, formData)
        toast.success('Rule updated!')
      } else {
        await createRule(formData)
        toast.success('Rule created!')
      }
      setModalOpen(false)
      setEditing(null)
      fetchRules()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteRule(deleting._id || deleting.id)
      toast.success('Rule deleted!')
      setConfirmOpen(false)
      setDeleting(null)
      fetchRules()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleToggle = async (rule) => {
    try {
      await toggleRule(rule._id || rule.id)
      toast.success(rule.enabled !== false ? 'Paused' : 'Activated')
      fetchRules()
    } catch {
      toast.error('Failed to toggle')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Auto Reply Rules</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{rules.length} rules configured</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true) }}>Add Rule</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            {rules.length === 0 ? (
              <EmptyState 
                icon={Shield}
                title="No rules" 
                description="Create auto-reply rules to respond automatically" 
                action={<Button icon={Plus} onClick={() => setModalOpen(true)}>Add Rule</Button>} 
              />
            ) : (
              <RuleTable 
                rules={rules} 
                onEdit={(r) => { setEditing(r); setModalOpen(true) }} 
                onDelete={(r) => { setDeleting(r); setConfirmOpen(true) }} 
                onToggle={handleToggle} 
              />
            )}
          </div>
        </div>
        <div>
          <RuleTester />
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} title={editing ? 'Edit Rule' : 'Add Rule'}>
        <RuleForm initial={editing || {}} onSave={handleSave} onCancel={() => { setModalOpen(false); setEditing(null) }} />
      </Modal>

      <ConfirmDialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Rule" 
        message={`Delete rule "${deleting?.trigger}"?`} 
        confirmText="Delete" 
      />
    </div>
  )
}