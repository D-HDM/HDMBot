import api from './axios'

export const listContacts = (params) => api.get('/contacts', { params })
export const getContact = (id) => api.get(`/contacts/${id}`)
export const createContact = (data) => api.post('/contacts', data)
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data)
export const deleteContact = (id) => api.delete(`/contacts/${id}`)
export const blockContact = (id) => api.patch(`/contacts/${id}/block`)