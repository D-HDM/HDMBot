import { createContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [ready, setReady] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

    // Don't reconnect if already exists
    if (socketRef.current?.connected) {
      setSocket(socketRef.current)
      setConnected(true)
      setReady(true)
      return
    }

    const s = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: false
    })

    socketRef.current = s

    s.on('connect', () => {
      console.log('🔌 Socket connected:', s.id)
      setConnected(true)
      setReady(true)
    })

    s.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason)
      setConnected(false)
    })

    s.on('connect_error', (error) => {
      console.log('🔌 Socket connection error:', error.message)
      setConnected(false)
    })

    setSocket(s)
    setConnected(s.connected)
    setReady(s.connected)

    return () => {
      // Only disconnect on unmount, not on re-render
      if (socketRef.current) {
        socketRef.current.off('connect')
        socketRef.current.off('disconnect')
        socketRef.current.off('connect_error')
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, connected, ready }}>
      {ready ? children : children}
    </SocketContext.Provider>
  )
}