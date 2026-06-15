import { useState, useEffect } from 'react'
import api from '../api/axios'
import Spinner from '../components/ui/Spinner'

export default function QRPage() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const poll = async () => {
      try {
        const { data: res } = await api.get('/qr/exported')
        if (res.success) {
          setData(res)
          setStatus('ready')
        } else {
          setStatus('waiting')
        }
      } catch {
        setStatus('error')
      }
    }
    poll()
    const timer = setInterval(poll, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {status === 'ready' && data && (
        <>
          <p className="text-gray-500 text-sm mb-8 font-mono">{data.sessionId}</p>
          <img src={data.qr} alt="QR Code" className="max-w-[300px] w-full" />
        </>
      )}

      {status === 'waiting' && (
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 text-xs mt-4">Waiting for QR export...</p>
        </div>
      )}

      {status === 'loading' && (
        <div className="text-center">
          <Spinner size="lg" />
        </div>
      )}

      {status === 'error' && (
        <p className="text-red-500 text-sm">Failed to load</p>
      )}
    </div>
  )
}