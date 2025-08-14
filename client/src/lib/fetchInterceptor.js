import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken

        if (token && !config._retry) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        try {
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true
                
                const res = await useAuthStore.getState().generateToken()

                if (!res.success) throw new Error();

                originalRequest.headers.Authorization = `Bearer ${res.accessToken}`

                return api(originalRequest)
            }
        } catch {
            useAuthStore.getState().logout()
        }

        return Promise.reject(error)
    }
)

export default api