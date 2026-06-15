import api from './axios'

export const getChats = (sessionId) => api.get('/chats', { params: { sessionId } })
export const getMessages = (jid, params) => api.get(`/chats/${jid}/messages`, { params })
export const sendMessage = (jid, message, sessionId) => api.post(`/chats/${jid}/send`, { message, sessionId })