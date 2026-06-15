import api from './axios'

export const listRules = (params) => api.get('/rules', { params })
export const createRule = (data) => api.post('/rules', data)
export const updateRule = (id, data) => api.put(`/rules/${id}`, data)
export const deleteRule = (id) => api.delete(`/rules/${id}`)
export const toggleRule = (id) => api.patch(`/rules/${id}/toggle`)