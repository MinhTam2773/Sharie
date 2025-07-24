import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    accessToken: null,
    isLogging: false,
    isSignignIn: false,
    isVerifyingCode: false,
    isCheckingUser: false,
    isLoggingOut: false,

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
    }
}))

