import { useState, useEffect } from 'react'
import { getSettings, updateSetting } from '../api/settings'
import { Bot, Shield, Bell, Eye, Wifi, Trash2, Zap, Save, RotateCcw } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const { toast } = useToast()

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    try {
      const { data } = await getSettings()
      setSettings(data.data?.settings || data.settings || {})
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (key, value) => {
    setSaving(prev => ({ ...prev, [key]: true }))
    try {
      await updateSetting(key, value)
      setSettings(prev => ({ ...prev, [key]: value }))
      toast.success(`${key} updated!`)
    } catch {
      toast.error(`Failed to update ${key}`)
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }))
    }
  }

  const handleToggle = (key) => {
    const current = settings?.[key]
    handleSave(key, !current)
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure your bot preferences</p>
      </div>

      {/* Prefix */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Bot size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Command Prefix</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Character that triggers commands</p>
          </div>
        </div>
        <div className="flex gap-3 items-end">
          <Input
            value={settings?.commandPrefix ?? '.'}
            onChange={(e) => setSettings(prev => ({ ...prev, commandPrefix: e.target.value }))}
            className="max-w-[100px]"
            maxLength={3}
          />
          <Button onClick={() => handleSave('commandPrefix', (settings?.commandPrefix ?? '.').slice(0, 3) || '.')} disabled={saving['commandPrefix']} icon={Save}>
            {saving['commandPrefix'] ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="ghost" icon={RotateCcw} onClick={() => handleSave('commandPrefix', '.')}>Reset</Button>
        </div>
      </div>

      {/* Mode */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Shield size={20} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bot Mode</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Public: everyone • Private: only you</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant={settings?.mode === 'public' ? 'primary' : 'secondary'} onClick={() => handleSave('mode', 'public')} disabled={saving['mode']}>
            🌍 Public
          </Button>
          <Button variant={settings?.mode === 'private' ? 'primary' : 'secondary'} onClick={() => handleSave('mode', 'private')} disabled={saving['mode']}>
            🔒 Private
          </Button>
        </div>
      </div>

      {/* Toggles */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
        <div className="space-y-4">
          {/* Auto Reply */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-green-500/10"><Bell size={16} className="text-green-500" /></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Auto Reply</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Automatically respond to messages</p>
              </div>
            </div>
            <button onClick={() => handleToggle('auto_reply')} className={`relative w-11 h-6 rounded-full transition-colors ${settings?.auto_reply ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings?.auto_reply ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Always Online */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-blue-500/10"><Wifi size={16} className="text-blue-500" /></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Always Online</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Appear online to contacts</p>
              </div>
            </div>
            <button onClick={() => handleToggle('alwaysOnline')} className={`relative w-11 h-6 rounded-full transition-colors ${settings?.alwaysOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings?.alwaysOnline ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Auto View Status */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-yellow-500/10"><Eye size={16} className="text-yellow-500" /></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Auto View Status</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Automatically view statuses</p>
              </div>
            </div>
            <button onClick={() => handleToggle('autoViewStatus')} className={`relative w-11 h-6 rounded-full transition-colors ${settings?.autoViewStatus ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings?.autoViewStatus ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Anti Delete */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-red-500/10"><Trash2 size={16} className="text-red-500" /></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Anti Delete</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Prevent message deletion</p>
              </div>
            </div>
            <button onClick={() => handleToggle('antiDelete')} className={`relative w-11 h-6 rounded-full transition-colors ${settings?.antiDelete ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings?.antiDelete ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Anti Bug */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-orange-500/10"><Zap size={16} className="text-orange-500" /></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Anti Bug</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Protect against bug attacks</p>
              </div>
            </div>
            <button onClick={() => handleToggle('antiBug')} className={`relative w-11 h-6 rounded-full transition-colors ${settings?.antiBug ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings?.antiBug ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Footer Text</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Appended to bot replies</p>
        <div className="flex gap-3 items-end">
          <Input
            value={settings?.footerText || '🤖 HDM BOT • Powered by HDM'}
            onChange={(e) => setSettings(prev => ({ ...prev, footerText: e.target.value }))}
            placeholder="Footer text..."
            className="flex-1"
          />
          <Button onClick={() => handleSave('footerText', settings?.footerText)} disabled={saving['footerText']} icon={Save}>Save</Button>
        </div>
      </div>
    </div>
  )
}