import { create } from 'zustand'
import { io } from "socket.io-client";
import api from '../lib/fetchInterceptor.js';
import { useChatStore } from './chatStore.js';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const useAuthStore = create((set, get) => ({
    accessToken: null,
    user: null,
    socket: null,
    isLogging: false,
    isSignignIn: false,
    isVerifyingCode: false,
    isCheckingUser: false,
    isLoggingOut: false,
    isGettingCurrentUser: false,
    isGettingTargetUser: false,

    login: async (form) => {
        try {
            set({ isLogging: true })

            if (!form.email || !form.password) {
                return { success: false, message: 'your email or password is invalid' }
            }

            const res = await api.post('/auth/login', form)

            if (!res.data.success) return { success: false, message: res.data.message }
            set({ accessToken: res.data.accessToken })
            await get().getCurrentUser()
            await get().connectSocket()

            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isLogging: false })
        }
    },
    generateToken: async () => {
        try {
            const res = await api.post('/auth/refresh')
            if (!res.data.success) return { success: false, message: res.data.message }

            if (res.data.success) {
                set({ accessToken: res.data.accessToken })
                await get().getCurrentUser()
                await get().connectSocket()
            }

            return { success: true, accessToken: res.data.accessToken }
        } catch (e) {
            console.error(e)
        }
    },
    checkExist: async (email) => {
        try {
            set({ isCheckingUser: true })

            const res = await api.post('/auth/checkUser', { email })
            if (!res.data.success) return { success: false, message: res.data.message }

            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isCheckingUser: false })
        }
    },
    sendCode: async (formData) => { //{email, password}
        try {
            const res = await api.post('/auth/sendCode', formData)
            if (!res.data.success) return { success: false, message: res.data.message }

            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.error(e)
        }
    },
    verifyCode: async (formData) => { //{email, code}
        try {
            set({ isVerifyingCode: true })

            const res = await api.post('/auth/verifyCode', formData)
            if (!res.data.success) return { success: false, message: res.data.message }

            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isVerifyingCode: false })
        }
    },
    signin: async (form) => {
        try {
            set({ isSignignIn: true })
            const res = await api.post('/auth/signin', form)
            if (!res.data.success) return { success: false, message: res.data.message }

            set({ accessToken: res.data.accessToken })
            get().getCurrentUser()
            get().connectSocket()

            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isSignignIn: false })
        }
    },
    logout: async () => {
        try {
            set({ isLoggingOut: true })

            const res = await api.post('/auth/logout')
            set({ accessToken: null, user: null, socket: null })
            get().disconnectSocket()
            useChatStore.getState().setSelectedChat(null)
            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isLoggingOut: false })
        }
    },
    getCurrentUser: async () => {
        try {
            set({ isGettingCurrentUser: true })

            const res = await api.get('/users/me')
            
            if (!res.data.success) return {success: false, message: res.data.message}
            set({ user: res.data.user })

            return { success: true, message: res.data.message }
        } catch (e) {
            console.log(e.message)
            return {success: false}
        } finally {
            set({ isGettingCurrentUser: false })
        }
    },
    connectSocket: () => {
        const { accessToken } = get()

        try {
            if (!accessToken || get().socket) return

            const socket = io(BASE_URL, {
                query: {
                    userId: get().user._id
                }
            })
            socket.connect()

            set({ socket: socket })
        } catch (e) {
            console.error(e)
        }
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect()
    },
}))

