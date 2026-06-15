import api from './axios'

const BASE = '/sessions'

export const listSessions = () => api.get(BASE)
export const getSession = (id) => api.get(`${BASE}/${id}`)
export const createSession = (data) => api.post(BASE, data)
export const deleteSession = (id) => api.delete(`${BASE}/${id}`)
export const connectSession = (id) => api.post(`${BASE}/${id}/connect`)
export const disconnectSession = (id) => api.post(`${BASE}/${id}/disconnect`)
export const restartSession = (id) => api.post(`${BASE}/${id}/connect`)
export const getSessionQR = (id) => api.get(`${BASE}/${id}/qr`)
export const getSessionStatus = (id) => api.get(`${BASE}/${id}/status`)