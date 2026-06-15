import api from './axios'

export const getOverview = () => api.get('/dashboard/overview')