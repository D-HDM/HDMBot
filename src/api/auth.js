import api from './axios'

export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (data) => api.post('/auth/register', data)
export const getMe = () => api.get('/auth/me')
export const updateProfile = (data) => api.put('/auth/profile', data)
export const refreshToken = (token) => api.post('/auth/refresh', { refreshToken: token })
export const logout = () => api.post('/auth/logout')