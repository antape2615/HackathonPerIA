import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { email: string; name: string; company?: string; industry?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; name: string }) =>
    api.post('/auth/login', data),
  
  getMe: () => api.get('/auth/me'),
}

// Assessment API
export const assessmentAPI = {
  create: (data: { title: string; responses: any }) =>
    api.post('/assessment', data),
  
  getAll: () => api.get('/assessment'),
  
  getById: (id: string) => api.get(`/assessment/${id}`),
  
  update: (id: string, data: any) => api.put(`/assessment/${id}`, data),
  
  delete: (id: string) => api.delete(`/assessment/${id}`),
}

// AI API
export const aiAPI = {
  analyze: (assessmentId: string) =>
    api.post(`/ai/analyze/${assessmentId}`),
  
  chat: (data: { message: string; assessmentId?: string }) =>
    api.post('/ai/chat', data),
  
  getChatHistory: (assessmentId: string) =>
    api.get(`/ai/chat/${assessmentId}`),
  
  insights: (assessmentId: string) =>
    api.post(`/ai/insights/${assessmentId}`)
}

// Dashboard API
export const dashboardAPI = {
  getData: (assessmentId: string) =>
    api.get(`/dashboard/${assessmentId}`)
}

export default api
