import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import Button from '../ui/Button'
import { Copy, Download, ExternalLink } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import { getSessionQR } from '../../api/sessions'
import api from '../../api/axios'

export default function QRModal({ open, onClose, sessionId }) {
  const [qrString, setQrString] = useState(null)
  const [status, setStatus] = useState('loading')
  const [expiryTime, setExpiryTime] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!open || !sessionId) return
    setQrString(null)
    setStatus('loading')
    setExpiryTime(Date.now() + 60000)

    const fetchQR = async () => {
      try {
        const { data } = await getSessionQR(sessionId)
        if (data.connected) {
          setStatus('connected')
          return
        }
        if (data.qr) {
          setQrString(data.qr)
          setStatus('ready')
        } else {
          setStatus('no_qr')
        }
      } catch {
        setStatus('error')
      }
    }

    fetchQR()
    const timer = setInterval(fetchQR, 3000)
    return () => clearInterval(timer)
  }, [open, sessionId])

  useEffect(() => {
    if (!expiryTime) return
    const timer = setInterval(() => {
      if (Date.now() > expiryTime) setStatus('expired')
    }, 1000)
    return () => clearInterval(timer)
  }, [expiryTime])

  const handleCopy = () => {
    navigator.clipboard.writeText(qrString)
    toast.success('QR copied!')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrString
    link.download = `qr-${sessionId}.png`
    link.click()
  }

  const handleExport = async () => {
    try {
      await api.post('/qr/export', { sessionId })
      toast.success('QR exported! Open /qr from anywhere')
    } catch {
      toast.error('Failed to export QR')
    }
  }

  const secondsLeft = expiryTime ? Math.max(0, Math.floor((expiryTime - Date.now()) / 1000)) : 0

  return (
    <Modal open={open} onClose={onClose} title={`QR Code - ${sessionId}`} size="sm">
      <div className="text-center">
        {status === 'loading' && (
          <div className="py-8">
            <Spinner size="lg" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Loading QR code...</p>
          </div>
        )}

        {status === 'connected' && (
          <div className="py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-green-500 font-medium">Already connected!</p>
          </div>
        )}

        {status === 'expired' && (
          <div className="py-8">
            <div className="text-4xl mb-3">⏰</div>
            <p className="text-yellow-500 font-medium">QR code expired</p>
            <Button size="sm" onClick={() => { setExpiryTime(Date.now() + 60000); setStatus('loading'); }} className="mt-3">
              Refresh QR
            </Button>
          </div>
        )}

        {status === 'no_qr' && (
          <div className="py-8">
            <div className="text-4xl mb-3">📱</div>
            <p className="text-gray-500 dark:text-gray-400">No QR available. Click Connect first.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <div className="text-4xl mb-3">❌</div>
            <p className="text-red-500">Failed to load QR</p>
          </div>
        )}

        {status === 'ready' && qrString && (
          <>
            <img src={qrString} alt="QR Code" className="max-w-[250px] mx-auto rounded-lg" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              WhatsApp → Settings → Linked Devices → Link a Device
            </p>
            {secondsLeft > 0 && (
              <p className="text-xs text-yellow-500 mt-1">Expires in {secondsLeft}s</p>
            )}
            <div className="flex gap-2 justify-center mt-4">
              <Button size="sm" variant="secondary" icon={Copy} onClick={handleCopy}>Copy</Button>
              <Button size="sm" variant="secondary" icon={Download} onClick={handleDownload}>Save</Button>
              <Button size="sm" variant="primary" icon={ExternalLink} onClick={handleExport}>Export</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}