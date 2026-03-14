import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',   // Vite proxy forwards to http://localhost:5000
})

// Automatically attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient