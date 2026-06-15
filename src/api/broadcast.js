import api from './axios'

export const sendBroadcast = (data) => api.post('/broadcast', data)
export const getBroadcastHistory = (params) => api.get('/broadcast/history', { params })