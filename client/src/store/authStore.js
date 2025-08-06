import { create } from 'zustand'
import { io } from "socket.io-client";

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

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
                credentials: 'include'
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            set({ accessToken: data.accessToken })
            return { success: data.success, message: data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isLogging: false })
        }
    },
    generateToken: async () => {
        try {
            const res = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            set({ accessToken: data.accessToken })
            return data.accessToken
        } catch (e) {
            console.error(e)
        }
    },
    checkExist: async (email) => {
        try {
            set({ isCheckingUser: true })

            const res = await fetch('/api/auth/checkUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            return { success: data.success, message: data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isCheckingUser: false })
        }
    },
    sendCode: async (formData) => { //{email, password}
        try {
            const res = await fetch('/api/auth/sendCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            return { success: data.success, message: data.message }
        } catch (e) {
            console.error(e)
        }
    },
    verifyCode: async (formData) => { //{email, code}
        try {
            set({ isVerifyingCode: true })

            const res = await fetch('/api/auth/verifyCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const error = await res.json()
                console.log(error.message)
                return { success: false, message: error.message }
            }

            const data = await res.json()
            return { success: data.success, message: data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isVerifyingCode: false })
        }
    },
    signin: async (form) => {
        try {
            set({ isSignignIn: true })
            const res = await fetch('/api/auth/signin', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()

            set({ accessToken: data.accessToken })
            return { success: true, message: data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isSignignIn: false })
        }
    },
    logout: async () => {
        try {
            set({isLoggingOut: true})

            const res = await fetch('/api/auth/logout',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                credentials: 'include',
                body: JSON.stringify()
            })

            if (!res.ok) {
                const error =await res.json()
                return {success: false, message: error.message}
            }

            const data = await res.json()
            set({accessToken: null})
            return {success: data.success, message: data.message}
        } catch(e) {
            console.error(e)
        } finally {
            set({isLoggingOut: false})
        }
    },
    getCurrentUser: async () => {
        try{
            const {accessToken} = get()
            set({isGettingCurrentUser: true})

            const res = await fetch('/api/users/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (!res.ok) {
                const error = await res.json()
                return {success: false, message: error.message}
            }

            const data = await res.json()
            set ({user: data.user})
            return {success: true, message: data.message}
        } catch(e) {
            console.error(e)
        }
    },
    getTargetUser: async (id) => {
        try {
            set({isGettingTargetUser: true})

            const res = await fetch(`/api/users/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${get().accessToken}`
                }
            })

            if (!res.ok) {
                const error = await res.json()
                return {success: false, message: error.message}
            }
            
            const data = await res.json()
            return {success: true, message: data.message, user: data.user }
        } catch(e) {
            console.error(e)
        } finally {
            set({isGettingTargetUser: false})
        }
    },
    connectSocket: () => {
        const {accessToken, user} = get()
        if (!accessToken) return

        try {
            const socket = io(BASE_URL, {
                query: {
                    userId: user._id
                }
            })
            socket.connect()
    
            set({socket: socket})
        } catch(e) {
            console.error(e)
        }
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect()
    }
}))

