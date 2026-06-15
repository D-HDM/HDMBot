import api from './axios'

export const listCommands = (params) => api.get('/commands', { params })
export const createCommand = (data) => api.post('/commands', data)
export const updateCommand = (id, data) => api.put(`/commands/${id}`, data)
export const deleteCommand = (id) => api.delete(`/commands/${id}`)
export const toggleCommand = (id) => api.patch(`/commands/${id}/toggle`)